# Data Model (DM) — Source of Truth #6

Document Version: v1.5 (Ubah tema_buku menjadi nullable enum 2 nilai; penyempurnaan aturan pengisian tingkat_kelas & tema_buku — sinkron srs.md v3.6)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-11
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan Data Model (DM) Sistem Informasi Perpustakaan SD Negeri Tamanan sebagai **Source of Truth #6 (SoT-6)**. Data model ini diturunkan secara langsung dari:

- **SoT-1 (`srs.md` v3.4):** Sumber business objects, validation rules, dan business rules (Feature ID F001–F007, FR-001–FR-029), termasuk **Tech Stack final: SQLite file-based** untuk deployment single-PC lokal di perpustakaan sekolah (Section 3, 3.1–3.3).
- **SoT-2 (`information_architecture.md`, sinkron SRS v3.4):** Sumber struktur halaman, field-field form aktual yang ditampilkan ke pengguna (termasuk field Gambar Sampul & kolom Denda), dan routing.
- **SoT-3 (`design_system.md` v1.5):** Sumber status/badge, komponen UI, formula denda, dan komponen Image Upload (9.11) yang harus dapat direpresentasikan oleh data.
- **SoT-4 (`user_flows` v1.1 — index.md + UC-001 s.d. UC-006):** Sumber utama entity lifecycle, atribut, dan relasi antar data.

Dokumen ini digunakan sebagai landasan resmi untuk:

- Implementasi backend dan desain skema database (DDL, **SQLite**).
- Pengembangan API contract dan validation rules.
- Pembuatan Use Case Integration Contract (SoT-7).
- Penulisan integration logic dan test cases.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | `srs.md` v3.4 | Spesifikasi kebutuhan, business objects, dan data validation rules (Feature ID F001–F007, FR-001–FR-029). Tech Stack final: SQLite file-based, deployment single-PC lokal. |
| SoT-2 | `information_architecture.md` (sinkron SRS v3.4) | Struktur halaman, field form aktual (termasuk Gambar Sampul & kolom Denda), routing. |
| SoT-3 | `design_system.md` v1.5 | Status/badge, komponen UI, formula denda (Section 11.8, 14), komponen Image Upload (9.11). |
| SoT-4 | `user_flows` v1.1 (index.md + UC-001 s.d. UC-006) | Sumber utama entity lifecycle, atribut, dan relasi antar data. |
| SoT-5 | HiFi Prototype | Representasi visual; menggunakan SoT-6 sebagai referensi data binding. |
| SoT-7 | UCIC | Use Case Integration Contract; diturunkan dari SoT-4 + SoT-6. |

### 1.3 Catatan Migrasi Engine Database (Baru v1.3)

Sesuai `srs.md` v3.3–v3.4, keputusan tech stack database berubah dari **MySQL (server terpisah)** menjadi **SQLite (file-based, tanpa instalasi server DB terpisah)**, karena sistem berjalan pada satu unit PC lokal di perpustakaan (server dan client adalah PC yang sama). Perubahan ini murni pada **lapisan implementasi/DDL** — seluruh Entity, Attribute, Relationship, dan Business Rules pada Section 2–5 dokumen ini **tidak berubah secara konseptual**. Yang berubah hanya sintaks DDL pada Section 6, karena SQLite memiliki keterbatasan dibanding MySQL:

| Fitur MySQL (v1.2) | Status di SQLite | Solusi/Pengganti |
| --- | --- | --- |
| `ENGINE=InnoDB` | Tidak ada konsep storage engine terpisah | Dihapus; SQLite selalu ACID-compliant secara default. |
| `TIMESTAMP ... ON UPDATE CURRENT_TIMESTAMP` | Tidak didukung sebagai klausa kolom | Diganti `TRIGGER AFTER UPDATE` per tabel. |
| `CHECK (... REGEXP ...)` | `REGEXP` bukan operator bawaan SQLite | Validasi format (`lokasi_rak`) tetap primer di application layer (Express.js); `CHECK` di database hanya sebagai sanity-check longgar, atau daftarkan custom function `REGEXP` via driver (`better-sqlite3`). |
| `DECIMAL(10,2)` | Tidak ada tipe DECIMAL asli (hanya type affinity TEXT/INTEGER/REAL) | Diganti `INTEGER`, karena seluruh nominal denda dalam Rupiah bulat (tanpa sen) — menghindari floating-point rounding error yang berisiko jika dipaksakan `REAL`. |
| `DATE` / `TIMESTAMP` sebagai tipe native | Disimpan sebagai TEXT (format ISO-8601) via type affinity | Tetap dideklarasikan `DATE`/`TIMESTAMP` di DDL untuk keterbacaan skema; SQLite menerimanya sebagai TEXT affinity dan aplikasi tetap memformat ISO-8601. |
| Foreign Key enforcement | Tidak aktif secara default | Wajib `PRAGMA foreign_keys = ON;` dijalankan di setiap koneksi backend (lihat Section 6). |

---

## 2. DOMAIN OBJECT INVENTORY

Berdasarkan analisis seluruh User Flows (UC-001 s.d. UC-006), terdapat **6 domain object** utama dalam sistem:

| Entity ID | Entity Name | Diturunkan dari UC | Deskripsi |
| --- | --- | --- | --- |
| E-01 | guru | UC-001 | Akun guru yang mengelola sistem perpustakaan. |
| E-02 | buku | UC-002, UC-003, UC-004, UC-006 | Katalog buku perpustakaan, termasuk Lokasi Rak dan Gambar Sampul (opsional, v1.3). |
| E-03 | peminjaman | UC-003, UC-004, UC-005 | Transaksi peminjaman buku oleh siswa. |
| E-04 | pengembalian | UC-004, UC-005 | Data pengembalian buku yang terhubung ke transaksi peminjaman, termasuk denda (v1.2). |
| E-05 | riwayat_peminjaman | UC-005 | View/rekap historis transaksi untuk monitoring. |
| E-06 | session | UC-001 | Sesi autentikasi guru yang aktif. |

---

## 3. ENTITY DEFINITIONS

### 3.1 Entity: guru

**Diturunkan dari:** UC-001 (Login Guru).

**Deskripsi:** Menyimpan data akun guru yang berwenang mengelola sistem perpustakaan.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_guru` | TEXT (VARCHAR 10) | PRIMARY KEY | Kode unik guru (contoh: "G001"). |
| `nama_guru` | TEXT (VARCHAR 100) | NOT NULL | Nama lengkap guru. |
| `username` | TEXT (VARCHAR 50) | NOT NULL, UNIQUE | Username untuk login. |
| `password_hash` | TEXT (VARCHAR 255) | NOT NULL | Password hash bcrypt. |
| `created_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu pembuatan akun. |
| `updated_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu terakhir data diperbarui (di-update via TRIGGER, lihat Section 6). |

#### Validation Rules
- `username` tidak boleh mengandung spasi atau karakter khusus berbahaya.
- `password_hash` wajib dihasilkan menggunakan algoritma bcrypt.
- Tidak ada mekanisme self-registration.

---

### 3.2 Entity: buku (Direvisi v1.3)

**Diturunkan dari:** UC-002, UC-003, UC-004, UC-006.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_buku` | TEXT (VARCHAR 20) | PRIMARY KEY | Kode unik buku. |
| `judul_buku` | TEXT (VARCHAR 255) | NOT NULL | Judul lengkap buku. |
| `penulis` | TEXT (VARCHAR 150) | NOT NULL | Nama penulis buku. |
| `penerbit` | TEXT (VARCHAR 150) | NOT NULL | Nama penerbit buku. |
| `tema_buku` | TEXT (VARCHAR 100) | NULL, DEFAULT NULL, CHECK (tema_buku IN ('Cerita & Dongeng', 'Lainnya') OR tema_buku IS NULL) | **(Direvisi v1.5)** Tema/kategori buku. Opsional — diisi hanya untuk buku non-pelajaran ("Cerita & Dongeng" atau "Lainnya"); buku pelajaran cukup diidentifikasi via `tingkat_kelas`. |
| `tahun_terbit` | INTEGER | NOT NULL, CHECK ≥ 1900 | Tahun penerbitan. |
| `lokasi_rak` | TEXT (VARCHAR 10) | NOT NULL | Kode rak, format huruf+nomor (contoh "A1"). |
| `stok` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Jumlah eksemplar tersedia. |
| `status_buku` | TEXT (VARCHAR 20) | NOT NULL, DEFAULT 'Tersedia' | `'Tersedia'` / `'Dipinjam'` / `'Tidak Aktif'`. |
| `gambar_sampul` | TEXT (VARCHAR 255) | NULL, DEFAULT NULL | **(Baru v1.3)** Path relatif file gambar sampul di filesystem lokal (contoh: `/uploads/buku_A1_001.jpg`). NULL jika Guru belum mengunggah sampul → frontend menampilkan placeholder inisial judul (DS v1.5 Section 9.11). |
| `tingkat_kelas` | INTEGER | NULL, DEFAULT NULL, CHECK (tingkat_kelas IS NULL OR tingkat_kelas BETWEEN 1 AND 6) | **(Baru v1.4, disempurnakan v1.5)** Tingkat kelas SD yang sesuai untuk buku ini (1–6). Opsional — diisi hanya untuk buku pelajaran berjenjang kelas; NULL berarti buku non-pelajaran atau berlaku untuk semua kelas. |
| `created_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu buku ditambahkan. |
| `updated_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu terakhir diperbarui (via TRIGGER). |

#### Validation Rules
- `id_buku` harus unik.
- `stok` ≥ 0.
- `lokasi_rak` wajib diisi, format `^[A-Za-z]+[0-9]+$` — divalidasi primer di application layer (Express.js); lihat Section 1.3 soal keterbatasan `REGEXP` di SQLite.
- Buku berstatus `'Dipinjam'` tidak dapat dihapus.
- `judul_buku`, `penulis`, `lokasi_rak` wajib bersih dari XSS.
- **(Baru v1.3)** `gambar_sampul` bersifat opsional (nullable) — tidak wajib diisi. Validasi ukuran file (maks 2MB) dan format (JPG/PNG) dilakukan sepenuhnya di application layer sebelum file disimpan ke `/uploads`; kolom ini hanya menyimpan **path**, bukan file/binary itu sendiri (SQLite tidak dipakai sebagai blob storage — sesuai `design_system.md` v1.5 token `token-image-storage`: "Local filesystem, bukan cloud storage").
- Jika buku dihapus (DELETE, hanya untuk status `'Tersedia'`), file fisik pada `gambar_sampul` juga wajib dihapus dari folder `/uploads` oleh application layer (bukan oleh database, karena SQLite tidak dapat mengakses filesystem).
- `tingkat_kelas` bersifat opsional (nullable); jika diisi, harus berupa integer 1–6.
- **(Baru v1.5)** `tema_buku` bersifat opsional (nullable); jika diisi, hanya dapat berupa `'Cerita & Dongeng'` atau `'Lainnya'` (enum tertutup).

