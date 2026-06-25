# User Flow — UC-006: Akses Ketersediaan Buku (Publik — Siswa)

Document Version: v1.0
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-06-25
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. USE CASE HEADER

| Field | Value |
| --- | --- |
| UC ID | UC-006 |
| Use Case Name | Akses Ketersediaan Buku (Publik — Siswa) |
| Actor | ACT-02 — Siswa |
| Feature ID (SRS) | F006 |
| Page ID (IA) | PAGE-002 |
| Route | / (root) |
| Priority | Medium |
| Status | Draft |

---

## 2. GOAL

Siswa dapat melihat status ketersediaan buku dan mencari buku berdasarkan judul atau tema secara mandiri tanpa perlu login — sehingga siswa tidak perlu bertanya kepada guru untuk mengetahui apakah buku yang diinginkan tersedia atau sedang dipinjam.

---

## 3. TRIGGER

Salah satu dari kondisi berikut memicu use case ini:

- Siswa membuka URL root (`/`) aplikasi di browser komputer perpustakaan sekolah.
- Siswa menerima tautan publik halaman perpustakaan dan membukanya.

---

## 4. PRECONDITIONS

- Sistem dalam kondisi aktif dan dapat diakses.
- Komputer di area perpustakaan terhubung ke internet.
- Siswa tidak perlu memiliki akun atau melakukan login.
- (Opsional) Data buku telah dimasukkan ke sistem melalui UC-002 oleh guru.

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition
- Siswa berhasil melihat daftar buku beserta status ketersediaannya.
- Siswa berhasil menemukan informasi buku yang dicari (judul, penulis, tema, stok, status).

### 5.2 No Data Postcondition
- Jika katalog buku belum terisi, halaman menampilkan empty state yang informatif.

---

## 6. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Siswa | Membuka browser dan mengakses URL `/` (root) aplikasi perpustakaan. | Sistem menampilkan halaman publik "Perpustakaan SD Negeri Tamanan" (PAGE-002) tanpa sidebar. Tampil judul halaman, kolom pencarian, daftar buku, dan tombol "Login Guru" di pojok kanan atas. |
| 2 | Siswa | Melihat daftar buku yang ditampilkan dalam tabel atau format kartu. | Sistem menampilkan daftar seluruh buku dengan kolom: Judul Buku, Penulis, Tema, Stok Tersedia, dan Status Buku. Badge hijau (Tersedia) atau merah (Stok Habis/Dipinjam). |
| 3 | Siswa | Menelusuri daftar buku untuk menemukan buku yang diinginkan. | Tabel dapat di-scroll jika data buku banyak. Tidak ada aksi penulisan data yang dapat dilakukan siswa. |
| 4 | Siswa | Menemukan buku yang diinginkan dan melihat status ketersediaannya. | Sistem menampilkan stok tersedia dan status buku secara real-time sesuai data transaksi terkini. |
| 5 | Siswa | Selesai mencari informasi; menutup browser atau tetap di halaman. | Sistem tidak melakukan perubahan apapun. Halaman tetap dapat diakses. |

---

## 7. ALTERNATIVE FLOW

### AF-001: Siswa Mencari Buku Berdasarkan Judul

| Step | Condition | Action |
| --- | --- | --- |
| 3A | Siswa ingin mencari buku tertentu berdasarkan judul. | Siswa mengetikkan kata kunci judul buku pada kolom pencarian. Sistem memfilter daftar secara real-time, menampilkan hanya buku yang judulnya cocok dengan kata kunci. |

### AF-002: Siswa Mencari Buku Berdasarkan Tema/Kategori

| Step | Condition | Action |
| --- | --- | --- |
| 3A | Siswa ingin mencari buku berdasarkan kategori (contoh: "Sains", "Dongeng", "Sejarah"). | Siswa mengetikkan tema/kategori pada kolom pencarian. Sistem memfilter daftar menampilkan buku yang temanya sesuai. |

### AF-003: Guru Mengakses Halaman Publik

| Step | Condition | Action |
| --- | --- | --- |
| 1A | Guru (bukan siswa) mengakses URL root (`/`). | Sistem tetap menampilkan halaman publik. Guru dapat mengklik tombol **"Login Guru"** di pojok kanan atas untuk beralih ke halaman `/login` (PAGE-001) dan masuk ke sistem manajemen. |

