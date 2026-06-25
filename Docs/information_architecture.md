Information Architecture (IA) - Source of Truth #2
Document Version: v1.0
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-06-25
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

### 1. DOCUMENT OVERVIEW
1.1 Purpose
Dokumen ini mendefinisikan Arsitektur Informasi (IA) dari Sistem Informasi Perpustakaan SD Negeri Tamanan (Web-Based LMS). IA ini berfungsi sebagai Source of Truth #2 (SoT-2) yang diturunkan secara langsung dari SoT-1 (SRS v1.0).

Dokumen ini digunakan sebagai landasan mutlak untuk:

Merancang High-Fidelity Prototype (SoT-5).
Menentukan struktur halaman pada implementasi Frontend.
Membangun navigasi antarmuka yang konsisten dan responsif.
Menentukan struktur routing pada aplikasi web (URL mapping).
Memetakan relasi antar-layar dan aliran informasi yang efisien untuk Guru dan Siswa.

1.2 Related Sources of Truth
ArtifactReferenceDescriptionSoT-1SRS v1.0Spesifikasi Kebutuhan Perangkat Lunak dasar.SoT-3Design SystemPanduan token visual, warna, tipografi, dan komponen UI.SoT-4User FlowsDetail langkah operasional per use-case.SoT-5HiFi PrototypeRepresentasi visual interaktif akhir.

### 2. PRODUCT STRUCTURE
2.1 Product Modules
Module IDModule NameDescriptionM001AuthenticationMengatur keamanan akses masuk dan keluar sistem untuk aktor Guru.M002Manajemen Data BukuModul pengelolaan katalog buku perpustakaan: menambah, mengubah, menghapus, dan mencari data buku.M003Transaksi PeminjamanModul pencatatan peminjaman buku oleh siswa yang dikelola oleh guru.M004Transaksi PengembalianModul pencatatan pengembalian buku beserta kondisi dan pengecekan keterlambatan.M005Riwayat PeminjamanModul rekap historis seluruh transaksi peminjaman dan pengembalian untuk monitoring guru.M006Akses Publik SiswaHalaman publik tanpa login untuk siswa melihat ketersediaan dan mencari buku.

2.2 Module Hierarchy
textSistem Informasi Perpustakaan SDN Tamanan (Root)
├── M001: Authentication
│   └── Halaman Login
├── M006: Akses Publik Siswa (Landing Page Publik)
│   ├── Daftar Buku & Status Ketersediaan
│   └── Pencarian Buku (Judul / Tema)
├── M002: Manajemen Data Buku (Authenticated)
│   ├── Tabel Katalog Buku
│   ├── Form Tambah Buku Baru (Modal Overlay)
│   └── Form Edit Data Buku (Modal Overlay)
├── M003: Transaksi Peminjaman (Authenticated)
│   ├── Daftar Buku Tersedia
│   └── Form Catat Peminjaman
├── M004: Transaksi Pengembalian (Authenticated)
│   ├── Daftar Peminjaman Aktif (Belum Dikembalikan)
│   └── Form Catat Pengembalian
└── M005: Riwayat Peminjaman (Authenticated)
    ├── Tabel Riwayat Seluruh Transaksi
    └── Filter & Pencarian Riwayat

### 3. SITE MAP
3.1 Navigation Tree
PAGE-001: Login (Tanpa Sidebar - Akses Publik / Unauthenticated)
PAGE-002: Ketersediaan Buku / Halaman Publik (Landing Page tanpa login untuk Siswa)
PAGE-003: Manajemen Data Buku (Halaman Utama setelah Login Guru)
PAGE-003-SUB-01: Form Tambah Buku Baru (Modal Triggered)
PAGE-003-SUB-02: Form Edit Data Buku (Modal Triggered)
PAGE-004: Catat Peminjaman
PAGE-005: Catat Pengembalian
PAGE-006: Riwayat Peminjaman

