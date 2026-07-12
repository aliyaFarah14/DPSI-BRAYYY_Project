# Test Case Specification

Document Version: v0.2

Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)

Status: Draft
Last Updated: 2026-07-12
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan test case untuk seluruh fitur sistem Aplikasi Perpustakaan Berbasis Web. Test case diturunkan dari Test Plan, Software Requirements Specification (SRS), dan User Flow Specifications untuk memastikan setiap kebutuhan fungsional terverifikasi sesuai strategi pengujian yang telah ditetapkan.

## 1.2 Scope

Mencakup test case untuk:
- F001: Autentikasi Guru (Login) — UC-001
- F002: Manajemen Data Buku — UC-002
- F003: Pencatatan Peminjaman Buku (memicu F007) — UC-003
- F004: Pencatatan Pengembalian Buku (memicu F007) — UC-004
- F005: Riwayat Peminjaman + Export Excel — UC-005, FR-032
- F006: Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik) — UC-006

## 1.3 References

| Document | Version | Location |
| --- | --- | --- |
| Test Plan | v0.2 | `docs/test_plan.md` |
| Software Requirements Specification (SRS) | v3.7 | `docs/srs.md` |
| User Flow Specifications | v1.3 | `docs/user_flows/` |
| System Logic Specifications | v1.4 | `docs/system_logic/` |
| Design System | v1.8 | `docs/design_system.md` |
| Information Architecture | v3.7 | `docs/information_architecture.md` |
| Class Diagram | v1.1 | `docs/class_diagram.md` |

## 1.4 Test Case Format

| Field | Description |
| --- | --- |
| **TC ID** | Test Case Identifier (format: TC-FXXX-NNN) |
| **Related UC** | Use Case ID dari user flow |
| **Related Feature** | Feature ID dari SRS |
| **Test Scenario** | Deskripsi skenario pengujian |
| **Preconditions** | Kondisi yang harus terpenuhi sebelum test |
| **Test Data** | Data yang digunakan dalam pengujian |
| **Test Steps** | Langkah-langkah pengujian |
| **Expected Result** | Hasil yang diharapkan |
| **Type** | Positif / Negatif / Exception |

---

# 2. TEST CASE INDEX

| TC ID | Feature | Use Case | Scenario |
| --- | --- | --- | --- |
| TC-F001-001 | F001 | UC-001 | Login Berhasil |
| TC-F001-002 | F001 | UC-001 | Login Gagal — Kredensial Salah |
| TC-F001-003 | F001 | UC-001 | Login Gagal — Input Kosong |
| TC-F001-004 | F001 | UC-001 | Login — Server Tidak Dapat Dihubungi |
| TC-F001-005 | F001 | UC-001 | Login — Sesi Sudah Aktif |
| TC-F001-006 | F001 | UC-001 | Sesi Berakhir Karena Idle Timeout |
| TC-F001-007 | F001 | UC-001 | Akses Halaman Terproteksi Tanpa Sesi |
| TC-F001-008 | F001 | UC-001 | Aksi Form dengan Sesi Kedaluwarsa (401) |
| TC-F002-001 | F002 | UC-002 | Tambah Buku Baru Berhasil |
| TC-F002-002 | F002 | UC-002 | Membatalkan Penambahan Buku |
| TC-F002-003 | F002 | UC-002 | Input Tidak Lengkap |
| TC-F002-004 | F002 | UC-002 | ID Buku Duplikat |
| TC-F002-005 | F002 | UC-002 | Lokasi Rak Format Salah |
| TC-F002-006 | F002 | UC-002 | Stok Negatif |
| TC-F002-007 | F002 | UC-002 | Edit Buku Berhasil |
| TC-F002-008 | F002 | UC-002 | Hapus Buku Berhasil |
| TC-F002-009 | F002 | UC-002 | Hapus Buku Gagal — Sedang Dipinjam |
| TC-F002-010 | F002 | UC-002 | Cari Buku |
| TC-F002-011 | F002 | UC-002 | Unggah Gambar Sampul |
| TC-F002-012 | F002 | UC-002 | Tambah Buku — Persistensi Setelah Refresh Halaman |
| TC-F002-013 | F002 | UC-002 | Tambah Buku Gagal — Sesi Kedaluwarsa (401) |
| TC-F003-001 | F003 | UC-003 | Peminjaman Berhasil |
| TC-F003-002 | F003 | UC-003 | Batalkan Peminjaman |
| TC-F003-003 | F003 | UC-003 | Pilih Buku Stok 0 (Habis) |
| TC-F003-004 | F003 | UC-003 | Cari Buku di Daftar Peminjaman |
| TC-F003-005 | F003 | UC-003 | Input Siswa Kosong |
| TC-F003-006 | F003 | UC-003 | Tanggal Kembali Sebelum Tanggal Pinjam |
| TC-F003-007 | F003 | UC-003 | Stok Berkurang Setelah Peminjaman (F007) |
| TC-F004-001 | F004 | UC-004 | Pengembalian Berhasil — Tepat Waktu, Kondisi Baik |
| TC-F004-002 | F004 | UC-004 | Pengembalian Terlambat dengan Denda |
| TC-F004-003 | F004 | UC-004 | Pengembalian dengan Kondisi Rusak |
| TC-F004-004 | F004 | UC-004 | Batalkan Pengembalian |
| TC-F004-005 | F004 | UC-004 | Stok Bertambah Setelah Pengembalian (F007) |
| TC-F004-006 | F004 | UC-004 | Pengembalian Tepat Waktu — Kondisi Baik — Total Denda = 0 |
| TC-F004-007 | F004 | UC-004 | Pengembalian Terlambat — Kondisi Rusak Ringan — Denda Kombinasi |
| TC-F004-008 | F004 | UC-004 | Pengembalian — Kondisi Rusak Berat — Status Tersedia (Regresi) |
| TC-F004-009 | F004 | UC-004 | Pengembalian Gagal — ID Peminjaman Sudah Dikembalikan |
| TC-F005-001 | F005 | UC-005 | Melihat Riwayat Transaksi |
| TC-F005-002 | F005 | UC-005 | Cari Riwayat Berdasarkan Nama Siswa |
| TC-F005-003 | F005 | UC-005 | Cari Riwayat Berdasarkan Judul Buku |
| TC-F005-004 | F005 | UC-005 | Filter Riwayat Berdasarkan Rentang Tanggal |
| TC-F005-005 | F005 | UC-005 | Tidak Ada Data Riwayat |
| TC-F005-006 | F005 | UC-005 | Denda Ditampilkan di Riwayat |
| TC-F005-007 | F005 | UC-005 | Export Excel Berhasil — Ada Data |
| TC-F005-008 | F005 | UC-005 | Export Excel — Tidak Ada Data |
| TC-F005-009 | F005 | UC-005 | Export Excel — Batasan Filter Bulan/Tahun |
| TC-F006-001 | F006 | UC-006 | Lihat Katalog Publik |
| TC-F006-002 | F006 | UC-006 | Cari Buku di Halaman Publik |
| TC-F006-003 | F006 | UC-006 | Buku Stok 0 Muncul Sebagai "Stok Habis" |
| TC-F006-004 | F006 | UC-006 | Data Peminjam Tidak Ditampilkan |
| TC-F006-005 | F006 | UC-006 | Filter Kategori — Kelas N Menampilkan Buku Tingkat Kelas N dan Tanpa Kelas |
| TC-F006-006 | F006 | UC-006 | Filter Kategori — Lainnya Menampilkan Tema Lainnya atau Tanpa Kategori |
| TC-F006-007 | F006 | UC-006 | Konsistensi Data — Katalog Publik vs Manajemen Buku |
| TC-F006-008 | F006 | UC-006 | Badge "Stok Habis" untuk Buku dengan Stok = 0 |

---

# 3. TEST CASES

## 3.1 Feature F001: Autentikasi Guru (Login)

### UC-001: Login Guru

---

#### TC-F001-001: Login Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-001 |
| **Related UC** | UC-001 |
| **Related Feature** | F001 |
| **Test Scenario** | Guru berhasil login dengan username dan password yang valid |
| **Preconditions** | Akun Guru terdaftar di sistem, aplikasi berjalan di browser |
| **Test Data** | Username: `admin`, Password: `admin123` |
| **Test Steps** | 1. Buka aplikasi di browser<br>2. Sistem menampilkan halaman publik `/`<br>3. Klik tombol "Login Guru" di pojok kanan atas<br>4. Sistem menampilkan halaman Login `/login`<br>5. Masukkan username `admin`<br>6. Masukkan password `admin123`<br>7. Klik tombol "Masuk" |
| **Expected Result** | 1. Sistem memvalidasi input (tidak kosong)<br>2. Sistem memverifikasi kredensial<br>3. Login berhasil<br>4. Redirect ke halaman `/buku` (Manajemen Buku)<br>5. Sidebar navigasi Guru ditampilkan |
| **Type** | Positif |