---

## 8. EXCEPTION FLOW

### EF-001: Katalog Buku Masih Kosong

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Guru belum memasukkan data buku apapun ke sistem. | Halaman menampilkan Empty State di area daftar buku: ikon buku dan teks: *"Katalog buku perpustakaan belum tersedia. Silakan kunjungi kembali nanti."* |

### EF-002: Pencarian Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 3E | Kata kunci yang dimasukkan siswa tidak cocok dengan judul atau tema buku manapun. | Sistem menampilkan Empty State di area daftar: ikon kaca pembesar dan teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* |

### EF-003: Koneksi Internet Terputus

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Komputer di perpustakaan kehilangan koneksi internet saat siswa mencoba mengakses halaman. | Browser menampilkan halaman error koneksi bawaan. Sistem tidak dapat menampilkan data. Siswa perlu menunggu koneksi pulih atau menghubungi guru. |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | judulBuku, penulis, temaBuku, stok, statusBuku | Database → tabel `buku` (read-only; real-time sesuai transaksi terkini) |

> Catatan: Halaman ini **tidak menampilkan** data identitas peminjam (nama siswa, kelas), nomor ID peminjaman, atau riwayat transaksi apapun — sesuai business rule SRS F006 untuk menjaga privasi data siswa.

---

## 10. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Layout Halaman Publik | Halaman tanpa Sidebar, header dengan nama sekolah | Nuansa hijau segar, ramah anak |
| Tombol "Login Guru" | Secondary Button — pojok kanan atas | Mengarahkan ke `/login` (PAGE-001) |
| Kolom Pencarian Buku | Text Input — Search | Placeholder: "Cari judul atau tema buku..." |
| Tabel Buku Publik | Table Component — read-only, zebra striping | Kolom: Judul, Penulis, Tema, Stok, Status |
| Badge "Tersedia" | Badge — Hijau (`bg-green-100 text-green-700`) | Stok buku > 0 |
| Badge "Stok Habis" | Badge — Merah (`bg-red-100 text-red-700`) | Stok buku = 0 |
| Card Buku (opsional tampilan alternatif) | Card Component — Buku Publik | Tampilan grid kartu buku untuk UX lebih ramah anak |
| Empty State — Katalog Kosong | Ilustrasi ikon buku + teks informatif | Muncul jika belum ada data buku |
| Empty State — Pencarian Kosong | Ilustrasi ikon Search + teks informatif | Muncul jika pencarian tidak menemukan hasil |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-006-01 | Halaman dapat diakses tanpa login di URL `/`. |
| AC-006-02 | Daftar buku menampilkan kolom: Judul, Penulis, Tema, Stok Tersedia, dan Status Buku. |
| AC-006-03 | Badge hijau (Tersedia) dan merah (Stok Habis) ditampilkan dengan benar sesuai stok aktual. |
| AC-006-04 | Pencarian berdasarkan judul memfilter daftar buku sesuai kata kunci. |
| AC-006-05 | Pencarian berdasarkan tema memfilter daftar buku sesuai kata kunci. |
| AC-006-06 | Pencarian yang tidak menemukan hasil menampilkan empty state yang informatif. |
| AC-006-07 | Data identitas peminjam (nama siswa) tidak ditampilkan di halaman publik. |
| AC-006-08 | Tidak ada tombol atau aksi penulisan data (tambah, edit, hapus) yang tersedia untuk siswa. |
| AC-006-09 | Status ketersediaan buku mencerminkan kondisi real-time sesuai transaksi terakhir. |
| AC-006-10 | Tombol "Login Guru" mengarahkan ke halaman `/login`. |

---

## 12. NOTES

- Halaman ini sepenuhnya bersifat **read-only** dan tidak memerlukan autentikasi apapun.
- Informasi yang ditampilkan dibatasi pada data buku saja — tidak ada data transaksi atau data pribadi siswa yang ditampilkan.
- Halaman ini merupakan satu-satunya halaman yang dapat diakses oleh aktor Siswa (ACT-02) pada sistem ini.

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |