# information_architecture.md — Information Architecture
## Sistem Informasi Perpustakaan SD Negeri Tamanan

**Status:** Draft (Revisi — sinkron dengan srs.md v3.7)
**Last Updated:** 2026-07-11
**Diturunkan dari:** `srs.md` v3.7 (SoT-1)
**Digunakan untuk:** High-Fidelity Prototype, struktur halaman Frontend, navigasi antarmuka, struktur routing, pemetaan relasi antar-layar.

---

## 1. Global Layout

### 1.1 Mode Layout

**A. Layout Halaman Login (Unauthenticated)**
- Tidak ada sidebar maupun topbar.
- Konten terpusat di tengah layar: form input username, password, dan tombol "Masuk".

**B. Layout Halaman Publik Siswa (Unauthenticated)**
- Topbar sederhana berisi judul "Perpustakaan SD Negeri Tamanan" dan tombol "Login Guru" di pojok kanan atas.
- Konten utama berisi kolom pencarian dan tabel daftar buku (termasuk lokasi rak).
- Tidak ada sidebar.

**C. Layout Halaman Guru (Authenticated)**
- **Sidebar** — permanen di sisi kiri layar, berisi menu: Data Buku, Peminjaman, Pengembalian, Riwayat, dan tombol Logout. Dapat diciutkan (collapsible) untuk memaksimalkan area kerja.
- **Topbar / User Menu** — dropdown di pojok kanan atas berisi nama Guru aktif dan tombol "Keluar" (Logout).
- **Konten** — area utama menampilkan tabel data, form, atau modal sesuai halaman aktif.
- **Responsive Fallback (opsional)** — sesuai srs.md v3.3, sistem dirancang untuk dijalankan pada satu unit PC desktop di perpustakaan (Guru dan siswa memakai perangkat yang sama secara bergantian). Perilaku sidebar-menciut/hamburger menu pada lebar layar < 768px tetap dipertahankan sebagai fallback ketasekokohan UI (mis. jika jendela browser diperkecil), namun bukan lagi kebutuhan utama karena tidak ada target device tablet/mobile terpisah pada versi ini.
- **Breadcrumb** — tidak diaktifkan, karena struktur menu sangat dangkal (maksimal 1 tingkat sub-halaman berupa modal), demi efisiensi fokus layar.

### 1.2 Module Hierarchy

```
Sistem Informasi Perpustakaan SDN Tamanan (Root)
├── M001: Authentication
│   └── Halaman Login
├── M006: Akses Publik Siswa (Landing Page Publik)
│   ├── Daftar Buku, Lokasi Rak & Status Ketersediaan
│   └── Pencarian Buku (Judul / Tema)
├── M002: Manajemen Data Buku (Authenticated)
│   ├── Tabel Katalog Buku (termasuk Lokasi Rak)
│   ├── Form Tambah Buku Baru (Modal Overlay)
│   └── Form Edit Data Buku (Modal Overlay)
├── M003: Transaksi Peminjaman (Authenticated)
│   ├── Daftar Buku Tersedia
│   └── Form Catat Peminjaman
├── M004: Transaksi Pengembalian (Authenticated)
│   ├── Daftar Peminjaman Aktif (Belum Dikembalikan)
│   └── Form Catat Pengembalian (termasuk Panel Ringkasan Denda)
└── M005: Riwayat Peminjaman (Authenticated)
    ├── Tabel Riwayat Seluruh Transaksi (termasuk kolom Denda)
    └── Filter & Pencarian Riwayat
```