---

#### TC-F001-002: Login Gagal — Kredensial Salah

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-002 |
| **Related UC** | UC-001 (AF-001) |
| **Related Feature** | F001 |
| **Test Scenario** | Guru memasukkan username atau password yang salah |
| **Preconditions** | Akun Guru terdaftar, halaman Login ditampilkan |
| **Test Data** | Username: `admin`, Password: `salah123` |
| **Test Steps** | 1. Buka halaman Login<br>2. Masukkan username `admin`<br>3. Masukkan password `salah123`<br>4. Klik tombol "Masuk" |
| **Expected Result** | 1. Sistem memverifikasi kredensial<br>2. Sistem menolak dengan pesan error "Password salah" (atau "Username atau password salah")<br>3. Guru tetap di halaman Login |
| **Type** | Negatif |

---

#### TC-F001-003: Login Gagal — Input Kosong

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-003 |
| **Related UC** | UC-001 (AF-002) |
| **Related Feature** | F001 |
| **Test Scenario** | Guru mengklik tombol "Masuk" tanpa mengisi username atau password |
| **Preconditions** | Halaman Login ditampilkan |
| **Test Data** | Username: (kosong), Password: (kosong) |
| **Test Steps** | 1. Buka halaman Login<br>2. Biarkan field username kosong<br>3. Biarkan field password kosong<br>4. Klik tombol "Masuk" |
| **Expected Result** | 1. Sistem menampilkan validasi error "Username wajib diisi."<br>2. Sistem menampilkan validasi error "Password wajib diisi."<br>3. Form tidak ter-submit |
| **Type** | Negatif |

---

#### TC-F001-004: Login — Server Tidak Dapat Dihubungi

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-004 |
| **Related UC** | UC-001 (EF-001) |
| **Related Feature** | F001 |
| **Test Scenario** | Backend server atau database tidak dapat diakses |
| **Preconditions** | Server dalam kondisi offline |
| **Test Data** | Username: `admin`, Password: `admin123` |
| **Test Steps** | 1. Buka halaman Login<br>2. Masukkan username dan password valid<br>3. Klik tombol "Masuk" |
| **Expected Result** | 1. Sistem mencoba mengirim request ke backend<br>2. Sistem mendapat error koneksi atau timeout<br>3. Sistem menampilkan pesan error "Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi." |
| **Type** | Exception |

---

#### TC-F001-005: Login — Sesi Sudah Aktif

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-005 |
| **Related UC** | UC-001 (EF-002) |
| **Related Feature** | F001 |
| **Test Scenario** | Guru sudah login dan mencoba mengakses halaman login |
| **Preconditions** | Guru sudah memiliki sesi login aktif |
| **Test Data** | - |
| **Test Steps** | 1. Dalam keadaan sudah login<br>2. Akses URL `/login` |
| **Expected Result** | 1. Sistem mendeteksi sesi aktif<br>2. Redirect otomatis ke halaman `/buku` |
| **Type** | Exception |

---

#### TC-F001-006: Sesi Berakhir Karena Idle Timeout

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-006 |
| **Related UC** | UC-001 (EF-003) |
| **Related Feature** | F001 |
| **Test Scenario** | Sesi Guru berakhir setelah 30 menit tidak ada aktivitas |
| **Preconditions** | Guru sudah login, tidak ada interaksi selama 30 menit |
| **Test Data** | - |
| **Test Steps** | 1. Login ke sistem<br>2. Biarkan aplikasi tanpa interaksi selama ~28 menit<br>3. Sistem menampilkan peringatan "Sesi akan berakhir. Perpanjang?"<br>4. Pilih "Tetap di Sini" atau biarkan hingga 30 menit |
| **Expected Result** | 1. Setelah 28 menit: warning toast muncul dengan tombol "Tetap di Sini"<br>2. Jika memilih "Tetap di Sini": sesi diperpanjang 30 menit<br>3. Jika tidak merespon hingga 30 menit: sesi berakhir, redirect ke `/login?timeout=1`<br>4. Halaman login menampilkan banner "Sesi Anda telah berakhir. Silakan masuk kembali." |
| **Type** | Exception |

---

#### TC-F001-007: Akses Halaman Terproteksi Tanpa Sesi

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-007 |
| **Related UC** | UC-001 (EF-004) |
| **Related Feature** | F001 |
| **Test Scenario** | Pengguna tanpa sesi valid mencoba mengakses halaman admin langsung via URL |
| **Preconditions** | Belum login (localStorage tidak menyimpan data sesi), aplikasi berjalan |
| **Test Data** | URL: `http://localhost:5173/buku` |
| **Test Steps** | 1. Buka browser dalam mode incognito/private<br>2. Ketik `http://localhost:5173/buku` di address bar<br>3. Tekan Enter |
| **Expected Result** | 1. Sistem tidak menampilkan halaman Manajemen Buku<br>2. Redirect otomatis ke `/login` (halaman login)<br>3. Tidak ada error JavaScript yang tampak (tidak ada halaman putih/kosong)<br>4. URL berubah menjadi `http://localhost:5173/login` |
| **Type** | Exception |

---

#### TC-F001-008: Aksi Form dengan Sesi Kedaluwarsa (401)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F001-008 |
| **Related UC** | UC-001 (EF-005) |
| **Related Feature** | F001 |
| **Test Scenario** | Guru melakukan aksi (misal: simpan buku) saat sesi sudah kedaluwarsa — sistem merespons 401 |
| **Preconditions** | Sesi sudah kedaluwarsa (cookie session_id sudah tidak valid), Guru masih di halaman admin |
| **Test Data** | Form tambah buku dengan data valid |
| **Test Steps** | 1. Login, lalu expirasi sesi secara paksa (tunggu 30 menit atau hapus cookie session_id via DevTools)<br>2. Tanpa refresh halaman, isi form tambah buku<br>3. Klik "Tambah Buku" |
| **Expected Result** | 1. Request ke backend mendapat response 401<br>2. Frontend menampilkan pesan error spesifik: "Sesi Anda telah berakhir, silakan login kembali."<br>3. Pesan berbeda dari error validasi biasa (misal: "Judul buku wajib diisi.")<br>4. Setelah dismiss, redirect ke `/login` |
| **Type** | Exception |

---

## 3.2 Feature F002: Manajemen Data Buku

### UC-002: Manajemen Data Buku

---

#### TC-F002-001: Tambah Buku Baru Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-001 |
| **Related UC** | UC-002 |
| **Related Feature** | F002 |
| **Test Scenario** | Guru menambahkan buku baru dengan data lengkap dan valid |
| **Preconditions** | 1. Guru sudah login (UC-001 selesai)<br>2. Mengakses halaman Manajemen Buku (`/buku`) |
| **Test Data** | ID Buku: `BK006`, Judul: "IPA Kelas 6", Penulis: "Sri Wahyuni", Penerbit: "Erlangga", Tema: "Pelajaran", Lokasi Rak: "A3", Stok: 5, Status: "Aktif" |
| **Test Steps** | 1. Klik tombol "Tambah Buku"<br>2. Sistem menampilkan modal form<br>3. Isi "ID Buku" = `BK006`<br>4. Isi "Judul Buku" = "IPA Kelas 6"<br>5. Isi "Penulis" = "Sri Wahyuni"<br>6. Isi "Penerbit" = "Erlangga"<br>7. Isi "Tema" = "Pelajaran"<br>8. Isi "Lokasi Rak" = "A3"<br>9. Isi "Stok" = 5<br>10. Pilih Status = "Aktif"<br>11. Klik tombol "Tambah Buku" |
| **Expected Result** | 1. Sistem memvalidasi semua input (valid)<br>2. Buku baru tersimpan ke database<br>3. Modal form tertutup<br>4. Tabel daftar buku ter-update menampilkan BK006<br>5. Buku baru muncul di halaman publik `/` |
| **Type** | Positif |

---

#### TC-F002-002: Membatalkan Penambahan Buku

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-002 |
| **Related UC** | UC-002 (AF-001) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru membatalkan proses penambahan buku |
| **Preconditions** | Modal form "Tambah Buku Baru" terbuka |
| **Test Data** | Field sudah terisi sebagian |
| **Test Steps** | 1. Isi beberapa field<br>2. Klik tombol "Batal" atau tombol X di modal |
| **Expected Result** | 1. Modal form tertutup<br>2. Data yang terisi tidak disimpan<br>3. Tabel inventaris tidak berubah |
| **Type** | Negatif |

