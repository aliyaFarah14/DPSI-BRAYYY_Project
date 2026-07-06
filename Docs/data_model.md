# Data Model (DM) — Source of Truth #6

Document Version: v1.2 (Sinkronisasi kolom Denda Keterlambatan sesuai srs.md v3.2 & design_system.md v1.4)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-06
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

> **Catatan revisi v1.2:** v1.1 belum memiliki kolom denda sama sekali di tabel `pengembalian`, karena saat itu srs.md masih v3.1 (tanpa denda). Setelah design_system.md direvisi ke v1.4 (menambahkan fitur Denda Keterlambatan) dan srs.md disinkronkan ke v3.2, Data Model ini diperbarui untuk menambahkan:
> 1. Kolom `denda_keterlambatan`, `biaya_kondisi`, dan `total_denda` pada tabel `pengembalian` (Section 3.4).
> 2. Section baru 3.7 — Konstanta Aplikasi, penjelasan nominal denda disimpan sebagai konfigurasi backend, bukan hardcode di skema database.
> 3. Update DDL `CREATE TABLE pengembalian` dan `CREATE VIEW riwayat_peminjaman` (Section 6).
> 4. BR-21 s.d. BR-23 pada Business Rules Traceability (Section 7).
> Entity lain (guru, buku, peminjaman, session) tidak berubah dari v1.1.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan Data Model (DM) Sistem Informasi Perpustakaan SD Negeri Tamanan sebagai **Source of Truth #6 (SoT-6)**. Data model ini diturunkan secara langsung dari:

- **SoT-1 (`srs.md` v3.2):** Sumber business objects, validation rules, dan business rules (Feature ID F001–F007, termasuk revisi denda F004).
- **SoT-2 (`information_architecture.md`, sinkron SRS v3.1):** Sumber struktur halaman, field-field form aktual yang ditampilkan ke pengguna, dan routing.
- **SoT-3 (`design_system.md` v1.4):** Sumber status/badge, komponen UI, dan formula denda yang harus dapat direpresentasikan oleh data.
- **SoT-4 (`user_flows` v1.1):** Sumber utama entity lifecycle, atribut, dan relasi antar data.

Dokumen ini digunakan sebagai landasan resmi untuk:

- Implementasi backend dan desain skema database (DDL, MySQL).
- Pengembangan API contract dan validation rules.
- Pembuatan Use Case Integration Contract (SoT-7).
- Penulisan integration logic dan test cases.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | `srs.md` v3.2 | Spesifikasi kebutuhan, business objects, dan data validation rules (Feature ID F001–F007, termasuk denda F004). |
| SoT-2 | `information_architecture.md` (sinkron SRS v3.1) | Struktur halaman, field form aktual, routing. |
| SoT-3 | `design_system.md` v1.4 | Status/badge, komponen UI, formula denda (Section 11.8, 14). |
| SoT-4 | `user_flows` v1.1 (index.md + UC-001 s.d. UC-006) | Sumber utama entity lifecycle, atribut, dan relasi antar data. |
| SoT-5 | HiFi Prototype | Representasi visual; menggunakan SoT-6 sebagai referensi data binding. |
| SoT-7 | UCIC | Use Case Integration Contract; diturunkan dari SoT-4 + SoT-6. |

---

## 2. DOMAIN OBJECT INVENTORY

Berdasarkan analisis seluruh User Flows (UC-001 s.d. UC-006), terdapat **6 domain object** utama dalam sistem:

| Entity ID | Entity Name | Diturunkan dari UC | Deskripsi |
| --- | --- | --- | --- |
| E-01 | guru | UC-001 | Akun guru yang mengelola sistem perpustakaan. |
| E-02 | buku | UC-002, UC-003, UC-004, UC-006 | Katalog buku perpustakaan, termasuk Lokasi Rak. |
| E-03 | peminjaman | UC-003, UC-004, UC-005 | Transaksi peminjaman buku oleh siswa. |
| E-04 | pengembalian | UC-004, UC-005 | Data pengembalian buku yang terhubung ke transaksi peminjaman, termasuk denda (v1.2). |
| E-05 | riwayat_peminjaman | UC-005 | View/rekap historis transaksi untuk monitoring. |
| E-06 | session | UC-001 | Sesi autentikasi guru yang aktif. |

