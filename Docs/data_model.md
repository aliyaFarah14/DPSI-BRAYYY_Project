# Data Model (DM) — Source of Truth #6

Document Version: v1.1 (Revisi — sinkronisasi dengan srs.md v3.1, information_architecture.md, design_system.md v1.3, dan user_flows v1.1)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-01
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

> **Catatan revisi v1.1:** Dokumen v1.0 (2026-06-25) disusun berdasarkan SRS v1.0 dan User Flows v1.0 yang sudah digantikan oleh SRS v3.1, `information_architecture.md`, `design_system.md` v1.3, dan `user_flows` v1.1. Revisi ini memperbaiki beberapa ketertinggalan yang ditemukan:
> 1. **Kolom `lokasi_rak` ditambahkan** ke entity `buku` — field ini wajib di F002 (SRS) namun sebelumnya tidak pernah dimodelkan.
> 2. **Nilai enum `status_buku` diperluas** menjadi `'Tersedia'`, `'Dipinjam'`, `'Tidak Aktif'` — sesuai SRS Section 7.3 (Data Retention Rules) dan DS v1.3 Section 9.5 (Badge "Tidak Aktif").
> 3. **Retensi data `peminjaman`/`pengembalian` dikoreksi** dari "minimal 5 tahun" menjadi **"minimal 3 tahun ajaran"** sesuai SRS Section 7.3.
> 4. **Validasi XSS untuk `nama_siswa`** ditambahkan secara eksplisit (sebelumnya hanya disebut untuk `judul_buku`/`penulis`).
> 5. **Query UC-006 (akses publik)** diperbaiki agar menyertakan `lokasi_rak` — tujuan utama F006 adalah menampilkan lokasi rak ke siswa, namun kolom ini sebelumnya tidak ikut ter-select.
> 6. **Referensi SoT usang dihapus** — seluruh sitasi "SRS v1.0" dan "User Flows v1.0" diperbarui menjadi SRS v3.1 dan User Flows v1.1; catatan "Open Question Q02" dihapus karena `srs.md` v3.1 Section 12 tidak lagi memiliki pertanyaan terbuka.
> 7. **Resolusi terminologi "ID Siswa"** — `srs.md` Section 7.1 dan 7.4 menyebut "ID Siswa" seakan-akan Siswa adalah entity master tersendiri, namun tidak ada satupun halaman/route di `information_architecture.md` untuk mengelola data Siswa secara terpisah (form peminjaman pada PAGE-004 hanya berisi field bebas Nama Siswa & Kelas Siswa). Data Model ini **tetap mempertahankan pendekatan denormalized** (`nama_siswa`, `kelas_siswa` langsung di tabel `peminjaman`) karena itulah yang benar-benar diimplementasikan di IA, DS, dan seluruh User Flow (UC-003, UC-004, UC-005). Penyebutan "ID Siswa" di SRS Section 7.1/7.4 direkomendasikan untuk diselaraskan pada revisi SRS berikutnya.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan Data Model (DM) Sistem Informasi Perpustakaan SD Negeri Tamanan sebagai **Source of Truth #6 (SoT-6)**. Data model ini diturunkan secara langsung dari:

- **SoT-1 (`srs.md` v3.1):** Sumber business objects, validation rules, dan business rules (Feature ID F001–F007).
- **SoT-2 (`information_architecture.md`, sinkron SRS v3.1):** Sumber struktur halaman, field-field form aktual yang ditampilkan ke pengguna, dan routing.
- **SoT-3 (`design_system.md` v1.3):** Sumber status/badge yang harus dapat direpresentasikan oleh data (mis. Badge "Tidak Aktif", Badge Kondisi Buku).
- **SoT-4 (`user_flows` v1.1):** Sumber utama entity lifecycle, atribut, dan relasi antar data — berdasarkan bagaimana data dibuat, dibaca, diperbarui, dan dihapus dalam setiap use case (UC-001 s.d. UC-006).

Dokumen ini digunakan sebagai landasan resmi untuk:

- Implementasi backend dan desain skema database (DDL, MySQL).
- Pengembangan API contract dan validation rules.
- Pembuatan Use Case Integration Contract (SoT-7).
- Penulisan integration logic dan test cases.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | `srs.md` v3.1 | Spesifikasi kebutuhan, business objects, dan data validation rules (Feature ID F001–F007). |
| SoT-2 | `information_architecture.md` (sinkron SRS v3.1) | Struktur halaman, field form aktual, routing. |
| SoT-3 | `design_system.md` v1.3 | Status/badge, komponen UI yang membutuhkan representasi data. |
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
| E-04 | pengembalian | UC-004, UC-005 | Data pengembalian buku yang terhubung ke transaksi peminjaman. |
| E-05 | riwayat_peminjaman | UC-005 | View/rekap historis transaksi untuk monitoring. |
| E-06 | session | UC-001 | Sesi autentikasi guru yang aktif. |