---

#### TC-F002-003: Input Tidak Lengkap

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-003 |
| **Related UC** | UC-002 (AF-002) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru tidak mengisi salah satu field yang wajib |
| **Preconditions** | Modal form "Tambah Buku Baru" terbuka |
| **Test Data** | Judul Buku: (kosong), field lain terisi |
| **Test Steps** | 1. Isi ID Buku = `BK007`<br>2. Biarkan Judul Buku kosong<br>3. Isi field lain dengan data valid<br>4. Klik tombol "Tambah Buku" |
| **Expected Result** | 1. Sistem menampilkan pesan error "Judul buku wajib diisi." pada field Judul Buku<br>2. Form tidak ter-submit<br>3. Data tidak tersimpan |
| **Type** | Negatif |

---

#### TC-F002-004: ID Buku Duplikat

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-004 |
| **Related UC** | UC-002 (EF-001) |
| **Related Feature** | F002 |
| **Test Scenario** | ID Buku yang dimasukkan sudah terdaftar di sistem |
| **Preconditions** | Buku dengan ID `BK001` sudah terdaftar |
| **Test Data** | ID Buku: `BK001` (duplikat) |
| **Test Steps** | 1. Buka modal form "Tambah Buku Baru"<br>2. Isi ID Buku = `BK001`<br>3. Isi field lain dengan data valid<br>4. Klik tombol "Tambah Buku" |
| **Expected Result** | 1. Sistem memvalidasi ID Buku<br>2. Sistem mendeteksi duplikat<br>3. Sistem menampilkan pesan error "ID Buku sudah digunakan."<br>4. Data tidak tersimpan |
| **Type** | Negatif |

---

#### TC-F002-005: Lokasi Rak Format Salah

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-005 |
| **Related UC** | UC-002 (EF-002) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru memasukkan Lokasi Rak dengan format yang tidak sesuai |
| **Preconditions** | Modal form "Tambah Buku Baru" terbuka |
| **Test Data** | Lokasi Rak: `Rak-A-1` (format salah — harus huruf+angka seperti "A1") |
| **Test Steps** | 1. Buka modal form<br>2. Isi data buku valid<br>3. Isi Lokasi Rak = "Rak-A-1"<br>4. Klik tombol "Tambah Buku" |
| **Expected Result** | 1. Sistem memvalidasi format Lokasi Rak<br>2. Sistem menampilkan pesan error "Format rak: huruf diikuti angka (contoh: A1, RB3)."<br>3. Form tidak ter-submit |
| **Type** | Negatif |

---

#### TC-F002-006: Stok Negatif

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-006 |
| **Related UC** | UC-002 (EF-003) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru memasukkan nilai stok negatif |
| **Preconditions** | Modal form "Tambah Buku Baru" terbuka |
| **Test Data** | Stok: `-1` |
| **Test Steps** | 1. Buka modal form<br>2. Isi data buku valid<br>3. Isi Stok = `-1`<br>4. Klik tombol "Tambah Buku" |
| **Expected Result** | 1. Sistem memvalidasi stok (harus >= 0)<br>2. Sistem menampilkan pesan error "Stok harus angka >= 0."<br>3. Form tidak ter-submit |
| **Type** | Negatif |

---

#### TC-F002-007: Edit Buku Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-007 |
| **Related UC** | UC-002 |
| **Related Feature** | F002 |
| **Test Scenario** | Guru mengubah data buku yang sudah ada |
| **Preconditions** | Minimal 1 buku terdaftar |
| **Test Data** | Buku: BK001, ubah judul menjadi "Matematika Kelas 4 — Revisi" |
| **Test Steps** | 1. Klik ikon pensil (Edit) pada baris buku BK001<br>2. Sistem membuka modal form dengan data terisi<br>3. Ubah Judul Buku menjadi "Matematika Kelas 4 — Revisi"<br>4. Klik tombol "Simpan Perubahan" |
| **Expected Result** | 1. Sistem memvalidasi input<br>2. Data buku berhasil diperbarui<br>3. Modal form tertutup<br>4. Tabel menampilkan judul yang sudah diubah<br>5. Pesan sukses "Buku berhasil diperbarui." ditampilkan |
| **Type** | Positif |

---

#### TC-F002-008: Hapus Buku Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-008 |
| **Related UC** | UC-002 |
| **Related Feature** | F002 |
| **Test Scenario** | Guru menghapus buku yang sedang tidak dipinjam |
| **Preconditions** | Buku target tidak dalam status dipinjam |
| **Test Data** | Buku: BK005 (Pendidikan Agama Islam, stok 4, tidak dipinjam) |
| **Test Steps** | 1. Klik ikon sampah (Hapus) pada baris buku BK005<br>2. Sistem menampilkan dialog konfirmasi hapus<br>3. Klik tombol "Hapus" |
| **Expected Result** | 1. Sistem memeriksa status peminjaman buku<br>2. Buku tidak sedang dipinjam → hapus diizinkan<br>3. Buku dihapus dari database<br>4. Dialog konfirmasi tertutup<br>5. Buku tidak lagi muncul di tabel |
| **Type** | Positif |

---

#### TC-F002-009: Hapus Buku Gagal — Sedang Dipinjam

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-009 |
| **Related UC** | UC-002 (EF-004) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru mencoba menghapus buku yang sedang dipinjam |
| **Preconditions** | Buku target sedang dalam status dipinjam |
| **Test Data** | Buku dengan status dipinjam (jika ada) |
| **Test Steps** | 1. Klik ikon sampah (Hapus) pada baris buku yang sedang dipinjam<br>2. Sistem menampilkan dialog konfirmasi hapus<br>3. Klik tombol "Hapus" |
| **Expected Result** | 1. Sistem memeriksa status peminjaman buku<br>2. Sistem mendeteksi buku sedang dipinjam<br>3. Sistem menampilkan pesan error "Buku sedang dipinjam dan tidak dapat dihapus."<br>4. Buku tidak dihapus |
| **Type** | Negatif |

---

#### TC-F002-010: Cari Buku

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-010 |
| **Related UC** | UC-002 (AF-003) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru mencari buku berdasarkan kata kunci |
| **Preconditions** | Minimal 5 buku terdaftar dengan variasi judul |
| **Test Data** | Pencarian: "Matematika" |
| **Test Steps** | 1. Akses halaman Manajemen Buku<br>2. Perhatikan bahwa tidak ada kolom pencarian di halaman ini (pencarian tersedia di halaman lain)<br>3. Alternatif: gunakan fitur pencarian yang tersedia |
| **Expected Result** | CATATAN: Pencarian di halaman Manajemen Buku dapat dilakukan melalui filter bawaan tabel atau belum diimplementasikan — verifikasi sesuai implementasi aktual. Jika belum ada, ini adalah area pengembangan. |
| **Type** | Positif |

---

#### TC-F002-011: Unggah Gambar Sampul

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-011 |
| **Related UC** | UC-002 |
| **Related Feature** | F002 |
| **Test Scenario** | Guru mengunggah gambar sampul saat menambah/mengubah buku |
| **Preconditions** | Modal form tambah/edit buku terbuka, file gambar JPG/PNG tersedia (< 2MB) |
| **Test Data** | File: `sampul.jpg` (1MB, ukuran 500x700) |
| **Test Steps** | 1. Di modal form, klik area dropzone "Sampul Buku"<br>2. Pilih file `sampul.jpg` dari file system<br>3. Sistem menampilkan pratinjau gambar<br>4. Klik tombol "Simpan" / "Tambah Buku" |
| **Expected Result** | 1. File tervalidasi (format JPG/PNG, ukuran < 2MB)<br>2. Pratinjau gambar ditampilkan di dropzone<br>3. Gambar tersimpan sebagai file di `backend/uploads/`, path tercatat di database<br>4. Gambar muncul di kartu buku pada halaman publik `/` |
| **Type** | Positif |

---