> **Catatan (data siswa — denormalized by design):** Data siswa (nama dan kelas) disimpan langsung di tabel `peminjaman`, **bukan** sebagai entity master `siswa` terpisah. Ini konsisten dengan `information_architecture.md` (PAGE-004 hanya memiliki field bebas "Nama Siswa" dan "Kelas Siswa") dan seluruh `user_flows`.

---

## 3. ENTITY DEFINITIONS

### 3.1 Entity: guru

**Diturunkan dari:** UC-001 (Login Guru).

**Deskripsi:** Menyimpan data akun guru yang berwenang mengelola sistem perpustakaan.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_guru` | VARCHAR(10) | PRIMARY KEY | Kode unik guru (contoh: "G001"). |
| `nama_guru` | VARCHAR(100) | NOT NULL | Nama lengkap guru. |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Username untuk login. |
| `password_hash` | VARCHAR(255) | NOT NULL | Password hash bcrypt. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu pembuatan akun. |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir data diperbarui. |

#### Validation Rules
- `username` tidak boleh mengandung spasi atau karakter khusus berbahaya.
- `password_hash` wajib dihasilkan menggunakan algoritma bcrypt.
- Tidak ada mekanisme self-registration.

---

### 3.2 Entity: buku

**Diturunkan dari:** UC-002, UC-003, UC-004, UC-006.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_buku` | VARCHAR(20) | PRIMARY KEY | Kode unik buku. |
| `judul_buku` | VARCHAR(255) | NOT NULL | Judul lengkap buku. |
| `penulis` | VARCHAR(150) | NOT NULL | Nama penulis buku. |
| `penerbit` | VARCHAR(150) | NOT NULL | Nama penerbit buku. |
| `tema_buku` | VARCHAR(100) | NOT NULL | Tema/kategori buku. |
| `tahun_terbit` | INTEGER | NOT NULL, CHECK ≥ 1900 | Tahun penerbitan. |
| `lokasi_rak` | VARCHAR(10) | NOT NULL | Kode rak, format huruf+nomor (contoh "A1"). |
| `stok` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Jumlah eksemplar tersedia. |
| `status_buku` | VARCHAR(20) | NOT NULL, DEFAULT 'Tersedia' | `'Tersedia'` / `'Dipinjam'` / `'Tidak Aktif'`. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu buku ditambahkan. |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir diperbarui. |

#### Validation Rules
- `id_buku` harus unik.
- `stok` ≥ 0.
- `lokasi_rak` wajib diisi, format `^[A-Za-z]+[0-9]+$`.
- Buku berstatus `'Dipinjam'` tidak dapat dihapus.
- `judul_buku`, `penulis`, `lokasi_rak` wajib bersih dari XSS.

---

### 3.3 Entity: peminjaman

