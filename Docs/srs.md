Software Requirements Specification (SRS)
Document Version: v1.0
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-06-25
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

### 1. INTRODUCTION
1.1 Purpose
Dokumen ini mendefinisikan spesifikasi kebutuhan fungsional dan non-fungsional untuk Sistem Informasi Perpustakaan SD Negeri Tamanan berbasis web. Dokumen ini berfungsi sebagai source of truth tunggal (SoT-1) yang melandasi pembuatan artefak pengembangan berikutnya seperti User Flows, Arsitektur Sistem, Model Data, dan API Contracts.

1.2 Scope
Business Goals
Mendigitalisasi pencatatan peminjaman dan pengembalian buku perpustakaan untuk menghindari kehilangan data.
Mempermudah pengelolaan data buku dan pemantauan stok secara real-time.
Memberikan akses informasi ketersediaan buku kepada siswa secara mandiri tanpa bergantung pada petugas.

In Scope
Pencatatan transaksi peminjaman buku (memilih siswa, memilih buku, menyimpan tanggal pinjam dan batas kembali).
Pencatatan pengembalian buku beserta kondisi buku dan pengecekan keterlambatan.
Manajemen Data Buku (menambah, mengubah, menghapus, dan mencari buku di sistem).
Pengelolaan stok dan status ketersediaan buku secara otomatis pasca-transaksi.
Riwayat peminjaman dan pengembalian yang dapat dicari dan difilter oleh guru.
Akses publik bagi siswa untuk melihat ketersediaan buku tanpa login.

Out of Scope
Sistem denda atau sanksi atas keterlambatan pengembalian buku.
Peminjaman buku yang dapat dilakukan secara mandiri oleh siswa tanpa konfirmasi guru.
Integrasi dengan sistem Data Pokok Pendidikan (Dapodik) atau sistem dinas pendidikan.
Manajemen multi-cabang atau multi-perpustakaan.
Modul pemesanan/reservasi buku secara online oleh siswa.

1.3 Stakeholders
StakeholderRoleResponsibilityKepala Sekolah / KlienProject SponsorMemberikan arahan kebutuhan dan menyetujui hasil akhir sistem.Guru / Petugas PerpustakaanEnd User (Admin)Mengelola data buku, mencatat transaksi peminjaman dan pengembalian, serta melihat riwayat.SiswaEnd User (Read-only)Melihat ketersediaan dan mencari buku secara mandiri tanpa login.System AnalystAuthorMenyusun dan memperbarui dokumentasi Source of Truth (SoT).

1.4 Definitions
TermDefinitionLMSLibrary Management System — sistem pengelolaan perpustakaan berbasis web.GuruAktor berperan sebagai administrator sistem yang mengelola buku dan transaksi perpustakaan.SiswaAktor pengguna akhir yang dapat melihat ketersediaan dan mencari buku tanpa login.Stok BukuJumlah eksemplar buku yang tersedia dan siap dipinjam di perpustakaan.Status BukuKondisi ketersediaan buku: "Tersedia" atau "Dipinjam".SoTSource of Truth — artefak yang telah divalidasi dan menjadi referensi resmi untuk pekerjaan hilir.

1.5 References
Laporan Analisis Kebutuhan — Kelompok DPSI BRAYYY, Universitas Ahmad Dahlan (2026).
Praktikum 1 — Use Case Diagram Sistem Perpustakaan SD Negeri Tamanan.
Praktikum 2 — Class Diagram Sistem Perpustakaan SD Negeri Tamanan.
Chain of Truth: A Source-of-Truth Workflow for AI-Assisted Software Development — Suryanto & Athoillah, UAD (2026).
IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.
ISO/IEC/IEEE 29148:2018 — Systems and Software Engineering: Requirements Engineering.

### 2. PRODUCT OVERVIEW
2.1 Product Summary
Sistem Informasi Perpustakaan SD Negeri Tamanan merupakan aplikasi berbasis web yang dirancang untuk mendigitalisasi dan menyederhanakan operasional perpustakaan sekolah. Berdasarkan hasil observasi dan wawancara, perpustakaan saat ini tidak memiliki petugas tetap, pencatatan masih manual menggunakan buku tulis yang sebagian datanya telah hilang, penataan buku tidak terorganisir, dan stok buku tidak dapat diketahui secara pasti. Sistem ini hadir untuk menyelesaikan permasalahan tersebut dengan menyediakan antarmuka yang sederhana dan mudah digunakan oleh guru yang merangkap sebagai pengelola perpustakaan, tanpa memerlukan latar belakang teknis.