#### TC-F002-012: Tambah Buku — Persistensi Setelah Refresh Halaman

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-012 |
| **Related UC** | UC-002 |
| **Related Feature** | F002 |
| **Test Scenario** | Buku yang baru ditambahkan tetap muncul setelah hard refresh halaman (bukan hanya optimistik UI) |
| **Preconditions** | Guru sudah login, halaman Manajemen Buku terbuka |
| **Test Data** | ID Buku: `BK010`, Judul: "Buku Uji Persistensi", Penulis: "Tester", Penerbit: "Testing", Tahun Terbit: 2025, Lokasi Rak: "Z1", Stok: 1 |
| **Test Steps** | 1. Tambah buku baru dengan data di atas (klik "Tambah Buku" → isi form → "Tambah Buku")<br>2. Tunggu pesan sukses "Buku berhasil ditambahkan."<br>3. Lakukan hard refresh browser (Ctrl+F5 atau F5)<br>4. Amati tabel daftar buku |
| **Expected Result** | 1. Setelah refresh, buku BK010 tetap muncul di tabel<br>2. Data buku (judul, penulis, stok, dll.) sesuai dengan yang diinput<br>3. Buku juga muncul di halaman publik `/` dengan data yang sama<br>4. Buku tercatat di database (`backend/data/perpustakaan.db`) — diverifikasi via SQLite Viewer |
| **Type** | Positif |

---

#### TC-F002-013: Tambah Buku Gagal — Sesi Kedaluwarsa (401)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F002-013 |
| **Related UC** | UC-002 (EF-005) |
| **Related Feature** | F002 |
| **Test Scenario** | Guru mencoba menambah buku saat sesi sudah kedaluwarsa — buku tidak tersimpan |
| **Preconditions** | Sesi sudah kedaluwarsa (cookie session_id dihapus via DevTools), modal form tambah buku terbuka |
| **Test Data** | ID Buku: `BK011`, Judul: "Buku Sesi Expired", data valid lainnya |
| **Test Steps** | 1. Login, buka halaman Manajemen Buku<br>2. Buka modal "Tambah Buku Baru" dan isi data valid<br>3. Hapus cookie `session_id` via DevTools (Application → Cookies)<br>4. Klik tombol "Tambah Buku"<br>5. Perhatikan response |
| **Expected Result** | 1. Request ke backend mendapat response 401<br>2. Sistem menampilkan pesan error spesifik: "Sesi Anda telah berakhir, silakan login kembali."<br>3. Buku BK011 **tidak** muncul di tabel (tidak tersimpan)<br>4. Redirect ke `/login` |
| **Type** | Exception |

---

## 3.3 Feature F003: Pencatatan Peminjaman Buku

### UC-003: Pencatatan Peminjaman Buku

---

#### TC-F003-001: Peminjaman Berhasil

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-001 |
| **Related UC** | UC-003 |
| **Related Feature** | F003 (memicu F007) |
| **Test Scenario** | Guru mencatat peminjaman buku oleh siswa dengan data lengkap |
| **Preconditions** | 1. Guru sudah login<br>2. Minimal 1 buku dengan stok > 0 |
| **Test Data** | Siswa: "Budi Santoso", Kelas: "4A", Buku: BK001, Tanggal Kembali: H+7 |
| **Test Steps** | 1. Akses halaman `/peminjaman`<br>2. Sistem menampilkan daftar buku (kiri) dan form data peminjaman (kanan)<br>3. Klik buku "Matematika Kelas 4" (BK001) — buku terpilih<br>4. Isi "Nama Siswa" = "Budi Santoso"<br>5. Isi "Kelas Siswa" = "4A"<br>6. "Nama Guru" terisi otomatis — tidak perlu diisi<br>7. "Tanggal Pinjam" terisi otomatis (hari ini)<br>8. Atur "Tanggal Kembali" = H+7 dari hari ini<br>9. Klik "Simpan Peminjaman"<br>10. Sistem menampilkan dialog konfirmasi<br>11. Klik "Konfirmasi & Simpan" |
| **Expected Result** | 1. Semua validasi terpenuhi<br>2. Transaksi peminjaman tersimpan<br>3. Stok BK001 berkurang 1 (F007)<br>4. Pesan sukses "Peminjaman berhasil dicatat."<br>5. Form kembali ke keadaan awal |
| **Type** | Positif |

---

#### TC-F003-002: Batalkan Peminjaman

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-002 |
| **Related UC** | UC-003 (AF-001) |
| **Related Feature** | F003 |
| **Test Scenario** | Guru membatalkan proses peminjaman sebelum konfirmasi |
| **Preconditions** | Form peminjaman sudah diisi sebagian |
| **Test Data** | - |
| **Test Steps** | 1. Isi form peminjaman<br>2. Klik "Batal" di dialog konfirmasi (jika dialog sudah muncul)<br>3. Atau klik tombol X / navigasi ke halaman lain |
| **Expected Result** | 1. Dialog konfirmasi tertutup<br>2. Data peminjaman tidak tersimpan<br>3. Form tetap terisi (data tidak hilang) |
| **Type** | Negatif |

---

#### TC-F003-003: Pilih Buku Stok 0 (Habis)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-003 |
| **Related UC** | UC-003 (AF-002) |
| **Related Feature** | F003 |
| **Test Scenario** | Buku dengan stok 0 tidak muncul di daftar pilihan |
| **Preconditions** | Ada buku dengan stok = 0 (misal BK003 — Dongeng Nusantara) |
| **Test Data** | Buku: BK003 (Dongeng Nusantara), Stok: 0 |
| **Test Steps** | 1. Akses halaman `/peminjaman`<br>2. Perhatikan daftar buku yang tersedia |
| **Expected Result** | 1. Buku dengan stok 0 tidak muncul di daftar pilihan buku<br>2. Buku dengan stok > 0 tetap muncul dan dapat dipilih |
| **Type** | Negatif |

---

#### TC-F003-004: Cari Buku di Daftar Peminjaman

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-004 |
| **Related UC** | UC-003 (AF-003) |
| **Related Feature** | F003 |
| **Test Scenario** | Guru mencari buku di panel pemilihan buku |
| **Preconditions** | Minimal 3 buku dengan stok > 0 |
| **Test Data** | Pencarian: "Matematika" |
| **Test Steps** | 1. Akses halaman `/peminjaman`<br>2. Ketik "Matematika" di kolom pencarian "Cari judul atau ID buku..."<br>3. Sistem memfilter daftar buku |
| **Expected Result** | 1. Hanya buku dengan judul mengandung "Matematika" yang ditampilkan<br>2. Buku lain tidak ditampilkan<br>3. Pencarian bersifat case-insensitive |
| **Type** | Positif |

---

#### TC-F003-005: Input Siswa Kosong

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-005 |
| **Related UC** | UC-003 (AF-004) |
| **Related Feature** | F003 |
| **Test Scenario** | Guru mencoba menyimpan peminjaman tanpa mengisi Nama Siswa |
| **Preconditions** | Buku sudah dipilih, form lain terisi |
| **Test Data** | Nama Siswa: (kosong) |
| **Test Steps** | 1. Pilih buku<br>2. Biarkan Nama Siswa kosong<br>3. Klik "Simpan Peminjaman" |
| **Expected Result** | 1. Tombol "Simpan Peminjaman" dalam keadaan disabled (tidak bisa diklik)<br>2. Atau jika diklik, sistem menampilkan error "Nama siswa wajib diisi." |
| **Type** | Negatif |

---

#### TC-F003-006: Tanggal Kembali Sebelum Tanggal Pinjam

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-006 |
| **Related UC** | UC-003 (EF-001) |
| **Related Feature** | F003 |
| **Test Scenario** | Guru mengatur Tanggal Kembali sebelum Tanggal Pinjam |
| **Preconditions** | Form peminjaman terbuka |
| **Test Data** | Tanggal Kembali: kemarin (sebelum hari ini) |
| **Test Steps** | 1. Pilih buku<br>2. Isi data siswa<br>3. Atur Tanggal Kembali ke tanggal sebelum hari ini<br>4. Coba klik "Simpan Peminjaman" |
| **Expected Result** | 1. Sistem memvalidasi Tanggal Kembali harus setelah Tanggal Pinjam<br>2. Tombol "Simpan Peminjaman" disabled<br>3. Atau error ditampilkan "Tanggal kembali harus setelah tanggal pinjam." |
| **Type** | Exception |

---

#### TC-F003-007: Stok Berkurang Setelah Peminjaman (F007)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F003-007 |
| **Related UC** | UC-003 (F007) |
| **Related Feature** | F003, F007 |
| **Test Scenario** | Stok buku otomatis berkurang setelah peminjaman berhasil |
| **Preconditions** | Buku BK001 memiliki stok 3 |
| **Test Data** | Buku: BK001 (Matematika Kelas 4) |
| **Test Steps** | 1. Catat stok BK001 sebelum peminjaman (misal: 3)<br>2. Lakukan peminjaman BK001 (TC-F003-001)<br>3. Periksa stok BK001 di halaman Manajemen Buku |
| **Expected Result** | 1. Stok BK001 berkurang 1 (dari 3 menjadi 2)<br>2. Status buku berubah menjadi "Dipinjam" jika stok 0, atau tetap "Aktif" jika stok > 0<br>3. Perubahan tercermin real-time di halaman publik |
| **Type** | Positif |

