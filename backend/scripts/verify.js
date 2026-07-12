const initSqlJs = require("sql.js")
const fs = require("fs")
const path = require("path")

const DB_PATH = path.join(__dirname, "..", "data", "perpustakaan.db")

async function check() {
  const SQL = await initSqlJs()
  const buf = fs.readFileSync(DB_PATH)
  const db = new SQL.Database(buf)

  console.log("=== TABLES ===")
  const tables = db.exec("SELECT name FROM sqlite_master WHERE type IN ('table','view') ORDER BY name;")
  for (const row of tables[0].values) console.log("  " + row[0])

  console.log("")
  console.log("=== GURU ===")
  const guru = db.exec("SELECT id_guru, nama_guru, username FROM guru;")
  for (const row of guru[0].values) console.log("  " + row.join(" | "))

  console.log("")
  console.log("=== BUKU (9 rows) ===")
  const buku = db.exec("SELECT id_buku, judul_buku, COALESCE(tema_buku,'NULL') AS tema_buku, COALESCE(CAST(tingkat_kelas AS TEXT),'NULL') AS tingkat_kelas FROM buku ORDER BY id_buku;")
  for (const row of buku[0].values) console.log("  " + row.join(" | "))

  console.log("")
  console.log("=== RIWAYAT VIEW ===")
  const r = db.exec("SELECT COUNT(*) AS cnt FROM riwayat_peminjaman;")
  console.log("  Count: " + r[0].values[0][0])

  db.close()
  console.log("")
  console.log("All checks passed.")
}

check().catch((e) => { console.error(e); process.exit(1) })
