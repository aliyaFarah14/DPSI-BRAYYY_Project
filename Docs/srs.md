# srs.md — Software Requirements Specification
## Sistem Informasi Perpustakaan SD Negeri Tamanan

**Document Version:** v3.7 (Tambah fitur Export Riwayat Peminjaman ke Excel — filter bulan/tahun, akses Guru; hapus poin Out-of-Scope terkait)
**Project:** Sistem Informasi Perpustakaan SD Negeri Tamanan
**Product:** Web-Based Library Management System
**Status:** Draft
**Last Updated:** 2026-07-11
**Author:** Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
**Supervisor:** Farid Suryanto, S.Pd., MT.

---

## 1. Tujuan Sistem

### 1.1 Latar Belakang

Berdasarkan observasi di SD Negeri Tamanan, Yogyakarta, sejumlah proses administrasi sekolah masih dikelola secara manual, seperti pendataan aset, penyusunan jadwal pelajaran, dan peminjaman fasilitas. Administrasi data siswa telah terintegrasi dengan sistem pusat sehingga tidak dikelola langsung oleh pihak sekolah. Di antara proses-proses tersebut, **pengelolaan perpustakaan** merupakan permasalahan paling kompleks karena melibatkan pencatatan peminjaman dan pengembalian buku, pengelolaan data buku, serta akses informasi oleh siswa dan pengelola.

### 1.2 Rumusan Masalah

Sistem ini dibangun untuk mengatasi permasalahan berikut secara spesifik:

1. Pencatatan peminjaman dan pengembalian buku yang masih dilakukan secara manual menggunakan buku tulis, sehingga data tidak terstruktur dan sebagian riwayat telah hilang.
2. Penataan buku di rak yang tidak terorganisir — buku ditempatkan secara acak, sehingga siswa kesulitan menemukan lokasi fisik buku yang dicari.
3. Ketersediaan dan jumlah stok buku yang tidak dapat diketahui secara pasti karena tidak ada pencatatan yang terpusat.
4. Ketergantungan siswa pada pencarian mandiri tanpa informasi yang jelas mengenai lokasi dan status buku, tanpa harus bertanya langsung ke petugas.

### 1.3 Business Goals

* Digitalisasi pencatatan transaksi peminjaman dan pengembalian buku untuk menghindari kehilangan riwayat.
* Menyediakan informasi lokasi rak dan ketersediaan buku secara mandiri bagi siswa.
* Menjamin data stok buku selalu akurat dan real-time tanpa perhitungan manual oleh Guru.

### 1.4 Ringkasan Solusi

Sistem ini wajib menyediakan pencatatan transaksi peminjaman dan pengembalian buku secara terpusat dan digital — termasuk informasi lokasi rak — sehingga Guru dapat mengelola data perpustakaan secara akurat tanpa kehilangan riwayat, dan siswa dapat memeriksa ketersediaan serta lokasi buku secara mandiri.

---

## 2. Aktor Pengguna

| Aktor | Hak Akses | Tanggung Jawab |
|---|---|---|
| **Guru** (bertindak sebagai pengelola perpustakaan, karena tidak ada petugas perpustakaan tetap) | Wajib login (administrator) | Mengelola data buku (tambah, ubah, hapus, cari), mencatat transaksi peminjaman dan pengembalian, melihat riwayat transaksi. |
| **Siswa** | Tanpa login (read-only, publik) | Melihat status ketersediaan dan lokasi rak buku, mencari buku berdasarkan judul/tema. |

### 2.1 User Goals

**Guru**
* Dapat mencatat transaksi peminjaman dan pengembalian buku dengan cepat tanpa risiko kehilangan data.
* Dapat menambah, mengubah, dan menghapus data buku (termasuk lokasi rak) agar katalog selalu akurat.
* Dapat melihat riwayat transaksi kapan saja tanpa perhitungan atau pencatatan manual di buku tulis.

**Siswa**
* Dapat mengetahui status ketersediaan dan lokasi rak sebuah buku tanpa harus bertanya langsung ke Guru.
* Dapat mencari buku berdasarkan judul atau tema secara mandiri.

---

## 3. Tech Stack

Tech stack berikut bersifat final dan wajib digunakan apa adanya oleh AI coding assistant. Tidak ada alternatif/opsi lain.

> **Konteks deployment:** Sistem dijalankan **secara lokal pada satu unit PC** di perpustakaan SD Negeri Tamanan (server dan client adalah PC yang sama). Guru dan siswa mengakses aplikasi melalui browser lokal di PC tersebut secara bergantian sesuai sesi yang aktif. Tidak ada hosting cloud maupun akses lintas jaringan pada versi ini.

| Layer | Teknologi |
|---|---|
| Frontend | React (Vite), di-*build* menjadi static file (production build) |
| Backend | Express.js (Node.js), berjalan sebagai server lokal di PC yang sama |
| Database | SQLite (file-based, tidak memerlukan instalasi server database terpisah) |
| Komunikasi Frontend–Backend | REST API, format JSON, protokol HTTP (localhost) |
| Autentikasi | Username & password, password disimpan dalam bentuk hash (bcrypt) |