---

## 3.4 Feature F004: Pencatatan Pengembalian Buku

### UC-004: Pencatatan Pengembalian Buku

---

#### TC-F004-001: Pengembalian Berhasil — Tepat Waktu, Kondisi Baik

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-001 |
| **Related UC** | UC-004 |
| **Related Feature** | F004 (memicu F007) |
| **Test Scenario** | Guru mencatat pengembalian buku tepat waktu dengan kondisi baik |
| **Preconditions** | 1. Guru sudah login<br>2. Minimal 1 transaksi peminjaman aktif (status "Dipinjam") dengan batas kembali >= hari ini |
| **Test Data** | Peminjaman aktif, Kondisi: "Baik" |
| **Test Steps** | 1. Akses halaman `/pengembalian`<br>2. Sistem menampilkan daftar peminjaman aktif<br>3. Klik tombol "Kembalikan" pada peminjaman yang dipilih<br>4. Sistem menampilkan modal konfirmasi<br>5. Pilih kondisi buku = "Baik"<br>6. Periksa panel ringkasan denda (denda = Rp0)<br>7. Klik "Konfirmasi Pengembalian" |
| **Expected Result** | 1. Tanggal kembali terisi otomatis (hari ini)<br>2. Denda keterlambatan = Rp0 (tepat waktu)<br>3. Denda kondisi = Rp0 (kondisi Baik)<br>4. Total denda = Rp0<br>5. Pengembalian tersimpan<br>6. Stok buku bertambah 1 (F007)<br>7. Status peminjaman berubah menjadi "Dikembalikan"<br>8. Pesan sukses "Pengembalian berhasil dicatat." |
| **Type** | Positif |

---

#### TC-F004-002: Pengembalian Terlambat dengan Denda

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-002 |
| **Related UC** | UC-004 |
| **Related Feature** | F004 |
| **Test Scenario** | Guru mencatat pengembalian buku yang terlambat — denda keterlambatan dihitung otomatis |
| **Preconditions** | 1. Minimal 1 peminjaman aktif dengan batas kembali sudah lewat<br>2. Atau: atur Tanggal Kembali di masa lalu pada data pengujian |
| **Test Data** | Peminjaman terlambat 3 hari, Kondisi: "Baik" |
| **Test Steps** | 1. Akses halaman `/pengembalian`<br>2. Klik "Kembalikan" pada peminjaman yang terlambat<br>3. Sistem menampilkan hari keterlambatan (misal: +3 hr)<br>4. Pilih kondisi = "Baik"<br>5. Periksa panel ringkasan denda |
| **Expected Result** | 1. Hari keterlambatan dihitung otomatis (3 hari)<br>2. Denda keterlambatan = 3 x Rp500 = Rp1.500<br>3. Denda kondisi = Rp0 (Baik)<br>4. Total denda = Rp1.500<br>5. Panel menampilkan rincian dengan background merah (karena total > 0) |
| **Type** | Positif |

---

#### TC-F004-003: Pengembalian dengan Kondisi Rusak

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-003 |
| **Related UC** | UC-004 |
| **Related Feature** | F004 |
| **Test Scenario** | Guru mencatat pengembalian dengan kondisi buku rusak — denda kondisi dihitung otomatis |
| **Preconditions** | Minimal 1 peminjaman aktif |
| **Test Data** | Kondisi: "Rusak Ringan" |
| **Test Steps** | 1. Akses halaman `/pengembalian`<br>2. Klik "Kembalikan" pada peminjaman<br>3. Pilih kondisi = "Rusak Ringan"<br>4. Periksa panel ringkasan denda |
| **Expected Result** | 1. Denda kondisi = Rp2.000 (Rusak Ringan)<br>2. Jika juga terlambat: denda keterlambatan + denda kondisi<br>3. Total denda = penjumlahan kedua komponen<br>4. Panel menampilkan rincian dengan background merah |
| **Type** | Positif |

---

#### TC-F004-004: Batalkan Pengembalian

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-004 |
| **Related UC** | UC-004 (AF-001) |
| **Related Feature** | F004 |
| **Test Scenario** | Guru membatalkan proses pengembalian sebelum konfirmasi |
| **Preconditions** | Modal konfirmasi pengembalian terbuka |
| **Test Data** | - |
| **Test Steps** | 1. Modal konfirmasi terbuka<br>2. Klik tombol "Batal" atau tombol X |
| **Expected Result** | 1. Modal tertutup<br>2. Data pengembalian tidak tersimpan<br>3. Peminjaman tetap berstatus "Dipinjam"<br>4. Stok buku tidak berubah |
| **Type** | Negatif |

---

#### TC-F004-005: Stok Bertambah Setelah Pengembalian (F007)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-005 |
| **Related UC** | UC-004 (F007) |
| **Related Feature** | F004, F007 |
| **Test Scenario** | Stok buku otomatis bertambah setelah pengembalian berhasil |
| **Preconditions** | Buku yang dipinjam memiliki stok tertentu |
| **Test Data** | Buku yang baru dikembalikan |
| **Test Steps** | 1. Catat stok buku sebelum pengembalian<br>2. Lakukan pengembalian (TC-F004-001)<br>3. Periksa stok buku di halaman Manajemen Buku |
| **Expected Result** | 1. Stok buku bertambah 1<br>2. Perubahan tercermin real-time |
| **Type** | Positif |

---

#### TC-F004-006: Pengembalian Tepat Waktu — Kondisi Baik — Total Denda = 0

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-006 |
| **Related UC** | UC-004 |+ |
| **Related Feature** | F004 |
| **Test Scenario** | Guru mengembalikan buku tepat waktu dengan kondisi Baik — total denda Rp0 |
| **Preconditions** | Minimal 1 peminjaman aktif dengan `tgl_batas_pengembalian` >= hari ini |
| **Test Data** | Peminjaman aktif tepat waktu, Kondisi: "Baik" |
| **Test Steps** | 1. Buka halaman `/pengembalian`<br>2. Klik "Kembalikan" pada peminjaman yang tepat waktu<br>3. Di modal konfirmasi, pilih kondisi = "Baik"<br>4. Periksa estimasi denda di panel ringkasan (live fee estimation)<br>5. Klik "Konfirmasi Pengembalian" |
| **Expected Result** | 1. Panel ringkasan menunjukkan: keterlambatan = 0 hari, denda keterlambatan = Rp0<br>2. Biaya kondisi = Rp0 (karena Baik)<br>3. Total denda = Rp0<br>4. Transaksi pengembalian berhasil dengan `total_denda` = 0 di database<br>5. Stok buku bertambah 1 |
| **Type** | Positif |

---

#### TC-F004-007: Pengembalian Terlambat — Kondisi Rusak Ringan — Denda Kombinasi

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-007 |
| **Related UC** | UC-004 |
| **Related Feature** | F004 |
| **Test Scenario** | Guru mengembalikan buku terlambat dengan kondisi Rusak Ringan — denda keterlambatan + biaya kondisi dijumlah |
| **Preconditions** | Minimal 1 peminjaman aktif dengan `tgl_batas_pengembalian` sudah lewat (terlambat 2+ hari) |
| **Test Data** | Peminjaman terlambat, Kondisi: "Rusak Ringan" |
| **Test Steps** | 1. Buka halaman `/pengembalian`<br>2. Klik "Kembalikan" pada peminjaman yang terlambat<br>3. Di modal konfirmasi, pilih kondisi = "Rusak Ringan"<br>4. Periksa estimasi denda: hari keterlambatan, denda keterlambatan, biaya kondisi, total<br>5. Klik "Konfirmasi Pengembalian" |
| **Expected Result** | 1. `keterlambatan_hari` = jumlah hari terlambat (terhitung sejak tgl_batas_pengembalian hingga hari ini dalam WIB)<br>2. `denda_keterlambatan` = keterlambatan_hari × Rp500 (sesuai konfigurasi denda)<br>3. `biaya_kondisi` = Rp2.000 (Rusak Ringan)<br>4. `total_denda` = denda_keterlambatan + biaya_kondisi<br>5. Semua nilai tersimpan di tabel `pengembalian` |
| **Type** | Positif |

---