**Diturunkan dari:** UC-003, UC-004, UC-005.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_peminjaman` | VARCHAR(20) | PRIMARY KEY | Kode unik transaksi. |
| `id_buku` | VARCHAR(20) | NOT NULL, FK → buku(id_buku) | Referensi buku dipinjam. |
| `nama_siswa` | VARCHAR(100) | NOT NULL | Nama siswa peminjam. |
| `kelas_siswa` | VARCHAR(10) | NOT NULL | Kelas siswa. |
| `tgl_peminjaman` | DATE | NOT NULL | Otomatis, immutable. |
| `tgl_batas_pengembalian` | DATE | NOT NULL | Diatur guru. |
| `status_peminjaman` | VARCHAR(25) | NOT NULL, DEFAULT 'Dipinjam' | `'Dipinjam'` / `'Sudah Dikembalikan'`. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | — |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | — |

#### Validation Rules
- `tgl_batas_pengembalian` ≥ `tgl_peminjaman`.
- `id_buku` harus ada, bukan `'Tidak Aktif'`, `stok > 0` saat dibuat.
- `nama_siswa`, `kelas_siswa` wajib diisi, bersih dari XSS.
- `tgl_peminjaman` immutable.

---

### 3.4 Entity: pengembalian (Direvisi v1.2)

**Diturunkan dari:** UC-004, UC-005, srs.md v3.2 F004, design_system.md v1.4 Section 11.8.

**Deskripsi:** Menyimpan data pengembalian buku, termasuk kondisi fisik, keterlambatan, dan sejak v1.2, nominal denda yang dihitung otomatis.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_pengembalian` | VARCHAR(20) | PRIMARY KEY | Kode unik transaksi pengembalian. |
| `id_peminjaman` | VARCHAR(20) | NOT NULL, UNIQUE, FK → peminjaman(id_peminjaman) | Referensi peminjaman. |
| `tgl_pengembalian` | DATE | NOT NULL | Otomatis, immutable. |
| `kondisi_buku` | VARCHAR(20) | NOT NULL | `'Baik'` / `'Rusak Ringan'` / `'Rusak Berat'`. |
| `keterlambatan_hari` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | `MAX(0, tgl_pengembalian - tgl_batas_pengembalian)`. |
| `denda_keterlambatan` | DECIMAL(10,2) | NOT NULL, DEFAULT 0, CHECK ≥ 0 | **(Baru v1.2)** `keterlambatan_hari × DENDA_PER_HARI`. |
| `biaya_kondisi` | DECIMAL(10,2) | NOT NULL, DEFAULT 0, CHECK ≥ 0 | **(Baru v1.2)** Diambil dari konstanta aplikasi (Section 3.7), bukan hardcode. |
| `total_denda` | DECIMAL(10,2) | NOT NULL, DEFAULT 0, CHECK ≥ 0 | **(Baru v1.2)** `denda_keterlambatan + biaya_kondisi`. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu data pengembalian dicatat. |

#### Calculation Rules
```
denda_keterlambatan = keterlambatan_hari × Rp 500     (placeholder, srs.md v3.2 Open Question #1)
biaya_kondisi        = Rp 0        jika kondisi_buku = 'Baik'
                       Rp 2.000    jika kondisi_buku = 'Rusak Ringan'
                       Rp 5.000    jika kondisi_buku = 'Rusak Berat'
total_denda          = denda_keterlambatan + biaya_kondisi
```

#### Lifecycle Rules

| Event | Action | Sumber |
| --- | --- | --- |
| Konfirmasi pengembalian | INSERT baris baru; sistem hitung `keterlambatan_hari`, `denda_keterlambatan`, `biaya_kondisi`, `total_denda` otomatis di application layer. UPDATE `peminjaman.status_peminjaman`, UPDATE `buku.stok`/`status_buku`. Satu database transaction. | UC-004, srs.md v3.2 F004 |
| Guru lihat riwayat | SELECT (JOIN `peminjaman`, `buku`), termasuk `total_denda` untuk Badge Denda. | UC-005 |
| Koreksi kesalahan | **Tidak tersedia via antarmuka Guru** — immutable setelah tersimpan. Koreksi hanya oleh administrator via database. | srs.md v3.2 |

#### Validation Rules
- `kondisi_buku` hanya enum `'Baik'`, `'Rusak Ringan'`, `'Rusak Berat'`.
- `id_peminjaman` harus ada dan berstatus `'Dipinjam'`.
- Satu `id_peminjaman` hanya satu baris `pengembalian` (UNIQUE).
- `tgl_pengembalian`, `denda_keterlambatan`, `biaya_kondisi`, `total_denda` immutable, tidak ada endpoint UPDATE.
- `denda_keterlambatan` dan `biaya_kondisi` **tidak boleh diinput manual** — wajib dihitung server-side dari konstanta aplikasi (Section 3.7), bukan dari input form.

