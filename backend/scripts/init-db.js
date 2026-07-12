const initSqlJs = require("sql.js")
const fs = require("fs")
const path = require("path")

const DB_PATH = path.join(__dirname, "..", "data", "perpustakaan.db")

async function initDatabase() {
  const SQL = await initSqlJs()

  let db
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  // PRAGMA wajib dijalankan di setiap koneksi backend
  db.run("PRAGMA journal_mode = WAL;")
  db.run("PRAGMA foreign_keys = ON;")

  // ============================================================
  // TABEL: guru
  // ============================================================
  db.run(`
    CREATE TABLE IF NOT EXISTS guru (
        id_guru         TEXT PRIMARY KEY,
        nama_guru       TEXT NOT NULL,
        username        TEXT NOT NULL UNIQUE,
        password_hash   TEXT NOT NULL,
        created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_guru_updated_at
    AFTER UPDATE ON guru
    BEGIN
        UPDATE guru SET updated_at = CURRENT_TIMESTAMP WHERE id_guru = NEW.id_guru;
    END;
  `)

  // ============================================================
  // TABEL: session
  // ============================================================
  db.run(`
    CREATE TABLE IF NOT EXISTS session (
        id_session      TEXT PRIMARY KEY,
        id_guru         TEXT NOT NULL,
        created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_activity   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at      TEXT NOT NULL,
        FOREIGN KEY (id_guru) REFERENCES guru(id_guru) ON DELETE CASCADE
    );
  `)

  // ============================================================
  // TABEL: buku
  // ============================================================
  db.run(`
    CREATE TABLE IF NOT EXISTS buku (
        id_buku         TEXT PRIMARY KEY,
        judul_buku      TEXT NOT NULL,
        penulis         TEXT NOT NULL,
        penerbit        TEXT NOT NULL,
        tema_buku       TEXT DEFAULT NULL
                        CHECK (tema_buku IS NULL OR tema_buku IN ('Cerita & Dongeng', 'Lainnya')),
        tahun_terbit    INTEGER NOT NULL CHECK (tahun_terbit >= 1900),
        lokasi_rak      TEXT NOT NULL,
        stok            INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
        status_buku     TEXT NOT NULL DEFAULT 'Tersedia'
                        CHECK (status_buku IN ('Tersedia', 'Dipinjam', 'Tidak Aktif')),
        gambar_sampul   TEXT DEFAULT NULL,
        tingkat_kelas   INTEGER DEFAULT NULL CHECK (tingkat_kelas IS NULL OR tingkat_kelas BETWEEN 1 AND 6),
        created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_buku_updated_at
    AFTER UPDATE ON buku
    BEGIN
        UPDATE buku SET updated_at = CURRENT_TIMESTAMP WHERE id_buku = NEW.id_buku;
    END;
  `)

  // ============================================================
  // TABEL: peminjaman
  // ============================================================
  db.run(`
    CREATE TABLE IF NOT EXISTS peminjaman (
        id_peminjaman           TEXT PRIMARY KEY,
        id_buku                 TEXT NOT NULL,
        nama_siswa              TEXT NOT NULL,
        kelas_siswa             TEXT NOT NULL,
        tgl_peminjaman          TEXT NOT NULL DEFAULT (date('now')),
        tgl_batas_pengembalian  TEXT NOT NULL,
        status_peminjaman       TEXT NOT NULL DEFAULT 'Dipinjam'
                                CHECK (status_peminjaman IN ('Dipinjam', 'Sudah Dikembalikan')),
        created_at              TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at              TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_buku) REFERENCES buku(id_buku),
        CHECK (tgl_batas_pengembalian >= tgl_peminjaman)
    );
  `)

  db.run(`
    CREATE TRIGGER IF NOT EXISTS trg_peminjaman_updated_at
    AFTER UPDATE ON peminjaman
    BEGIN
        UPDATE peminjaman SET updated_at = CURRENT_TIMESTAMP WHERE id_peminjaman = NEW.id_peminjaman;
    END;
  `)

  // ============================================================
  // TABEL: pengembalian
  // ============================================================
  db.run(`
    CREATE TABLE IF NOT EXISTS pengembalian (
        id_pengembalian     TEXT PRIMARY KEY,
        id_peminjaman       TEXT NOT NULL UNIQUE,
        tgl_pengembalian    TEXT NOT NULL DEFAULT (date('now')),
        kondisi_buku        TEXT NOT NULL
                            CHECK (kondisi_buku IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
        keterlambatan_hari  INTEGER NOT NULL DEFAULT 0 CHECK (keterlambatan_hari >= 0),
        denda_keterlambatan INTEGER NOT NULL DEFAULT 0 CHECK (denda_keterlambatan >= 0),
        biaya_kondisi       INTEGER NOT NULL DEFAULT 0 CHECK (biaya_kondisi >= 0),
        total_denda         INTEGER NOT NULL DEFAULT 0 CHECK (total_denda >= 0),
        created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_peminjaman) REFERENCES peminjaman(id_peminjaman)
    );
  `)

  // ============================================================
  // VIEW: riwayat_peminjaman
  // ============================================================
  db.run(`
    CREATE VIEW IF NOT EXISTS riwayat_peminjaman AS
    SELECT
        p.id_peminjaman,
        p.nama_siswa,
        p.kelas_siswa,
        b.judul_buku,
        b.tema_buku,
        p.tgl_peminjaman,
        p.tgl_batas_pengembalian,
        k.tgl_pengembalian,
        k.kondisi_buku,
        k.keterlambatan_hari,
        k.total_denda,
        p.status_peminjaman,
        p.created_at AS tgl_catat_peminjaman
    FROM peminjaman p
    LEFT JOIN buku b ON p.id_buku = b.id_buku
    LEFT JOIN pengembalian k ON p.id_peminjaman = k.id_peminjaman
    ORDER BY p.created_at DESC;
  `)

  // Simpan ke file
  const data = db.export()
  const buffer = Buffer.from(data)
  fs.writeFileSync(DB_PATH, buffer)

  console.log("Database initialized successfully at:", DB_PATH)
  db.close()
}

initDatabase().catch((err) => {
  console.error("Failed to initialize database:", err)
  process.exit(1)
})