#### TC-F004-008: Pengembalian — Kondisi Rusak Berat — Status Tersedia (Regresi)

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-008 |
| **Related UC** | UC-004 |
| **Related Feature** | F004 |
| **Test Scenario** | Buku yang dikembalikan dengan kondisi Rusak Berat tetap menjadi "Tersedia" (bukan "Tidak Aktif") |
| **Preconditions** | Minimal 1 peminjaman aktif |
| **Test Data** | Kondisi: "Rusak Berat" |
| **Test Steps** | 1. Catat `id_buku` dari peminjaman yang akan dikembalikan<br>2. Buka halaman `/pengembalian`, klik "Kembalikan"<br>3. Pilih kondisi = "Rusak Berat"<br>4. Periksa estimasi denda: biaya kondisi = Rp5.000<br>5. Klik "Konfirmasi Pengembalian"<br>6. Buka halaman Manajemen Buku, cari buku tersebut |
| **Expected Result** | 1. `biaya_kondisi` = Rp5.000 (sesuai konfigurasi denda_rusak_berat)<br>2. Status buku di tabel Manajemen Buku = **"Aktif" / "Tersedia"** (bukan "Tidak Aktif")<br>3. Stok buku bertambah 1<br>4. Di halaman publik, buku tetap muncul sebagai "Tersedia" |
| **Type** | Positif |

---

#### TC-F004-009: Pengembalian Gagal — ID Peminjaman Sudah Dikembalikan

| Field | Value |
| --- | --- |
| **TC ID** | TC-F004-009 |
| **Related UC** | UC-004 (EF-001) |
| **Related Feature** | F004 |
| **Test Scenario** | Guru mencoba mengembalikan peminjaman yang sudah dikembalikan sebelumnya |
| **Preconditions** | Minimal 1 transaksi pengembalian sudah selesai (status "Sudah Dikembalikan") |
| **Test Data** | `id_peminjaman` dari transaksi yang sudah dikembalikan |
| **Test Steps** | 1. Buka halaman `/pengembalian`<br>2. Pastikan peminjaman yang sudah dikembalikan tidak muncul di daftar aktif<br>3. Secara manual kirim POST `/api/v1/returns` dengan id_peminjaman yang sudah dikembalikan (via curl/DevTools)<br>4. Atau: jika UI memungkinkan, coba klik "Kembalikan" pada peminjaman yang sudah diproses |
| **Expected Result** | 1. Backend mengembalikan status 409 (Conflict)<br>2. Pesan error: "Peminjaman sudah dikembalikan sebelumnya"<br>3. Tidak ada duplikasi data pengembalian<br>4. Stok buku tidak bertambah lagi |
| **Type** | Exception |

---

## 3.5 Feature F005: Riwayat Peminjaman

### UC-005: Melihat Riwayat Peminjaman

---

#### TC-F005-001: Melihat Riwayat Transaksi

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-001 |
| **Related UC** | UC-005 |
| **Related Feature** | F005 |
| **Test Scenario** | Guru melihat daftar riwayat transaksi peminjaman dan pengembalian |
| **Preconditions** | 1. Guru sudah login<br>2. Minimal 1 transaksi peminjaman sudah tercatat |
| **Test Data** | - |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Sistem menampilkan tabel riwayat transaksi |
| **Expected Result** | 1. Tabel menampilkan: Nama Siswa, Buku, Tgl Pinjam, Tgl Kembali, Kondisi, Denda, Status<br>2. Data diurutkan secara kronologis (terbaru di atas)<br>3. Data bersifat read-only (tidak ada tombol edit/hapus)<br>4. Status transaksi ditampilkan dengan badge (Dipinjam/Dikembalikan) |
| **Type** | Positif |

---

#### TC-F005-002: Cari Riwayat Berdasarkan Nama Siswa

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-002 |
| **Related UC** | UC-005 (AF-001) |
| **Related Feature** | F005 |
| **Test Scenario** | Guru mencari riwayat berdasarkan nama siswa |
| **Preconditions** | Minimal 2 transaksi dengan nama siswa berbeda |
| **Test Data** | Pencarian: "Budi" |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Ketik "Budi" di kolom pencarian<br>3. Sistem melakukan pencarian (debounce 300ms) |
| **Expected Result** | 1. Hanya transaksi dengan nama siswa mengandung "Budi" yang ditampilkan<br>2. Transaksi dengan nama siswa lain tidak ditampilkan<br>3. Pencarian case-insensitive |
| **Type** | Positif |

---

#### TC-F005-003: Cari Riwayat Berdasarkan Judul Buku

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-003 |
| **Related UC** | UC-005 (AF-001) |
| **Related Feature** | F005 |
| **Test Scenario** | Guru mencari riwayat berdasarkan judul buku |
| **Preconditions** | Minimal 2 transaksi dengan buku berbeda |
| **Test Data** | Pencarian: "Matematika" |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Ketik "Matematika" di kolom pencarian<br>3. Sistem melakukan pencarian |
| **Expected Result** | 1. Transaksi yang mengandung buku "Matematika Kelas 4" ditampilkan<br>2. Transaksi lain tidak ditampilkan<br>3. Pencarian mencocokkan nama siswa ATAU judul buku |
| **Type** | Positif |

---

#### TC-F005-004: Filter Riwayat Berdasarkan Rentang Tanggal

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-004 |
| **Related UC** | UC-005 (AF-002) |
| **Related Feature** | F005 |
| **Test Scenario** | Guru memfilter riwayat berdasarkan rentang tanggal |
| **Preconditions** | Transaksi tersebar di beberapa tanggal |
| **Test Data** | Rentang: 1 Juli 2026 — 7 Juli 2026 |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Isi "Dari" = 2026-07-01<br>3. Isi "Sampai" = 2026-07-07<br>4. Klik tombol "Terapkan Filter"<br>5. Sistem memfilter data |
| **Expected Result** | 1. Hanya transaksi dalam rentang 1–7 Juli yang ditampilkan<br>2. Klik "Reset": filter dihapus, semua data tampil kembali |
| **Type** | Positif |

---

#### TC-F005-005: Tidak Ada Data Riwayat

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-005 |
| **Related UC** | UC-005 (AF-003) |
| **Related Feature** | F005 |
| **Test Scenario** | Belum ada transaksi peminjaman |
| **Preconditions** | Database bersih (belum ada transaksi) |
| **Test Data** | - |
| **Test Steps** | 1. Akses halaman `/riwayat` |
| **Expected Result** | 1. Tabel menampilkan state kosong: ikon + pesan "Belum ada riwayat transaksi peminjaman." |
| **Type** | Negatif |

---

#### TC-F005-006: Denda Ditampilkan di Riwayat

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-006 |
| **Related UC** | UC-005 |
| **Related Feature** | F005 |
| **Test Scenario** | Riwayat menampilkan nominal denda jika ada |
| **Preconditions** | Minimal 1 transaksi pengembalian dengan denda > 0 |
| **Test Data** | - |
| **Test Steps** | 1. Lakukan pengembalian terlambat (TC-F004-002) — denda Rp1.500<br>2. Akses halaman `/riwayat`<br>3. Cari transaksi tersebut |
| **Expected Result** | 1. Kolom Denda menampilkan nominal "Rp1.500"<br>2. Nomor denda ditampilkan dengan badge/ikon yang mencolok<br>3. Transaksi tanpa denda menampilkan "Rp0" |
| **Type** | Positif |

---

#### TC-F005-007: Export Excel Berhasil — Ada Data

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-007 |
| **Related UC** | UC-005 (FR-032) |
| **Related Feature** | F005 |
| **Test Scenario** | Guru berhasil mengekspor riwayat ke Excel untuk bulan/tahun yang memiliki data |
| **Preconditions** | 1. Guru sudah login<br>2. Minimal 1 transaksi peminjaman pada bulan dan tahun yang akan diexport |
| **Test Data** | Bulan: 7 (Juli), Tahun: 2026 |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Di panel Export, pilih Bulan = "Juli"<br>3. Pilih Tahun = "2026"<br>4. Klik tombol "Export Excel"<br>5. Amati response |
| **Expected Result** | 1. File `.xlsx` terdownload secara otomatis<br>2. Nama file: `riwayat-peminjaman-7-2026.xlsx`<br>3. File berisi kolom: Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Tgl Kembali Aktual, Kondisi Buku, Denda, Status<br>4. Data sesuai dengan yang tampil di tabel riwayat untuk periode tersebut<br>5. Kolom Denda menggunakan format Rp (contoh: "Rp 1.500") |
| **Type** | Positif |

---