> **Catatan (data siswa — denormalized by design):** Data siswa (nama dan kelas) disimpan langsung di tabel `peminjaman`, **bukan** sebagai entity master `siswa` terpisah. Ini konsisten dengan `information_architecture.md` (PAGE-004 hanya memiliki field bebas "Nama Siswa" dan "Kelas Siswa", tanpa halaman/route pengelolaan data siswa) dan seluruh `user_flows` (UC-003, UC-004, UC-005 tidak pernah merujuk ke "ID Siswa"). Lihat catatan revisi v1.1 poin 7 di atas terkait penyebutan "ID Siswa" pada `srs.md` Section 7.1/7.4 yang belum sinkron dengan implementasi UI.

---

## 3. ENTITY DEFINITIONS

### 3.1 Entity: guru

**Diturunkan dari:** UC-001 (Login Guru) — sistem memvalidasi kredensial dan membuat sesi aktif.

**Deskripsi:** Menyimpan data akun guru yang berwenang mengelola sistem perpustakaan. Akun hanya dapat dibuat oleh administrator sistem.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_guru` | VARCHAR(10) | PRIMARY KEY | Kode unik guru (contoh: "G001"). |
| `nama_guru` | VARCHAR(100) | NOT NULL | Nama lengkap guru. |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Username untuk login; harus unik di seluruh sistem. |
| `password_hash` | VARCHAR(255) | NOT NULL | Password yang disimpan dalam format hash bcrypt. Tidak pernah plaintext. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu pembuatan akun. |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir data diperbarui. |

#### Lifecycle Rules

| Event | Action | Sumber UC |
| --- | --- | --- |
| Login | Sistem membaca `username` dan memverifikasi `password_hash` dengan bcrypt. | UC-001 |
| Login berhasil | Sesi aktif dibuat di tabel `session`. | UC-001 |
| Idle 30 menit | Sesi dihapus/kadaluarsa otomatis. | UC-001 |

#### Validation Rules

- `username` tidak boleh mengandung spasi atau karakter khusus berbahaya.
- `password_hash` wajib dihasilkan menggunakan algoritma bcrypt sebelum disimpan.
- Tidak ada mekanisme self-registration; insert ke tabel ini hanya dilakukan oleh administrator sistem.

---

### 3.2 Entity: buku

**Diturunkan dari:** UC-002 (Manajemen Data Buku, termasuk Lokasi Rak), UC-003 (stok berkurang saat dipinjam), UC-004 (stok bertambah saat dikembalikan), UC-006 (dibaca oleh siswa, termasuk Lokasi Rak).

**Deskripsi:** Menyimpan data master seluruh buku yang tersedia di perpustakaan, termasuk lokasi rak fisik, stok, dan status ketersediaan real-time.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_buku` | VARCHAR(20) | PRIMARY KEY | Kode unik buku (alfanumerik); diisi manual oleh guru. |
| `judul_buku` | VARCHAR(255) | NOT NULL | Judul lengkap buku. |
| `penulis` | VARCHAR(150) | NOT NULL | Nama penulis buku. |
| `penerbit` | VARCHAR(150) | NOT NULL | Nama penerbit buku. |
| `tema_buku` | VARCHAR(100) | NOT NULL | Tema atau kategori buku (contoh: "Sains", "Dongeng"). |
| `tahun_terbit` | INTEGER | NOT NULL, CHECK ≥ 1900 | Tahun penerbitan buku. |
| `lokasi_rak` | VARCHAR(10) | NOT NULL | **(Baru — v1.1)** Kode lokasi fisik rak; wajib berupa kombinasi kode rak (huruf) + nomor, contoh `"A1"`, `"B3"`. Metadata referensi manual, bukan sistem pemetaan otomatis (SRS Out-of-Scope poin #12). |
| `stok` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Jumlah eksemplar buku yang tersedia. Tidak boleh negatif. |
| `status_buku` | VARCHAR(20) | NOT NULL, DEFAULT 'Tersedia' | Status buku: `'Tersedia'`, `'Dipinjam'`, atau **`'Tidak Aktif'`** (Baru — v1.1). |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu data buku ditambahkan. |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir data buku diperbarui. |

#### Status Buku — State Model

```
[Tersedia] ──── (Transaksi Peminjaman berhasil, stok → 0) ────► [Dipinjam]
[Dipinjam] ──── (Pengembalian berhasil dikonfirmasi, stok +1) ──► [Tersedia]
[Tersedia] ──── (Guru menandai buku rusak berat/ditarik via F002) ────► [Tidak Aktif]
```

> Status berubah menjadi `'Dipinjam'` hanya ketika `stok = 0`. Jika stok masih > 0 setelah peminjaman, status tetap `'Tersedia'`. Status `'Tidak Aktif'` **(Baru — v1.1)** ditetapkan manual oleh guru melalui fitur Manajemen Data Buku (F002) ketika buku ditarik dari sirkulasi (mis. rusak berat) — buku **tidak dihapus**, agar riwayat historisnya tetap tersimpan (SRS Section 7.3 — Data Retention Rules). Buku berstatus `'Tidak Aktif'` tidak boleh dipilih pada transaksi peminjaman baru (UC-003) dan tidak ditampilkan di halaman publik siswa (UC-006).

#### Lifecycle Rules

| Event | Action | Sumber UC |
| --- | --- | --- |
| Tambah buku | INSERT baris baru; `stok`, `lokasi_rak` diisi dari input guru (keduanya wajib), `status_buku` = `'Tersedia'`. | UC-002 |
| Edit buku | UPDATE atribut yang diubah guru (termasuk `lokasi_rak` dan `status_buku`); `id_buku` tidak dapat diubah setelah tersimpan. | UC-002 |
| Tandai Tidak Aktif | UPDATE `status_buku = 'Tidak Aktif'` (dilakukan via form edit F002); data tidak dihapus. | UC-002 |
| Hapus buku | DELETE permanen; hanya diperbolehkan jika `status_buku = 'Tersedia'`. | UC-002 |
| Peminjaman berhasil | `stok = stok - 1`; jika `stok = 0` maka `status_buku = 'Dipinjam'`. | UC-003 |
| Pengembalian berhasil | `stok = stok + 1`; `status_buku = 'Tersedia'`. | UC-004 |
| Siswa melihat katalog | SELECT (read-only, termasuk `lokasi_rak`); tidak ada perubahan data; buku `'Tidak Aktif'` disembunyikan. | UC-006 |

#### Validation Rules

- `id_buku` harus unik; sistem menolak INSERT jika ID sudah terdaftar.
- `stok` harus berupa bilangan bulat ≥ 0; sistem menolak input negatif.
- `tahun_terbit` harus berupa bilangan bulat 4 digit yang valid (≥ 1900).
- `lokasi_rak` **(Baru — v1.1)** wajib diisi (NOT NULL) dan wajib sesuai format kombinasi kode rak huruf + nomor (mis. pola `^[A-Za-z]+[0-9]+$`); sistem menolak penyimpanan jika kosong atau format tidak sesuai (SRS F002).
- Buku dengan `status_buku = 'Dipinjam'` tidak dapat dihapus (PROTECTED DELETE).
- `judul_buku`, `penulis`, dan `lokasi_rak` harus bersih dari tag skrip berbahaya (XSS prevention), sesuai Business Rules Master List SRS poin 4.

---

### 3.3 Entity: peminjaman

**Diturunkan dari:** UC-003 (pencatatan transaksi peminjaman), UC-004 (sumber data untuk diproses pengembalian), UC-005 (data riwayat).

**Deskripsi:** Menyimpan setiap transaksi peminjaman buku yang dilakukan siswa dan dicatat oleh guru. Data siswa (nama dan kelas) disimpan secara denormalized di tabel ini (lihat catatan Section 2).

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_peminjaman` | VARCHAR(20) | PRIMARY KEY | Kode unik transaksi peminjaman (contoh: "PJM-20260701-001"). |
| `id_buku` | VARCHAR(20) | NOT NULL, FOREIGN KEY → buku(id_buku) | Referensi ke buku yang dipinjam. |
| `nama_siswa` | VARCHAR(100) | NOT NULL | Nama lengkap siswa peminjam. |
| `kelas_siswa` | VARCHAR(10) | NOT NULL | Kelas siswa (contoh: "4A", "5B"). |
| `tgl_peminjaman` | DATE | NOT NULL | Tanggal peminjaman; diisi otomatis oleh sistem (tanggal hari ini), immutable. |
| `tgl_batas_pengembalian` | DATE | NOT NULL | Tanggal batas pengembalian yang ditentukan guru saat mencatat (date picker aktif). |
| `status_peminjaman` | VARCHAR(25) | NOT NULL, DEFAULT 'Dipinjam' | Status transaksi: `'Dipinjam'` atau `'Sudah Dikembalikan'`. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu transaksi peminjaman dicatat ke sistem. |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir data transaksi diperbarui (saat pengembalian diproses). |

#### Status Peminjaman — State Model

```
[Dipinjam] ──── (Pengembalian berhasil dikonfirmasi) ────► [Sudah Dikembalikan]
```

> Status tidak dapat dikembalikan ke `'Dipinjam'` setelah diubah menjadi `'Sudah Dikembalikan'`.

#### Lifecycle Rules

| Event | Action | Sumber UC |
| --- | --- | --- |
| Simpan peminjaman | INSERT baris baru; `tgl_peminjaman` diisi otomatis oleh server (DATE NOW), `status_peminjaman = 'Dipinjam'`. | UC-003 |
| Pengembalian dikonfirmasi | UPDATE `status_peminjaman = 'Sudah Dikembalikan'`, `updated_at = NOW()`. | UC-004 |
| Guru lihat daftar aktif | SELECT WHERE `status_peminjaman = 'Dipinjam'`. | UC-004 |
| Guru lihat riwayat | SELECT semua record (JOIN dengan `buku` dan `pengembalian`). | UC-005 |

#### Validation Rules

- `tgl_batas_pengembalian` harus ≥ `tgl_peminjaman`; sistem menolak jika batas kembali lebih awal dari tanggal pinjam.
- `id_buku` harus merujuk ke buku yang ada, berstatus bukan `'Tidak Aktif'`, dan memiliki `stok > 0` saat transaksi dibuat.
- `nama_siswa` dan `kelas_siswa` wajib diisi; tidak boleh kosong.
- `nama_siswa` **(Baru — v1.1)** wajib bersih dari tag skrip berbahaya (XSS prevention), sesuai Business Rule F003 dan Master List SRS poin 4.
- `tgl_peminjaman` tidak dapat diubah setelah transaksi tersimpan (immutable).
- Satu transaksi hanya mencakup satu buku (satu baris per peminjaman).

---

### 3.4 Entity: pengembalian

**Diturunkan dari:** UC-004 (pencatatan pengembalian buku), UC-005 (ditampilkan sebagai bagian riwayat).

**Deskripsi:** Menyimpan data pengembalian buku untuk setiap transaksi peminjaman yang aktif. Terpisah dari tabel `peminjaman` karena terjadi pada waktu yang berbeda, namun selalu terhubung melalui `id_peminjaman`.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_pengembalian` | VARCHAR(20) | PRIMARY KEY | Kode unik transaksi pengembalian (contoh: "KBL-20260701-001"). |
| `id_peminjaman` | VARCHAR(20) | NOT NULL, UNIQUE, FOREIGN KEY → peminjaman(id_peminjaman) | Referensi ke transaksi peminjaman; UNIQUE karena satu peminjaman hanya memiliki satu pengembalian. |
| `tgl_pengembalian` | DATE | NOT NULL | Tanggal pengembalian; diisi otomatis oleh sistem (tanggal hari ini), immutable. |
| `kondisi_buku` | VARCHAR(20) | NOT NULL | Kondisi buku saat dikembalikan: `'Baik'`, `'Rusak Ringan'`, atau `'Rusak Berat'`. |
| `keterlambatan_hari` | INTEGER | NOT NULL, DEFAULT 0, CHECK ≥ 0 | Jumlah hari keterlambatan; dihitung otomatis: `MAX(0, tgl_pengembalian - tgl_batas_pengembalian)`. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu data pengembalian dicatat ke sistem. |

#### Lifecycle Rules

| Event | Action | Sumber UC |
| --- | --- | --- |
| Konfirmasi pengembalian | INSERT baris baru; `tgl_pengembalian = DATE NOW()`, `keterlambatan_hari` dihitung otomatis oleh server, UPDATE `peminjaman.status_peminjaman = 'Sudah Dikembalikan'`, UPDATE `buku.stok = stok + 1` dan `buku.status_buku = 'Tersedia'`. Semua dalam satu database transaction (ACID), sesuai Business Rule F007. | UC-004 |
| Guru lihat riwayat | SELECT (JOIN dengan `peminjaman` dan `buku`). | UC-005 |

#### Calculation Rules

```
keterlambatan_hari = MAX(0, tgl_pengembalian - tgl_batas_pengembalian)
```

- Jika `tgl_pengembalian ≤ tgl_batas_pengembalian` → `keterlambatan_hari = 0` (tepat waktu).
- Jika `tgl_pengembalian > tgl_batas_pengembalian` → `keterlambatan_hari = selisih hari` (terlambat).
- Tidak ada denda; informasi keterlambatan hanya bersifat informatif (Out-of-Scope SRS poin #3; Business Rule F004).

#### Validation Rules

- `kondisi_buku` hanya menerima nilai enum: `'Baik'`, `'Rusak Ringan'`, `'Rusak Berat'` (wajib dipilih, sesuai DS v1.3 Section 9.7).
- `id_peminjaman` harus merujuk ke transaksi yang ada dan berstatus `'Dipinjam'`.
- Satu `id_peminjaman` hanya dapat memiliki **satu** baris di tabel `pengembalian` (UNIQUE constraint).
- `tgl_pengembalian` tidak dapat diubah setelah dicatat (immutable).

---

### 3.5 Entity: riwayat_peminjaman (View)

**Diturunkan dari:** UC-005 (Melihat Riwayat Peminjaman).

**Deskripsi:** Bukan tabel fisik tersendiri, melainkan sebuah **database VIEW** yang menggabungkan (JOIN) data dari tabel `peminjaman`, `pengembalian`, dan `buku` untuk kebutuhan tampilan riwayat transaksi. Seluruh data bersifat **read-only**, sesuai Business Rule F005 dan Master List SRS poin 7.

#### Definisi VIEW

```sql
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
    p.status_peminjaman,
    p.created_at AS tgl_catat_peminjaman
FROM peminjaman p
LEFT JOIN buku b ON p.id_buku = b.id_buku
LEFT JOIN pengembalian k ON p.id_peminjaman = k.id_peminjaman
ORDER BY p.created_at DESC;
```

#### Kolom yang Tersedia (untuk tampilan UC-005)

| Kolom | Sumber Tabel | Keterangan |
| --- | --- | --- |
| `id_peminjaman` | peminjaman | ID transaksi |
| `nama_siswa` | peminjaman | Nama siswa peminjam |
| `kelas_siswa` | peminjaman | Kelas siswa |
| `judul_buku` | buku | Judul buku yang dipinjam |
| `tema_buku` | buku | Tema/kategori buku |
| `tgl_peminjaman` | peminjaman | Tanggal pinjam |
| `tgl_batas_pengembalian` | peminjaman | Tanggal batas kembali |
| `tgl_pengembalian` | pengembalian | Tanggal aktual pengembalian (NULL jika masih dipinjam) |
| `kondisi_buku` | pengembalian | Kondisi buku saat kembali (NULL jika masih dipinjam) |
| `keterlambatan_hari` | pengembalian | Jumlah hari terlambat (NULL jika masih dipinjam) |
| `status_peminjaman` | peminjaman | `'Dipinjam'` / `'Sudah Dikembalikan'` |

> Catatan: `lokasi_rak` tidak disertakan pada VIEW ini karena tabel riwayat pada PAGE-006 (DS v1.3 Traceability F005) tidak menampilkan kolom Lokasi Rak — kolom tersebut hanya relevan pada F002, F003, dan F006.

#### Filter yang Didukung (UC-005)

| Filter | Kolom yang Difilter | Tipe Operasi |
| --- | --- | --- |
| Nama Siswa | `nama_siswa` | LIKE `%keyword%` |
| Judul Buku | `judul_buku` | LIKE `%keyword%` |
| Rentang Tanggal | `tgl_peminjaman` | BETWEEN `tgl_mulai` AND `tgl_akhir` |
| Kombinasi Filter | Semua kolom di atas | AND logic |

---

### 3.6 Entity: session

**Diturunkan dari:** UC-001 (Login Guru — sesi dibuat setelah login berhasil).

**Deskripsi:** Menyimpan sesi autentikasi aktif guru sebagai HttpOnly Cookie. Digunakan untuk validasi akses ke seluruh halaman authenticated.

#### Atribut

| Kolom | Tipe Data | Constraint | Keterangan |
| --- | --- | --- | --- |
| `id_session` | VARCHAR(128) | PRIMARY KEY | Token sesi unik (UUID atau random secure string). |
| `id_guru` | VARCHAR(10) | NOT NULL, FOREIGN KEY → guru(id_guru) | Referensi ke akun guru yang sedang aktif. |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu sesi dibuat. |
| `last_activity` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu terakhir guru melakukan aktivitas (diperbarui setiap request). |
| `expires_at` | TIMESTAMP | NOT NULL | Waktu kadaluarsa sesi = `last_activity + 30 menit`. |

#### Lifecycle Rules

| Event | Action | Sumber UC |
| --- | --- | --- |
| Login berhasil | INSERT baris baru; kirim `id_session` ke klien sebagai HttpOnly Cookie. | UC-001 |
| Setiap request authenticated | UPDATE `last_activity = NOW()`, `expires_at = NOW() + 30 menit`. | UC-001 |
| Idle 30 menit | DELETE atau tandai sesi kadaluarsa; redirect klien ke `/login`. | UC-001 |
| Logout | DELETE baris sesi yang aktif; hapus HttpOnly Cookie di klien. | UC-001 (F001) |

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
│ lokasi_rak  (v1.1)    │         │ status_peminjaman                      │
│ stok                  │         │ created_at                             │
│ status_buku           │         │ updated_at                             │
│  (Tersedia/Dipinjam/  │         └─────────────────┬──────────────────────┘
│   Tidak Aktif — v1.1) │                           │ 1
│ created_at            │                           │
│ updated_at            │                           │ 1
└──────────────────────┘         ┌──────────────────▼──────────────────────┐
                                  │           pengembalian                  │
                                  ├──────────────────────────────────────────┤
                                  │ id_pengembalian  PK                     │
                                  │ id_peminjaman    FK (UNIQUE)            │
                                  │ tgl_pengembalian                        │
                                  │ kondisi_buku                            │
                                  │ keterlambatan_hari                      │
                                  │ created_at                              │
                                  └──────────────────────────────────────────┘

─────────────────────────────────────────────────────────────────────
VIEW: riwayat_peminjaman
(JOIN: peminjaman ← buku, peminjaman ← pengembalian — read-only)
─────────────────────────────────────────────────────────────────────
```

### Ringkasan Relasi

| Relasi | Kardinalitas | Keterangan |
| --- | --- | --- |
| guru → session | 1 : N | Satu guru dapat memiliki banyak sesi (multi-device), namun hanya satu sesi aktif per login. |
| buku → peminjaman | 1 : N | Satu buku dapat muncul di banyak transaksi peminjaman (di waktu berbeda). |
| peminjaman → pengembalian | 1 : 1 | Satu transaksi peminjaman hanya memiliki tepat satu data pengembalian. |
| peminjaman → riwayat_peminjaman | N : 1 | View menggabungkan semua transaksi (semua records). |

---

## 5. DATA FLOW PER USE CASE

### UC-001: Login Guru
```
INPUT:  username, password (plaintext dari form)
PROSES: SELECT guru WHERE username = ? → verify bcrypt(password, password_hash)
OUTPUT: INSERT session → kirim id_session sebagai HttpOnly Cookie
TABLES: guru (READ), session (INSERT)
```

### UC-002: Manajemen Data Buku
```
Tambah: INSERT INTO buku (id_buku, judul_buku, penulis, penerbit, tema_buku, tahun_terbit,
                            lokasi_rak, stok, status_buku='Tersedia')
Edit:   UPDATE buku SET ... [termasuk lokasi_rak, status_buku] WHERE id_buku = ?
Tandai Tidak Aktif: UPDATE buku SET status_buku = 'Tidak Aktif' WHERE id_buku = ?
Hapus:  DELETE FROM buku WHERE id_buku = ? AND status_buku = 'Tersedia'
Cari:   SELECT * FROM buku WHERE judul_buku LIKE ? OR tema_buku LIKE ? OR id_buku LIKE ?
TABLES: buku (CRUD)
```

### UC-003: Pencatatan Peminjaman
```
INPUT:  id_buku, nama_siswa, kelas_siswa, tgl_batas_pengembalian
PROSES: BEGIN TRANSACTION
        INSERT INTO peminjaman (id_peminjaman, id_buku, nama_siswa, kelas_siswa,
                                 tgl_peminjaman=TODAY, tgl_batas_pengembalian, status='Dipinjam')
        UPDATE buku SET stok = stok - 1,
               status_buku = CASE WHEN stok-1=0 THEN 'Dipinjam' ELSE status_buku END
               WHERE id_buku = ? AND status_buku != 'Tidak Aktif'
        COMMIT
TABLES: peminjaman (INSERT), buku (UPDATE)
```

### UC-004: Pencatatan Pengembalian
```
INPUT:  id_peminjaman, kondisi_buku
PROSES: BEGIN TRANSACTION
        INSERT INTO pengembalian (id_pengembalian, id_peminjaman, tgl_pengembalian=TODAY,
                                   kondisi_buku, keterlambatan_hari=CALCULATED)
        UPDATE peminjaman SET status_peminjaman='Sudah Dikembalikan', updated_at=NOW()
               WHERE id_peminjaman = ?
        UPDATE buku SET stok = stok + 1, status_buku = 'Tersedia'
               WHERE id_buku = (SELECT id_buku FROM peminjaman WHERE id_peminjaman = ?)
        COMMIT
TABLES: pengembalian (INSERT), peminjaman (UPDATE), buku (UPDATE)
```

### UC-005: Melihat Riwayat Peminjaman
```
PROSES: SELECT * FROM riwayat_peminjaman
        [WHERE nama_siswa LIKE ? AND/OR judul_buku LIKE ? AND/OR tgl_peminjaman BETWEEN ? AND ?]
        ORDER BY tgl_peminjaman DESC
TABLES: riwayat_peminjaman VIEW (READ-ONLY)
```

### UC-006: Akses Publik Siswa
```
PROSES: SELECT id_buku, judul_buku, penulis, tema_buku, lokasi_rak, stok, status_buku FROM buku
        WHERE status_buku != 'Tidak Aktif'
        [AND (judul_buku LIKE ? OR tema_buku LIKE ?)]
        ORDER BY judul_buku ASC
TABLES: buku (READ-ONLY, tanpa data peminjam, menyertakan lokasi_rak, menyembunyikan buku Tidak Aktif)
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
                    CHECK (lokasi_rak REGEXP '^[A-Za-z]+[0-9]+$'),   -- Baru (v1.1): format kode rak huruf + nomor
    stok            INTEGER      NOT NULL DEFAULT 0 CHECK (stok >= 0),
    status_buku     VARCHAR(20)  NOT NULL DEFAULT 'Tersedia'
                    CHECK (status_buku IN ('Tersedia', 'Dipinjam', 'Tidak Aktif')),  -- 'Tidak Aktif' baru (v1.1)
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
    id_pengembalian     VARCHAR(20) PRIMARY KEY,
    id_peminjaman       VARCHAR(20) NOT NULL UNIQUE,
    tgl_pengembalian    DATE        NOT NULL DEFAULT (CURRENT_DATE),
    kondisi_buku        VARCHAR(20) NOT NULL
                        CHECK (kondisi_buku IN ('Baik', 'Rusak Ringan', 'Rusak Berat')),
    keterlambatan_hari  INTEGER     NOT NULL DEFAULT 0 CHECK (keterlambatan_hari >= 0),
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_peminjaman) REFERENCES peminjaman(id_peminjaman)
) ENGINE=InnoDB;

