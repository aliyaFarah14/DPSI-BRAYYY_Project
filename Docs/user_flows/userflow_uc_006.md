# User Flow — UC-006: Akses Ketersediaan & Lokasi Buku (Publik)

Document Version: v1.2 (Sempurnakan filter tema menjadi dropdown tertutup Cerita & Dongeng/Lainnya — sinkron srs.md v3.6 & data_model.md v1.5)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-11
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. USE CASE HEADER

| Field | Value |
| --- | --- |
| UC ID | UC-006 |
| Use Case Name | Akses Ketersediaan & Lokasi Buku (Publik) |
| Actor | ACT-02 — Siswa |
| Feature ID (SRS) | F006 |
| FR-ID Terkait (SRS v3.6) | FR-024, FR-025 (pencarian tema dropdown tertutup), FR-026, FR-031 (filter kategori kelas & tema) |
| Page ID (IA) | PAGE-002 |
| Route | `/` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Siswa dapat mengetahui status ketersediaan dan lokasi rak sebuah buku, serta mencari/memfilter buku berdasarkan judul, tema (Cerita & Dongeng / Lainnya), atau tingkat kelas (1–6) secara mandiri, tanpa harus bertanya langsung ke Guru dan tanpa memerlukan login.

---

## 3. AKTOR

**ACT-02 — Siswa.** Pengguna publik tanpa akun/login; akses bersifat read-only sepenuhnya.

---

## 4. TRIGGER

- Siswa membuka URL root `/` secara langsung di browser, pada PC yang sama dengan Guru mengoperasikan sistem (konteks deployment single-PC, SRS v3.4).
- Siswa mengakses tautan publik yang dibagikan oleh Guru/sekolah.

---

## 5. PRE-CONDITION

- Sistem dalam kondisi aktif dan dapat diakses melalui browser (server lokal di PC perpustakaan sudah dijalankan).
- Tidak diperlukan akun atau sesi login apa pun.

---

## 6. POST-CONDITION

### 6.1 Success Postcondition
- Siswa melihat daftar buku beserta status ketersediaan dan lokasi rak, dapat mencari buku berdasarkan judul/tema.
- Tidak ada data yang ditulis atau diubah oleh siswa (murni read-only).

### 6.2 Failure Postcondition
- Halaman gagal memuat data buku karena kegagalan koneksi; sistem menampilkan Inline Alert Banner error.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Siswa | Membuka URL `/` melalui browser (Chrome/Edge) pada PC perpustakaan. | Sistem menampilkan Topbar Publik ("Perpustakaan SD Negeri Tamanan" + tombol "Login Guru") dan daftar buku dalam format Card/Table (Judul, Penulis, **Tema (Cerita & Dongeng / Lainnya)**, **Lokasi Rak**, Stok Tersedia, Status), serta Baris Kategori Filter (Semua / Kelas 1–6 / Cerita & Dongeng / Lainnya) di bawah kolom pencarian. |
| 2 | Siswa | (Opsional) Mengklik tombol kategori filter (Kelas 1–6, Cerita & Dongeng, atau Lainnya) untuk menyaring daftar buku. | Sistem menyaring daftar buku sesuai kategori yang dipilih (`?tingkat_kelas=N` atau `?tema_buku=Cerita & Dongeng`/`?tema_buku=Lainnya`), dapat dikombinasikan dengan pencarian teks di kolom pencarian. |
| 3 | Siswa | Mengetik kata kunci judul atau tema pada kolom pencarian (dapat dikombinasikan dengan filter kategori). | Sistem memfilter daftar buku secara live sesuai kata kunci dan kategori yang dipilih. |
| 4 | Siswa | Meninjau Badge Status (Hijau: Tersedia, Merah: Dipinjam/Stok Habis) dan chip Lokasi Rak pada buku yang dicari. | Sistem menampilkan informasi lengkap tanpa memerlukan interaksi tambahan (tanpa login). |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Tampilan Fallback Layar Sempit

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Jendela browser diperkecil hingga lebar < 768px (fallback ketangguhan UI, bukan target device utama — SRS v3.4 Section 3.1). | Sistem menampilkan daftar buku dalam format kartu satu kolom (Viewport Mobile — Section 12 DS); tidak ada sidebar. |

### AF-002: Siswa Ingin Beralih ke Area Guru

| Step | Condition | System Response |
| --- | --- | --- |
| 1B | Siswa (atau Guru yang membuka halaman publik) mengklik tombol **"Login Guru"** di Topbar. | Sistem mengarahkan ke `/login` (PAGE-001, UC-001). |

### EF-001: Pencarian Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Kata kunci judul/tema tidak cocok dengan data buku manapun. | Sistem menampilkan ikon `Search` dengan tanda tanya + teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* |

### EF-002: Belum Ada Data Buku di Katalog

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Katalog buku masih kosong (belum ada data dari UC-002). | Sistem menampilkan Empty State: ikon `BookOpen` + teks informatif bahwa katalog belum tersedia. |

### AF-003: Filter Kategori Tidak Menemukan Hasil *(Baru v1.1)*