#### TC-F005-008: Export Excel — Tidak Ada Data

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-008 |
| **Related UC** | UC-005 (FR-032, EF-001) |
| **Related Feature** | F005 |
| **Test Scenario** | Guru mengekspor riwayat untuk bulan/tahun yang tidak memiliki transaksi |
| **Preconditions** | Guru sudah login, tidak ada transaksi pada bulan/tahun target |
| **Test Data** | Bulan: 1 (Januari), Tahun: 2025 (atau periode tanpa data) |
| **Test Steps** | 1. Akses halaman `/riwayat`<br>2. Pilih Bulan dan Tahun yang dipastikan tidak memiliki data<br>3. Klik tombol "Export Excel"<br>4. Amati response |
| **Expected Result** | 1. **Tidak ada file** yang terdownload<br>2. Sistem menampilkan pesan informatif: "Tidak ada data peminjaman untuk periode ini."<br>3. Tidak ada error JavaScript yang tampak<br>4. Tabel riwayat tetap menampilkan data terkini (tidak berubah) |
| **Type** | Exception |

---

#### TC-F005-009: Export Excel — Batasan Filter Bulan/Tahun

| Field | Value |
| --- | --- |
| **TC ID** | TC-F005-009 |
| **Related UC** | UC-005 (FR-032, EF-002) |
| **Related Feature** | F005 |
| **Test Scenario** | Filter Export Excel hanya mencakup transaksi dalam bulan/tahun yang dipilih — transaksi dari bulan berdekatan tidak ikut |
| **Preconditions** | 1. Guru sudah login<br>2. Ada transaksi di bulan Juni 2026 dan Juli 2026 (dua bulan berbeda) |
| **Test Data** | Export: Bulan 6 (Juni), Tahun 2026 |
| **Test Steps** | 1. Pastikan ada transaksi di Juni 2026 dan Juli 2026<br>2. Akses halaman `/riwayat`<br>3. Pilih Bulan = "Juni", Tahun = "2026"<br>4. Klik "Export Excel"<br>5. Buka file Excel yang terdownload |
| **Expected Result** | 1. File hanya berisi transaksi dengan `tgl_peminjaman` di bulan Juni 2026<br>2. Transaksi Juli 2026 **tidak** muncul di file<br>3. Kolom tanggal pada file sesuai dengan data yang ditampilkan di tabel riwayat untuk periode Juni 2026 |
| **Type** | Positif |

---

## 3.6 Feature F006: Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik)

### UC-006: Akses Ketersediaan & Lokasi Buku (Publik)

---

#### TC-F006-001: Lihat Katalog Publik

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-001 |
| **Related UC** | UC-006 |
| **Related Feature** | F006 |
| **Test Scenario** | Siswa (publik) melihat katalog buku tanpa login |
| **Preconditions** | Minimal 1 buku dengan status "Aktif" |
| **Test Data** | - |
| **Test Steps** | 1. Buka halaman utama `/`<br>2. Sistem menampilkan katalog publik |
| **Expected Result** | 1. Halaman menampilkan grid kartu buku<br>2. Setiap kartu menampilkan: cover/sampul (atau placeholder ikon), lokasi rak, judul, penulis, tema, status ketersediaan, stok<br>3. Tidak ada data peminjam yang ditampilkan<br>4. Tidak ada tombol login untuk akses lanjutan (hanya tombol "Login Guru" di header) |
| **Type** | Positif |

---

#### TC-F006-002: Cari Buku di Halaman Publik

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-002 |
| **Related UC** | UC-006 (AF-001) |
| **Related Feature** | F006 |
| **Test Scenario** | Siswa mencari buku di halaman publik |
| **Preconditions** | Minimal 3 buku dengan variasi judul |
| **Test Data** | Pencarian: "Dongeng" |
| **Test Steps** | 1. Buka halaman `/`<br>2. Ketik "Dongeng" di kolom pencarian "Cari judul atau tema buku..."<br>3. Sistem memfilter kartu buku |
| **Expected Result** | 1. Hanya buku dengan judul atau tema mengandung "Dongeng" yang ditampilkan<br>2. Jumlah hasil ditampilkan ("Menampilkan N hasil")<br>3. Pencarian bersifat case-insensitive<br>4. Jika tidak ada hasil: tampilkan "Buku tidak ditemukan. Coba kata kunci lain." |
| **Type** | Positif |

---

#### TC-F006-003: Buku Stok 0 Muncul Sebagai "Stok Habis"

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-003 |
| **Related UC** | UC-006 |
| **Related Feature** | F006 |
| **Test Scenario** | Buku dengan stok 0 tetap muncul namun dengan status "Stok Habis" |
| **Preconditions** | Ada buku dengan stok = 0 (atau stok habis setelah peminjaman) |
| **Test Data** | Buku dengan stok 0 |
| **Test Steps** | 1. Buka halaman `/`<br>2. Cari buku yang memiliki stok 0 |
| **Expected Result** | 1. Buku dengan stok 0 tetap muncul di katalog<br>2. Status badge menampilkan "Stok Habis" (merah)<br>3. Informasi stok: "Stok: 0" |
| **Type** | Positive |

---

#### TC-F006-004: Data Peminjam Tidak Ditampilkan

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-004 |
| **Related UC** | UC-006 |
| **Related Feature** | F006 |
| **Test Scenario** | Halaman publik tidak menampilkan informasi peminjam |
| **Preconditions** | Minimal 1 buku sedang dipinjam |
| **Test Data** | - |
| **Test Steps** | 1. Buka halaman `/`<br>2. Periksa seluruh elemen halaman |
| **Expected Result** | 1. Tidak ada nama siswa yang ditampilkan di kartu buku mana pun<br>2. Tidak ada informasi "Dipinjam oleh..." atau sejenisnya<br>3. Hanya status ketersediaan yang ditampilkan (Tersedia/Stok Habis) |
| **Type** | Positif |

---

#### TC-F006-005: Filter Kategori — Kelas N Menampilkan Buku Tingkat Kelas N dan Tanpa Kelas

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-005 |
| **Related UC** | UC-006 (AF-002) |
| **Related Feature** | F006 |
| **Test Scenario** | Filter kategori "Kelas N" menampilkan buku dengan tingkat_kelas = N DAN buku dengan tingkat_kelas = NULL (uncategorized) |
| **Preconditions** | Memiliki buku dengan tingkat_kelas=4, buku dengan tingkat_kelas=NULL, dan buku dengan tingkat_kelas=5 |
| **Test Data** | Filter: tab "Kelas 4" |
| **Test Steps** | 1. Buka halaman `/`<br>2. Klik tab filter "Kelas 4"<br>3. Amati buku yang ditampilkan |
| **Expected Result** | 1. Buku dengan `tingkat_kelas = 4` muncul<br>2. Buku dengan `tingkat_kelas = NULL` (tanpa kelas, misal buku Cerita & Dongeng) juga muncul<br>3. Buku dengan `tingkat_kelas = 5` tidak muncul<br>4. Jumlah hasil sesuai ("Menampilkan N hasil") |
| **Type** | Positif |

---

#### TC-F006-006: Filter Kategori — Lainnya Menampilkan Tema Lainnya atau Tanpa Kategori

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-006 |
| **Related UC** | UC-006 (AF-003) |
| **Related Feature** | F006 |
| **Test Scenario** | Filter "Lainnya" menampilkan buku dengan tema="Lainnya" DAN buku tanpa tema DAN tanpa tingkat_kelas |
| **Preconditions** | Memiliki buku dengan tema="Lainnya", buku tanpa tema dan tanpa tingkat_kelas, dan buku dengan tema="Cerita & Dongeng" |
| **Test Data** | Filter: tab "Lainnya" |
| **Test Steps** | 1. Buka halaman `/`<br>2. Klik tab filter "Lainnya"<br>3. Amati buku yang ditampilkan |
| **Expected Result** | 1. Buku dengan `tema_buku = "Lainnya"` muncul<br>2. Buku dengan `tema_buku = NULL` DAN `tingkat_kelas = NULL` (uncategorized) muncul<br>3. Buku dengan `tema_buku = "Cerita & Dongeng"` tidak muncul<br>4. Buku dengan `tingkat_kelas` tertentu (meski tanpa tema) tidak muncul |
| **Type** | Positif |

---

#### TC-F006-007: Konsistensi Data — Katalog Publik vs Manajemen Buku

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-007 |
| **Related UC** | UC-006, UC-002 |
| **Related Feature** | F006, F002 |
| **Test Scenario** | Data buku di katalog publik identik dengan data di halaman Manajemen Buku (tidak ada mismatch mock vs API) |
| **Preconditions** | Guru sudah login, minimal ada beberapa buku |
| **Test Data** | - |
| **Test Steps** | 1. Buka halaman publik `/` di satu tab (atau browser tanpa login)<br>2. Buka halaman Manajemen Buku `/buku` di tab lain (dengan login)<br>3. Bandingkan daftar buku |
| **Expected Result** | 1. Jumlah buku sama di kedua halaman (semua buku aktif)<br>2. Untuk setiap buku: judul, penulis, stok sama<br>3. Jika menambah/mengubah buku di Manajemen Buku, perubahan langsung tercermin di katalog publik setelah refresh<br>4. Kedua halaman mengambil data dari API yang sama (`/api/v1/books` dan `/api/v1/books/public`), bukan dari mock lokal |
| **Type** | Positif |

