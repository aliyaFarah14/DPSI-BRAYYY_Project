const express = require("express")
const db = require("../lib/db")
const requireAuth = require("../middleware/requireAuth")
const { DENDA_PER_HARI, DENDA_RUSAK_RINGAN, DENDA_RUSAK_BERAT } = require("../config/denda.config")
const { todayWIB, dateFromWIB } = require("../lib/wib")

const router = express.Router()

const ALLOWED_KONDISI = ["Baik", "Rusak Ringan", "Rusak Berat"]

const KONDISI_BIAYA_MAP = {
  "Baik": 0,
  "Rusak Ringan": DENDA_RUSAK_RINGAN,
  "Rusak Berat": DENDA_RUSAK_BERAT
}

// GET /api/v1/loans/active
router.get("/loans/active", requireAuth, (req, res) => {
  try {
    const todayWIBdate = todayWIB()
    const rows = db.all(`
      SELECT p.id_peminjaman, p.nama_siswa, p.kelas_siswa, b.judul_buku,
             p.tgl_peminjaman, p.tgl_batas_pengembalian,
             MAX(0, CAST(julianday(?) - julianday(p.tgl_batas_pengembalian) AS INTEGER)) AS hari_terlambat_saat_ini
      FROM peminjaman p
      JOIN buku b ON p.id_buku = b.id_buku
      WHERE p.status_peminjaman = 'Dipinjam'
      ORDER BY p.tgl_peminjaman DESC
    `, [todayWIBdate])
    return res.json({ success: true, data: rows, message: "Success" })
  } catch (err) {
    console.error("GET /loans/active:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

// GET /api/v1/config/denda
router.get("/config/denda", requireAuth, (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        denda_per_hari: DENDA_PER_HARI,
        denda_rusak_ringan: DENDA_RUSAK_RINGAN,
        denda_rusak_berat: DENDA_RUSAK_BERAT
      },
      message: "Success"
    })
  } catch (err) {
    console.error("GET /config/denda:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

// POST /api/v1/returns
router.post("/returns", requireAuth, (req, res) => {
  try {
    const { id_peminjaman, kondisi_buku } = req.body
    const errors = []

    if (!id_peminjaman || !(id_peminjaman || "").trim()) {
      errors.push({ field: "id_peminjaman", message: "ID peminjaman tidak boleh kosong" })
    }
    if (!kondisi_buku || !ALLOWED_KONDISI.includes(kondisi_buku)) {
      errors.push({ field: "kondisi_buku", message: "Silakan pilih kondisi buku" })
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors })
    }

    const loanId = id_peminjaman.trim()

    const peminjaman = db.get(
      "SELECT p.id_peminjaman, p.id_buku, p.tgl_batas_pengembalian, p.status_peminjaman FROM peminjaman p WHERE p.id_peminjaman = ?",
      [loanId]
    )

    if (!peminjaman || peminjaman.status_peminjaman !== "Dipinjam") {
      return res.status(409).json({ success: false, data: null, message: "Peminjaman sudah dikembalikan sebelumnya", errors: [] })
    }

    const tgl_pengembalian = todayWIB()
    const today = dateFromWIB(tgl_pengembalian)
    const batasDate = dateFromWIB(peminjaman.tgl_batas_pengembalian)
    const diffTime = today.getTime() - batasDate.getTime()
    const keterlambatan_hari = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))

    const denda_keterlambatan = keterlambatan_hari * DENDA_PER_HARI
    const biaya_kondisi = KONDISI_BIAYA_MAP[kondisi_buku]
    const total_denda = denda_keterlambatan + biaya_kondisi

    const count = db.get("SELECT COUNT(*) as cnt FROM pengembalian").cnt
    const id_pengembalian = `PG${String(count + 1).padStart(5, "0")}`

    const processReturn = db.transaction(() => {
      db.run(
        `INSERT INTO pengembalian (id_pengembalian, id_peminjaman, tgl_pengembalian, kondisi_buku, keterlambatan_hari, denda_keterlambatan, biaya_kondisi, total_denda)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id_pengembalian, loanId, tgl_pengembalian, kondisi_buku, keterlambatan_hari, denda_keterlambatan, biaya_kondisi, total_denda]
      )

      db.run(
        "UPDATE peminjaman SET status_peminjaman = 'Sudah Dikembalikan' WHERE id_peminjaman = ?",
        [loanId]
      )

      db.run(
        "UPDATE buku SET stok = stok + 1, status_buku = 'Tersedia' WHERE id_buku = ?",
        [peminjaman.id_buku]
      )
    })

    processReturn()

    return res.status(201).json({
      success: true,
      data: {
        id_pengembalian,
        tgl_pengembalian,
        keterlambatan_hari,
        denda_keterlambatan,
        biaya_kondisi,
        total_denda,
        status_peminjaman: "Sudah Dikembalikan",
        status_buku: "Tersedia"
      },
      message: "Pengembalian berhasil dicatat"
    })
  } catch (err) {
    console.error("POST /returns:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

module.exports = router