---

### 3.5 Entity: riwayat_peminjaman (View) — Direvisi v1.2

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
| `total_denda` | pengembalian | **(Baru v1.2)** Nominal denda untuk Badge Denda |
| `status_peminjaman` | peminjaman | `'Dipinjam'` / `'Sudah Dikembalikan'` |

#### Filter yang Didukung (UC-005)

| Filter | Kolom | Tipe Operasi |
| --- | --- | --- |
| Nama Siswa | `nama_siswa` | LIKE `%keyword%` |
| Judul Buku | `judul_buku` | LIKE `%keyword%` |
| Rentang Tanggal | `tgl_peminjaman` | BETWEEN `tgl_mulai` AND `tgl_akhir` |

> Definisi SQL lengkap ada di Section 6 (DDL).

---

### 3.6 Entity: session

**Diturunkan dari:** UC-001.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_session` | VARCHAR(128) | PRIMARY KEY | Token sesi unik. |
| `id_guru` | VARCHAR(10) | NOT NULL, FK → guru(id_guru) | Referensi guru aktif. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu sesi dibuat. |
| `last_activity` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu aktivitas terakhir. |
| `expires_at` | TIMESTAMP | NOT NULL | `last_activity + 30 menit`. |

---

### 3.7 Konstanta Aplikasi — Denda (Baru v1.2)

Nominal denda **tidak** disimpan sebagai nilai tetap di skema database, melainkan sebagai konfigurasi backend (bukan tabel, bukan baris data) — mengikuti design_system.md v1.4 Section 14 (Design Tokens). Ini supaya nominal bisa diubah kapan saja tanpa migrasi database.

**Lokasi implementasi (backend Express.js):**

```
backend/
├── .env                          ← nilai aktual nominal denda
├── .env.example                  ← template kosong untuk dokumentasi
├── config/
│   └── denda.config.js           ← baca dari .env, di-export sebagai object
└── controllers/
    └── pengembalianController.js ← pakai config ini saat hitung total_denda (F004)
```

| Konstanta | Nilai Saat Ini (Placeholder) | Catatan |
| --- | --- | --- |
| `DENDA_PER_HARI` | Rp 500 | Wajib dikonfirmasi ulang oleh sekolah sebelum go-live (srs.md v3.2, Open Question #1). |
| `DENDA_RUSAK_RINGAN` | Rp 2.000 | Idem. |
| `DENDA_RUSAK_BERAT` | Rp 5.000 | Idem. |
| `DENDA_CAP_MAKSIMAL` | *(belum ditetapkan)* | Menunggu keputusan sekolah (srs.md v3.2, Open Question #2). Jika ditetapkan, diterapkan sebagai `LEAST(total_denda, cap)` di application layer. |

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
│         buku          │  1      │              peminjaman                │
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
│ created_at            │         └─────────────────┬──────────────────────┘
│ updated_at            │                           │ 1
└──────────────────────┘                            │
                                  ┌──────────────────▼──────────────────────┐
                                  │           pengembalian (v1.2)            │
                                  ├──────────────────────────────────────────┤
                                  │ id_pengembalian  PK                     │
                                  │ id_peminjaman    FK (UNIQUE)            │
                                  │ tgl_pengembalian                        │
                                  │ kondisi_buku                            │
                                  │ keterlambatan_hari                      │
                                  │ denda_keterlambatan   (Baru v1.2)       │
                                  │ biaya_kondisi         (Baru v1.2)       │
                                  │ total_denda           (Baru v1.2)       │
                                  │ created_at                              │
                                  └──────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────
VIEW: riwayat_peminjaman (kini menyertakan total_denda)
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

### UC-002: Manajemen Data Buku
```
Tambah: INSERT INTO buku (..., lokasi_rak, stok, status_buku='Tersedia')
Edit:   UPDATE buku SET ... WHERE id_buku = ?
Hapus:  DELETE FROM buku WHERE id_buku = ? AND status_buku = 'Tersedia'
TABLES: buku (CRUD)
```

### UC-003: Pencatatan Peminjaman
```
PROSES: BEGIN TRANSACTION
        INSERT INTO peminjaman (..., tgl_peminjaman=TODAY, status='Dipinjam')
        UPDATE buku SET stok = stok - 1, status_buku = CASE WHEN stok-1=0 THEN 'Dipinjam' ELSE status_buku END
        COMMIT