---

#### TC-F006-008: Badge "Stok Habis" untuk Buku dengan Stok = 0

| Field | Value |
| --- | --- |
| **TC ID** | TC-F006-008 |
| **Related UC** | UC-006 |
| **Related Feature** | F006 |
| **Test Scenario** | Buku dengan stok = 0 menampilkan badge "Stok Habis" di kartu publik |
| **Preconditions** | Ada buku dengan stok = 0 (seed: BK004 — Dongeng Nusantara) |
| **Test Data** | Buku: BK004 (Dongeng Nusantara, stok: 0) |
| **Test Steps** | 1. Buka halaman `/`<br>2. Cari buku "Dongeng Nusantara" atau buku dengan stok = 0<br>3. Amati badge/tag pada kartu buku |
| **Expected Result** | 1. Badge "Stok Habis" (atau setara) muncul dengan warna merah/destruktif<br>2. Buku lain dengan stok > 0 menampilkan badge "Tersedia" (hijau)<br>3. Badge konsisten antara halaman publik dan Manajemen Buku |
| **Type** | Positif |

---

# 4. TRACEABILITY MATRIX

## 4.1 Test Case to Requirement Traceability

| Feature ID | Feature Name | TC IDs |
| --- | --- | --- |
| F001 | Autentikasi Guru (Login) | TC-F001-001 s.d. TC-F001-008 |
| F002 | Manajemen Data Buku | TC-F002-001 s.d. TC-F002-013 |
| F003 | Pencatatan Peminjaman Buku | TC-F003-001 s.d. TC-F003-007 |
| F004 | Pencatatan Pengembalian Buku | TC-F004-001 s.d. TC-F004-009 |
| F005 | Riwayat Peminjaman + Export Excel | TC-F005-001 s.d. TC-F005-009 |
| F006 | Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik) | TC-F006-001 s.d. TC-F006-008 |

## 4.2 Test Case to Use Case Traceability

| Use Case ID | Use Case Name | TC IDs |
| --- | --- | --- |
| UC-001 | Login Guru | TC-F001-001 s.d. TC-F001-008 |
| UC-002 | Manajemen Data Buku | TC-F002-001 s.d. TC-F002-013 |
| UC-003 | Pencatatan Peminjaman Buku | TC-F003-001 s.d. TC-F003-007 |
| UC-004 | Pencatatan Pengembalian Buku | TC-F004-001 s.d. TC-F004-009 |
| UC-005 | Melihat Riwayat Peminjaman + Export Excel | TC-F005-001 s.d. TC-F005-009 |
| UC-006 | Akses Ketersediaan & Lokasi Buku (Publik) | TC-F006-001 s.d. TC-F006-008 |

## 4.3 FR-ID Traceability

| FR-ID | Deskripsi | TC IDs |
| --- | --- | --- |
| FR-001 | Form login dengan kolom username dan password | TC-F001-001, TC-F001-003 |
| FR-002 | Verifikasi kredensial ke backend | TC-F001-001, TC-F001-002 |
| FR-003 | Pesan error jika kredensial salah | TC-F001-002 |
| FR-004 | Idle timeout 30 menit | TC-F001-006 |
| FR-005 | Form tambah buku lengkap | TC-F002-001, TC-F002-003 |
| FR-006 | Fitur ubah dan hapus buku | TC-F002-007, TC-F002-008, TC-F002-009 |
| FR-007 | Pencarian buku | TC-F002-010 |
| FR-008 | Tolak ID Buku duplikat | TC-F002-004 |
| FR-009 | Validasi format Lokasi Rak | TC-F002-005 |
| FR-010 | Form peminjaman dengan pilihan siswa dan buku | TC-F003-001 |
| FR-011 | Tanggal pinjam otomatis | TC-F003-001 |
| FR-012 | Kolom tanggal batas pengembalian | TC-F003-001, TC-F003-006 |
| FR-013 | Sembunyikan buku stok 0 | TC-F003-003 |
| FR-014 | Update stok setelah peminjaman | TC-F003-007 |
| FR-015 | Form pengembalian terhubung ke ID Peminjaman | TC-F004-001 |
| FR-016 | Pilihan kondisi buku | TC-F004-001, TC-F004-003 |
| FR-017 | Tanggal kembali otomatis | TC-F004-001 |
| FR-018 | Hitung hari keterlambatan otomatis | TC-F004-002 |
| FR-019 | Hitung denda otomatis sebelum konfirmasi | TC-F004-002, TC-F004-003 |
| FR-020 | Update stok setelah pengembalian | TC-F004-005 |
| FR-021 | Daftar riwayat kronologis | TC-F005-001 |
| FR-022 | Pencarian riwayat (siswa, judul, tanggal) | TC-F005-002, TC-F005-003, TC-F005-004 |
| FR-023 | Status transaksi di riwayat | TC-F005-001 |
| FR-024 | Katalog publik tanpa login | TC-F006-001 |
| FR-025 | Pencarian publik (judul/tema) | TC-F006-002 |
| FR-026 | Data peminjam tidak ditampilkan publik | TC-F006-004 |
| FR-027 | Stok berkurang + status berubah saat peminjaman | TC-F003-007 |
| FR-028 | Stok bertambah + status berubah saat pengembalian | TC-F004-005 |
| FR-029 | Perubahan stok real-time | TC-F003-007, TC-F004-005 |
| FR-030 | Tema buku dropdown tertutup (Cerita & Dongeng / Lainnya) opsional | TC-F002-001 |
| FR-031 | Tingkat Kelas dropdown opsional, mutually exclusive dengan tema | TC-F002-001, TC-F006-005 |
| FR-032 | Export Riwayat ke Excel (filter bulan/tahun, akses Guru) | TC-F005-007, TC-F005-008, TC-F005-009 |

## 4.4 Test Type Summary

| Type | Count |
| --- | --- |
| Positif | 28 |
| Negatif | 11 |
| Exception | 13 |
| **Total** | **52** |

---

# 5. TEST EXECUTION NOTES

## 5.1 Test Environment

| Component | Specification |
| --- | --- |
| Browser | Google Chrome, Microsoft Edge (versi terbaru) |
| OS | Windows (PC perpustakaan SD Negeri Tamanan) |
| Network | Localhost (tidak memerlukan koneksi internet) |
| Backend | Express.js (Node.js) berjalan di PC yang sama |
| Database | SQLite (file-based) |

## 5.2 Test Data Setup

Sebelum eksekusi test case, pastikan kondisi berikut terpenuhi:
- Aplikasi berjalan (server lokal aktif di PC, backend di `http://localhost:3001`, frontend di `http://localhost:5173`)
- Minimal 1 akun Guru terdaftar (username: `guru_sd`, password: `guru123`)
- Minimal 9 buku (BK001–BK009) dengan variasi stok, tema, dan tingkat_kelas (termasuk buku dengan stok = 0: BK004)
- Minimal 1 transaksi peminjaman aktif (status "Dipinjam")
- Minimal 1 transaksi pengembalian (denda > 0 dan = 0)
- Data transaksi untuk pengujian filter tanggal dan export Excel

## 5.3 Acronyms

| Acronym | Definition |
| --- | --- |
| TC | Test Case |
| UC | Use Case |
| F | Feature |
| FR | Functional Requirement |
| AF | Alternative Flow |
| EF | Exception Flow |
| SRS | Software Requirements Specification |

---

# 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 0.1 | 2026-07-10 | Kelompok DPSI BRAYYY | Initial Draft — 38 test cases covering F001–F006 (UC-001 s.d. UC-006), termasuk F007 embedded test cases, traceability matrix, FR-ID mapping, dan test execution notes. |
| 0.2 | 2026-07-12 | Kelompok DPSI BRAYYY | Tambah 14 test case baru (total 52 TC) untuk fitur Export Excel (FR-032, F005), skenario regresi yang ditemukan selama implementasi (mock-data fallback, timezone pada Pengembalian, sesi expired), denda kombinasi, filter kategori publik, persistensi data, dan boundary export; update referensi dokumen ke versi terbaru (SRS v3.7, test plan v0.2, system logic v1.4); update test data setup sesuai seed aktual (username: guru_sd, 9 buku). |
