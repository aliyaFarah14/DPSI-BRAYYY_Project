const express = require("express")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const db = require("../lib/db")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 1000

const rateLimitStore = {}

function checkRateLimit(username) {
  const now = Date.now()
  const entry = rateLimitStore[username]

  if (!entry || (now - entry.windowStart) > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore[username] = { count: 1, windowStart: now }
    return { allowed: true }
  }

  entry.count++
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false }
  }
  return { allowed: true }
}

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body

    const errors = []
    if (!username || typeof username !== "string" || !username.trim()) {
      errors.push({ field: "username", message: "Username tidak boleh kosong" })
    }
    if (!password || typeof password !== "string" || !password.trim()) {
      errors.push({ field: "password", message: "Password tidak boleh kosong" })
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Validation Failed",
        errors
      })
    }

    const trimmedUsername = username.trim()

    if (!checkRateLimit(trimmedUsername).allowed) {
      return res.status(429).json({
        success: false,
        data: null,
        message: "Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa saat.",
        errors: []
      })
    }

    const user = db.get("SELECT * FROM guru WHERE username = ?", [trimmedUsername])
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Username atau password salah",
        errors: []
      })
    }

    delete rateLimitStore[trimmedUsername]

    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .replace("Z", "")

    db.run(
      "INSERT INTO session (id_session, id_guru, expires_at) VALUES (?, ?, ?)",
      [sessionId, user.id_guru, expiresAt]
    )

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60 * 1000
    })

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id_guru: user.id_guru,
          username: user.username,
          nama_guru: user.nama_guru
        }
      },
      message: "Login berhasil"
    })
  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({
      success: false,
      data: null,
      message: "Terjadi kesalahan server",
      errors: []
    })
  }
})

router.post("/logout", (req, res) => {
  try {
    const sessionId = req.cookies?.session_id

    if (sessionId) {
      db.run("DELETE FROM session WHERE id_session = ?", [sessionId])
    }

    res.cookie("session_id", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0
    })

    return res.status(200).json({
      success: true,
      data: null,
      message: "Logout berhasil"
    })
  } catch (err) {
    console.error("Logout error:", err)
    return res.status(500).json({
      success: false,
      data: null,
      message: "Terjadi kesalahan server",
      errors: []
    })
  }
})

router.get("/me", requireAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      id_guru: req.user.id_guru,
      username: req.user.username,
      nama_guru: req.user.nama_guru,
      created_at: req.user.created_at
    },
    message: "Success"
  })
})

router.post("/extend-session", requireAuth, (req, res) => {
  try {
    db.run(
      "UPDATE session SET last_activity = CURRENT_TIMESTAMP, expires_at = datetime('now', '+30 minutes') WHERE id_session = ?",
      [req.sessionId]
    )

    return res.status(200).json({
      success: true,
      data: { expires_in: 1800 },
      message: "Sesi diperpanjang"
    })
  } catch (err) {
    console.error("Extend session error:", err)
    return res.status(500).json({
      success: false,
      data: null,
      message: "Terjadi kesalahan server",
      errors: []
    })
  }
})

module.exports = router