| Module ID | Module Name | Description |
|---|---|---|
| M001 | Authentication | Mengatur keamanan akses masuk dan keluar sistem untuk aktor Guru. |
| M002 | Manajemen Data Buku | Modul pengelolaan katalog buku: menambah, mengubah, menghapus, mencari data buku (termasuk lokasi rak). |
| M003 | Transaksi Peminjaman | Modul pencatatan peminjaman buku oleh siswa, dikelola oleh guru. |
| M004 | Transaksi Pengembalian | Modul pencatatan pengembalian buku beserta kondisi, pengecekan keterlambatan, dan kalkulasi denda otomatis. |
| M005 | Riwayat Peminjaman | Modul rekap historis seluruh transaksi peminjaman dan pengembalian, termasuk riwayat nominal denda. |
| M006 | Akses Publik Siswa | Halaman publik tanpa login untuk siswa melihat ketersediaan, lokasi rak, dan mencari buku. |

### 1.3 Content Hierarchy per Module

**Module: Manajemen Data Buku**
- Level 1 (Halaman Master Katalog): Judul "Data Buku Perpustakaan", tombol "Tambah Buku Baru", kolom pencarian (Judul/Tema).
- Level 2 (Tabel Data Katalog): Tabel Buku (ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Lokasi Rak, Stok, Status, Aksi); Status Badge Stok (Hijau: Tersedia, Merah: Stok Habis); tombol Edit/Hapus per baris.
- Level 3 (Modal Form Tambah/Edit Buku): Field Gambar Sampul (Image Upload, opsional), ID Buku (alfanumerik, unik), Judul Buku, Penulis, Penerbit, Tema (dropdown opsional: Cerita & Dongeng / Lainnya — diisi hanya untuk buku non-pelajaran), Tahun Terbit (numerik), Lokasi Rak (format kode huruf + nomor, misal "A1"/"B3", wajib diisi, tervalidasi), Tingkat Kelas (opsional, dropdown Kelas 1–6 — diisi hanya untuk buku pelajaran berjenjang, mutually exclusive dengan Tema), Stok Awal (integer ≥ 0); tombol "Batal" dan "Simpan".

**Module: Transaksi Peminjaman**
- Level 1 (Halaman Catat Peminjaman): Judul "Catat Peminjaman Buku"; Panel Kiri (Daftar Buku Tersedia, stok > 0); Panel Kanan (Form Data Peminjaman).
- Level 2 (Detail & Form Isian): Kartu Buku (Judul, Penulis, Tema, Lokasi Rak, Badge Stok) — Lokasi Rak ditampilkan agar Guru dapat mengambil buku secara fisik dengan cepat; Field Nama Siswa, Kelas Siswa, Tanggal Pinjam (otomatis, non-editable), Tanggal Batas Pengembalian (date picker).
- Level 3 (Aksi & Konfirmasi): Ringkasan Data Peminjaman; tombol "Batal" dan "Simpan Peminjaman".

**Module: Transaksi Pengembalian**
- Level 1 (Daftar Peminjaman Aktif): Judul "Catat Pengembalian Buku"; daftar peminjaman belum dikembalikan.
- Level 2 (Detail Transaksi Aktif): Tabel Peminjaman Aktif (Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali); Indikator Keterlambatan (badge merah + jumlah hari); tombol "Proses Pengembalian" per baris.
- Level 3 (Form Konfirmasi): Ringkasan data; Field Tanggal Pengembalian (otomatis); Pilihan Kondisi Buku (Baik/Rusak Ringan/Rusak Berat, radio button); Panel Ringkasan Denda (rincian keterlambatan + biaya kondisi + total, dihitung otomatis dan real-time); info keterlambatan; tombol "Batal" dan "Konfirmasi Pengembalian".

**Module: Riwayat Peminjaman**
- Level 1 (Halaman Riwayat): Judul "Riwayat Peminjaman"; Filter Pencarian (Nama Siswa, Judul Buku, Rentang Tanggal); tombol "Export ke Excel" (filter bulan/tahun sebelum export).
- Level 2 (Tabel Riwayat): Kolom Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Tgl Kembali Aktual, Kondisi Buku, Denda, Status; Badge Status (Hijau: Sudah Dikembalikan, Kuning: Masih Dipinjam); Badge Denda (merah, menampilkan nominal, hanya muncul jika Total Denda > 0 — strip "—" jika Rp 0 atau transaksi masih berjalan).

**Module: Akses Publik Siswa**
- Level 1 (Halaman Ketersediaan Buku): Judul "Perpustakaan SD Negeri Tamanan"; kolom pencarian (Judul/Tema); **Baris Kategori Filter (Semua / Kelas 1–6 / Cerita & Dongeng / Lainnya)**; tombol "Login Guru" di pojok kanan atas.
- Level 2 (Daftar Buku): Tabel Buku (Judul, Penulis, Tema, Lokasi Rak, Stok Tersedia, Status) — Lokasi Rak wajib ditampilkan agar siswa dapat langsung menemukan posisi fisik buku tanpa bertanya ke Guru; Badge Status (Hijau: Tersedia, Merah: Dipinjam/Stok Habis). Data denda dan data peminjam tidak ditampilkan di sini (Business Rule Master List poin 10).

---

## 2. Route Map

### 2.1 Page Inventory & Routing

| Page ID | Page Name | Module | Access Role | Route | Fallback / Redirect Rule |
|---|---|---|---|---|---|
| PAGE-001 | Login | M001 | Tamu / Guest | `/login` | Jika Guru sudah login, akses `/login` redirect otomatis ke `/buku`. |
| PAGE-002 | Ketersediaan & Lokasi Buku (Publik) | M006 | Publik (Siswa & Guru) | `/` | Halaman publik, dapat diakses siapa pun tanpa autentikasi. |
| PAGE-003 | Manajemen Data Buku | M002 | Guru (Authenticated) | `/buku` | Jika sesi habis/tidak valid, redirect ke `/login`. |
| PAGE-003-SUB-01 | Form Tambah Buku Baru | M002 | Guru (Authenticated) | Modal di `/buku` | — |
| PAGE-003-SUB-02 | Form Edit Data Buku | M002 | Guru (Authenticated) | Modal di `/buku` | — |
| PAGE-004 | Catat Peminjaman | M003 | Guru (Authenticated) | `/peminjaman` | Jika sesi habis/tidak valid, redirect ke `/login`. |
| PAGE-005 | Catat Pengembalian | M004 | Guru (Authenticated) | `/pengembalian` | Jika sesi habis/tidak valid, redirect ke `/login`. |
| PAGE-006 | Riwayat Peminjaman | M005 | Guru (Authenticated) | `/riwayat` | Jika sesi habis/tidak valid, redirect ke `/login`. |
| — | Redirector Root | — | — | `-` | Jika ada sesi aktif → `/buku`; jika tidak ada → `/login`. |
| — | 404 Page | — | — | `*` (route lain) | Menampilkan "Halaman Tidak Ditemukan" + tombol kembali ke `/`. |

### 2.2 Page Definitions

**PAGE-001: Login**
- Purpose: Memverifikasi identitas Guru untuk mencegah akses tidak sah.
- Entry Points: akses langsung `/login`; redirect otomatis saat akses halaman authenticated tanpa sesi; sesi habis (idle timeout 30 menit).
- Exit Points: berhasil login → diarahkan ke `/buku` (PAGE-003).
- Related User Flow: UC-001 (Login Guru).
- Required Permissions: Publik / Tanpa Autentikasi.
- Notes: Layar minimalis tanpa sidebar; form username, password, tombol "Masuk".

**PAGE-002: Ketersediaan & Lokasi Buku (Publik)**
- Purpose: Akses mandiri siswa untuk melihat ketersediaan, lokasi rak, dan mencari buku tanpa login.
- Entry Points: akses URL root `/`; tautan publik yang dibagikan ke siswa.
- Exit Points: klik "Login Guru" → `/login` (PAGE-001).
- Related User Flow: UC-006 (Siswa Melihat Ketersediaan Buku).
- Required Permissions: Publik / Tanpa Autentikasi.
- Notes: Read-only sepenuhnya; tabel Judul, Penulis, Tema (Cerita & Dongeng / Lainnya), Lokasi Rak, Stok Tersedia, Status; kolom pencarian; baris filter kategori (Semua/Kelas 1–6/Cerita & Dongeng/Lainnya); data peminjam dan data denda tidak ditampilkan.