---

### 3.3 Entity: peminjaman

**Diturunkan dari:** UC-003, UC-004, UC-005.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_peminjaman` | TEXT (VARCHAR 20) | PRIMARY KEY | Kode unik transaksi. |
| `id_buku` | TEXT (VARCHAR 20) | NOT NULL, FK → buku(id_buku) | Referensi buku dipinjam. |
| `nama_siswa` | TEXT (VARCHAR 100) | NOT NULL | Nama siswa peminjam. |
| `kelas_siswa` | TEXT (VARCHAR 10) | NOT NULL | Kelas siswa. |
| `tgl_peminjaman` | DATE (TEXT ISO-8601) | NOT NULL | Otomatis, immutable. |
| `tgl_batas_pengembalian` | DATE (TEXT ISO-8601) | NOT NULL | Diatur guru. |
| `status_peminjaman` | TEXT (VARCHAR 25) | NOT NULL, DEFAULT 'Dipinjam' | `'Dipinjam'` / `'Sudah Dikembalikan'`. |
| `created_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | — |
| `updated_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | — (via TRIGGER) |

#### Validation Rules
- `tgl_batas_pengembalian` ≥ `tgl_peminjaman`.
- `id_buku` harus ada, bukan `'Tidak Aktif'`, `stok > 0` saat dibuat.
- `nama_siswa`, `kelas_siswa` wajib diisi, bersih dari XSS.
- `tgl_peminjaman` immutable.

---

### 3.4 Entity: pengembalian

**Diturunkan dari:** UC-004, UC-005, srs.md v3.4 F004, design_system.md v1.5 Section 11.8.

**Deskripsi:** Menyimpan data pengembalian buku, termasuk kondisi fisik, keterlambatan, dan nominal denda yang dihitung otomatis.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_pengembalian` | TEXT (VARCHAR 20) | PRIMARY KEY | Kode unik transaksi pengembalian. |
| `id_peminjaman` | TEXT (VARCHAR 20) | NOT NULL, UNIQUE, FK → peminjaman(id_peminjaman) | Referensi peminjaman. |
| `tgl_pengembalian` | DATE (TEXT ISO-8601) | NOT NULL | Otomatis, immutable. |
| `kondisi_buku` | TEXT (VARCHAR 20) | NOT NULL | `'Baik'` / `'Rusak Ringan'` / `'Rusak Berat'`. |
| `keterlambatan_hari` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | `MAX(0, tgl_pengembalian - tgl_batas_pengembalian)`. |
| `denda_keterlambatan` | **INTEGER** *(direvisi v1.3, sebelumnya DECIMAL)* | NOT NULL, DEFAULT 0, CHECK ≥ 0 | `keterlambatan_hari × DENDA_PER_HARI` — nilai Rupiah bulat. |
| `biaya_kondisi` | **INTEGER** *(direvisi v1.3, sebelumnya DECIMAL)* | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Diambil dari konstanta aplikasi (Section 3.7), bukan hardcode. |
| `total_denda` | **INTEGER** *(direvisi v1.3, sebelumnya DECIMAL)* | NOT NULL, DEFAULT 0, CHECK ≥ 0 | `denda_keterlambatan + biaya_kondisi`. |
| `created_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu data pengembalian dicatat. |

#### Calculation Rules
```
denda_keterlambatan = keterlambatan_hari × Rp 500     (placeholder, srs.md v3.4 Open Question #1)
biaya_kondisi        = Rp 0        jika kondisi_buku = 'Baik'
                       Rp 2.000    jika kondisi_buku = 'Rusak Ringan'
                       Rp 5.000    jika kondisi_buku = 'Rusak Berat'
total_denda          = denda_keterlambatan + biaya_kondisi
```

#### Lifecycle Rules

| Event | Action | Sumber |
| --- | --- | --- |
| Konfirmasi pengembalian | INSERT baris baru; sistem hitung `keterlambatan_hari`, `denda_keterlambatan`, `biaya_kondisi`, `total_denda` otomatis di application layer. UPDATE `peminjaman.status_peminjaman`, UPDATE `buku.stok`/`status_buku`. Satu database transaction. | UC-004, srs.md v3.4 F004 |
| Guru lihat riwayat | SELECT (JOIN `peminjaman`, `buku`), termasuk `total_denda` untuk Badge Denda. | UC-005 |
| Koreksi kesalahan | **Tidak tersedia via antarmuka Guru** — immutable setelah tersimpan. Koreksi hanya oleh administrator via akses langsung ke file database SQLite. | srs.md v3.4 |

#### Validation Rules
- `kondisi_buku` hanya enum `'Baik'`, `'Rusak Ringan'`, `'Rusak Berat'`.
- `id_peminjaman` harus ada dan berstatus `'Dipinjam'`.
- Satu `id_peminjaman` hanya satu baris `pengembalian` (UNIQUE).
- `tgl_pengembalian`, `denda_keterlambatan`, `biaya_kondisi`, `total_denda` immutable, tidak ada endpoint UPDATE.
- `denda_keterlambatan` dan `biaya_kondisi` **tidak boleh diinput manual** — wajib dihitung server-side dari konstanta aplikasi (Section 3.7), bukan dari input form.

---

### 3.5 Entity: riwayat_peminjaman (View)

**Diturunkan dari:** UC-005.

**Deskripsi:** Database VIEW read-only yang menggabungkan `peminjaman`, `pengembalian`, `buku`.

#### Kolom yang Tersedia

| Kolom | Sumber Tabel | Keterangan |
| --- | --- | --- |
| `id_peminjaman` | peminjaman | ID transaksi |
| `nama_siswa` | peminjaman | Nama siswa peminjam |
| `kelas_siswa` | peminjaman | Kelas siswa |
| `judul_buku` | buku | Judul buku |
| `tema_buku` | buku | Tema/kategori buku |
| `tgl_peminjaman` | peminjaman | Tanggal pinjam |
| `tgl_batas_pengembalian` | peminjaman | Tanggal batas kembali |
| `tgl_pengembalian` | pengembalian | Tanggal aktual kembali (NULL jika masih dipinjam) |
| `kondisi_buku` | pengembalian | Kondisi saat kembali |
| `keterlambatan_hari` | pengembalian | Jumlah hari terlambat |
| `total_denda` | pengembalian | Nominal denda untuk Badge Denda |
| `status_peminjaman` | peminjaman | `'Dipinjam'` / `'Sudah Dikembalikan'` |

#### Filter yang Didukung (UC-005)

| Filter | Kolom | Tipe Operasi |
| --- | --- | --- |
| Nama Siswa | `nama_siswa` | LIKE `%keyword%` |
| Judul Buku | `judul_buku` | LIKE `%keyword%` |
| Rentang Tanggal | `tgl_peminjaman` | BETWEEN `tgl_mulai` AND `tgl_akhir` |

---

### 3.6 Entity: session

**Diturunkan dari:** UC-001.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_session` | TEXT (VARCHAR 128) | PRIMARY KEY | Token sesi unik. |
| `id_guru` | TEXT (VARCHAR 10) | NOT NULL, FK → guru(id_guru) | Referensi guru aktif. |
| `created_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu sesi dibuat. |
| `last_activity` | TIMESTAMP (TEXT ISO-8601) | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Waktu aktivitas terakhir. |
| `expires_at` | TIMESTAMP (TEXT ISO-8601) | NOT NULL | `last_activity + 30 menit`. |

---

### 3.7 Konstanta Aplikasi — Denda

Nominal denda tidak disimpan sebagai nilai tetap di skema database, melainkan sebagai konfigurasi backend (bukan tabel, bukan baris data) — mengikuti design_system.md v1.5 Section 14 (Design Tokens). Ini supaya nominal bisa diubah kapan saja tanpa migrasi database.

**Lokasi implementasi (backend Express.js):**

```
backend/
├── .env                          ← nilai aktual nominal denda
├── .env.example                  ← template kosong untuk dokumentasi
├── config/
│   └── denda.config.js           ← baca dari .env, di-export sebagai object
├── data/
│   └── perpustakaan.db           ← (Baru v1.3) file database SQLite, disimpan lokal di PC perpustakaan
├── uploads/                      ← (Baru v1.3) folder penyimpanan gambar sampul buku (bukan cloud storage)
└── controllers/
    └── pengembalianController.js ← pakai config ini saat hitung total_denda (F004)
```

| Konstanta | Nilai Saat Ini (Placeholder) | Catatan |
| --- | --- | --- |
| `DENDA_PER_HARI` | Rp 500 | Wajib dikonfirmasi ulang oleh sekolah sebelum go-live (srs.md v3.4, Open Question #1). |
| `DENDA_RUSAK_RINGAN` | Rp 2.000 | Idem. |
| `DENDA_RUSAK_BERAT` | Rp 5.000 | Idem. |
| `DENDA_CAP_MAKSIMAL` | *(belum ditetapkan)* | Menunggu keputusan sekolah (srs.md v3.4, Open Question #2). Jika ditetapkan, diterapkan sebagai `MIN(total_denda, cap)` di application layer. |
| `MAX_IMAGE_SIZE_MB` | 2 MB | Sesuai DS v1.5 token `token-image-upload-maxsize`. |
| `ALLOWED_IMAGE_FORMAT` | JPG, PNG | Sesuai DS v1.5 token `token-image-upload-format`. |

---

## 4. ENTITY RELATIONSHIP DIAGRAM (ERD)

```
┌─────────────┐       ┌──────────────────────────────────────────────┐
│    guru     │       │                  session                     │
├─────────────┤  1    ├──────────────────────────────────────────────┤
│ id_guru  PK │───────│ id_session PK                                │
│ nama_guru   │       │ id_guru FK ──────────────────────────────────┘
│ username    │       │ created_at                                   │
│ password_   │       │ last_activity                                │
│   hash      │       │ expires_at                                   │
│ created_at  │       └──────────────────────────────────────────────┘
│ updated_at  │
└─────────────┘

┌──────────────────────┐         ┌────────────────────────────────────────┐
│     buku (v1.3)       │  1      │              peminjaman                │
├──────────────────────┤◄────────┤                                        │
│ id_buku         PK   │         │ id_peminjaman      PK                  │
│ judul_buku           │    *    │ id_buku            FK → buku(id_buku)  │
│ penulis               │         │ nama_siswa                             │
│ penerbit              │         │ kelas_siswa                            │
│ tema_buku             │         │ tgl_peminjaman                         │
│ tahun_terbit          │         │ tgl_batas_pengembalian                 │
│ lokasi_rak            │         │ status_peminjaman                      │
│ stok                  │         │ created_at                             │
│ status_buku           │         │ updated_at                             │
│ gambar_sampul (baru)  │         └─────────────────┬──────────────────────┘
│ created_at            │                           │ 1
│ updated_at            │                           │
└──────────────────────┘                            │
                                  ┌──────────────────▼──────────────────────┐
                                  │              pengembalian                │
                                  ├──────────────────────────────────────────┤
                                  │ id_pengembalian  PK                     │
                                  │ id_peminjaman    FK (UNIQUE)            │
                                  │ tgl_pengembalian                        │
                                  │ kondisi_buku                            │
                                  │ keterlambatan_hari                      │
                                  │ denda_keterlambatan   (INTEGER, v1.3)   │
                                  │ biaya_kondisi         (INTEGER, v1.3)   │
                                  │ total_denda           (INTEGER, v1.3)   │
                                  │ created_at                              │
                                  └──────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────
VIEW: riwayat_peminjaman (menyertakan total_denda)
Engine: SQLite (file-based, /backend/data/perpustakaan.db)
─────────────────────────────────────────────────────────────────────
```

### Ringkasan Relasi

| Relasi | Kardinalitas | Keterangan |
| --- | --- | --- |
| guru → session | 1 : N | Satu guru, banyak sesi (multi-device), satu sesi aktif per login. |
| buku → peminjaman | 1 : N | Satu buku bisa dipinjam berkali-kali. |
| peminjaman → pengembalian | 1 : 1 | Satu peminjaman, tepat satu pengembalian. |

---

## 5. DATA FLOW PER USE CASE

### UC-001: Login Guru
```
INPUT:  username, password
PROSES: SELECT guru WHERE username = ? → verify bcrypt(password, password_hash)
OUTPUT: INSERT session → kirim id_session sebagai HttpOnly Cookie
TABLES: guru (READ), session (INSERT)
```

### UC-002: Manajemen Data Buku (Direvisi v1.5)
```
Tambah: (opsional) simpan file gambar sampul ke /uploads, dapatkan path
        INSERT INTO buku (..., lokasi_rak, stok, status_buku='Tersedia', gambar_sampul=<path atau NULL>, tema_buku=<NULL/'Cerita & Dongeng'/'Lainnya'>, tingkat_kelas=<1-6 or NULL>)
Edit:   (opsional) ganti file gambar sampul di /uploads, hapus file lama jika diganti
        UPDATE buku SET ..., tema_buku = ?, tingkat_kelas = ? WHERE id_buku = ?
Hapus:  DELETE FROM buku WHERE id_buku = ? AND status_buku = 'Tersedia'
        (application layer juga menghapus file gambar_sampul terkait dari /uploads, jika ada)
TABLES: buku (CRUD)
FILES:  /uploads (CRUD gambar sampul, dikelola application layer, bukan oleh SQLite)
```

### UC-003: Pencatatan Peminjaman
```
PROSES: BEGIN TRANSACTION
        INSERT INTO peminjaman (..., tgl_peminjaman=TODAY, status='Dipinjam')
        UPDATE buku SET stok = stok - 1, status_buku = CASE WHEN stok-1=0 THEN 'Dipinjam' ELSE status_buku END
        COMMIT
TABLES: peminjaman (INSERT), buku (UPDATE)
```

### UC-004: Pencatatan Pengembalian
```
INPUT:  id_peminjaman, kondisi_buku
PROSES: BEGIN TRANSACTION
        -- hitung di application layer sebelum INSERT:
        keterlambatan_hari   = MAX(0, TODAY - tgl_batas_pengembalian)
        denda_keterlambatan  = keterlambatan_hari * DENDA_PER_HARI      -- INTEGER, Rupiah bulat
        biaya_kondisi         = lookup(kondisi_buku)   -- dari config, Section 3.7
        total_denda           = denda_keterlambatan + biaya_kondisi

        INSERT INTO pengembalian (id_pengembalian, id_peminjaman, tgl_pengembalian=TODAY,
                                   kondisi_buku, keterlambatan_hari,
                                   denda_keterlambatan, biaya_kondisi, total_denda)
        UPDATE peminjaman SET status_peminjaman='Sudah Dikembalikan', updated_at=NOW()
        UPDATE buku SET stok = stok + 1, status_buku = 'Tersedia'
        COMMIT
TABLES: pengembalian (INSERT), peminjaman (UPDATE), buku (UPDATE)
```

### UC-005: Melihat Riwayat Peminjaman
```
PROSES: SELECT * FROM riwayat_peminjaman
        [WHERE nama_siswa LIKE ? AND/OR judul_buku LIKE ? AND/OR tgl_peminjaman BETWEEN ? AND ?]
TABLES: riwayat_peminjaman VIEW (READ-ONLY)
```

### UC-006: Akses Publik Siswa (Direvisi v1.5)
```
PROSES: SELECT id_buku, judul_buku, penulis, tema_buku, lokasi_rak, stok, status_buku, gambar_sampul, tingkat_kelas FROM buku
        WHERE status_buku != 'Tidak Aktif'
        [AND (tingkat_kelas = ? OR tingkat_kelas IS NULL)]   -- filter kategori kelas opsional
        [AND (tema_buku = ?)]                                 -- filter tema opsional (Cerita & Dongeng / Lainnya)
TABLES: buku (READ-ONLY)
```

---

## 6. DATABASE SCHEMA (DDL — SQLite) 
> **Wajib dijalankan di setiap koneksi backend:**
> ```sql
> PRAGMA foreign_keys = ON;
> ```
> SQLite tidak mengaktifkan foreign key enforcement secara default per-koneksi.

```sql
-- ============================================================
-- TABEL: guru
-- ============================================================
CREATE TABLE guru (
    id_guru         TEXT PRIMARY KEY,
    nama_guru       TEXT NOT NULL,
    username        TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_guru_updated_at
AFTER UPDATE ON guru
BEGIN
    UPDATE guru SET updated_at = CURRENT_TIMESTAMP WHERE id_guru = NEW.id_guru;
END;

-- ============================================================
-- TABEL: session
-- ============================================================
CREATE TABLE session (
    id_session      TEXT PRIMARY KEY,
    id_guru         TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TEXT NOT NULL,
    FOREIGN KEY (id_guru) REFERENCES guru(id_guru) ON DELETE CASCADE
);

-- ============================================================
-- TABEL: buku
-- ============================================================
CREATE TABLE buku (
    id_buku         TEXT PRIMARY KEY,
    judul_buku      TEXT NOT NULL,
    penulis         TEXT NOT NULL,
    penerbit        TEXT NOT NULL,
    tema_buku       TEXT DEFAULT NULL             -- opsional (v1.5); 'Cerita & Dongeng' / 'Lainnya' — diisi hanya untuk buku non-pelajaran
                    CHECK (tema_buku IS NULL OR tema_buku IN ('Cerita & Dongeng', 'Lainnya')),
    tahun_terbit    INTEGER NOT NULL CHECK (tahun_terbit >= 1900),
    lokasi_rak      TEXT NOT NULL,
    -- Catatan: validasi format '^[A-Za-z]+[0-9]+$' primer dilakukan di application layer (Express.js).
    -- SQLite tidak punya REGEXP bawaan; jika ingin lapisan kedua di database, daftarkan custom
    -- function REGEXP via better-sqlite3 (db.function('REGEXP', ...)) lalu aktifkan CHECK berikut:
    -- CHECK (lokasi_rak REGEXP '^[A-Za-z]+[0-9]+$')
    stok            INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0),
    status_buku     TEXT NOT NULL DEFAULT 'Tersedia'
                    CHECK (status_buku IN ('Tersedia', 'Dipinjam', 'Tidak Aktif')),
    gambar_sampul   TEXT DEFAULT NULL,  -- path relatif, contoh: /uploads/buku_A1_001.jpg; NULL = belum ada sampul
    tingkat_kelas   INTEGER DEFAULT NULL CHECK (tingkat_kelas IS NULL OR tingkat_kelas BETWEEN 1 AND 6),
    created_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER trg_buku_updated_at
AFTER UPDATE ON buku
BEGIN
    UPDATE buku SET updated_at = CURRENT_TIMESTAMP WHERE id_buku = NEW.id_buku;
END;

-- ============================================================
-- TABEL: peminjaman
-- ============================================================
CREATE TABLE peminjaman (
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

CREATE TRIGGER trg_peminjaman_updated_at
AFTER UPDATE ON peminjaman
BEGIN
    UPDATE peminjaman SET updated_at = CURRENT_TIMESTAMP WHERE id_peminjaman = NEW.id_peminjaman;
END;

-- ============================================================
-- TABEL: pengembalian 
-- ============================================================
CREATE TABLE pengembalian (
    id_pengembalian     TEXT PRIMARY KEY,
    id_peminjaman       TEXT NOT NULL UNIQUE,
    tgl_pengembalian    TEXT NOT NULL DEFAULT (date('now')),
    kondisi_buku        TEXT NOT NULL
                        CHECK (kondisi_buku IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
    keterlambatan_hari  INTEGER NOT NULL DEFAULT 0 CHECK (keterlambatan_hari >= 0),
    denda_keterlambatan INTEGER NOT NULL DEFAULT 0 CHECK (denda_keterlambatan >= 0),
    biaya_kondisi       INTEGER NOT NULL DEFAULT 0 CHECK (biaya_kondisi >= 0),
    total_denda         INTEGER NOT NULL DEFAULT 0 CHECK (total_denda >= 0),
    -- Alternatif: total_denda dapat dideklarasikan sebagai generated column jika SQLite >= 3.31:
    -- total_denda INTEGER GENERATED ALWAYS AS (denda_keterlambatan + biaya_kondisi) STORED
    created_at          TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_peminjaman) REFERENCES peminjaman(id_peminjaman)
);

-- ============================================================
-- VIEW: riwayat_peminjaman (menyertakan total_denda)
-- ============================================================
CREATE VIEW riwayat_peminjaman AS
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
```

---

## 7. BUSINESS RULES TRACEABILITY

| Rule ID | Business Rule | Sumber (SRS) | Implementasi di Data Model |
| --- | --- | --- | --- |
| BR-01 | ID Buku harus unik. | F002 | `id_buku` PRIMARY KEY. |
| BR-02 | Stok buku tidak boleh negatif (≥ 0). | F002 | `CHECK (stok >= 0)` pada `buku`. |
| BR-03 | Buku "Dipinjam" tidak dapat dihapus. | F002 | Validasi application layer sebelum DELETE. |
| BR-04 | Stok berkurang otomatis saat peminjaman. | F002, F003, F007 | UPDATE `buku.stok = stok - 1` dalam transaksi atomik UC-003. |
| BR-05 | Stok bertambah otomatis saat pengembalian. | F002, F004, F007 | UPDATE `buku.stok = stok + 1` dalam transaksi atomik UC-004. |
| BR-06 | Tanggal peminjaman otomatis, tidak dapat diubah. | F003 | `tgl_peminjaman DEFAULT (date('now'))`, immutable. |
| BR-07 | Buku stok 0 tidak dapat dipinjam. | F003 | Validasi `buku.stok > 0` sebelum INSERT. |
| BR-08 | Satu transaksi = satu eksemplar. | F003 | Satu baris per INSERT `peminjaman`. |
| BR-09 | Tanggal pengembalian otomatis, tidak dapat diubah. | F004 | `tgl_pengembalian DEFAULT (date('now'))`, immutable. |
| BR-10 | Informasi keterlambatan tampil sebagai info dasar. | F004 | `keterlambatan_hari` dihitung dan disimpan. |
| BR-11 | Satu peminjaman hanya punya satu pengembalian. | F004 | UNIQUE constraint `pengembalian.id_peminjaman`. |
| BR-12 | Data riwayat read-only. | F005 | `riwayat_peminjaman` adalah VIEW. |
| BR-13 | Halaman publik tidak menampilkan data peminjam. | F006 | Query UC-006 hanya dari tabel `buku`. |
| BR-14 | Password disimpan sebagai hash bcrypt. | F001 | Kolom `password_hash`. |
| BR-15 | Sesi kadaluarsa otomatis 30 menit idle. | F001 | Kolom `expires_at` di `session`. |
| BR-16 | Tgl batas kembali ≥ tgl peminjaman. | F003 | `CHECK (tgl_batas_pengembalian >= tgl_peminjaman)`. |
| BR-17 | Lokasi Rak wajib diisi, format kode huruf+nomor. | F002 | `lokasi_rak NOT NULL`; validasi format primer di application layer (lihat Section 1.3). |
| BR-18 | Buku ditarik dari sirkulasi diberi status "Tidak Aktif". | Section 7.3 | `status_buku` enum menyertakan `'Tidak Aktif'`. |
| BR-19 | Judul buku, nama siswa, lokasi rak bersih dari XSS. | Master List poin 4 | Sanitasi application layer. |
| BR-20 | Stok tidak boleh diubah manual di luar mekanisme F003/F004/F002. | F007 | Tidak ada endpoint penyesuaian stok bebas. |
| BR-21 | Denda dihitung otomatis, tidak ada input manual nominal. | srs.md v3.4, Master List poin 11 | Kolom `denda_keterlambatan`, `biaya_kondisi`, `total_denda` dihitung di application layer. |
| BR-22 | Data denda immutable setelah tersimpan. | srs.md v3.4, Master List poin 12 | Tidak ada endpoint UPDATE pada kolom denda; koreksi hanya via akses langsung ke file database SQLite oleh administrator. |
| BR-23 | Nominal denda bersifat konfigurasi, bukan hardcode. | srs.md v3.4 F004, DS v1.5 Section 14 | Disimpan sebagai konstanta aplikasi (Section 3.7: `DENDA_PER_HARI`, dst.), bukan hardcode di skema/kode. |
| **BR-24** | **(Baru v1.3) Gambar sampul buku bersifat opsional dan disimpan sebagai file lokal, bukan blob database.** | **DS v1.5 Section 9.11, token `token-image-storage`** | **Kolom `gambar_sampul` hanya menyimpan path (TEXT, nullable); file fisik dikelola application layer di folder `/uploads`.** |
| **BR-25** | **(Baru v1.3) Database berjalan file-based (SQLite) pada satu PC lokal, bukan server DB terpisah.** | **srs.md v3.4 Section 3, 3.1–3.3** | **Seluruh DDL Section 6 menggunakan sintaks SQLite; file `perpustakaan.db` disimpan lokal di folder `backend/data/`.** |

| **BR-26** | **(Baru v1.4) Tingkat Kelas buku bersifat opsional; jika diisi wajib 1–6.** | **srs.md v3.5 F002** | **CHECK constraint `(tingkat_kelas IS NULL OR tingkat_kelas BETWEEN 1 AND 6)` pada kolom `tingkat_kelas`.** |
| **BR-27** | **(Baru v1.5) Tema buku menjadi nullable enum tertutup (2 nilai); aturan pengisian: buku pelajaran → isi tingkat_kelas (kosongkan tema_buku), buku non-pelajaran → isi tema_buku (kosongkan tingkat_kelas), tidak jelas kategorinya → kosongkan keduanya.** | **srs.md v3.6 F002** | **CHECK constraint `(tema_buku IS NULL OR tema_buku IN ('Cerita & Dongeng', 'Lainnya'))` pada kolom `tema_buku`; tingkat_kelas tetap (lihat BR-26).** |

---

| Data | Retensi | Keterangan |
| --- | --- | --- |
| `peminjaman` | Minimal 3 tahun ajaran | Tidak dapat dihapus via UI. |
| `pengembalian` | Minimal 3 tahun ajaran | Termasuk data denda; terhubung dengan `peminjaman`. |
| `buku` | Selama dibutuhkan | Dihapus hanya jika `'Tersedia'`; kalau ditarik, jadi `'Tidak Aktif'`. |
| `guru` | Selama dibutuhkan | Hanya administrator yang dapat menghapus. |
| `session` | Sampai kadaluarsa | Dihapus otomatis. |
| **File `perpustakaan.db` (Baru v1.3)** | **Backup manual mingguan** | **File tunggal SQLite; wajib disalin manual oleh administrator/pihak sekolah (srs.md v3.4 Section 7.3) untuk mencegah kehilangan data akibat kerusakan PC.** |
| **Folder `/uploads` (Baru v1.3)** | **Backup manual mingguan, bersamaan dengan `perpustakaan.db`** | **Berisi file gambar sampul buku; jika folder ini hilang tanpa backup, kolom `gambar_sampul` di database akan menunjuk ke file yang tidak ada (fallback ke placeholder inisial judul di frontend).** |

---

## 9. TRACEABILITY MATRIX (User Flows → Data Model)

| UC ID | Use Case | Tables READ | Tables WRITE | View Used | Files Involved |
| --- | --- | --- | --- | --- | --- |
| UC-001 | Login Guru | guru | session | — | — |
| UC-002 | Manajemen Data Buku | buku | buku | — | `/uploads` (gambar sampul, opsional) |
| UC-003 | Pencatatan Peminjaman | buku | peminjaman, buku | — | — |
| UC-004 | Pencatatan Pengembalian (termasuk denda) | peminjaman, buku | pengembalian, peminjaman, buku | — | — |
| UC-005 | Riwayat Peminjaman | — | — | riwayat_peminjaman | — |
| UC-006 | Akses Publik Siswa | buku | — | — | `/uploads` (baca thumbnail, jika ada) |

---

## 10. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |
| 1.1 | 2026-07-01 | Kelompok DPSI BRAYYY | Sinkronisasi terhadap srs.md v3.1, IA, DS v1.3, User Flows v1.1 (lokasi_rak, status Tidak Aktif, retensi 3 tahun, dst). |
| 1.2 | 2026-07-06 | Kelompok DPSI BRAYYY | Sinkronisasi dengan srs.md v3.2 & design_system.md v1.4: menambah kolom `denda_keterlambatan`, `biaya_kondisi`, `total_denda` pada `pengembalian` (3.4); menambah Section 3.7 Konstanta Aplikasi; update DDL `CREATE TABLE pengembalian` dan `CREATE VIEW riwayat_peminjaman` (Section 6, masih sintaks MySQL); menambah BR-21 s.d. BR-23 (Section 7). |
| **1.4** | **2026-07-10** | **Kelompok DPSI BRAYYY** | **Tambah kolom `tingkat_kelas` (INTEGER, nullable, 1–6) pada entity buku (Section 3.2), validation rule (Section 3.2), DDL (Section 6), dan BR-26 (Section 7). Update Data Flow UC-002 dan UC-006 (Section 5) untuk menyertakan tingkat_kelas. Sinkron dengan srs.md v3.5.** |
| **1.5** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Ubah `tema_buku` dari NOT NULL menjadi nullable enum tertutup (`'Cerita & Dongeng'` / `'Lainnya'`): (1) update definisi kolom @ Section 3.2; (2) tambah validation rule tema_buku @ Section 3.2; (3) update UC-002 Data Flow — INSERT/UPDATE sertakan tema_buku; (4) update UC-006 Data Flow — tambah filter tema_buku; (5) update DDL — tema_buku TEXT DEFAULT NULL + CHECK; (6) tambah BR-27 @ Section 7. Sinkron dengan srs.md v3.6.** |