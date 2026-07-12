const initSqlJs = require("sql.js")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

const DB_PATH = path.join(__dirname, "..", "data", "perpustakaan.db")

async function seed() {
  const SQL = await initSqlJs()

  if (!fs.existsSync(DB_PATH)) {
    console.error("Database file not found. Run 'npm run db:init' first.")
    process.exit(1)
  }

  const buffer = fs.readFileSync(DB_PATH)
  const db = new SQL.Database(buffer)
  db.run("PRAGMA foreign_keys = ON;")

  // Cek apakah sudah ada data Guru — jika ya, skip
  const result = db.exec("SELECT COUNT(*) AS cnt FROM guru;")
  const cnt = result[0]?.values?.[0]?.[0]
  if (cnt && cnt > 0) {
    console.log("Database already seeded. Skipping.")
    db.close()
    process.exit(0)
  }

  const saltRounds = 10

  // ---- Seed Guru ----
  const passwordHash = bcrypt.hashSync("guru123", saltRounds)
  db.run(
    "INSERT INTO guru (id_guru, nama_guru, username, password_hash) VALUES (?, ?, ?, ?)",
    ["G001", "Admin Perpustakaan", "guru_sd", passwordHash]
  )

  // ---- Seed Buku ----
  const bukuList = [
    // Buku pelajaran berjenjang (tingkat_kelas diisi, tema_buku NULL)
    { id_buku: "BK001", judul_buku: "Matematika Kelas 4",       penulis: "Suparjo",       penerbit: "Erlangga",      tema_buku: null, tahun_terbit: 2024, lokasi_rak: "A1", stok: 3, tingkat_kelas: 4 },
    { id_buku: "BK002", judul_buku: "IPA Kelas 5",              penulis: "Siti Aminah",    penerbit: "Gramedia",      tema_buku: null, tahun_terbit: 2023, lokasi_rak: "A2", stok: 2, tingkat_kelas: 5 },
    { id_buku: "BK003", judul_buku: "Bahasa Indonesia Kelas 3", penulis: "Dewi Sartika",   penerbit: "Kemendikbud",   tema_buku: null, tahun_terbit: 2024, lokasi_rak: "A3", stok: 4, tingkat_kelas: 3 },

    // Buku non-pelajaran Cerita & Dongeng (tema_buku diisi, tingkat_kelas NULL)
    { id_buku: "BK004", judul_buku: "Dongeng Nusantara",        penulis: "Budi Santoso",   penerbit: "Mizan",         tema_buku: "Cerita & Dongeng", tahun_terbit: 2022, lokasi_rak: "B1", stok: 0, tingkat_kelas: null },
    { id_buku: "BK005", judul_buku: "Cerita Rakyat Jawa",       penulis: "Dewi Lestari",   penerbit: "Balai Pustaka", tema_buku: "Cerita & Dongeng", tahun_terbit: 2021, lokasi_rak: "B2", stok: 1, tingkat_kelas: null },
    { id_buku: "BK006", judul_buku: "Kumpulan Fabel Dunia",     penulis: "Rina Wijaya",    penerbit: "Gramedia",      tema_buku: "Cerita & Dongeng", tahun_terbit: 2023, lokasi_rak: "B3", stok: 3, tingkat_kelas: null },

    // Buku non-pelajaran kategori Lainnya
    { id_buku: "BK007", judul_buku: "Pendidikan Agama Islam",   penulis: "Ahmad Fauzi",    penerbit: "Tiga Serangkai", tema_buku: "Lainnya", tahun_terbit: 2024, lokasi_rak: "C1", stok: 4, tingkat_kelas: null },
    { id_buku: "BK008", judul_buku: "Ensiklopedia Sains",       penulis: "Tim Pustaka",    penerbit: "Erlangga",      tema_buku: "Lainnya", tahun_terbit: 2023, lokasi_rak: "C2", stok: 2, tingkat_kelas: null },

    // Buku tidak jelas kategorinya (kedua field NULL)
    { id_buku: "BK009", judul_buku: "Panduan Pramuka Siaga",    penulis: "Hendra Putra",   penerbit: "Pustaka Jaya",  tema_buku: null, tahun_terbit: 2023, lokasi_rak: "D1", stok: 2, tingkat_kelas: null },
  ]

  const stmt = db.prepare(`
    INSERT INTO buku (id_buku, judul_buku, penulis, penerbit, tema_buku, tahun_terbit, lokasi_rak, stok, status_buku, tingkat_kelas)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Tersedia', ?)
  `)

  for (const buku of bukuList) {
    stmt.run([buku.id_buku, buku.judul_buku, buku.penulis, buku.penerbit, buku.tema_buku, buku.tahun_terbit, buku.lokasi_rak, buku.stok, buku.tingkat_kelas])
  }
  stmt.free()

  // Simpan ke file
  const data = db.export()
  fs.writeFileSync(DB_PATH, Buffer.from(data))

  console.log("Seed data inserted successfully:")
  console.log("  - 1 Guru (username: guru_sd, password: guru123)")
  console.log(`  - ${bukuList.length} Buku`)
  db.close()
}

seed().catch((err) => {
  console.error("Failed to seed database:", err)
  process.exit(1)
})