2.2 User Types
User TypeDescriptionGuruPengguna dengan akses penuh (administrator). Bertugas mengelola data buku, mencatat transaksi peminjaman dan pengembalian, serta memantau riwayat transaksi. Guru wajib login untuk mengakses seluruh fitur manajemen.SiswaPengguna dengan akses terbatas (read-only). Dapat melihat ketersediaan buku dan mencari buku tanpa perlu melakukan login ke sistem.

2.3 User Goals
User Type: Guru
Dapat melakukan login ke sistem dengan aman menggunakan username dan password.
Dapat menambah, mengubah, menghapus, dan mencari data buku di sistem dengan mudah.
Dapat mencatat transaksi peminjaman buku siswa beserta tanggal pinjam dan batas pengembalian.
Dapat mencatat pengembalian buku dan memperbarui kondisi serta status buku secara otomatis.
Dapat melihat dan mencari riwayat seluruh transaksi peminjaman dan pengembalian buku.

User Type: Siswa
Dapat melihat status ketersediaan buku (tersedia/dipinjam) tanpa memerlukan login.
Dapat mencari buku berdasarkan judul atau tema secara mandiri.

2.4 Operating Environment
Frontend: HTML5, CSS3, JavaScript Framework (React/Vue/Next.js).
Backend: Node.js / Python / Go Rest API.
Database: Relational Database (PostgreSQL / MySQL).
Deployment: Cloud Hosting (AWS / GCP / DigitalOcean).
Browser Support: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (versi terbaru).
Device Support: Desktop PC, Laptop, Tablet — Responsive Web Layout.

2.5 Assumptions
Sekolah menyediakan minimal satu unit komputer yang terhubung internet di area perpustakaan untuk digunakan guru.
Guru memiliki akun yang telah dibuat dan dikonfigurasi sebelum sistem digunakan.
Perangkat komputer di perpustakaan selalu terhubung dengan koneksi internet yang stabil selama jam operasional sekolah.
Data buku awal (inventaris ±16.000 eksemplar) akan dimasukkan ke sistem secara manual oleh guru sebelum sistem mulai digunakan.

2.6 Constraints
Sistem hanya mendukung satu perpustakaan (single-school, single-library); manajemen multi-cabang di luar cakupan.
Keamanan data bergantung pada kerahasiaan akun login guru — tidak ada mekanisme self-registration.
Penghapusan buku yang masih berstatus "Dipinjam" tidak diperkenankan hingga buku dikembalikan.

### 3. SYSTEM FEATURES
# Feature ID: F001
Feature Name: Autentikasi Guru (Login)
Description
Fitur ini memungkinkan guru untuk masuk ke dalam sistem perpustakaan menggunakan username dan password agar dapat mengakses seluruh fitur manajemen yang memerlukan hak akses administrator.

Requirements
Sistem harus menyediakan halaman login dengan kolom username dan password.
Sistem harus memvalidasi kredensial guru ke database sebelum memberikan akses.
Sistem harus menampilkan pesan kesalahan yang informatif jika username atau password tidak sesuai.
Sistem harus mengarahkan guru ke halaman utama dashboard setelah login berhasil.
Sistem harus menyediakan fungsi logout yang mengakhiri sesi aktif guru.

Business Rules
Akun guru hanya dapat dibuat oleh administrator sistem, bukan melalui self-registration.
Sesi login harus berakhir secara otomatis setelah periode tidak aktif (idle timeout) selama 30 menit.
Seluruh fitur manajemen (tambah/ubah/hapus buku, catat transaksi, lihat riwayat) hanya dapat diakses setelah guru berhasil login.

# Feature ID: F002
Feature Name: Manajemen Data Buku
Description
Fitur ini memungkinkan guru untuk mengelola katalog buku perpustakaan secara penuh, mencakup penambahan buku baru, pengubahan informasi buku yang ada, penghapusan buku, dan pencarian buku berdasarkan kata kunci.

