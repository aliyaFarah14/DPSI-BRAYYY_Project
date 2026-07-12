const express = require("express")
const db = require("../lib/db")

const router = express.Router()

const RATE_LIMIT_MAX = 60
const RATE_LIMIT_WINDOW_MS = 60_000

let requestLog = []

function rateLimiter(req, res, next) {
  const now = Date.now()
  requestLog = requestLog.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  if (requestLog.length >= RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false, data: null, message: "Terlalu banyak permintaan. Silakan coba lagi sesaat lagi.", errors: []
    })
  }
  requestLog.push(now)
  next()
}

router.use(rateLimiter)

const BASE_SQL = "SELECT id_buku, judul_buku, penulis, tema_buku, tahun_terbit, lokasi_rak, stok, status_buku, gambar_sampul, tingkat_kelas FROM buku WHERE status_buku != 'Tidak Aktif'"

router.get("/", (req, res) => {
  try {
    const { search, tingkat_kelas, tema_buku } = req.query
    let sql = BASE_SQL
    const params = []

    if (search && search.trim()) {
      sql += " AND (judul_buku LIKE ? OR tema_buku LIKE ?)"
      const term = `%${search.trim()}%`
      params.push(term, term)
    }

    if (tingkat_kelas !== undefined && tingkat_kelas !== "") {
      const tk = Number(tingkat_kelas)
      if (Number.isInteger(tk) && tk >= 1 && tk <= 6) {
        sql += " AND (tingkat_kelas = ? OR tingkat_kelas IS NULL)"
        params.push(tk)
      }
    }

    if (tema_buku !== undefined && tema_buku !== "") {
      sql += " AND tema_buku = ?"
      params.push(tema_buku)
    }

    sql += " ORDER BY id_buku"

    const rows = db.all(sql, params)
    return res.json({ success: true, data: rows, message: "Success" })
  } catch (err) {
    console.error("GET /books/public:", err)
    return res.status(500).json({ success: false, data: null, message: "Gagal memuat data buku", errors: [] })
  }
})

module.exports = router