3.2 Navigation Type
NavigationTypeBehaviorMain MenuSidebar NavigationBerada permanen di sisi kiri layar pada resolusi Desktop/Tablet. Dapat diciutkan (collapsible) untuk memaksimalkan area kerja Guru. Hanya ditampilkan setelah Guru berhasil login.User MenuTop-Right DropdownBerisi informasi nama Guru aktif dan tombol "Keluar" (Logout).Mobile/Tablet NavigationTop Hamburger MenuSidebar akan disembunyikan dan diakses via tombol hamburger jika lebar layar menyusut di bawah 768px (Responsiveness rule).BreadcrumbDisabledTidak diaktifkan karena struktur menu sangat dangkal (maksimal 1 tingkat sub-halaman) guna efisiensi fokus layar.

### 4. PAGE INVENTORY
Page IDPage NameModuleAccess RoleURL PathPAGE-001LoginM001Tamu / Guest/loginPAGE-002Ketersediaan Buku (Publik)M006Publik (Siswa & Guru)/PAGE-003Manajemen Data BukuM002Guru (Authenticated)/bukuPAGE-004Catat PeminjamanM003Guru (Authenticated)/peminjamanPAGE-005Catat PengembalianM004Guru (Authenticated)/pengembalianPAGE-006Riwayat PeminjamanM005Guru (Authenticated)/riwayat

### 5. PAGE DEFINITIONS
# Page ID: PAGE-001
Page Name: Login
Purpose: Memverifikasi identitas Guru untuk mencegah akses tidak sah ke fitur pengelolaan perpustakaan.
Entry Points:
Mengakses URL /login secara langsung.
Mengakses halaman yang memerlukan autentikasi tanpa sesi aktif (redirect otomatis).
Sesi login guru habis (idle timeout 30 menit).
Exit Points:
Berhasil login → diarahkan otomatis ke /buku (PAGE-003).
Related User Flows: UC-001: Login Guru
Child Pages: None.
Required Permissions: Publik / Tanpa Autentikasi.
Notes: Layar minimalis tanpa sidebar menu. Menampilkan form input username, password, dan tombol "Masuk".

# Page ID: PAGE-002
Page Name: Ketersediaan Buku (Publik)
Purpose: Menyediakan akses mandiri bagi siswa untuk melihat status ketersediaan buku dan mencari buku tanpa perlu login.
Entry Points:
Mengakses URL root (/) aplikasi secara langsung oleh siswa.
Tautan publik yang dibagikan kepada siswa.
Exit Points:
Klik tombol "Login Guru" → diarahkan ke /login (PAGE-001).
Related User Flows: UC-006: Siswa Melihat Ketersediaan Buku
Child Pages: None.
Required Permissions: Publik / Tanpa Autentikasi.
Notes: Halaman bersifat read-only sepenuhnya. Menampilkan tabel daftar buku dengan kolom Judul, Penulis, Tema, Stok Tersedia, dan Status Buku. Dilengkapi kolom pencarian berdasarkan judul atau tema. Tidak menampilkan data identitas peminjam.

# Page ID: PAGE-003
Page Name: Manajemen Data Buku
Purpose: Menyediakan antarmuka utama guru untuk mengelola seluruh katalog buku perpustakaan secara penuh.
Entry Points:
Setelah sukses login dari PAGE-001.
Klik menu "Data Buku" pada Sidebar.
Exit Points:
Klik menu lain di Sidebar.
Klik "Keluar" di User Menu → diarahkan ke /login (PAGE-001).
Related User Flows: UC-002: Manajemen Data Buku
Child Pages:

PAGE-003-SUB-01: Form Tambah Buku Baru (Ditampilkan dalam bentuk Modal Dialog di atas halaman utama).
PAGE-003-SUB-02: Form Edit Data Buku (Ditampilkan dalam bentuk Modal Dialog di atas halaman utama).

Required Permissions: Guru (Authenticated).
Notes: Menampilkan tabel katalog buku interaktif dengan kolom ID Buku, Judul, Penulis, Tema, Tahun Terbit, Stok, Status, dan kolom Aksi (Edit / Hapus). Dilengkapi tombol "Tambah Buku Baru" dan kolom pencarian. Indikator visual (badge merah) untuk buku dengan stok 0.


