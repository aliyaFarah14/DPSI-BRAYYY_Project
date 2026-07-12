const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const db = require("../lib/db")
const requireAuth = require("../middleware/requireAuth")
const {
  validateLokasiRak, stripHTML, validateTemaBuku,
  validateTingkatKelas, validateStok, validateTahunTerbit
} = require("../utils/bookValidation")

const router = express.Router()
const UPLOADS_DIR = path.join(__dirname, "..", "uploads")

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `book_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) return cb(null, true)
    cb(new Error("Format gambar harus JPG atau PNG"))
  }
})

function errField(field, message) {
  return { field, message }
}

function handleUploadError(err) {
  if (err.code === "LIMIT_FILE_SIZE") {
    return { status: 400, body: { success: false, data: null, message: "Validation Failed", errors: [errField("gambar_sampul", "Ukuran file melebihi 2MB. Silakan kompres gambar terlebih dahulu.")] } }
  }
  return { status: 400, body: { success: false, data: null, message: "Validation Failed", errors: [errField("gambar_sampul", err.message)] } }
}

// GET /api/v1/books
router.get("/", requireAuth, (req, res) => {
  try {
    const { search } = req.query
    const rows = (search && search.trim())
      ? db.all("SELECT * FROM buku WHERE judul_buku LIKE ? OR tema_buku LIKE ? OR id_buku LIKE ? ORDER BY id_buku", [`%${search.trim()}%`, `%${search.trim()}%`, `%${search.trim()}%`])
      : db.all("SELECT * FROM buku ORDER BY id_buku")
    return res.json({ success: true, data: rows, message: "Success" })
  } catch (err) {
    console.error("GET /books:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

// GET /api/v1/books/available
router.get("/available", requireAuth, (req, res) => {
  try {
    const rows = db.all("SELECT id_buku, judul_buku, penulis, tema_buku, lokasi_rak, stok, status_buku FROM buku WHERE stok > 0 ORDER BY id_buku")
    return res.json({ success: true, data: rows, message: "Success" })
  } catch (err) {
    console.error("GET /books/available:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

// POST /api/v1/books
router.post("/", requireAuth, (req, res) => {
  upload.single("gambar_sampul")(req, res, (uploadErr) => {
    if (uploadErr) {
      const e = handleUploadError(uploadErr)
      return res.status(e.status).json(e.body)
    }
    try {
      const body = req.body
      const file = req.file
      const errors = []

      const id_buku = (body.id_buku || "").trim()
      if (!id_buku) errors.push(errField("id_buku", "ID Buku tidak boleh kosong"))

      let judul_buku = (body.judul_buku || "").trim()
      if (!judul_buku) errors.push(errField("judul_buku", "Judul buku tidak boleh kosong"))
      else judul_buku = stripHTML(judul_buku)

      let penulis = (body.penulis || "").trim()
      if (!penulis) errors.push(errField("penulis", "Penulis tidak boleh kosong"))
      else penulis = stripHTML(penulis)

      const penerbit = stripHTML((body.penerbit || "").trim())
      if (!penerbit) errors.push(errField("penerbit", "Penerbit tidak boleh kosong"))

      const tahunVal = validateTahunTerbit(body.tahun_terbit)
      if (!tahunVal.valid) errors.push(errField("tahun_terbit", "Tahun terbit harus angka >= 1900"))

      let lokasi_rak = (body.lokasi_rak || "").trim()
      if (!lokasi_rak) errors.push(errField("lokasi_rak", "Lokasi rak tidak boleh kosong"))
      else {
        lokasi_rak = stripHTML(lokasi_rak)
        if (!validateLokasiRak(lokasi_rak)) errors.push(errField("lokasi_rak", "Format lokasi rak tidak valid"))
      }

      const stokVal = validateStok(body.stok)
      if (!stokVal.valid) errors.push(errField("stok", "Stok harus angka >= 0"))

      const temaVal = validateTemaBuku(body.tema_buku !== undefined ? body.tema_buku : null)
      if (!temaVal.valid) errors.push(errField("tema_buku", temaVal.message))

      const kelasVal = validateTingkatKelas(body.tingkat_kelas !== undefined ? body.tingkat_kelas : null)
      if (!kelasVal.valid) errors.push(errField("tingkat_kelas", kelasVal.message))

      if (errors.length > 0) {
        if (file) { try { fs.unlinkSync(file.path) } catch {} }
        return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors })
      }

      const exists = db.get("SELECT id_buku FROM buku WHERE id_buku = ?", [id_buku])
      if (exists) {
        if (file) { try { fs.unlinkSync(file.path) } catch {} }
        return res.status(409).json({ success: false, data: null, message: "ID Buku sudah digunakan", errors: [] })
      }

      const gambar_sampul = file ? `/uploads/${file.filename}` : null

      db.run(
        `INSERT INTO buku (id_buku, judul_buku, penulis, penerbit, tema_buku, tahun_terbit, lokasi_rak, stok, gambar_sampul, tingkat_kelas, status_buku)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Tersedia')`,
        [id_buku, judul_buku, penulis, penerbit, temaVal.sanitized, tahunVal.sanitized, lokasi_rak, stokVal.sanitized, gambar_sampul, kelasVal.sanitized]
      )

      return res.status(201).json({ success: true, data: { id_buku, gambar_sampul }, message: "Buku berhasil ditambahkan" })
    } catch (err) {
      if (req.file) { try { fs.unlinkSync(req.file.path) } catch {} }
      console.error("POST /books:", err)
      return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
    }
  })
})

