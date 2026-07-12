const db = require("../lib/db")

function requireAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.session_id
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Sesi tidak valid atau telah berakhir",
        errors: []
      })
    }

    const session = db.get(
      `SELECT s.id_session, s.id_guru, s.created_at, s.last_activity, s.expires_at,
              g.username, g.nama_guru, g.created_at AS guru_created_at
       FROM session s
       JOIN guru g ON s.id_guru = g.id_guru
       WHERE s.id_session = ?`,
      [sessionId]
    )

    if (!session) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Sesi tidak valid atau telah berakhir",
        errors: []
      })
    }

    const now = new Date()
    const expiresAt = new Date(session.expires_at.replace(" ", "T") + "Z")
    if (now > expiresAt) {
      db.run("DELETE FROM session WHERE id_session = ?", [sessionId])
      return res.status(401).json({
        success: false,
        data: null,
        message: "Sesi tidak valid atau telah berakhir",
        errors: []
      })
    }

    db.run("UPDATE session SET last_activity = CURRENT_TIMESTAMP WHERE id_session = ?", [sessionId])

    req.user = {
      id_guru: session.id_guru,
      username: session.username,
      nama_guru: session.nama_guru,
      created_at: session.guru_created_at
    }
    req.sessionId = sessionId

    next()
  } catch (err) {
    console.error("requireAuth error:", err)
    return res.status(500).json({
      success: false,
      data: null,
      message: "Terjadi kesalahan server",
      errors: []
    })
  }
}

module.exports = requireAuth