# Page ID: PAGE-004
Page Name: Catat Peminjaman
Purpose: Menyediakan antarmuka bagi guru untuk mencatat transaksi peminjaman buku oleh siswa secara cepat dan akurat.
Entry Points:
Klik menu "Peminjaman" pada Sidebar.
Exit Points:
Klik menu lain di Sidebar.
Related User Flows: UC-003: Pencatatan Peminjaman Buku
Child Pages: None.
Required Permissions: Guru (Authenticated).
Notes: Halaman terbagi menjadi dua panel: Panel Kiri menampilkan daftar buku yang tersedia (stok > 0), Panel Kanan menampilkan form isian data peminjam (nama siswa, kelas) dan detail transaksi (tanggal pinjam otomatis, tanggal batas kembali). Buku dengan stok 0 ditampilkan dalam kondisi non-selectable (disabled) dengan badge "Stok Habis".

# Page ID: PAGE-005
Page Name: Catat Pengembalian
Purpose: Menyediakan antarmuka bagi guru untuk memproses pengembalian buku, mencatat kondisi buku, dan memperbarui stok secara otomatis.
Entry Points:
Klik menu "Pengembalian" pada Sidebar.
Exit Points:
Klik menu lain di Sidebar.
Related User Flows: UC-004: Pencatatan Pengembalian Buku
Child Pages: None.
Required Permissions: Guru (Authenticated).
Notes: Menampilkan daftar transaksi peminjaman yang masih aktif (belum dikembalikan). Setiap baris dilengkapi informasi nama siswa, kelas, judul buku, tanggal pinjam, tanggal batas kembali, dan indikator keterlambatan (warna merah jika melewati batas). Tombol "Proses Pengembalian" membuka form konfirmasi kondisi buku (Baik / Rusak Ringan / Rusak Berat).


# Page ID: PAGE-006
Page Name: Riwayat Peminjaman
Purpose: Menampilkan rekap historis seluruh transaksi peminjaman dan pengembalian buku untuk keperluan monitoring dan pelaporan guru.
Entry Points:
Klik menu "Riwayat" pada Sidebar.
Exit Points:
Klik menu lain di Sidebar.
Related User Flows: UC-005: Melihat Riwayat Peminjaman
Child Pages: None.
Required Permissions: Guru (Authenticated).
Notes: Menampilkan tabel riwayat lengkap dengan kolom Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Tanggal Batas Kembali, Tanggal Kembali Aktual, Kondisi Buku, dan Status (Sudah Dikembalikan / Masih Dipinjam). Dilengkapi filter pencarian berdasarkan nama siswa, judul buku, dan rentang tanggal. Data bersifat read-only.


### 6. USER NAVIGATION FLOWS
# Flow NF-001: Alur Login dan Akses Sistem Guru
Entry Page: PAGE-001 (Login)
Navigation Path:
PAGE-001 (Buka halaman /login)
PAGE-001 (Input username dan password)
PAGE-001 (Klik tombol "Masuk")
Sistem memvalidasi kredensial
PAGE-003 (Diarahkan otomatis ke halaman Manajemen Data Buku)
Exit Page: PAGE-003 (Manajemen Data Buku)
Related User Flows: UC-001

# Flow NF-002: Alur Pengelolaan Data Buku
Entry Page: PAGE-003 (Manajemen Data Buku)
Navigation Path:
PAGE-003 (Halaman Manajemen Data Buku)
Klik tombol "Tambah Buku Baru"
PAGE-003-SUB-01 (Modal Form Tambah Buku Muncul)
Isi ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Stok Awal
Klik "Simpan"
PAGE-003 (Tabel Katalog Terperbarui, Modal Tertutup)
Exit Page: PAGE-003 (Manajemen Data Buku)
Related User Flows: UC-002

