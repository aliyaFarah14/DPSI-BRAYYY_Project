const express = require("express")
const db = require("../lib/db")
const requireAuth = require("../middleware/requireAuth")
const { stripHTML } = require("../utils/bookValidation")
const { todayWIB, dateFromWIB } = require("../lib/wib")

const router = express.Router()

// POST /api/v1/loans
router.post("/", requireAuth, (req, res) => {
  try {
    const { id_buku, nama_siswa, kelas_siswa, tgl_batas_pengembalian } = req.body
    const errors = []

    if (!id_buku || !(id_buku || "").trim()) errors.push({ field: "id_buku", message: "Pilih buku yang akan dipinjam" })
    if (!nama_siswa || !(nama_siswa || "").trim()) errors.push({ field: "nama_siswa", message: "Nama siswa tidak boleh kosong" })
    if (!kelas_siswa || !(kelas_siswa || "").trim()) errors.push({ field: "kelas_siswa", message: "Kelas siswa tidak boleh kosong" })
    if (!tgl_batas_pengembalian || !(tgl_batas_pengembalian || "").trim()) errors.push({ field: "tgl_batas_pengembalian", message: "Tanggal batas pengembalian tidak boleh kosong" })

    if (errors.length > 0) {
      return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors })
    }

    const sanitizedNama = stripHTML(nama_siswa.trim())
    const sanitizedKelas = stripHTML(kelas_siswa.trim())

    const tgl_peminjaman = todayWIB()
    const today = dateFromWIB(tgl_peminjaman)
    const batasDate = dateFromWIB(tgl_batas_pengembalian.trim())
    if (isNaN(batasDate.getTime())) {
      return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors: [{ field: "tgl_batas_pengembalian", message: "Format tanggal tidak valid" }] })
    }
    if (batasDate < today) {
      return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors: [{ field: "tgl_batas_pengembalian", message: "Tanggal batas pengembalian tidak boleh sebelum tanggal peminjaman" }] })
    }

    const count = db.get("SELECT COUNT(*) as cnt FROM peminjaman").cnt
    const id_peminjaman = `PJ${String(count + 1).padStart(5, "0")}`
    const bukuId = id_buku.trim()

    const processLoan = db.transaction(() => {
      const book = db.get("SELECT stok FROM buku WHERE id_buku = ?", [bukuId])
      if (!book || book.stok <= 0) {
        throw new Error("CONFLICT")
      }

      db.run(
        `INSERT INTO peminjaman (id_peminjaman, id_buku, nama_siswa, kelas_siswa, tgl_peminjaman, tgl_batas_pengembalian, status_peminjaman)
         VALUES (?, ?, ?, ?, ?, ?, 'Dipinjam')`,
        [id_peminjaman, bukuId, sanitizedNama, sanitizedKelas, tgl_peminjaman, tgl_batas_pengembalian.trim()]
      )

      db.run(
        `UPDATE buku SET stok = stok - 1,
          status_buku = CASE WHEN stok - 1 = 0 THEN 'Dipinjam' ELSE status_buku END
         WHERE id_buku = ?`,
        [bukuId]
      )
    })

    try {
      processLoan()
    } catch (txErr) {
      if (txErr.message === "CONFLICT") {
        return res.status(409).json({ success: false, data: null, message: "Buku ini sudah tidak tersedia. Silakan pilih buku lain.", errors: [] })
      }
      throw txErr
    }

    return res.status(201).json({
      success: true,
      data: { id_peminjaman, tgl_peminjaman, status_peminjaman: "Dipinjam" },
      message: "Peminjaman berhasil dicatat"
    })
  } catch (err) {
    console.error("POST /loans:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

module.exports = router