Requirements
Sistem harus menyediakan formulir tambah buku dengan kolom: ID Buku, Judul Buku, Penulis, Penerbit, Tema Buku, Tahun Terbit, dan Stok Awal.
Sistem harus memvalidasi seluruh kolom wajib sebelum menyimpan data buku baru.
Sistem harus memungkinkan guru mengubah data buku yang sudah terdaftar melalui form edit.
Sistem harus menyediakan tombol konfirmasi penghapusan sebelum data buku dihapus secara permanen.
Sistem harus menyediakan kolom pencarian buku berdasarkan judul atau tema/kategori.
Sistem harus menampilkan daftar seluruh buku beserta informasi stok dan status ketersediaannya.

Business Rules
ID Buku harus bersifat unik; sistem menolak penyimpanan jika ID sudah digunakan.
Nilai stok buku tidak boleh bernilai negatif (harus ≥ 0).
Buku yang sedang berstatus "Dipinjam" tidak dapat dihapus dari sistem sebelum dikembalikan.
Stok buku berkurang otomatis saat transaksi peminjaman berhasil dicatat, dan bertambah kembali saat pengembalian berhasil dicatat.

# Feature ID: F003
Feature Name: Pencatatan Peminjaman Buku
Description
Fitur ini memungkinkan guru untuk mencatat transaksi peminjaman buku yang dilakukan oleh siswa, termasuk memilih siswa peminjam, buku yang dipinjam, tanggal pinjam, dan tanggal batas pengembalian.

Requirements
Sistem harus menampilkan daftar buku yang tersedia (stok > 0) saat guru membuka menu peminjaman.
Sistem harus menyediakan formulir peminjaman dengan kolom: nama dan kelas siswa, buku yang dipinjam, tanggal peminjaman (otomatis terisi), dan tanggal batas pengembalian.
Sistem harus memvalidasi kelengkapan data sebelum menyimpan transaksi peminjaman.
Sistem harus memperbarui status buku menjadi "Dipinjam" dan mengurangi stok secara otomatis setelah transaksi berhasil disimpan.
Sistem harus menampilkan konfirmasi bahwa transaksi peminjaman berhasil dicatat.

Business Rules
Buku dengan stok 0 (habis) tidak dapat dipilih untuk transaksi peminjaman.
Satu transaksi peminjaman hanya untuk satu eksemplar buku per siswa per waktu.
Tanggal peminjaman diisi otomatis oleh sistem berdasarkan tanggal hari ini dan tidak dapat diubah secara manual.

# Feature ID: F004
Feature Name: Pencatatan Pengembalian Buku
Description
Fitur ini memungkinkan guru untuk mencatat proses pengembalian buku oleh siswa, memperbarui kondisi buku, mengecek status keterlambatan, dan memperbarui ketersediaan stok buku.

Requirements
Sistem harus menampilkan daftar transaksi peminjaman yang belum dikembalikan saat guru membuka menu pengembalian.
Sistem harus memungkinkan guru memilih data peminjaman yang akan diproses pengembaliannya.
Sistem harus menyediakan kolom kondisi buku (Baik / Rusak Ringan / Rusak Berat) yang diisi guru saat pengembalian.
Sistem harus secara otomatis menghitung dan menampilkan informasi keterlambatan jika pengembalian melebihi tanggal batas.
Sistem harus memperbarui status buku menjadi "Tersedia" dan menambah stok kembali setelah pengembalian berhasil dicatat.

Business Rules
Tanggal pengembalian diisi otomatis oleh sistem berdasarkan tanggal hari ini.
Sistem menampilkan informasi keterlambatan (jumlah hari terlambat) secara informatif, namun tidak menerapkan sanksi denda karena kebijakan sekolah negeri tidak memberlakukan denda.
Data pengembalian disimpan secara terpisah dari data peminjaman namun tetap terhubung melalui ID Peminjaman.

# Feature ID: F005
Feature Name: Riwayat Peminjaman
Description
Fitur ini menyediakan rekap historis seluruh transaksi peminjaman dan pengembalian buku yang dapat diakses dan dicari oleh guru untuk keperluan monitoring dan pelaporan.

Requirements
Sistem harus menampilkan daftar riwayat seluruh transaksi peminjaman dan pengembalian secara kronologis.
Sistem harus menyediakan fungsi pencarian riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal.
Sistem harus menampilkan detail riwayat meliputi: nama siswa, kelas, judul buku, tanggal pinjam, tanggal batas kembali, tanggal kembali aktual, dan kondisi buku.
Sistem harus membedakan secara visual antara transaksi yang sudah dikembalikan dan yang masih aktif dipinjam.