**PAGE-003: Manajemen Data Buku**
- Purpose: Antarmuka utama guru mengelola katalog buku.
- Entry Points: setelah login dari PAGE-001; klik menu "Data Buku" di sidebar.
- Exit Points: klik menu lain di sidebar; klik "Keluar" → `/login`.
- Related User Flow: UC-002 (Manajemen Data Buku).
- Child Pages: PAGE-003-SUB-01 (modal Tambah Buku), PAGE-003-SUB-02 (modal Edit Buku).
- Required Permissions: Guru (Authenticated).
- Notes: Tabel katalog interaktif (ID Buku, Judul, Penulis, Tema, Tahun Terbit, Lokasi Rak, Stok, Status, Aksi); tombol "Tambah Buku Baru"; kolom pencarian; badge merah untuk stok 0; validasi format Lokasi Rak (kode huruf + nomor); field Gambar Sampul opsional pada modal Tambah/Edit; field Tema (dropdown opsional: Cerita & Dongeng / Lainnya) pada modal Tambah/Edit; field Tingkat Kelas (opsional, dropdown 1–6) pada modal Tambah/Edit — mutually exclusive dengan Tema.

**PAGE-004: Catat Peminjaman**
- Purpose: Mencatat transaksi peminjaman buku secara cepat dan akurat.
- Entry Points: klik menu "Peminjaman" di sidebar.
- Exit Points: klik menu lain di sidebar.
- Related User Flow: UC-003 (Pencatatan Peminjaman Buku).
- Required Permissions: Guru (Authenticated).
- Notes: Panel Kiri (daftar buku tersedia, stok > 0, menampilkan Lokasi Rak agar Guru cepat mengambil buku fisik); Panel Kanan (form data peminjam + tanggal); buku stok 0 non-selectable dengan badge "Stok Habis". Saat transaksi berhasil disimpan, sistem otomatis menjalankan logika F007 (Sinkronisasi Stok & Status) di background.

**PAGE-005: Catat Pengembalian**
- Purpose: Memproses pengembalian buku, mencatat kondisi buku, menghitung denda otomatis, memperbarui stok otomatis.
- Entry Points: klik menu "Pengembalian" di sidebar.
- Exit Points: klik menu lain di sidebar.
- Related User Flow: UC-004 (Pencatatan Pengembalian Buku).
- Required Permissions: Guru (Authenticated).
- Notes: Daftar transaksi aktif (belum dikembalikan); info nama siswa, kelas, judul buku, tanggal pinjam, batas kembali, indikator keterlambatan (merah); tombol "Proses Pengembalian" membuka form konfirmasi kondisi buku beserta Panel Ringkasan Denda (real-time, read-only). Saat pengembalian dikonfirmasi, sistem otomatis menjalankan logika F007 (Sinkronisasi Stok & Status) di background dan menyimpan nominal Total Denda sebagai data immutable.

**PAGE-006: Riwayat Peminjaman**
- Purpose: Rekap historis seluruh transaksi untuk monitoring dan pelaporan, termasuk riwayat nominal denda.
- Entry Points: klik menu "Riwayat" di sidebar.
- Exit Points: klik menu lain di sidebar.
- Related User Flow: UC-005 (Melihat Riwayat Peminjaman).
- Required Permissions: Guru (Authenticated).
- Notes: Tabel lengkap (Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Tgl Kembali Aktual, Kondisi Buku, Denda, Status); filter nama siswa/judul buku/rentang tanggal; data read-only termasuk nominal denda yang sudah tersimpan; tombol "Export ke Excel" dengan dropdown filter bulan dan tahun — hanya Guru, menghasilkan file .xlsx sesuai filter.

### 2.3 Traceability Matrix (SRS → IA)

| Feature ID | Feature Name | Mapped Page ID | Mapped Route |
|---|---|---|---|
| F001 | Autentikasi Guru (Login) | PAGE-001 | `/login` |
| F002 | Manajemen Data Buku (termasuk Lokasi Rak & Gambar Sampul) | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 | `/buku` |
| F003 | Pencatatan Peminjaman Buku | PAGE-004 | `/peminjaman` |
| F004 | Pencatatan Pengembalian Buku (termasuk kalkulasi Denda) | PAGE-005 | `/pengembalian` |
| F005 | Riwayat Peminjaman (termasuk riwayat Denda) | PAGE-006 | `/riwayat` |
| F006 | Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik) | PAGE-002 | `/` |
| F007 | Sinkronisasi Stok & Status Otomatis | Tidak ada halaman khusus — logika berjalan otomatis di sisi backend, terpicu saat submit form di PAGE-004 dan PAGE-005 | — (server-side logic, bukan route halaman) |

---

## 3. Navigasi

### 3.1 Tipe Navigasi

| Navigation | Type | Behavior |
|---|---|---|
| Main Menu | Sidebar Navigation | Permanen di sisi kiri layar, collapsible, hanya tampil setelah Guru login. |
| User Menu | Top-Right Dropdown | Berisi nama Guru aktif dan tombol "Keluar" (Logout). |
| Responsive Fallback | Top Hamburger Menu | Sidebar disembunyikan, diakses via tombol hamburger jika lebar jendela browser < 768px — dipertahankan sebagai fallback UI, bukan kebutuhan utama karena target perangkat adalah satu unit PC desktop (lihat srs.md Section 3.1). |
| Breadcrumb | Disabled | Tidak diaktifkan karena struktur menu dangkal (maksimal 1 sub-halaman). |

### 3.2 Hierarki Navigasi

```
/login (publik)
   └─→ /buku (setelah login berhasil)
         ├── /buku        → modal: Tambah Buku, Edit Buku (termasuk field Lokasi Rak & Gambar Sampul)
         ├── /peminjaman
         ├── /pengembalian → modal konfirmasi (termasuk Panel Ringkasan Denda)
         ├── /riwayat      → tabel (termasuk kolom Denda)
         └── logout ──→ kembali ke /login

/ (publik, terpisah dari alur Guru)
   └─→ /login (via tombol "Login Guru")
```

### 3.3 User Navigation Flows

**NF-001: Alur Login dan Akses Sistem Guru**
- Entry: PAGE-001 (Login) → input username/password → klik "Masuk" → sistem validasi → redirect ke PAGE-003.
- Exit: PAGE-003 (Manajemen Data Buku). Related: UC-001.

**NF-002: Alur Pengelolaan Data Buku**
- Entry: PAGE-003 → klik "Tambah Buku Baru" → modal PAGE-003-SUB-01 muncul → (opsional) unggah Gambar Sampul → isi ID Buku, Judul, Penulis, Penerbit, Tema (dropdown opsional: Cerita & Dongeng / Lainnya), Tahun Terbit, **Lokasi Rak**, Tingkat Kelas (opsional, dropdown 1–6 — untuk buku pelajaran), Stok Awal → klik "Simpan" → tabel katalog terperbarui, modal tertutup.
- Exit: PAGE-003. Related: UC-002.

**NF-003: Alur Pencatatan Peminjaman Buku**
- Entry: PAGE-003 → sidebar "Peminjaman" → PAGE-004 → pilih buku (stok > 0, lokasi rak terlihat) di Panel Kiri → isi nama siswa, kelas, tanggal batas kembali di Panel Kanan → klik "Simpan Peminjaman" → stok & status buku terupdate otomatis (F007) → form ter-reset.
- Exit: PAGE-004. Related: UC-003.