// PUT /api/v1/books/:id_buku
router.put("/:id_buku", requireAuth, (req, res) => {
  upload.single("gambar_sampul")(req, res, (uploadErr) => {
    if (uploadErr) {
      const e = handleUploadError(uploadErr)
      return res.status(e.status).json(e.body)
    }
    try {
      const { id_buku } = req.params
      const existing = db.get("SELECT * FROM buku WHERE id_buku = ?", [id_buku])
      if (!existing) {
        return res.status(404).json({ success: false, data: null, message: "Buku tidak ditemukan", errors: [] })
      }

      const body = req.body
      const file = req.file
      const errors = []

      // Validate fields that are present, track which to update
      const updates = []

      if (body.judul_buku !== undefined) {
        let v = (body.judul_buku || "").trim()
        if (!v) errors.push(errField("judul_buku", "Judul buku tidak boleh kosong"))
        else { v = stripHTML(v); updates.push({ col: "judul_buku", val: v }) }
      }

      if (body.penulis !== undefined) {
        let v = (body.penulis || "").trim()
        if (!v) errors.push(errField("penulis", "Penulis tidak boleh kosong"))
        else { v = stripHTML(v); updates.push({ col: "penulis", val: v }) }
      }

      if (body.penerbit !== undefined) {
        let v = stripHTML((body.penerbit || "").trim())
        if (!v) errors.push(errField("penerbit", "Penerbit tidak boleh kosong"))
        else updates.push({ col: "penerbit", val: v })
      }

      if (body.tahun_terbit !== undefined) {
        const v = validateTahunTerbit(body.tahun_terbit)
        if (!v.valid) errors.push(errField("tahun_terbit", "Tahun terbit harus angka >= 1900"))
        else updates.push({ col: "tahun_terbit", val: v.sanitized })
      }

      if (body.lokasi_rak !== undefined) {
        let v = (body.lokasi_rak || "").trim()
        if (!v) errors.push(errField("lokasi_rak", "Lokasi rak tidak boleh kosong"))
        else {
          v = stripHTML(v)
          if (!validateLokasiRak(v)) errors.push(errField("lokasi_rak", "Format lokasi rak tidak valid"))
          else updates.push({ col: "lokasi_rak", val: v })
        }
      }

      if (body.stok !== undefined) {
        const v = validateStok(body.stok)
        if (!v.valid) errors.push(errField("stok", "Stok harus angka >= 0"))
        else updates.push({ col: "stok", val: v.sanitized })
      }

      if (body.tema_buku !== undefined) {
        const v = validateTemaBuku(body.tema_buku === "" ? null : body.tema_buku)
        if (!v.valid) errors.push(errField("tema_buku", v.message))
        else updates.push({ col: "tema_buku", val: v.sanitized })
      }

      if (body.tingkat_kelas !== undefined) {
        const v = validateTingkatKelas(body.tingkat_kelas === "" ? null : body.tingkat_kelas)
        if (!v.valid) errors.push(errField("tingkat_kelas", v.message))
        else updates.push({ col: "tingkat_kelas", val: v.sanitized })
      }

      // Handle image
      let newGambar = existing.gambar_sampul

      if (file) {
        if (existing.gambar_sampul) {
          const oldPath = path.join(UPLOADS_DIR, path.basename(existing.gambar_sampul))
          try { fs.unlinkSync(oldPath) } catch (e) { if (e.code !== "ENOENT") console.warn("Delete old image:", e.message) }
        }
        newGambar = `/uploads/${file.filename}`
        updates.push({ col: "gambar_sampul", val: newGambar })
      } else if (body.hapus_gambar === "true" || body.hapus_gambar === true) {
        if (existing.gambar_sampul) {
          const oldPath = path.join(UPLOADS_DIR, path.basename(existing.gambar_sampul))
          try { fs.unlinkSync(oldPath) } catch (e) { if (e.code !== "ENOENT") console.warn("Delete image:", e.message) }
        }
        newGambar = null
        updates.push({ col: "gambar_sampul", val: null })
      }

      if (errors.length > 0) {
        if (file) { try { fs.unlinkSync(file.path) } catch {} }
        return res.status(400).json({ success: false, data: null, message: "Validation Failed", errors })
      }

      if (updates.length > 0) {
        const setStr = updates.map((u) => `${u.col} = ?`).join(", ")
        const params = updates.map((u) => u.val)
        params.push(id_buku)
        db.run(`UPDATE buku SET ${setStr} WHERE id_buku = ?`, params)
      }

      return res.json({ success: true, data: null, message: "Buku berhasil diubah" })
    } catch (err) {
      if (req.file) { try { fs.unlinkSync(req.file.path) } catch {} }
      console.error("PUT /books:", err)
      return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
    }
  })
})

// DELETE /api/v1/books/:id_buku
router.delete("/:id_buku", requireAuth, (req, res) => {
  try {
    const { id_buku } = req.params
    const book = db.get("SELECT status_buku, gambar_sampul FROM buku WHERE id_buku = ?", [id_buku])
    if (!book) {
      return res.status(404).json({ success: false, data: null, message: "Buku tidak ditemukan", errors: [] })
    }
    if (book.status_buku === "Dipinjam") {
      return res.status(409).json({ success: false, data: null, message: "Buku sedang dipinjam dan tidak dapat dihapus", errors: [] })
    }
    db.run("DELETE FROM buku WHERE id_buku = ?", [id_buku])
    if (book.gambar_sampul) {
      const p = path.join(UPLOADS_DIR, path.basename(book.gambar_sampul))
      try { fs.unlinkSync(p) } catch (e) { if (e.code !== "ENOENT") console.warn("Delete image:", e.message) }
    }
    return res.json({ success: true, data: null, message: "Buku berhasil dihapus" })
  } catch (err) {
    console.error("DELETE /books:", err)
    return res.status(500).json({ success: false, data: null, message: "Terjadi kesalahan server", errors: [] })
  }
})

module.exports = router