Catatan arsitektur: Karena aplikasi berjalan pada satu PC yang sama (server dan client sama), hasil *build* frontend disajikan langsung oleh backend Express sebagai static file dari satu proses/origin yang sama — sehingga **tidak diperlukan dua server terpisah, tidak diperlukan konfigurasi CORS, dan tidak diperlukan HTTPS** (karena tidak melewati jaringan publik). Guru dan siswa mengakses aplikasi melalui browser dengan alamat `http://localhost:<port>` pada PC yang sama.

### 3.1 Operating Environment

* **Operating System:** Windows (mengikuti OS yang terpasang pada PC perpustakaan sekolah).
* **Browser Support:** Google Chrome, Microsoft Edge (versi terbaru), dibuka secara lokal di PC yang sama tempat aplikasi dijalankan.
* **Device Support:** Satu unit PC desktop, digunakan bergantian oleh Guru (mode manajemen, login) dan siswa (mode publik, read-only) sesuai sesi yang aktif di browser.
* **Deployment:** Aplikasi (backend Node.js, hasil *build* frontend, dan file database SQLite) diinstal dan dijalankan langsung di PC perpustakaan tersebut. Tidak menggunakan layanan hosting cloud (Vercel/Netlify/VPS/Railway) pada versi ini.
* **Menjalankan Aplikasi:** Server backend dijalankan melalui skrip/*shortcut* lokal (mis. file `.bat` atau *Node script*) yang dijalankan setiap PC dinyalakan atau sebelum jam layanan perpustakaan dimulai.

### 3.2 Assumptions

* Aplikasi **tidak bergantung pada koneksi internet** untuk beroperasi sehari-hari, karena backend, database, dan frontend berjalan pada PC yang sama (localhost). Internet sekolah yang stabil tersedia dan dapat dimanfaatkan untuk kebutuhan lain (mis. instalasi awal, pembaruan aplikasi), namun bukan syarat operasional harian sistem.
* PC perpustakaan tetap menyala selama jam operasional agar server backend lokal tetap aktif dan dapat diakses.

### 3.3 Constraints

* Sistem hanya berjalan pada **satu unit PC** perpustakaan SD Negeri Tamanan — tidak ada dukungan multi-PC/akses jaringan (LAN) pada versi ini.
* Karena database berbentuk file lokal (SQLite), backup data menjadi tanggung jawab manual (menyalin file database secara berkala) oleh pihak sekolah/administrator sistem.
* Jika PC dimatikan atau di-*restart*, server backend ikut berhenti; aplikasi perlu dijalankan ulang secara manual sebelum dapat diakses kembali.
* Sistem hanya boleh digunakan pada satu unit sekolah (SD Negeri Tamanan) — tidak ada dukungan multi-sekolah.
* Keamanan data transaksi bergantung penuh pada sesi login Guru yang aktif dan valid.

---

## 4. In-Scope Features

Setiap fitur wajib diimplementasikan sesuai Feature ID, Description, Requirements, dan Business Rules berikut. AI coding assistant wajib mengacu pada detail per-fitur ini, bukan hanya judul fitur.

### 4.1 Kebutuhan Fungsional (Functional Requirements)

Berikut daftar seluruh kebutuhan fungsional sistem (FR-ID), disarikan dari Requirements tiap fitur pada Section 4.2 agar dapat ditelusuri (*traceable*) ke Feature ID terkait.

| FR-ID | Deskripsi Kebutuhan Fungsional | Fitur Terkait |
|---|---|---|
| FR-001 | Sistem harus menyediakan form login dengan kolom username dan password. | F001 |
| FR-002 | Sistem harus memverifikasi kredensial ke backend sebelum memberikan akses ke halaman manajemen. | F001 |
| FR-003 | Sistem harus menampilkan pesan error yang jelas jika username atau password salah. | F001 |
| FR-004 | Sistem harus mengakhiri sesi secara otomatis setelah 30 menit tanpa aktivitas (idle timeout) dan mengarahkan pengguna kembali ke halaman login. | F001 |
| FR-005 | Sistem harus menyediakan form tambah buku dengan field: ID Buku, Judul, Penulis, Penerbit, Tema (dropdown opsional: Cerita & Dongeng / Lainnya), Tahun Terbit, Lokasi Rak, Stok, Tingkat Kelas (opsional), dan Status. | F002 |
| FR-006 | Sistem harus menyediakan fitur ubah dan hapus data buku. | F002 |
| FR-007 | Sistem harus menyediakan fitur pencarian buku berdasarkan judul, tema, atau ID Buku. | F002 |
| FR-008 | Sistem harus menolak penyimpanan apabila ID Buku sudah terdaftar sebelumnya. | F002 |
| FR-009 | Sistem harus menolak penyimpanan apabila field Lokasi Rak dikosongkan atau tidak sesuai format. | F002 |
| FR-010 | Sistem harus menyediakan form peminjaman dengan pilihan siswa dan pilihan buku (dapat memilih lebih dari satu buku dalam satu transaksi).. | F003 |
| FR-011 | Sistem harus mengisi tanggal peminjaman secara otomatis berdasarkan tanggal hari ini. | F003 |
| FR-012 | Sistem harus menyediakan kolom tanggal batas pengembalian yang dapat diatur oleh Guru. | F003 |
| FR-013 | Sistem harus menyembunyikan buku dengan stok 0 dari daftar pilihan peminjaman. | F003 |
| FR-014 | Sistem harus memperbarui stok dan status buku segera setelah transaksi peminjaman berhasil disimpan. | F003 |
| FR-015 | Sistem harus menyediakan form pengembalian yang terhubung ke ID Peminjaman terkait. | F004 |
| FR-016 | Sistem harus menyediakan pilihan kondisi buku: Baik, Rusak Ringan, atau Rusak Berat. | F004 |
| FR-017 | Sistem harus mengisi tanggal pengembalian secara otomatis berdasarkan tanggal hari ini. | F004 |
| FR-018 | Sistem harus menghitung dan menampilkan jumlah hari keterlambatan secara otomatis, apabila ada. | F004 |
| FR-019 | Sistem harus menghitung dan menampilkan nominal denda keterlambatan secara otomatis (berdasarkan hari terlambat dan kondisi buku) sebelum Guru mengklik "Konfirmasi Pengembalian". | F004 |
| FR-020 | Sistem harus memperbarui stok dan status buku segera setelah transaksi pengembalian berhasil disimpan. | F004 |
| FR-021 | Sistem harus menampilkan daftar seluruh transaksi peminjaman dan pengembalian secara kronologis. | F005 |
| FR-022 | Sistem harus menyediakan pencarian riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal. | F005 |
| FR-023 | Sistem harus menampilkan status setiap transaksi (Dipinjam/Dikembalikan/Terlambat). | F005 |
| FR-024 | Sistem harus menampilkan daftar buku beserta status ketersediaan (Tersedia/Dipinjam) dan lokasi rak tanpa memerlukan login. | F006 |
| FR-025 | Sistem harus menyediakan fitur pencarian/pemfilteran buku berdasarkan judul atau tema (dropdown tertutup: Cerita & Dongeng / Lainnya) untuk pengguna publik. | F006 |
| FR-026 | Sistem tidak boleh menampilkan data peminjam (nama siswa yang meminjam) pada halaman publik. | F006 |
| FR-027 | Sistem harus mengurangi stok buku sebanyak satu unit dan mengubah status menjadi "Dipinjam" segera setelah transaksi peminjaman berhasil disimpan. | F007 |
| FR-028 | Sistem harus menambah stok buku sebanyak satu unit dan mengubah status menjadi "Tersedia" segera setelah transaksi pengembalian berhasil disimpan. | F007 |
| FR-029 | Sistem harus memastikan perubahan stok dan status tercermin secara real-time pada halaman manajemen Guru maupun halaman publik siswa. | F007 |
| FR-030 | Sistem harus menyediakan field Tingkat Kelas (opsional, dropdown 1–6) pada form tambah/edit buku untuk buku pelajaran berjenjang. | F002 |
| FR-031 | Sistem harus menyediakan filter kategori pada halaman publik: Semua / Kelas 1–6 / Cerita & Dongeng / Lainnya, dapat dikombinasikan dengan pencarian judul/tema. | F006 |
| FR-032 | Sistem harus menyediakan fitur export data riwayat peminjaman ke format Excel (.xlsx), dengan filter bulan dan tahun, hanya dapat diakses oleh Guru yang sudah login. | F005 |

### 4.2 Detail per Fitur

---

### Feature ID: F001 — Autentikasi Guru (Login)

**Description:** Fitur ini memungkinkan Guru login menggunakan username dan password untuk mengakses seluruh fitur manajemen perpustakaan.

**Requirements:**
* Sistem harus menyediakan form login dengan kolom username dan password.
* Sistem harus memverifikasi kredensial ke backend sebelum memberikan akses ke halaman manajemen.
* Sistem harus menampilkan pesan error yang jelas jika username atau password salah.
* Sistem harus mengakhiri sesi secara otomatis setelah 30 menit tanpa aktivitas (idle timeout) dan mengarahkan pengguna kembali ke halaman login.

**Business Rules:**
* Akun Guru hanya dapat dibuat oleh administrator sistem, bukan melalui self-registration.
* Sesi login wajib berakhir otomatis setelah 30 menit tidak aktif.
* Seluruh fitur manajemen hanya dapat diakses setelah Guru berhasil login.
* Password Guru wajib disimpan dalam bentuk hash (bcrypt), tidak boleh dalam bentuk plaintext.

---

### Feature ID: F002 — Manajemen Data Buku

**Description:** Fitur ini memungkinkan Guru menambah, mengubah, menghapus, dan mencari data buku, termasuk informasi lokasi rak agar posisi fisik buku dapat diketahui secara pasti.

**Requirements:**
* Sistem harus menyediakan form tambah buku dengan field: ID Buku, Judul, Penulis, Penerbit, Tema (dropdown opsional: Cerita & Dongeng / Lainnya), Tahun Terbit, Lokasi Rak, Stok, Tingkat Kelas (dropdown opsional 1–6), dan Status.
* Sistem harus menyediakan fitur ubah dan hapus data buku.
* Sistem harus menyediakan fitur pencarian buku berdasarkan judul, tema, atau ID Buku.
* Sistem harus menolak penyimpanan apabila ID Buku sudah terdaftar sebelumnya.
* Sistem harus menolak penyimpanan apabila field Lokasi Rak dikosongkan atau tidak sesuai format.
* Sistem harus menyediakan field Tingkat Kelas (opsional) dan field Tema (dropdown opsional) pada form tambah/edit buku.

**Business Rules:**
* ID Buku harus unik; sistem wajib menolak penyimpanan jika ID sudah digunakan.
* Nilai stok buku tidak boleh negatif (harus ≥ 0, bertipe integer).
* Buku berstatus "Dipinjam" tidak boleh dihapus dari sistem sebelum dikembalikan.
* Field Lokasi Rak wajib diisi saat buku ditambahkan dan tidak boleh kosong.
* Format Lokasi Rak wajib berupa kombinasi kode rak (huruf) dan nomor (misal: "A1", "B3"); sistem wajib menolak input yang tidak mengikuti format ini.
* Judul buku wajib divalidasi bersih dari tag skrip berbahaya (XSS prevention).
* Jika diisi, Tingkat Kelas harus bernilai 1–6; field ini bersifat opsional dan boleh dikosongkan.
* Tema hanya dapat dipilih dari dua nilai: "Cerita & Dongeng" atau "Lainnya" — tidak dapat diinput bebas; bersifat opsional (boleh dikosongkan).
* Buku pelajaran diidentifikasi melalui Tingkat Kelas (isi tingkat_kelas, kosongkan tema_buku). Buku non-pelajaran (cerita/dongeng/komik) diidentifikasi melalui Tema (isi tema_buku, kosongkan tingkat_kelas). Kedua field boleh sama-sama kosong untuk buku yang tidak jelas kategorinya.

---

### Feature ID: F003 — Pencatatan Peminjaman Buku

**Description:** Fitur ini memungkinkan Guru mencatat transaksi peminjaman buku oleh siswa secara digital.

**Requirements:**
* Sistem harus menyediakan form peminjaman dengan pilihan siswa dan pilihan buku.
* Sistem harus mengisi tanggal peminjaman secara otomatis berdasarkan tanggal hari ini.
* Sistem harus menyediakan kolom tanggal batas pengembalian yang dapat diatur oleh Guru.
* Sistem harus menyembunyikan buku dengan stok 0 dari daftar pilihan peminjaman.
* Sistem harus memperbarui stok dan status buku segera setelah transaksi peminjaman berhasil disimpan.

**Business Rules:**
* Buku dengan stok 0 (habis) tidak dapat dipilih untuk transaksi peminjaman.
* Satu transaksi peminjaman dapat mencakup lebih dari satu eksemplar buku untuk satu siswa dalam satu waktu; setiap buku dicatat sebagai baris data terpisah namun tetap dikelompokkan sebagai satu sesi peminjaman berdasarkan kombinasi siswa, tanggal peminjaman, dan tanggal batas pengembalian.
* Tanggal peminjaman diisi otomatis oleh sistem berdasarkan tanggal hari ini dan tidak dapat diubah manual.
* Tanggal batas pengembalian harus selalu lebih besar atau sama dengan tanggal peminjaman.
* Stok buku berkurang otomatis saat peminjaman berhasil dicatat, dan status buku berubah menjadi "Dipinjam".
* Nama siswa wajib divalidasi bersih dari tag skrip berbahaya (XSS prevention).

---

### Feature ID: F004 — Pencatatan Pengembalian Buku

**Description:** Fitur ini memungkinkan Guru mencatat pengembalian buku oleh siswa, termasuk kondisi fisik buku, status keterlambatan, dan denda keterlambatan yang dihitung otomatis oleh sistem.

**Requirements:**
* Sistem harus menyediakan form pengembalian yang terhubung ke ID Peminjaman terkait.
* Sistem harus menyediakan pilihan kondisi buku: Baik, Rusak Ringan, atau Rusak Berat.
* Sistem harus mengisi tanggal pengembalian secara otomatis berdasarkan tanggal hari ini.
* Sistem harus menghitung dan menampilkan jumlah hari keterlambatan secara otomatis, apabila ada.
* Sistem harus menghitung dan menampilkan nominal denda keterlambatan secara otomatis berdasarkan jumlah hari terlambat dan kondisi buku, sebelum Guru mengklik "Konfirmasi Pengembalian".
* Sistem harus memperbarui stok dan status buku segera setelah transaksi pengembalian berhasil disimpan.

**Business Rules:**
* Tanggal pengembalian diisi otomatis oleh sistem berdasarkan tanggal hari ini.
* Sistem menerapkan denda keterlambatan dengan formula berikut:
    * * Denda Keterlambatan = Rp 500 × jumlah hari terlambat (dihitung dari selisih Tanggal Pengembalian − Tanggal Batas Kembali; jika ≤ 0 hari, komponen ini Rp 0).
    * * Biaya Kondisi Buku = Rp 0 (Baik) / Rp 2.000 (Rusak Ringan) / Rp 5.000 (Rusak Berat).
    * *  Total Denda = Denda Keterlambatan + Biaya Kondisi Buku.
* Denda bersifat pencatatan informatif sebagai bagian dari data pengembalian — sistem ini tidak menyediakan modul pembayaran/pelunasan digital (transfer, status Lunas/Belum Lunas, dsb). Mekanisme pembayaran denda dilakukan secara manual di luar sistem oleh pihak sekolah.
* Sesuai Business Rule F005 (data riwayat read-only), nominal Total Denda yang sudah tersimpan tidak dapat diubah atau dihapus melalui antarmuka sistem setelah transaksi pengembalian dikonfirmasi — konsisten dengan sifat immutable data pengembalian yang sudah berlaku sejak v3.1. Jika terjadi kesalahan pencatatan kondisi buku, koreksi dilakukan secara manual oleh administrator langsung di database, bukan melalui antarmuka Guru.
* Data pengembalian disimpan terpisah dari data peminjaman, namun tetap terhubung melalui ID Peminjaman.
* Stok buku bertambah kembali dan status berubah menjadi "Tersedia" setelah pengembalian berhasil dicatat.

---

### Feature ID: F005 — Riwayat Peminjaman

**Description:** Fitur ini memungkinkan Guru melihat dan mencari seluruh riwayat transaksi peminjaman dan pengembalian buku, serta mengekspor data riwayat ke format Excel (.xlsx) berdasarkan bulan dan tahun tertentu.

**Requirements:**
* Sistem harus menampilkan daftar seluruh transaksi peminjaman dan pengembalian secara kronologis.
* Sistem harus menyediakan pencarian riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal.
* Sistem harus menampilkan status setiap transaksi (Dipinjam/Dikembalikan/Terlambat).
* Sistem harus menyediakan tombol "Export ke Excel" pada halaman Riwayat (PAGE-006), yang menghasilkan file .xlsx berisi seluruh kolom yang ditampilkan pada tabel Riwayat (Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Batas Kembali, Tanggal Kembali Aktual, Kondisi Buku, Denda, Status), difilter berdasarkan bulan dan tahun yang dipilih Guru.

**Business Rules:**
* Data riwayat bersifat read-only dan tidak dapat diubah atau dihapus oleh Guru melalui antarmuka sistem.
* Export hanya mencakup data yang sesuai dengan filter bulan/tahun yang dipilih; jika tidak ada transaksi pada periode tersebut, sistem menampilkan pesan informatif alih-alih men-generate file kosong.
* Fitur export hanya dapat diakses oleh Guru dengan sesi aktif — tidak tersedia di halaman publik.
* File Excel yang dihasilkan bersifat read-only snapshot pada saat export dilakukan; tidak ada mekanisme sinkronisasi otomatis setelah file diunduh.

---

### Feature ID: F006 — Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik)

**Description:** Fitur ini menyediakan akses publik tanpa login bagi siswa untuk melihat status ketersediaan dan lokasi rak buku, serta mencari buku berdasarkan judul/tema.

**Requirements:**
* Sistem harus menampilkan daftar buku beserta status ketersediaan (Tersedia/Dipinjam) dan lokasi rak tanpa memerlukan login.
* Sistem harus menyediakan fitur pencarian buku berdasarkan judul atau tema (dropdown tertutup: Cerita & Dongeng / Lainnya) untuk pengguna publik.
* Sistem tidak boleh menampilkan data peminjam (nama siswa yang meminjam) pada halaman publik.
* Sistem harus menyediakan filter kategori pada halaman publik: Semua / Kelas 1–6 / Cerita & Dongeng / Lainnya, dapat dikombinasikan dengan pencarian judul/tema.

**Business Rules:**
* Halaman akses siswa hanya bersifat read-only; tidak ada aksi penulisan data tanpa login.
* Informasi yang ditampilkan ke siswa dibatasi pada judul, penulis, tema, lokasi rak, dan status ketersediaan — data peminjam tidak ditampilkan.

---

### Feature ID: F007 — Sinkronisasi Stok & Status Otomatis

**Description:** Fitur ini menjamin bahwa stok dan status buku (Tersedia/Dipinjam) selalu konsisten dan diperbarui otomatis setiap kali transaksi peminjaman (F003) atau pengembalian (F004) berhasil dicatat, tanpa intervensi manual dari Guru.

**Requirements:**
* Sistem harus mengurangi stok buku sebanyak satu unit dan mengubah status menjadi "Dipinjam" segera setelah transaksi peminjaman berhasil disimpan.
* Sistem harus menambah stok buku sebanyak satu unit dan mengubah status menjadi "Tersedia" segera setelah transaksi pengembalian berhasil disimpan.
* Sistem harus memastikan perubahan stok dan status tercermin secara real-time pada halaman manajemen Guru maupun halaman publik siswa.

**Business Rules:**
* Perubahan stok dan status wajib terjadi dalam satu transaksi database yang sama dengan pencatatan peminjaman/pengembalian (tidak boleh terpisah/tertunda).
* Guru tidak diperbolehkan mengubah nilai stok secara manual di luar mekanisme peminjaman/pengembalian, kecuali melalui fitur Manajemen Data Buku (F002) saat menambah/mengoreksi data buku.

---

## 5. Out-of-Scope Features

1. Tidak ada fitur registrasi mandiri (self-registration) untuk akun Guru — akun hanya dibuat oleh administrator sistem.
2. Tidak ada fitur forgot password.
3. Buku dipinjam untuk digunakan di lingkungan sekolah; batas waktu pengembalian ditentukan oleh Guru saat mencatat transaksi peminjaman, dan tidak wajib dikembalikan pada hari yang sama — selama masih dalam periode yang ditentukan Guru.
4. Tidak ada login atau akun untuk Siswa — akses siswa selalu bersifat publik dan read-only.
5. Tidak ada integrasi dengan sistem Data Pokok Pendidikan (Dapodik) atau sistem dinas pendidikan — data siswa yang sudah terintegrasi pusat tidak dikelola ulang oleh sistem ini.
6. Tidak ada modul pendataan aset sekolah, penyusunan jadwal pelajaran, atau peminjaman fasilitas non-buku (misal: ruang kelas, alat olahraga) — sistem ini hanya mencakup domain perpustakaan.
7. Tidak ada manajemen multi-cabang atau multi-perpustakaan.
8. Tidak ada modul pemesanan/reservasi buku secara online oleh siswa.
9. Tidak ada notifikasi otomatis (email/SMS) untuk pengingat batas pengembalian.
10. Tidak ada manajemen multi-role, integrasi barcode/QR code pada versi ini. (Fitur export laporan riwayat bulanan/tahunan sudah masuk scope sejak v3.7 — lihat F005, FR-032.)
11. Tidak ada algoritma penataan ulang rak secara otomatis — Lokasi Rak diinput manual oleh Guru sebagai metadata referensi, bukan sistem pemetaan fisik otomatis.
12. Tidak ada mekanisme banding/pembatalan denda melalui antarmuka Guru — koreksi kesalahan pencatatan hanya dapat dilakukan oleh administrator sistem di luar antarmuka aplikasi.
13. Tidak ada akses multi-PC/jaringan (LAN) pada versi ini — sistem hanya berjalan pada satu unit PC perpustakaan (lihat Section 3.3).

---

## 6. Business Rules (Master List — Lintas Fitur)

Rule spesifik per fitur sudah dijabarkan di Section 4. Berikut adalah rule global yang berlaku lintas fitur dan wajib dipatuhi di seluruh sistem.

**Autentikasi & Keamanan**
1. Akun Guru hanya dapat dibuat oleh administrator sistem, bukan melalui self-registration.
2. Sesi login wajib berakhir otomatis setelah 30 menit tidak aktif (idle timeout).
3. Password Guru wajib disimpan dalam bentuk hash (bcrypt), tidak boleh dalam bentuk plaintext.
4. Seluruh input teks (judul buku, nama siswa, lokasi rak) wajib divalidasi bersih dari tag skrip berbahaya (XSS prevention).
5. ID Buku dan ID Siswa harus bersifat unik di dalam database.

**Integritas Data**
6. Nilai stok buku tidak boleh negatif (harus ≥ 0, bertipe integer).
7. Data riwayat peminjaman/pengembalian bersifat read-only dan tidak dapat diubah atau dihapus melalui antarmuka sistem.
8. Data pengembalian disimpan terpisah dari data peminjaman, namun tetap terhubung melalui ID Peminjaman.

**Akses Publik**
9. Halaman akses siswa hanya bersifat read-only; tidak ada aksi penulisan data tanpa login.
10. Data peminjam (nama siswa) tidak boleh ditampilkan pada halaman akses publik.

**Denda & Keuangan**
11. Nominal denda dihitung otomatis oleh sistem (Rp 500/hari keterlambatan + biaya kondisi buku); tidak ada input.
12. Data denda yang sudah tersimpan bersifat read-only, mengikuti sifat immutable data pengembalian

---

## 7. Data Requirements

### 7.1 Core Business Objects

| Object | Description |
|---|---|
| Buku | Menyimpan data master buku meliputi ID Buku, Judul, Penulis, Penerbit, Tema (opsional, dropdown: Cerita & Dongeng / Lainnya), Tahun Terbit, Lokasi Rak, Stok, Tingkat Kelas (opsional, 1–6), dan Status. |
| Siswa | Menyimpan data identitas siswa (Nama, Kelas) yang digunakan sebagai referensi transaksi peminjaman — bukan akun login. |
| Peminjaman | Menyimpan data transaksi peminjaman meliputi ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, dan Tanggal Batas Kembali. |
| Pengembalian | Menyimpan data transaksi pengembalian meliputi ID Pengembalian, ID Peminjaman (referensi), Tanggal Kembali, Kondisi Buku, dan Status Keterlambatan. |

### 7.2 Ownership Rules

| Object | Owner |
|---|---|
| Buku | Guru (akses kelola penuh: tambah, ubah, hapus). |
| Siswa | Guru (akses kelola penuh sebagai data referensi transaksi). |
| Peminjaman | Guru (akses buat dan lihat; tidak dapat diubah/dihapus setelah tersimpan). |
| Pengembalian | Guru (akses buat dan lihat; tidak dapat diubah/dihapus setelah tersimpan). |

### 7.3 Data Retention Rules

* Data peminjaman dan pengembalian wajib disimpan secara permanen di database selama minimal 3 tahun ajaran untuk keperluan audit dan pelaporan sekolah.
* Data buku yang sudah tidak aktif (misal rusak berat dan ditarik dari sirkulasi) tidak dihapus, melainkan diberi status "Tidak Aktif" agar riwayat historisnya tetap tersimpan.
* Karena database berbentuk file lokal (SQLite) yang tersimpan di PC perpustakaan, backup rutin (mis. mingguan) terhadap file database wajib dilakukan secara manual oleh administrator/pihak sekolah untuk mencegah kehilangan data akibat kerusakan PC.

### 7.4 Data Validation Rules

* ID Buku dan ID Siswa wajib unik dan tidak boleh kosong.
* Stok buku harus berupa bilangan bulat ≥ 0.
* Tanggal batas pengembalian harus ≥ tanggal peminjaman.
* Judul buku, nama siswa, dan lokasi rak wajib berupa karakter alfanumerik yang bersih dari tag skrip berbahaya.
* Total Denda harus berupa nilai non-negatif (≥ 0), dihitung otomatis oleh sistem — tidak menerima input manual.
* Tingkat Kelas, jika diisi, harus bernilai integer 1 sampai 6.
* Tema, jika diisi, hanya dapat berupa "Cerita & Dongeng" atau "Lainnya" (enum tertutup).

---

## 8. External Interfaces

### 8.1 User Interface Requirements

* Layout dioptimalkan untuk penggunaan pada satu unit PC desktop di perpustakaan (mode manajemen Guru dan mode publik siswa, digunakan bergantian pada perangkat yang sama).
* Navigasi Guru menggunakan sidebar menu (Manajemen Buku, Peminjaman, Pengembalian, Riwayat).
* Halaman publik siswa dibuat sederhana dengan kolom pencarian sebagai elemen utama.

### 8.2 External Systems

Tidak ada sistem eksternal pihak ketiga yang diintegrasikan pada versi ini (lihat Section 5 — Out-of-Scope, poin 6).

### 8.3 Communication Requirements

**Protocols:**
* HTTP (localhost) — komunikasi frontend ke backend berlangsung di dalam PC yang sama, tidak melewati jaringan publik sehingga HTTPS tidak diwajibkan pada versi ini.
* REST API (komunikasi utama frontend ke backend).

**Formats:**
* JSON (untuk pertukaran data buku, siswa, peminjaman, dan pengembalian).

---

## 9. Non-Functional Requirements

### 9.1 Performance
* Sistem harus memuat halaman daftar buku dalam waktu di bawah 1 detik, mengingat komunikasi berlangsung secara lokal (localhost) tanpa latensi jaringan eksternal.
* Proses pencatatan transaksi peminjaman/pengembalian harus selesai dalam waktu kurang dari 1 detik.

### 9.2 Security
* Hak akses ke halaman manajemen wajib dilindungi dengan mekanisme autentikasi (username & password).
* Token sesi login harus disimpan secara aman di sisi klien (HttpOnly Cookie).

### 9.3 Availability
* Sistem harus dapat diakses tanpa gangguan selama PC perpustakaan menyala dan aplikasi (server lokal) berjalan, dengan target ketersediaan minimal 99% selama jam operasional perpustakaan.

### 9.4 Reliability
* Sistem harus mampu menangani gangguan sementara (mis. PC idle/lag) tanpa menghilangkan data form yang sedang diisi Guru (local state retention sebelum submit).

### 9.5 Scalability
* Struktur database harus mampu menangani pertumbuhan data hingga 5.000 judul buku dan 2.000 transaksi per tahun ajaran tanpa penurunan performa signifikan pada penyimpanan berbasis file (SQLite).

### 9.6 Maintainability
* Source code aplikasi wajib ditulis menggunakan standar penamaan yang bersih dan modular untuk memudahkan pengembangan fitur baru di masa mendatang.

### 9.7 Usability
* Antarmuka Guru harus mudah dipahami oleh pengguna baru dengan waktu pelatihan maksimal 15 menit, mengingat Guru bukan tenaga IT.

---

## 10. Permissions and Access Control

| Capability | Guru | Siswa (Publik) |
|---|---|---|
| Login ke sistem | AKSI (ALLOWED) | DITOLAK (DENIED) — tidak ada akun |
| Tambah/Ubah/Hapus Data Buku | AKSI (ALLOWED) | DITOLAK (DENIED) |
| Mencatat Peminjaman | AKSI (ALLOWED) | DITOLAK (DENIED) |
| Mencatat Pengembalian | AKSI (ALLOWED) | DITOLAK (DENIED) |
| Melihat Riwayat Transaksi | AKSI (ALLOWED) | DITOLAK (DENIED) |
| Melihat Ketersediaan & Lokasi Buku | AKSI (ALLOWED) | AKSI (ALLOWED) |
| Mengubah/Menghapus Riwayat Transaksi | DITOLAK (DENIED) | DITOLAK (DENIED) |
| Melihat Nominal Denda pada Riwayat/Pengembalian | AKSI (ALLOWED) | DITOLAK (DENIED) |
| --- | --- | --- |
| Mengubah/Menghapus Nominal Denda via Antarmuka | DITOLAK (DENIED) — hanya administrator via database | DITOLAK (DENIED) |

---

## 11. Feature Inventory

| Feature ID | Feature Name | Priority |
|---|---|---|
| F001 | Autentikasi Guru (Login) | High |
| F002 | Manajemen Data Buku | High |
| F003 | Pencatatan Peminjaman Buku | High |
| F004 | Pencatatan Pengembalian Buku | High |
| F005 | Riwayat Peminjaman | Medium |
| F006 | Akses Ketersediaan & Lokasi Buku untuk Siswa | High |
| F007 | Sinkronisasi Stok & Status Otomatis | High |

---

## 12. Open Questions

1. Apakah nominal Rp 500/hari, Rp 2.000 (Rusak Ringan), dan Rp 5.000 (Rusak Berat) adalah angka final dari pihak sekolah, atau masih perlu disesuaikan sebelum go-live?
2. Apakah diperlukan batas maksimal (cap) nominal denda untuk kasus keterlambatan yang sangat lama?
3. Siapa yang bertanggung jawab menjalankan aplikasi (start server) setiap hari sebelum perpustakaan buka, dan siapa yang bertanggung jawab melakukan backup rutin file database SQLite?

---

## 13. Future Considerations

* Integrasi barcode/QR code pada buku untuk mempercepat proses pencatatan transaksi.
* Dukungan akses multi-PC via jaringan LAN sekolah, apabila ke depan dibutuhkan lebih dari satu titik akses di perpustakaan.
* Migrasi ke database server (mis. MySQL/PostgreSQL) apabila skala data atau jumlah titik akses bertambah sehingga SQLite tidak lagi mencukupi.
* Modul pelunasan denda (status Lunas/Belum Lunas) dan integrasi pembayaran, apabila sekolah memutuskan denda perlu dikelola sebagai kewajiban finansial formal.

---

## 14. Revision History
| **Version** | **Date** | **Author** | **Description** |
| --- | --- | --- | --- |
| **1.0** | 2026-06-30 | Kelompok DPSI BRAYYY | Draft awal sesuai struktur dasar tutorial SoT. |
| **2.0** | 2026-06-30 | Kelompok DPSI BRAYYY | Restrukturisasi sesuai Tutorial SoT (6 section wajib). |
| **2.1** | 2026-07-01 | Kelompok DPSI BRAYYY | Penyelarasan dengan Problem Statement — penambahan field Lokasi Rak dan klarifikasi Out-of-Scope. |
| **3.0** | 2026-07-01 | Kelompok DPSI BRAYYY | Ekspansi kedalaman dokumen: Feature ID per fitur, Data Requirements, External Interfaces, NFR, Permission Matrix, Feature Inventory, Open Questions, Future Considerations. |
| **3.1** | 2026-07-01 | Kelompok DPSI BRAYYY | Perbaikan kontradiksi internal Out-of-Scope poin #4 vs F003. |
| **3.2** | 2026-07-06 | Kelompok DPSI BRAYYY | Sinkronisasi dengan Design System v1.4: merevisi Business Rule F004 untuk mengakomodasi fitur Denda Keterlambatan (formula Rp 500/hari + biaya kondisi buku), merevisi Out-of-Scope poin #3, menambah Business Rule Master List poin 11–12, menambah baris Permission Matrix untuk kontrol akses denda, menambah Open Question soal nominal final dan cap denda, menambah Future Consideration soal modul pelunasan. |
| **3.3** | 2026-07-09 | Kelompok DPSI BRAYYY | Penyesuaian Tech Stack (Section 3) agar sistem dapat dijalankan secara lokal pada satu unit PC (Windows) di perpustakaan sekolah: database diganti dari MySQL menjadi SQLite (file-based, tanpa instalasi server DB terpisah), protokol komunikasi diubah dari HTTPS menjadi HTTP localhost (CORS tidak lagi diperlukan), deployment diubah dari hosting cloud (Vercel/Netlify/VPS/Railway) menjadi instalasi lokal PC. Menambah Out-of-Scope poin #14 (tanpa akses multi-PC/LAN), menambah catatan backup manual database di Section 7.3, menambah Open Question #3 soal operasional harian (start server & backup), menambah Future Consideration soal dukungan LAN dan migrasi DB server di masa depan. Section 8.1, 8.3, 9.1, 9.3, 9.5 disesuaikan mengikuti konteks single-PC lokal. |
| **3.4** | 2026-07-09 | Kelompok DPSI BRAYYY | Menambah Section 4.1 — Kebutuhan Fungsional (Functional Requirements) berisi daftar eksplisit FR-001 s.d. FR-029, disarikan dari Requirements tiap Feature ID (F001–F007) agar dapat ditelusuri (traceable) dan mudah ditemukan sebagai section tersendiri. Detail per fitur yang sudah ada dipindah ke Section 4.2 tanpa perubahan isi.
| **3.6** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Ubah tema_buku dari teks bebas menjadi dropdown tertutup (Cerita & Dongeng / Lainnya) opsional; penyempurnaan aturan pengisian:** (1) update FR-005, FR-025, FR-030, FR-031 di Section 4.1; (2) update Requirements & Business Rules F002 — Tema jadi dropdown opsional, Tingkat Kelas dropdown opsional, aturan pengisian mutually exclusive; (3) update Requirements F006 — filter kategori Semua/Kelas 1–6/Cerita & Dongeng/Lainnya; (4) update Section 7.1 & 7.4. |
| **3.7** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Tambah fitur Export Riwayat Peminjaman ke Excel (FR-032): filter bulan/tahun, akses terbatas Guru, kolom sesuai tabel Riwayat. Hapus bagian "laporan rekap bulanan/tahunan" dari Out-of-Scope (Section 5) dan Future Considerations (Section 13).** |

---

## Lampiran: Referensi
- Problem Statement — Observasi SD Negeri Tamanan, Yogyakarta (2026)
- Laporan Analisis Kebutuhan — Kelompok DPSI BRAYYY (2026)
- Praktikum 1 — Use Case Diagram Sistem Perpustakaan SD Negeri Tamanan
- Praktikum 2 — Class Diagram Sistem Perpustakaan SD Negeri Tamanan
- Chain of Truth: A Source-of-Truth Workflow for AI-Assisted Software Development — Suryanto & Athoillah (2026)