-- VIEW: riwayat_peminjaman
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
    p.status_peminjaman,
    p.created_at AS tgl_catat_peminjaman
FROM peminjaman p
LEFT JOIN buku b ON p.id_buku = b.id_buku
LEFT JOIN pengembalian k ON p.id_peminjaman = k.id_peminjaman
ORDER BY p.created_at DESC;
```

> Catatan implementasi: `CHECK (... REGEXP ...)` didukung penuh pada MySQL 8.0.16+ (CHECK constraint benar-benar ditegakkan sejak versi ini). Tim backend tetap wajib menduplikasi validasi format `lokasi_rak`, nilai `stok ≥ 0`, dan XSS-sanitization di application layer (Express.js) sebagai lapisan pertahanan kedua, sesuai NFR keamanan SRS.

---

## 7. BUSINESS RULES TRACEABILITY

| Rule ID | Business Rule | Sumber (SRS) | Implementasi di Data Model |
| --- | --- | --- | --- |
| BR-01 | ID Buku harus unik. | F002 | `id_buku` PRIMARY KEY + UNIQUE. |
| BR-02 | Stok buku tidak boleh negatif (≥ 0). | F002 | `CHECK (stok >= 0)` pada tabel `buku`. |
| BR-03 | Buku berstatus "Dipinjam" tidak dapat dihapus. | F002 | Validasi di application layer sebelum DELETE; `status_buku = 'Tersedia'` wajib. |
| BR-04 | Stok berkurang otomatis saat peminjaman. | F002, F003, F007 | UPDATE `buku.stok = stok - 1` dalam transaksi atomik UC-003. |
| BR-05 | Stok bertambah otomatis saat pengembalian. | F002, F004, F007 | UPDATE `buku.stok = stok + 1` dalam transaksi atomik UC-004. |
| BR-06 | Tanggal peminjaman diisi otomatis, tidak dapat diubah. | F003 | `tgl_peminjaman DEFAULT (CURRENT_DATE)`, kolom immutable di application layer. |
| BR-07 | Buku stok 0 tidak dapat dipilih untuk dipinjam. | F003 | Validasi `buku.stok > 0` sebelum INSERT `peminjaman`. |
| BR-08 | Satu transaksi hanya untuk satu eksemplar buku. | F003 | Satu baris per INSERT di tabel `peminjaman`. |
| BR-09 | Tanggal pengembalian diisi otomatis, tidak dapat diubah. | F004 | `tgl_pengembalian DEFAULT (CURRENT_DATE)`, immutable di application layer. |
| BR-10 | Informasi keterlambatan tampil, tanpa denda. | F004 | `keterlambatan_hari` dihitung dan disimpan; tidak ada tabel denda. |
| BR-11 | Satu peminjaman hanya punya satu pengembalian. | F004 | UNIQUE constraint pada `pengembalian.id_peminjaman`. |
| BR-12 | Data riwayat bersifat read-only; tidak dapat diubah. | F005 | `riwayat_peminjaman` adalah VIEW; tidak ada UPDATE/DELETE. |
| BR-13 | Halaman publik tidak menampilkan data peminjam. | F006 | Query UC-006 SELECT hanya dari tabel `buku`; tidak JOIN ke `peminjaman`. |
| BR-14 | Password disimpan sebagai hash bcrypt. | F001 | Kolom `password_hash`; hashing dilakukan di application layer. |
| BR-15 | Sesi kadaluarsa otomatis setelah 30 menit idle. | F001 | Kolom `expires_at` di tabel `session`; dicek setiap request. |
| BR-16 | Tgl batas kembali ≥ tgl peminjaman. | F003 | `CONSTRAINT chk_batas_kembali` di tabel `peminjaman`. |
| BR-17 | **(Baru — v1.1)** Lokasi Rak wajib diisi dan sesuai format kode huruf + nomor. | F002 | `lokasi_rak NOT NULL` + `CHECK (... REGEXP '^[A-Za-z]+[0-9]+$')` pada tabel `buku`. |
| BR-18 | **(Baru — v1.1)** Buku ditarik dari sirkulasi diberi status "Tidak Aktif", bukan dihapus. | Section 7.3 (Data Retention Rules) | `status_buku` enum menyertakan `'Tidak Aktif'`; tidak ada DELETE untuk kondisi ini. |
| BR-19 | **(Baru — v1.1)** Judul buku, nama siswa, dan lokasi rak wajib bersih dari tag skrip berbahaya (XSS). | Master List poin 4; F002, F003 | Sanitasi di application layer pada kolom `judul_buku`, `nama_siswa`, `lokasi_rak` sebelum INSERT/UPDATE. |
| BR-20 | **(Baru — v1.1)** Guru tidak boleh mengubah stok secara manual di luar mekanisme peminjaman/pengembalian, kecuali via F002. | F007 | Perubahan `stok` hanya terjadi via UC-002 (input manual saat tambah/edit) atau transaksi atomik UC-003/UC-004; tidak ada endpoint terpisah untuk penyesuaian stok bebas. |

---

## 8. DATA RETENTION RULES

Sesuai `srs.md` v3.1 Section 7.3 (Data Retention Rules):

| Data | Retensi | Keterangan |
| --- | --- | --- |
| `peminjaman` | **Minimal 3 tahun ajaran** (dikoreksi dari "5 tahun" — v1.1) | Tidak dapat dihapus oleh pengguna melalui UI, untuk keperluan audit dan pelaporan sekolah. |
| `pengembalian` | **Minimal 3 tahun ajaran** (dikoreksi dari "5 tahun" — v1.1) | Terhubung dengan `peminjaman`; tidak dapat dihapus via UI. |
| `buku` | Selama dibutuhkan | Dapat dihapus guru hanya jika status `'Tersedia'`; jika ditarik dari sirkulasi (mis. rusak berat), diberi status `'Tidak Aktif'` **(bukan dihapus)** agar riwayat historis tetap tersimpan. |
| `guru` | Selama dibutuhkan | Hanya administrator sistem yang dapat menghapus. |
| `session` | Sampai kadaluarsa | Dihapus otomatis setelah `expires_at` atau saat logout. |

---

## 9. TRACEABILITY MATRIX (User Flows → Data Model)

| UC ID | Use Case | Tables READ | Tables WRITE | View Used |
| --- | --- | --- | --- | --- |
| UC-001 | Login Guru | guru | session | — |
| UC-002 | Manajemen Data Buku (termasuk Lokasi Rak & status Tidak Aktif) | buku | buku | — |
| UC-003 | Pencatatan Peminjaman | buku | peminjaman, buku | — |
| UC-004 | Pencatatan Pengembalian | peminjaman, buku | pengembalian, peminjaman, buku | — |
| UC-005 | Riwayat Peminjaman | — | — | riwayat_peminjaman |
| UC-006 | Akses Publik Siswa (termasuk Lokasi Rak) | buku | — | — |

---

## 10. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft — Data Model SoT-6 diturunkan dari SRS v1.0 (SoT-1) dan User Flows v1.0 (SoT-4). |
| **1.1** | **2026-07-01** | **Kelompok DPSI BRAYYY** | **Sinkronisasi penuh terhadap `srs.md` v3.1, `information_architecture.md`, `design_system.md` v1.3, dan `user_flows` v1.1:** (1) menambahkan kolom `lokasi_rak` (NOT NULL + format constraint) pada tabel `buku`, sebelumnya hilang total meski wajib di F002; (2) memperluas enum `status_buku` dengan `'Tidak Aktif'` sesuai SRS Section 7.3 & DS Badge 9.5; (3) mengoreksi retensi data `peminjaman`/`pengembalian` dari "5 tahun" menjadi "3 tahun ajaran" sesuai SRS Section 7.3; (4) menambahkan validasi XSS eksplisit untuk `nama_siswa` (BR-19); (5) memperbaiki query UC-006 agar menyertakan `lokasi_rak` dan menyembunyikan buku `'Tidak Aktif'`; (6) menghapus referensi "SRS v1.0"/"UF v1.0"/"Open Question Q02" yang sudah usang, diganti dengan SRS v3.1 & UF v1.1; (7) menambahkan catatan resolusi terminologi "ID Siswa" (SRS 7.1/7.4) vs pendekatan denormalized `nama_siswa`/`kelas_siswa` yang benar-benar diimplementasikan di IA/DS/UF; (8) menambahkan BR-17 s.d. BR-20 pada Business Rules Traceability; (9) mengonversi DDL menjadi MySQL-flavored (`ENGINE=InnoDB`, `CURRENT_TIMESTAMP`, `REGEXP`) sesuai Tech Stack final SRS Section 3. |