**NF-004: Alur Pencatatan Pengembalian Buku**
- Entry: PAGE-004 → sidebar "Pengembalian" → PAGE-005 → pilih transaksi aktif → klik "Proses Pengembalian" → form konfirmasi (pilih kondisi buku) → sistem menghitung dan menampilkan Panel Ringkasan Denda secara otomatis → klik "Konfirmasi" → status buku jadi "Tersedia", stok bertambah otomatis (F007), Total Denda tersimpan sebagai data immutable.
- Exit: PAGE-005. Related: UC-004.

**NF-005: Alur Monitoring Riwayat dan Keluar Aplikasi**
- Entry: PAGE-005 → sidebar "Riwayat" → PAGE-006 → filter/cari riwayat, tinjau Badge Denda per transaksi → User Menu dropdown → klik "Keluar" → kembali ke PAGE-001.
- Exit: PAGE-001. Related: UC-005, UC-001.

**NF-006: Alur Akses Siswa (Publik)**
- Entry: PAGE-002 → siswa buka `/` → lihat daftar buku, lokasi rak & status → gunakan kolom pencarian → lihat detail lokasi rak dan stok/status buku yang dicari.
- Exit: tetap di PAGE-002. Related: UC-006.

### 3.4 Indikator Visual Navigasi
- Badge merah pada menu/tabel untuk buku dengan stok 0.
- Badge merah pada baris transaksi yang melewati batas pengembalian.
- Badge hijau/kuning pada tabel Riwayat untuk status "Sudah Dikembalikan" / "Masih Dipinjam".
- Badge Denda (merah, ikon `CircleDollarSign`) pada tabel Riwayat (PAGE-006) dan Tabel Peminjaman Aktif setelah diproses (PAGE-005), muncul hanya jika Total Denda > 0.
- Label/chip berisi kode Lokasi Rak (misal "A1") ditampilkan konsisten di setiap tempat buku ditampilkan: katalog Guru, form peminjaman, dan halaman publik siswa.

---

## 4. REVISION HISTORY

| Version | Date | Description |
|---|---|---|
| — (tanpa versi eksplisit) | 2026-07-01 s.d. 2026-07-08 | Draft dan revisi bertahap mengikuti SRS v3.0 s.d. v3.3. |
| Sinkron v3.4 | 2026-07-09 | Sinkronisasi penuh dengan srs.md v3.4 (deployment single-PC lokal). |
| **Sinkron v3.5** | **2026-07-10** | **Tambah field Tingkat Kelas (opsional) pada Content Hierarchy Manajemen Data Buku — Level 3 (Section 1.3), tambah Baris Kategori Filter (Semua / Kelas 1–6 / Tema) pada Content Hierarchy Akses Publik Siswa — Level 1 (Section 1.3), update Page Definitions PAGE-002 dan PAGE-003 (Section 2.2) untuk menyebut field/filter baru — sinkron dengan srs.md v3.5.** |
| **Sinkron v3.6** | **2026-07-11** | **Ubah Tema dari teks bebas menjadi dropdown opsional tertutup (Cerita & Dongeng / Lainnya); aturan mutually exclusive dengan Tingkat Kelas:** (1) update Content Hierarchy Level 3 — Tema jadi dropdown, tambah aturan mutually exclusive; (2) update Content Hierarchy Akses Publik — Baris Kategori Filter jadi 4 nilai; (3) update PAGE-002 Notes — filter tema spesifik; (4) update PAGE-003 Notes — Tema dropdown + mutually exclusive; (5) update NF-002 — Tema dropdown, Tingkat Kelas untuk buku pelajaran. Sinkron dengan srs.md v3.6. |
| **Sinkron v3.7** | **2026-07-11** | **Tambah tombol "Export ke Excel" (filter bulan/tahun) pada Content Hierarchy Riwayat Level 1 dan PAGE-006 Notes — sinkron dengan srs.md v3.7 (fitur Export Riwayat).** |