# Flow NF-003: Alur Pencatatan Peminjaman Buku
Entry Page: PAGE-003 (Manajemen Data Buku)
Navigation Path:
PAGE-003 (Manajemen Data Buku)
Sidebar Navigation (Klik "Peminjaman")
PAGE-004 (Halaman Catat Peminjaman)
Panel Kiri: Pilih buku yang akan dipinjam (stok > 0)
Panel Kanan: Isi nama siswa, kelas, dan tanggal batas kembali
Klik "Simpan Peminjaman"
Sistem memperbarui stok dan status buku menjadi "Dipinjam"
PAGE-004 (Form ter-reset, siap untuk transaksi berikutnya)
Exit Page: PAGE-004 (Catat Peminjaman)
Related User Flows: UC-003

# Flow NF-004: Alur Pencatatan Pengembalian Buku
Entry Page: PAGE-004 (Catat Peminjaman)
Navigation Path:
PAGE-004 (Catat Peminjaman)
Sidebar Navigation (Klik "Pengembalian")
PAGE-005 (Halaman Catat Pengembalian)
Pilih transaksi peminjaman aktif dari daftar
Klik tombol "Proses Pengembalian"
Form konfirmasi muncul: pilih kondisi buku (Baik / Rusak Ringan / Rusak Berat)
Klik "Konfirmasi"
Sistem memperbarui status buku menjadi "Tersedia" dan stok bertambah
PAGE-005 (Daftar peminjaman aktif terperbarui)
Exit Page: PAGE-005 (Catat Pengembalian)
Related User Flows: UC-004

# Flow NF-005: Alur Monitoring Riwayat dan Keluar Aplikasi
Entry Page: PAGE-005 (Catat Pengembalian)
Navigation Path:
PAGE-005 (Catat Pengembalian)
Sidebar Navigation (Klik "Riwayat")
PAGE-006 (Halaman Riwayat Peminjaman)
Filter/cari riwayat berdasarkan nama siswa atau rentang tanggal
Top-Right User Menu (Klik Dropdown)
Klik "Keluar"
PAGE-001 (Kembali ke Halaman Login)
Exit Page: PAGE-001 (Login)
Related User Flows: UC-005, UC-001
Flow NF-006: Alur Akses Siswa (Publik)
Entry Page: PAGE-002 (Ketersediaan Buku - Publik)
Navigation Path:
PAGE-002 (Siswa membuka URL root "/" aplikasi)
PAGE-002 (Melihat daftar buku beserta status ketersediaan)
PAGE-002 (Menggunakan kolom pencarian untuk mencari buku berdasarkan judul/tema)
PAGE-002 (Melihat detail stok dan status buku yang dicari)
Exit Page: PAGE-002 (Tetap di halaman publik)
Related User Flows: UC-006


### 7. CONTENT HIERARCHY
7.1 Module: Manajemen Data Buku

Level 1 (Halaman Master Katalog):
Judul Halaman: "Data Buku Perpustakaan".
Tombol Utama: "Tambah Buku Baru".
Kolom Pencarian Buku (Judul / Tema).

Level 2 (Tabel Data Katalog):
Tabel Buku (ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Stok, Status, Aksi).
Status Badge Stok (Hijau: Tersedia, Merah: Stok Habis).
Tombol Aksi per baris: "Edit" dan "Hapus".

Level 3 (Modal Form Tambah / Edit Buku):
Field Input ID Buku (Alfanumerik, Unik).
Field Input Judul Buku (Teks).
Field Input Penulis (Teks).
Field Input Penerbit (Teks).
Field Input Tema/Kategori Buku (Teks).
Field Input Tahun Terbit (Numerik).
Field Input Stok Awal (Integer ≥ 0).
Tombol "Batal" dan "Simpan".


7.2 Module: Transaksi Peminjaman

Level 1 (Halaman Catat Peminjaman):

Judul Halaman: "Catat Peminjaman Buku".
Panel Kiri: Daftar Buku Tersedia (stok > 0).
Panel Kanan: Form Data Peminjaman.


Level 2 (Detail Buku & Form Isian):
Kartu Buku (Judul, Penulis, Tema, Badge Stok Tersedia).
Field Input Nama Siswa (Teks).
Field Input Kelas Siswa (Teks).
Field Tanggal Pinjam (Otomatis terisi, non-editable).
Field Input Tanggal Batas Pengembalian (Date Picker).