TABLES: peminjaman (INSERT), buku (UPDATE)
```

### UC-004: Pencatatan Pengembalian (Direvisi v1.2)
```
INPUT:  id_peminjaman, kondisi_buku
PROSES: BEGIN TRANSACTION
        -- hitung di application layer sebelum INSERT:
        keterlambatan_hari   = MAX(0, TODAY - tgl_batas_pengembalian)
        denda_keterlambatan  = keterlambatan_hari * DENDA_PER_HARI
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

### UC-006: Akses Publik Siswa
```
PROSES: SELECT id_buku, judul_buku, penulis, tema_buku, lokasi_rak, stok, status_buku FROM buku
        WHERE status_buku != 'Tidak Aktif'
TABLES: buku (READ-ONLY)
```

---

## 6. DATABASE SCHEMA (DDL — MySQL)

```sql
-- ============================================================
-- TABEL: guru
-- ============================================================
CREATE TABLE guru (
    id_guru         VARCHAR(10)  PRIMARY KEY,
    nama_guru       VARCHAR(100) NOT NULL,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: session
-- ============================================================
CREATE TABLE session (
    id_session      VARCHAR(128) PRIMARY KEY,
    id_guru         VARCHAR(10)  NOT NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_activity   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMP    NOT NULL,
    FOREIGN KEY (id_guru) REFERENCES guru(id_guru) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: buku
-- ============================================================
CREATE TABLE buku (
    id_buku         VARCHAR(20)  PRIMARY KEY,
    judul_buku      VARCHAR(255) NOT NULL,
    penulis         VARCHAR(150) NOT NULL,
    penerbit        VARCHAR(150) NOT NULL,
    tema_buku       VARCHAR(100) NOT NULL,
    tahun_terbit    INTEGER      NOT NULL CHECK (tahun_terbit >= 1900),
    lokasi_rak      VARCHAR(10)  NOT NULL
                    CHECK (lokasi_rak REGEXP '^[A-Za-z]+[0-9]+$'),
    stok            INTEGER      NOT NULL DEFAULT 0 CHECK (stok >= 0),
    status_buku     VARCHAR(20)  NOT NULL DEFAULT 'Tersedia'
                    CHECK (status_buku IN ('Tersedia', 'Dipinjam', 'Tidak Aktif')),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: peminjaman
-- ============================================================
CREATE TABLE peminjaman (
    id_peminjaman           VARCHAR(20) PRIMARY KEY,
    id_buku                 VARCHAR(20) NOT NULL,
    nama_siswa              VARCHAR(100) NOT NULL,
    kelas_siswa             VARCHAR(10)  NOT NULL,
    tgl_peminjaman          DATE         NOT NULL DEFAULT (CURRENT_DATE),
    tgl_batas_pengembalian  DATE         NOT NULL,
    status_peminjaman       VARCHAR(25)  NOT NULL DEFAULT 'Dipinjam'
                            CHECK (status_peminjaman IN ('Dipinjam', 'Sudah Dikembalikan')),
    created_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_buku) REFERENCES buku(id_buku),
    CONSTRAINT chk_batas_kembali CHECK (tgl_batas_pengembalian >= tgl_peminjaman)
) ENGINE=InnoDB;

-- ============================================================
-- TABEL: pengembalian
-- ============================================================
CREATE TABLE pengembalian (
    id_pengembalian     VARCHAR(20)    PRIMARY KEY,
    id_peminjaman       VARCHAR(20)    NOT NULL UNIQUE,
    tgl_pengembalian    DATE           NOT NULL DEFAULT (CURRENT_DATE),
    kondisi_buku        VARCHAR(20)    NOT NULL
    
                        CHECK (kondisi_buku IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
    keterlambatan_hari  INTEGER        NOT NULL DEFAULT 0 CHECK (keterlambatan_hari >= 0),
    denda_keterlambatan DECIMAL(10,2)  NOT NULL DEFAULT 0 CHECK (denda_keterlambatan >= 0),  
    biaya_kondisi       DECIMAL(10,2)  NOT NULL DEFAULT 0 CHECK (biaya_kondisi >= 0),          
    total_denda         DECIMAL(10,2)  NOT NULL DEFAULT 0 CHECK (total_denda >= 0),         
    created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_peminjaman) REFERENCES peminjaman(id_peminjaman)
) ENGINE=InnoDB;

-- Catatan: total_denda dapat pula didefinisikan sebagai GENERATED COLUMN
-- jika versi MySQL mendukung:
-- total_denda DECIMAL(10,2) GENERATED ALWAYS AS (denda_keterlambatan + biaya_kondisi) STORED

-- ============================================================
-- VIEW: riwayat_peminjaman (Direvisi v1.2 — tambah total_denda)
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

> Catatan implementasi: `CHECK (... REGEXP ...)` didukung penuh pada MySQL 8.0.16+. Tim backend tetap wajib menduplikasi validasi format `lokasi_rak`, nilai `stok ≥ 0`, kalkulasi denda, dan XSS-sanitization di application layer (Express.js) sebagai lapisan pertahanan kedua.

---

## 7. BUSINESS RULES TRACEABILITY

| Rule ID | Business Rule | Sumber (SRS) | Implementasi di Data Model |
| --- | --- | --- | --- |
| BR-01 | ID Buku harus unik. | F002 | `id_buku` PRIMARY KEY + UNIQUE. |
| BR-02 | Stok buku tidak boleh negatif (≥ 0). | F002 | `CHECK (stok >= 0)` pada `buku`. |
| BR-03 | Buku "Dipinjam" tidak dapat dihapus. | F002 | Validasi application layer sebelum DELETE. |
| BR-04 | Stok berkurang otomatis saat peminjaman. | F002, F003, F007 | UPDATE `buku.stok = stok - 1` dalam transaksi atomik UC-003. |
| BR-05 | Stok bertambah otomatis saat pengembalian. | F002, F004, F007 | UPDATE `buku.stok = stok + 1` dalam transaksi atomik UC-004. |
| BR-06 | Tanggal peminjaman otomatis, tidak dapat diubah. | F003 | `tgl_peminjaman DEFAULT (CURRENT_DATE)`, immutable. |
| BR-07 | Buku stok 0 tidak dapat dipinjam. | F003 | Validasi `buku.stok > 0` sebelum INSERT. |
| BR-08 | Satu transaksi = satu eksemplar. | F003 | Satu baris per INSERT `peminjaman`. |
| BR-09 | Tanggal pengembalian otomatis, tidak dapat diubah. | F004 | `tgl_pengembalian DEFAULT (CURRENT_DATE)`, immutable. |
| BR-10 | Informasi keterlambatan tampil sebagai info dasar. | F004 | `keterlambatan_hari` dihitung dan disimpan. |
| BR-11 | Satu peminjaman hanya punya satu pengembalian. | F004 | UNIQUE constraint `pengembalian.id_peminjaman`. |
| BR-12 | Data riwayat read-only. | F005 | `riwayat_peminjaman` adalah VIEW. |
| BR-13 | Halaman publik tidak menampilkan data peminjam. | F006 | Query UC-006 hanya dari tabel `buku`. |
| BR-14 | Password disimpan sebagai hash bcrypt. | F001 | Kolom `password_hash`. |
| BR-15 | Sesi kadaluarsa otomatis 30 menit idle. | F001 | Kolom `expires_at` di `session`. |
| BR-16 | Tgl batas kembali ≥ tgl peminjaman. | F003 | `CONSTRAINT chk_batas_kembali`. |
| BR-17 | Lokasi Rak wajib diisi, format kode huruf+nomor. | F002 | `lokasi_rak NOT NULL` + `CHECK (REGEXP ...)`. |
| BR-18 | Buku ditarik dari sirkulasi diberi status "Tidak Aktif". | Section 7.3 | `status_buku` enum menyertakan `'Tidak Aktif'`. |
| BR-19 | Judul buku, nama siswa, lokasi rak bersih dari XSS. | Master List poin 4 | Sanitasi application layer. |
| BR-20 | Stok tidak boleh diubah manual di luar mekanisme F003/F004/F002. | F007 | Tidak ada endpoint penyesuaian stok bebas. |
| BR-21 | Denda dihitung otomatis, tidak ada input manual nominal. | srs.md v3.2, Master List poin 11 | Kolom `denda_keterlambatan`, `biaya_kondisi`, `total_denda` dihitung di application layer. |
| BR-22 | (Baru v1.2) Data denda immutable setelah tersimpan. | srs.md v3.2, Master List poin 12 | Tidak ada endpoint UPDATE pada kolom denda; koreksi hanya via database langsung oleh administrator. |
| BR-23 | Nominal denda bersifat konfigurasi, bukan hardcode. | srs.md v3.2 F004, DS v1.4 Section 14 | Disimpan sebagai konstanta aplikasi (Section 3.7: `DENDA_PER_HARI`, dst.), bukan hardcode di skema/kode. |

---

## 8. DATA RETENTION RULES

| Data | Retensi | Keterangan |
| --- | --- | --- |
| `peminjaman` | Minimal 3 tahun ajaran | Tidak dapat dihapus via UI. |
| `pengembalian` | Minimal 3 tahun ajaran | Termasuk data denda; terhubung dengan `peminjaman`. |
| `buku` | Selama dibutuhkan | Dihapus hanya jika `'Tersedia'`; kalau ditarik, jadi `'Tidak Aktif'`. |
| `guru` | Selama dibutuhkan | Hanya administrator yang dapat menghapus. |
| `session` | Sampai kadaluarsa | Dihapus otomatis. |

---

## 9. TRACEABILITY MATRIX (User Flows → Data Model)

| UC ID | Use Case | Tables READ | Tables WRITE | View Used |
| --- | --- | --- | --- | --- |
| UC-001 | Login Guru | guru | session | — |
| UC-002 | Manajemen Data Buku | buku | buku | — |
| UC-003 | Pencatatan Peminjaman | buku | peminjaman, buku | — |
| UC-004 | Pencatatan Pengembalian (termasuk denda) | peminjaman, buku | pengembalian, peminjaman, buku | — |
| UC-005 | Riwayat Peminjaman | — | — | riwayat_peminjaman |
| UC-006 | Akses Publik Siswa | buku | — | — |

---

## 10. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |
| 1.1 | 2026-07-01 | Kelompok DPSI BRAYYY | Sinkronisasi terhadap srs.md v3.1, IA, DS v1.3, User Flows v1.1 (lokasi_rak, status Tidak Aktif, retensi 3 tahun, dst). |
| **1.2** | **2026-07-06** | **Kelompok DPSI BRAYYY** | **Sinkronisasi dengan srs.md v3.2 & design_system.md v1.4:** menambah kolom `denda_keterlambatan`, `biaya_kondisi`, `total_denda` pada `pengembalian` (3.4); menambah Section 3.7 Konstanta Aplikasi (lokasi implementasi backend); update DDL `CREATE TABLE pengembalian` dan `CREATE VIEW riwayat_peminjaman` (Section 6); menambah BR-21 s.d. BR-23 (Section 7). |