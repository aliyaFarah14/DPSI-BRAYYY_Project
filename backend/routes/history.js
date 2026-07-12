const express = require("express")
const ExcelJS = require("exceljs")
const db = require("../lib/db")
const requireAuth = require("../middleware/requireAuth")

const router = express.Router()

// GET /api/v1/history
router.get("/", requireAuth, (req, res) => {
  try {
    const { nama, judul, tgl_mulai, tgl_akhir } = req.query

    if (tgl_mulai && tgl_akhir && tgl_akhir < tgl_mulai) {
      return res.status(400).json({
        success: false, data: null, message: "Rentang tanggal tidak valid",
        errors: [{ field: "tgl_akhir", message: "Tanggal akhir tidak boleh lebih kecil dari tanggal mulai" }]
      })
    }

    let sql = "SELECT * FROM riwayat_peminjaman WHERE 1=1"
    const params = []

    if (nama && nama.trim()) {
      sql += " AND nama_siswa LIKE ?"
      params.push(`%${nama.trim()}%`)
    }
    if (judul && judul.trim()) {
      sql += " AND judul_buku LIKE ?"
      params.push(`%${judul.trim()}%`)
    }
    if (tgl_mulai) {
      sql += " AND tgl_peminjaman >= ?"
      params.push(tgl_mulai)
    }
    if (tgl_akhir) {
      sql += " AND tgl_peminjaman <= ?"
      params.push(tgl_akhir)
    }

    sql += " ORDER BY tgl_peminjaman DESC"
    const rows = db.all(sql, params)

    return res.json({ success: true, data: rows, message: "Success" })
  } catch (err) {
    console.error("GET /history:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

// GET /api/v1/history/export?bulan={1-12}&tahun={yyyy}
router.get("/export", requireAuth, async (req, res) => {
  try {
    const { bulan, tahun } = req.query

    if (!bulan || !tahun || !/^([1-9]|1[012])$/.test(bulan) || !/^\d{4}$/.test(tahun)) {
      return res.status(400).json({
        success: false, data: null, message: "Parameter bulan dan tahun wajib diisi",
        errors: []
      })
    }

    const bulanPadded = String(bulan).padStart(2, "0")
    const rows = db.all(
      `SELECT * FROM riwayat_peminjaman
       WHERE strftime('%m', tgl_peminjaman) = ? AND strftime('%Y', tgl_peminjaman) = ?
       ORDER BY tgl_peminjaman DESC`,
      [bulanPadded, tahun]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false, data: null, message: "Tidak ada data riwayat pada periode yang dipilih.",
        errors: []
      })
    }

    const workbook = new ExcelJS.Workbook()
    workbook.creator = "Sistem Informasi Perpustakaan SD Negeri Tamanan"
    workbook.created = new Date()

    const sheet = workbook.addWorksheet("Riwayat Peminjaman")

    sheet.columns = [
      { header: "Nama Siswa", key: "nama_siswa", width: 25 },
      { header: "Kelas", key: "kelas_siswa", width: 10 },
      { header: "Judul Buku", key: "judul_buku", width: 35 },
      { header: "Tgl Pinjam", key: "tgl_peminjaman", width: 14 },
      { header: "Batas Kembali", key: "tgl_batas_pengembalian", width: 14 },
      { header: "Tgl Kembali Aktual", key: "tgl_pengembalian", width: 18 },
      { header: "Kondisi Buku", key: "kondisi_buku", width: 16 },
      { header: "Denda", key: "denda", width: 16 },
      { header: "Status", key: "status_peminjaman", width: 18 },
    ]

    const headerRow = sheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.alignment = { vertical: "middle", horizontal: "center" }

    rows.forEach((r) => {
      sheet.addRow({
        nama_siswa: r.nama_siswa,
        kelas_siswa: r.kelas_siswa,
        judul_buku: r.judul_buku,
        tgl_peminjaman: r.tgl_peminjaman,
        tgl_batas_pengembalian: r.tgl_batas_pengembalian,
        tgl_pengembalian: r.tgl_pengembalian || "-",
        kondisi_buku: r.kondisi_buku || "-",
        denda: r.total_denda != null ? `Rp ${r.total_denda.toLocaleString("id-ID")}` : "-",
        status_peminjaman: r.status_peminjaman,
      })
    })

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename="riwayat-${bulan}-${tahun}.xlsx"`)

    await workbook.xlsx.write(res)
    res.end()
  } catch (err) {
    console.error("GET /history/export:", err)
    if (!res.headersSent) {
      return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
    }
  }
})

module.exports = router