Business Rules
Data riwayat bersifat read-only dan tidak dapat diubah atau dihapus oleh guru melalui antarmuka sistem.
Seluruh data riwayat tersedia sejak pertama kali sistem digunakan tanpa batasan periode waktu tampil.

# Feature ID: F006
Feature Name: Akses Ketersediaan Buku untuk Siswa (Publik)
Description
Fitur ini memungkinkan siswa untuk melihat status ketersediaan buku dan mencari buku berdasarkan judul atau tema secara mandiri tanpa perlu melakukan login ke sistem.

Requirements
Sistem harus menyediakan halaman publik (tanpa login) yang menampilkan daftar buku beserta status ketersediaannya.
Sistem harus menyediakan kolom pencarian buku berdasarkan judul atau tema/kategori.
Sistem harus menampilkan informasi minimal: Judul Buku, Penulis, Tema, Stok Tersedia, dan Status Buku.
Sistem harus memperbarui informasi ketersediaan buku secara real-time mengikuti perubahan transaksi peminjaman dan pengembalian.

Business Rules
Halaman akses siswa hanya bersifat read-only; tidak ada aksi penulisan data yang dapat dilakukan tanpa login.
Informasi yang ditampilkan kepada siswa dibatasi hanya pada judul, penulis, tema, dan status ketersediaan — data peminjam tidak ditampilkan.

### 4. DATA REQUIREMENTS
4.1 Core Business Objects
ObjectDescriptionBukuMenyimpan data master buku meliputi ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Stok, dan Status Buku.SiswaMenyimpan data siswa peminjam meliputi ID Siswa, Nama Siswa, dan Kelas.GuruMenyimpan data guru pengelola perpustakaan meliputi ID Guru, Nama Guru, Username, dan Password (hashed).PeminjamanMenyimpan data transaksi peminjaman meliputi ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, Tanggal Batas Pengembalian, dan Status Peminjaman.PengembalianMenyimpan data transaksi pengembalian meliputi ID Pengembalian, ID Peminjaman, Tanggal Pengembalian, Kondisi Buku, dan Status Pengembalian.RiwayatPeminjamanMenyimpan data riwayat transaksi peminjaman dan pengembalian meliputi ID Riwayat, Tanggal Riwayat, dan Status Peminjaman.

4.2 Ownership Rules
ObjectOwnerBukuGuru (akses kelola penuh: tambah, ubah, hapus, cari). Siswa (hanya baca).SiswaGuru (akses tambah dan lihat data siswa).PeminjamanGuru (hanya memiliki akses membuat dan melihat).PengembalianGuru (hanya memiliki akses membuat dan melihat).RiwayatPeminjamanGuru (hanya akses baca/lihat; tidak dapat diubah atau dihapus).

4.3 Data Retention Rules
Data transaksi peminjaman dan pengembalian wajib disimpan secara permanen di database minimal selama 5 tahun untuk keperluan audit dan pelaporan sekolah.
Data riwayat peminjaman tidak dapat dihapus oleh pengguna melalui antarmuka sistem.
Log aktivitas pengelolaan data buku (tambah/ubah/hapus) dibersihkan secara berkala setiap 1 tahun sekali.

4.4 Data Validation Rules
Stok buku harus berupa bilangan bulat positif (integer ≥ 0).
Tanggal batas pengembalian harus selalu lebih besar atau sama dengan tanggal peminjaman.
Judul buku dan nama siswa wajib berupa karakter alfanumerik yang bersih dari tag skrip berbahaya (XSS prevention).
Password guru wajib disimpan dalam bentuk hash (bcrypt) dan tidak boleh disimpan dalam bentuk plaintext.
ID Buku dan ID Siswa harus bersifat unik di dalam database.

5. EXTERNAL INTERFACES
5.1 User Interface Requirements
Layout responsif yang dioptimalkan untuk resolusi Desktop PC, Laptop, dan Tablet.
Navigasi konsisten menggunakan sidebar menu (Data Buku, Peminjaman, Pengembalian, Riwayat, Logout) untuk guru; halaman publik untuk siswa.
Formulir input dibuat sederhana dengan penanda field wajib (required fields) yang jelas.
Indikator visual (warna merah/oranye) untuk buku dengan stok habis atau transaksi yang melewati batas pengembalian.

5.2 External Systems
SystemPurposeWeb BrowserAntarmuka utama yang digunakan guru dan siswa untuk mengakses sistem via browser modern.

