# srs.md — Software Requirements Specification
## Sistem Informasi Perpustakaan SD Negeri Tamanan

**Document Version:** v3.1 (Perbaikan kontradiksi Out-of-Scope vs F003)**Project:** Sistem Informasi Perpustakaan SD Negeri Tamanan
**Product:** Web-Based Library Management System
**Status:** Draft
**Last Updated:** 2026-07-01
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

| Layer | Teknologi |
|---|---|
| Frontend | React (Vite) |
| Backend | Express.js (Node.js) |
| Database | MySQL |
| Komunikasi Frontend–Backend | REST API, format JSON, protokol HTTPS |
| Autentikasi | Username & password, password disimpan dalam bentuk hash (bcrypt) |

Catatan arsitektur: Frontend dan backend wajib berjalan sebagai dua project terpisah (bukan satu framework gabungan). Frontend wajib menggunakan `fetch`/`axios` untuk memanggil REST API milik backend, dan backend wajib mengaktifkan CORS agar dapat diakses oleh frontend.

### 3.1 Operating Environment

* **Browser Support:** Google Chrome, Mozilla Firefox, Microsoft Edge (versi terbaru).
* **Device Support:** Desktop/laptop untuk Guru (input intensif); tablet/mobile untuk akses publik siswa (read-only).
* **Deployment:** Frontend dan backend dapat di-deploy pada layanan hosting terpisah (misal: Vercel/Netlify untuk frontend, VPS/Railway untuk backend) — detail infrastruktur ditentukan pada dokumen arsitektur, bukan pada SRS ini.

### 3.2 Assumptions

* Perangkat yang digunakan Guru dan siswa selalu terhubung ke jaringan internet sekolah yang stabil selama jam operasional.
* Server backend dan database MySQL berjalan pada satu lingkungan hosting yang sama atau saling terhubung secara stabil.

### 3.3 Constraints

* Sistem hanya boleh digunakan pada satu unit sekolah (SD Negeri Tamanan) — tidak ada dukungan multi-sekolah.
* Keamanan data transaksi bergantung penuh pada sesi login Guru yang aktif dan valid.

---

## 4. In-Scope Features

Setiap fitur wajib diimplementasikan sesuai Feature ID, Description, Requirements, dan Business Rules berikut. AI coding assistant wajib mengacu pada detail per-fitur ini, bukan hanya judul fitur.

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
* Sistem harus menyediakan form tambah buku dengan field: ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Lokasi Rak, Stok, dan Status.
* Sistem harus menyediakan fitur ubah dan hapus data buku.
* Sistem harus menyediakan fitur pencarian buku berdasarkan judul, tema, atau ID Buku.
* Sistem harus menolak penyimpanan apabila ID Buku sudah terdaftar sebelumnya.
* Sistem harus menolak penyimpanan apabila field Lokasi Rak dikosongkan atau tidak sesuai format.

**Business Rules:**
* ID Buku harus unik; sistem wajib menolak penyimpanan jika ID sudah digunakan.
* Nilai stok buku tidak boleh negatif (harus ≥ 0, bertipe integer).
* Buku berstatus "Dipinjam" tidak boleh dihapus dari sistem sebelum dikembalikan.
* Field Lokasi Rak wajib diisi saat buku ditambahkan dan tidak boleh kosong.
* Format Lokasi Rak wajib berupa kombinasi kode rak (huruf) dan nomor (misal: "A1", "B3"); sistem wajib menolak input yang tidak mengikuti format ini.
* Judul buku wajib divalidasi bersih dari tag skrip berbahaya (XSS prevention).

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
* Satu transaksi peminjaman hanya berlaku untuk satu eksemplar buku per siswa per waktu.
* Tanggal peminjaman diisi otomatis oleh sistem berdasarkan tanggal hari ini dan tidak dapat diubah manual.
* Tanggal batas pengembalian harus selalu lebih besar atau sama dengan tanggal peminjaman.
* Stok buku berkurang otomatis saat peminjaman berhasil dicatat, dan status buku berubah menjadi "Dipinjam".
* Nama siswa wajib divalidasi bersih dari tag skrip berbahaya (XSS prevention).

---

### Feature ID: F004 — Pencatatan Pengembalian Buku

**Description:** Fitur ini memungkinkan Guru mencatat pengembalian buku oleh siswa, termasuk kondisi fisik buku dan status keterlambatan.