| Step | Condition | System Response |
| --- | --- | --- |
| 1F | Siswa memilih kategori filter (Kelas/Tema) yang tidak cocok dengan data buku manapun. | Sistem menampilkan ikon `Search` + teks: *"Buku tidak ditemukan untuk kategori ini."* |

### EF-003: Koneksi Jaringan/Server Lokal Gagal

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Request API gagal — pada konteks deployment single-PC (SRS v3.4), penyebab realistisnya lebih sering karena server backend lokal belum dijalankan/berhenti, bukan gangguan jaringan eksternal. | Inline Alert Banner: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* dengan tombol "Coba Lagi". |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | Judul, Penulis, Tema, Lokasi Rak, Stok, Status | Database → tabel `buku` (read-only, terbatas field publik) |

> Catatan: Data peminjam (Nama Siswa yang meminjam) dan data **Denda** **tidak** ditampilkan pada halaman ini, sesuai Business Rule Master List poin 10 dan Section 4.2 F006 SRS v3.4. Filter kategori beroperasi pada kolom `tingkat_kelas` (dengan `OR tingkat_kelas IS NULL` sehingga buku untuk semua kelas tetap muncul) dan `tema_buku`.

---

## 10. RELATED PAGES & COMPONENTS (DS v1.5)

| Element | DS Component | Notes |
| --- | --- | --- |
| Topbar | Header/Topbar — varian Publik (9.9) | Nama sistem + tombol Secondary "Login Guru". |
| Daftar Buku | Card Component — Buku Publik (9.6) / Table Component (9.4) | Chip Lokasi Rak wajib tampil konsisten (IA Section 3.4); thumbnail sampul (jika ada, dari Image Upload F002) atau placeholder inisial judul. |
| Badge Status | Badge/Status Indicator (9.5) | Hijau: Tersedia; Merah: Dipinjam/Stok Habis. |
| Kolom Pencarian | Text Input (9.2) | Elemen utama halaman, sesuai IA Section 8.1. |
| Empty/No-Result State | Empty State (11.2) / Search No-Result State (11.3) | Ikon + teks informatif. |
| Error Koneksi | System Error State (11.7) | Inline Alert Banner dengan tombol "Coba Lagi". |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-006-01 | Siswa dapat mengakses `/` tanpa login dan melihat daftar buku beserta status ketersediaan dan lokasi rak. |
| AC-006-02 | Siswa dapat mencari buku berdasarkan judul atau tema secara live. |
| AC-006-03 | Halaman publik tidak menampilkan data peminjam (nama siswa yang meminjam) maupun data denda. |
| AC-006-04 | Tidak ada aksi penulisan data pada halaman publik (murni read-only). |
| AC-006-05 | Tombol "Login Guru" mengarahkan ke `/login` dengan benar. |
| AC-006-06 | Halaman responsif: tampilan kartu satu kolom pada layar < 768px (fallback). |
| AC-006-07 | **Siswa dapat memfilter daftar buku berdasarkan kategori Kelas 1–6 (tingkat_kelas) atau Tema (Cerita & Dongeng / Lainnya), dikombinasikan dengan pencarian judul/tema.** |

---

## 12. NOTES

- Halaman akses siswa hanya bersifat read-only; tidak ada aksi penulisan data tanpa login (Business Rule F006 & Master List poin 9).
- Informasi yang ditampilkan dibatasi pada: judul, penulis, tema, lokasi rak, dan status ketersediaan (Business Rule F006). Data peminjam dan nominal denda tidak termasuk dalam informasi publik.
- Tidak ada akun/login untuk siswa pada versi ini — akses siswa selalu bersifat publik dan read-only (Out-of-Scope poin #5).
- Sesuai konteks deployment single-PC (SRS v3.4), Siswa dan Guru mengakses sistem dari perangkat/browser yang sama secara bergantian — bukan dari perangkat terpisah di jaringan berbeda.

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal, mengacu srs.md v3.1 dan design_system.md v1.3. |
| **1.1** | **2026-07-10** | **Kelompok DPSI BRAYYY** | **Tambah filter kategori kelas pada halaman publik:** (1) tambah FR-031 di Header; (2) update Main Flow — step 1 perbarui deskripsi filter, tambah step 2 (filter kategori), renumber step 2→3 dan 3→4; (3) tambah AF-003 (filter kategori tidak menemukan hasil); (4) update Related Data dengan catatan filter tingkat_kelas; (5) tambah AC-006-07. Sinkron srs.md v3.5 & design_system.md v1.6. |
| **1.2** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Sempurnakan filter tema menjadi enum tertutup Cerita & Dongeng/Lainnya:** (1) update Header — FR-ID v3.6; (2) update GOAL — sebut filter tingkat_kelas & tema; (3) update Main Flow step 1 — Tema jadi "(Cerita & Dongeng / Lainnya)", Baris Kategori filter dengan 4 nilai; (4) update step 2 — query param `?tema_buku=`; (5) update AC-006-07 — sebut spesifik nilai tema. Sinkron srs.md v3.6 & data_model.md v1.5.** |