5.3 Communication Requirements
Protocols
HTTPS (untuk menjamin keamanan transmisi data antara client dan server)
REST API (komunikasi utama antara frontend dan backend)


Formats
JSON (untuk pertukaran data objek buku, transaksi, dan siswa antara frontend dan backend)
### 6. NON-FUNCTIONAL REQUIREMENTS

6.1 Performance
Sistem harus memuat halaman utama dalam waktu di bawah 2 detik pada koneksi internet standar.
Proses penyimpanan transaksi peminjaman/pengembalian ke database harus selesai dalam waktu kurang dari 500 milidetik.

6.2 Security
Akses fitur manajemen wajib dilindungi dengan mekanisme autentikasi (Username & Password).
Seluruh token sesi login harus dienkripsi dan disimpan dengan aman di sisi klien (HttpOnly Cookie).
Password guru wajib disimpan dalam bentuk hash bcrypt dan tidak boleh tersimpan sebagai plaintext.

6.3 Availability
Sistem perpustakaan berbasis web harus memiliki tingkat ketersediaan (uptime) minimal 99% selama jam operasional sekolah.

6.4 Reliability
Sistem harus mampu menangani kegagalan jaringan sementara tanpa menghilangkan data yang sedang diinput pada layar browser guru (local state retention).

6.5 Scalability
Struktur database harus mampu menangani pertumbuhan data hingga 5.000 transaksi peminjaman per tahun tanpa penurunan performa yang signifikan.

6.6 Maintainability
baru di masa mendatang.

6.7 Usability
Antarmuka sistem harus mudah dipahami oleh guru tanpa latar belakang teknis, dengan waktu pelatihan maksimal 15 menit.

### 7. PERMISSIONS AND ACCESS CONTROL
CapabilityGuru (Login)Siswa (Publik)Login ke sistemALLOWEDDENIEDMenambahkan data bukuALLOWEDDENIEDMengubah data bukuALLOWEDDENIEDMenghapus data bukuALLOWEDDENIEDMencatat transaksi peminjamanALLOWEDDENIEDMencatat pengembalian bukuALLOWEDDENIEDMelihat riwayat transaksiALLOWEDDENIEDMelihat ketersediaan bukuALLOWEDALLOWEDMencari buku (publik)ALLOWEDALLOWEDMengubah riwayat transaksi lampauDENIEDDENIED

### 8. FEATURE INVENTORY
Feature IDFeature NamePriorityF001Autentikasi Guru (Login)HighF002Manajemen Data Buku (Tambah, Ubah, Hapus, Cari)HighF003Pencatatan Transaksi Peminjaman BukuHighF004Pencatatan Pengembalian BukuHighF005Riwayat Peminjaman dan PengembalianHighF006Akses Ketersediaan Buku untuk Siswa (Publik)Medium

### 9. OPEN QUESTIONS
Q01 — Apakah sistem perlu menampilkan notifikasi atau pengingat kepada guru untuk buku yang mendekati atau telah melewati batas pengembalian?
Q02 — Apakah data siswa perlu dimasukkan secara manual oleh guru ke master data, atau cukup diisi saat mencatat transaksi peminjaman?
Q03 — Apakah laporan rekap bulanan atau tahunan diperlukan sebagai fitur tersendiri di masa mendatang?

### 10. FUTURE CONSIDERATIONS
Pengembangan sistem notifikasi otomatis (email/SMS) kepada guru untuk pengingat batas pengembalian buku.
Fitur laporan rekap bulanan dan tahunan untuk kebutuhan pelaporan kepada kepala sekolah atau dinas pendidikan.
Pengembangan modul manajemen multi-role (pemisahan peran Kepala Sekolah, Guru, dan Siswa dengan hak akses berbeda).
Integrasi dengan sistem Dapodik untuk sinkronisasi data siswa secara otomatis.
Fitur barcode/QR code untuk mempercepat proses pencatatan peminjaman dan pengembalian buku.
Sinkronisasi data lokal (Offline-first mode) jika koneksi internet di sekolah sewaktu-waktu terputus.

### 11. REVISION HISTORY
VersionDateAuthorDescription1.02026-06-25Kelompok DPSI BRAYYYInitial Draft — SRS Sistem Informasi Perpustakaan SD Negeri Tamanan berdasarkan hasil analisis kebutuhan, Praktikum 1 & 2, dan metodologi Chain of Truth (Suryanto & Athoillah, 2026).