Level 3 (Aksi & Konfirmasi):
Ringkasan Data Peminjaman (Nama Siswa, Buku, Tanggal).
Tombol "Batal" dan "Simpan Peminjaman".

7.3 Module: Transaksi Pengembalian
Level 1 (Halaman Daftar Peminjaman Aktif):
Judul Halaman: "Catat Pengembalian Buku".
Daftar peminjaman yang belum dikembalikan.

Level 2 (Detail Transaksi Aktif):
Tabel Peminjaman Aktif (Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Batas Kembali).
Indikator Keterlambatan (Badge merah dengan jumlah hari terlambat jika melewati batas).
Tombol "Proses Pengembalian" per baris.

Level 3 (Form Konfirmasi Pengembalian):
Ringkasan data peminjaman yang diproses.
Field Tanggal Pengembalian (Otomatis terisi, non-editable).
Pilihan Kondisi Buku: Baik / Rusak Ringan / Rusak Berat (Radio Button).
Informasi keterlambatan (jika ada) dalam jumlah hari.
Tombol "Batal" dan "Konfirmasi Pengembalian".

7.4 Module: Riwayat Peminjaman

Level 1 (Halaman Riwayat):
Judul Halaman: "Riwayat Peminjaman".
Filter Pencarian (Nama Siswa, Judul Buku, Rentang Tanggal).

Level 2 (Tabel Riwayat Transaksi):
Tabel Riwayat (Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Batas Kembali, Tanggal Kembali Aktual, Kondisi Buku, Status).
Badge Status: Hijau (Sudah Dikembalikan), Kuning (Masih Dipinjam).

7.5 Module: Akses Publik Siswa

Level 1 (Halaman Ketersediaan Buku):
Judul Halaman: "Perpustakaan SD Negeri Tamanan".
Kolom Pencarian Buku (Judul / Tema).
Tombol "Login Guru" di pojok kanan atas.

Level 2 (Daftar Buku):
Tabel Buku (Judul, Penulis, Tema, Stok Tersedia, Status Buku).
Badge Status: Hijau (Tersedia), Merah (Dipinjam / Stok Habis).

8. ROUTING CONVENTIONS
Sistem menggunakan Client-Side Routing yang bersih dan ramah pengguna (human-readable URLs).

Page IDRouteAccess TypeFallback/Redirect RulesPAGE-001/loginPublic / GuestJika guru sudah login, mengakses /login akan me-redirect otomatis ke /buku.PAGE-002/Public / GuestHalaman publik, dapat diakses oleh siapapun tanpa autentikasi.PAGE-003/bukuAuthenticatedJika sesi habis atau tidak valid, redirect otomatis ke /login.PAGE-004/peminjamanAuthenticatedJika sesi habis atau tidak valid, redirect otomatis ke /login.PAGE-005/pengembalianAuthenticatedJika sesi habis atau tidak valid, redirect otomatis ke /login.PAGE-006/riwayatAuthenticatedJika sesi habis atau tidak valid, redirect otomatis ke /login.-/redirector-Jika ada sesi aktif → /buku, jika tidak ada → /login.-* (Any other)404 PageMenampilkan pesan "Halaman Tidak Ditemukan" dan menyediakan tombol kembali ke /.

9. TRACEABILITY MATRIX (SRS v1.0 → IA v1.0)
Untuk menjamin kepatuhan Chain of Truth, setiap komponen arsitektur informasi dipetakan kembali ke ID Fitur dari spesifikasi kebutuhan sistem.
Feature IDFeature NameMapped Page IDMapped Navigation / RouteF001Autentikasi Guru (Login)PAGE-001/loginF002Manajemen Data BukuPAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02/bukuF003Pencatatan Transaksi Peminjaman BukuPAGE-004/peminjamanF004Pencatatan Pengembalian BukuPAGE-005/pengembalianF005Riwayat Peminjaman dan PengembalianPAGE-006/riwayatF006Akses Ketersediaan Buku untuk Siswa (Publik)PAGE-002/