**Requirements:**
* Sistem harus menyediakan form pengembalian yang terhubung ke ID Peminjaman terkait.
* Sistem harus menyediakan pilihan kondisi buku: Baik, Rusak Ringan, atau Rusak Berat.
* Sistem harus mengisi tanggal pengembalian secara otomatis berdasarkan tanggal hari ini.
* Sistem harus menghitung dan menampilkan jumlah hari keterlambatan secara otomatis, apabila ada.
* Sistem harus memperbarui stok dan status buku segera setelah transaksi pengembalian berhasil disimpan.

**Business Rules:**
* Tanggal pengembalian diisi otomatis oleh sistem berdasarkan tanggal hari ini.
* Sistem menampilkan informasi keterlambatan (jumlah hari) secara informatif, tanpa menerapkan denda.
* Data pengembalian disimpan terpisah dari data peminjaman, namun tetap terhubung melalui ID Peminjaman.
* Stok buku bertambah kembali dan status berubah menjadi "Tersedia" setelah pengembalian berhasil dicatat.

---

### Feature ID: F005 — Riwayat Peminjaman

**Description:** Fitur ini memungkinkan Guru melihat dan mencari seluruh riwayat transaksi peminjaman dan pengembalian buku.

**Requirements:**
* Sistem harus menampilkan daftar seluruh transaksi peminjaman dan pengembalian secara kronologis.
* Sistem harus menyediakan pencarian riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal.
* Sistem harus menampilkan status setiap transaksi (Dipinjam/Dikembalikan/Terlambat).

**Business Rules:**
* Data riwayat bersifat read-only dan tidak dapat diubah atau dihapus oleh Guru melalui antarmuka sistem.

---

### Feature ID: F006 — Akses Ketersediaan & Lokasi Buku untuk Siswa (Publik)

**Description:** Fitur ini menyediakan akses publik tanpa login bagi siswa untuk melihat status ketersediaan dan lokasi rak buku, serta mencari buku berdasarkan judul/tema.

**Requirements:**
* Sistem harus menampilkan daftar buku beserta status ketersediaan (Tersedia/Dipinjam) dan lokasi rak tanpa memerlukan login.
* Sistem harus menyediakan fitur pencarian buku berdasarkan judul atau tema untuk pengguna publik.
* Sistem tidak boleh menampilkan data peminjam (nama siswa yang meminjam) pada halaman publik.

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
3. Tidak ada sistem denda/sanksi atas keterlambatan pengembalian buku (kebijakan sekolah negeri tidak memberlakukan denda).
4. Buku dipinjam untuk digunakan di lingkungan sekolah; batas waktu pengembalian ditentukan oleh Guru saat mencatat transaksi peminjaman, dan tidak wajib dikembalikan pada hari yang sama — selama masih dalam periode yang ditentukan Guru.
5. Tidak ada login atau akun untuk Siswa — akses siswa selalu bersifat publik dan read-only.
6. Tidak ada integrasi dengan sistem Data Pokok Pendidikan (Dapodik) atau sistem dinas pendidikan — data siswa yang sudah terintegrasi pusat tidak dikelola ulang oleh sistem ini.
7. Tidak ada modul pendataan aset sekolah, penyusunan jadwal pelajaran, atau peminjaman fasilitas non-buku (misal: ruang kelas, alat olahraga) — sistem ini hanya mencakup domain perpustakaan.
8. Tidak ada manajemen multi-cabang atau multi-perpustakaan.
9. Tidak ada modul pemesanan/reservasi buku secara online oleh siswa.
10. Tidak ada notifikasi otomatis (email/SMS) untuk pengingat batas pengembalian.
11. Tidak ada fitur laporan rekap bulanan/tahunan, manajemen multi-role, integrasi barcode/QR code, atau mode offline-first pada versi ini.
12. Tidak ada algoritma penataan ulang rak secara otomatis — Lokasi Rak diinput manual oleh Guru sebagai metadata referensi, bukan sistem pemetaan fisik otomatis.

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

---

## 7. Data Requirements

### 7.1 Core Business Objects

| Object | Description |
|---|---|
| Buku | Menyimpan data master buku meliputi ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Lokasi Rak, Stok, dan Status. |
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

### 7.4 Data Validation Rules

* ID Buku dan ID Siswa wajib unik dan tidak boleh kosong.
* Stok buku harus berupa bilangan bulat ≥ 0.
* Tanggal batas pengembalian harus ≥ tanggal peminjaman.
* Judul buku, nama siswa, dan lokasi rak wajib berupa karakter alfanumerik yang bersih dari tag skrip berbahaya.

---

## 8. External Interfaces

### 8.1 User Interface Requirements

* Layout responsif, dioptimalkan untuk desktop/laptop (halaman manajemen Guru) dan tablet/mobile (halaman publik siswa).
* Navigasi Guru menggunakan sidebar menu (Manajemen Buku, Peminjaman, Pengembalian, Riwayat).
* Halaman publik siswa dibuat sederhana dengan kolom pencarian sebagai elemen utama.

### 8.2 External Systems

Tidak ada sistem eksternal pihak ketiga yang diintegrasikan pada versi ini (lihat Section 5 — Out-of-Scope, poin 6).

### 8.3 Communication Requirements

**Protocols:**
* HTTPS (untuk menjamin keamanan transmisi data).
* REST API (komunikasi utama frontend ke backend).

**Formats:**
* JSON (untuk pertukaran data buku, siswa, peminjaman, dan pengembalian).

---

## 9. Non-Functional Requirements

### 9.1 Performance
* Sistem harus memuat halaman daftar buku dalam waktu di bawah 2 detik pada koneksi internet standar sekolah.
* Proses pencatatan transaksi peminjaman/pengembalian harus selesai dalam waktu kurang dari 1 detik.

### 9.2 Security
* Hak akses ke halaman manajemen wajib dilindungi dengan mekanisme autentikasi (username & password).
* Token sesi login harus disimpan secara aman di sisi klien (HttpOnly Cookie).

### 9.3 Availability
* Sistem harus memiliki tingkat ketersediaan (uptime) minimal 99% selama jam operasional sekolah.

### 9.4 Reliability
* Sistem harus mampu menangani kegagalan jaringan sementara tanpa menghilangkan data form yang sedang diisi Guru (local state retention sebelum submit).

### 9.5 Scalability
* Struktur database harus mampu menangani pertumbuhan data hingga 5.000 judul buku dan 2.000 transaksi per tahun ajaran tanpa penurunan performa signifikan.

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

* Belum ada pertanyaan terbuka saat ini.

---

## 13. Future Considerations

* Pengembangan fitur laporan rekap bulanan/tahunan peminjaman buku.
* Integrasi barcode/QR code pada buku untuk mempercepat proses pencatatan transaksi.
* Mode offline-first apabila koneksi internet sekolah sewaktu-waktu terputus.

---

## 14. Revision History

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| **1.0** | 2026-06-30 | Kelompok DPSI BRAYYY | Draft awal sesuai struktur dasar tutorial SoT. |
| **2.0** | 2026-06-30 | Kelompok DPSI BRAYYY | Restrukturisasi sesuai Tutorial SoT (6 section wajib). |
| **2.1** | 2026-07-01 | Kelompok DPSI BRAYYY | Penyelarasan dengan Problem Statement — penambahan field Lokasi Rak dan klarifikasi Out-of-Scope. |
| **3.0** | 2026-07-01 | Kelompok DPSI BRAYYY | Ekspansi kedalaman dokumen: Feature ID per fitur (Requirements & Business Rules), penambahan Data Requirements, External Interfaces, NFR, Permission Matrix, Feature Inventory, Open Questions, Future Considerations. |
| **3.1** | 2026-07-01 | Kelompok DPSI BRAYYY | Perbaikan kontradiksi internal: revisi Out-of-Scope poin #4 (Section 5) agar selaras dengan Feature F003 — peminjaman tidak lagi dibatasi "dikembalikan pada hari yang sama". Perubahan dipicu temuan konsistensi dari design_system.md v1.2 Section 10. |
---

## Lampiran: Referensi
- Problem Statement — Observasi SD Negeri Tamanan, Yogyakarta (2026)
- Laporan Analisis Kebutuhan — Kelompok DPSI BRAYYY (2026)
- Praktikum 1 — Use Case Diagram Sistem Perpustakaan SD Negeri Tamanan
- Praktikum 2 — Class Diagram Sistem Perpustakaan SD Negeri Tamanan
- Chain of Truth: A Source-of-Truth Workflow for AI-Assisted Software Development — Suryanto & Athoillah (2026)