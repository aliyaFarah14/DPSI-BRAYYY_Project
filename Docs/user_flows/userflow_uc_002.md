# User Flow — UC-002: Manajemen Data Buku

Document Version: v1.1 (Sinkronisasi field Gambar Sampul/Image Upload — DS v1.5 Section 9.11, SRS v3.4)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-09
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. USE CASE HEADER

| Field | Value |
| --- | --- |
| UC ID | UC-002 |
| Use Case Name | Manajemen Data Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F002 |
| FR-ID Terkait (SRS v3.4) | FR-005, FR-006, FR-007, FR-008, FR-009 |
| Page ID (IA) | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 |
| Route | `/buku` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat menambah, mengubah, menghapus, dan mencari data buku — termasuk field Lokasi Rak dan **(opsional) Gambar Sampul** — agar katalog perpustakaan selalu akurat, posisi fisik buku dapat diketahui secara pasti, dan tampilan katalog/kartu publik lebih mudah dikenali siswa.

---

## 3. AKTOR

**ACT-01 — Guru.** Guru bertindak sebagai pengelola tunggal katalog buku (tidak ada petugas perpustakaan tetap), dengan hak akses penuh: tambah, ubah, hapus, dan cari data buku.

---

## 4. TRIGGER

- Guru mengklik menu **"Data Buku"** pada sidebar setelah login (UC-001).
- Guru mengakses langsung route `/buku` dengan sesi aktif.

---

## 5. PRE-CONDITION

- Guru telah berhasil login dan memiliki sesi aktif (UC-001 selesai).
- Guru berada di halaman PAGE-003 (Manajemen Data Buku).

---

## 6. POST-CONDITION

### 6.1 Success Postcondition
- Data buku baru tersimpan / data buku yang diubah ter-update / data buku terhapus dari database.
- **(Jika ada)** Gambar sampul tersimpan di filesystem lokal folder `/uploads` pada PC yang sama (bukan cloud storage), dan tertaut ke record buku terkait.
- Tabel katalog pada PAGE-003 dan halaman publik siswa (PAGE-002) diperbarui secara instan, sesuai F007, termasuk thumbnail sampul (jika ada) pada Card Component publik.

### 6.2 Failure Postcondition
- Data tidak tersimpan/terubah/terhapus; modal form tetap terbuka dengan pesan error yang informatif, data isian (termasuk gambar sampul yang sudah dipilih) tidak hilang (NFR 9.4).

---

## 7. MAIN FLOW — Tambah Buku Baru (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Berada di PAGE-003, mengklik tombol **"Tambah Buku Baru"**. | Sistem membuka Modal Dialog (PAGE-003-SUB-01) dengan backdrop blur, judul "Tambah Buku Baru". |
| 2 | Guru | **(Opsional, Baru v1.1)** Mengklik/menyeret file gambar ke area dropzone **Gambar Sampul** di bagian atas form. | Sistem menampilkan dropzone (rasio 3:4) dengan ikon `ImagePlus` dan teks *"Klik atau seret gambar sampul ke sini"*; setelah file dipilih, tampilkan overlay spinner (Uploading State), lalu preview gambar penuh (Filled State) dengan tombol hapus/ganti di pojok kanan atas. |
| 3 | Guru | Mengisi field: ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, **Lokasi Rak** (contoh: "A1"), Stok Awal (≥ 0). | Sistem menampilkan input real-time; label required ditandai (*); field Gambar Sampul tidak ditandai bintang merah karena bersifat opsional. |
| 4 | Guru | Mengklik tombol **"Simpan"**. | Tombol berubah ke state `[Loading]` (spinner, disabled). Sistem mengirim request POST ke API (termasuk file gambar sampul jika ada). |
| 5 | — | — | Sistem memvalidasi: ID Buku belum terdaftar, Lokasi Rak terisi & sesuai format (huruf + nomor), Stok bertipe integer ≥ 0, Judul bersih dari tag skrip (XSS), **(jika ada gambar) ukuran file ≤ 2MB dan format JPG/PNG**. |
| 6 | — | — | Validasi lolos. Sistem menyimpan data buku baru dengan Status default "Tersedia"; gambar sampul (jika ada) disimpan ke `/uploads` lokal dan path-nya ditautkan ke record buku. |
| 7 | — | — | Modal tertutup otomatis; tabel katalog pada PAGE-003 diperbarui menampilkan buku baru (beserta thumbnail sampul jika ada); toast notifikasi sukses muncul. |

---

## 8. ALTERNATIVE FLOW

### AF-001: Ubah Data Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1A | Guru mengklik ikon **Edit (Pencil)** pada baris buku di tabel. | Sistem membuka Modal Dialog (PAGE-003-SUB-02) "Form Edit Data Buku" terisi otomatis dengan data buku terkait, termasuk preview Gambar Sampul jika sudah pernah diunggah (atau dropzone kosong jika belum). |
| 2A | Guru mengubah field yang diperlukan (termasuk Lokasi Rak dan/atau mengganti Gambar Sampul) lalu mengklik "Simpan". | Sistem menjalankan validasi yang sama seperti Main Flow step 5–7; data buku ter-update di tabel; jika gambar sampul diganti, file lama digantikan file baru di `/uploads`. |

### AF-002: Hapus Data Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1B | Guru mengklik ikon **Hapus (Trash2)** pada baris buku berstatus "Tersedia". | Sistem menampilkan modal konfirmasi: *"Apakah Anda yakin ingin menghapus buku ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan."* dengan tombol "Ya, Hapus" (Danger) dan "Batal" (Secondary). |
| 2B | Guru mengklik "Ya, Hapus". | Sistem menghapus data buku (beserta gambar sampul terkait di `/uploads`, jika ada); tabel katalog diperbarui; toast notifikasi sukses muncul. |

### AF-003: Pencarian Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1C | Guru mengetik kata kunci pada kolom pencarian (Judul/Tema/ID Buku). | Sistem memfilter tabel katalog secara live sesuai kata kunci. |
| 2C | Kata kunci tidak menemukan hasil. | Sistem menampilkan ikon `Search` dengan teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* |

### AF-004: Buku Tanpa Gambar Sampul

| Step | Action | System Response |
| --- | --- | --- |
| 1D | Guru menyimpan data buku tanpa mengisi field Gambar Sampul (field dilewati). | Sistem menyimpan data buku seperti biasa; Card Component publik (PAGE-002) dan Table Katalog menampilkan placeholder inisial judul buku di atas latar `color-primary-light`, konsisten dengan behavior buku-buku lama sebelum fitur ini ada. |

---

## 9. EXCEPTION FLOW

### EF-001: ID Buku Sudah Terdaftar

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Sistem menemukan ID Buku yang diinput sudah ada di database. | Modal tetap terbuka, tombol "Simpan" kembali aktif. Pesan error di bawah field ID Buku: *"ID Buku sudah terdaftar, gunakan ID lain."* |

### EF-002: Lokasi Rak Kosong atau Format Salah

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Field Lokasi Rak kosong, atau tidak sesuai format kode huruf + nomor. | Pesan error spesifik di bawah field: *"Format Lokasi Rak tidak valid. Gunakan kombinasi kode rak (huruf) dan nomor, contoh: A1, B3."* Fokus kursor otomatis berpindah ke field ini. |

### EF-003: Stok Bernilai Negatif atau Bukan Integer

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Field Stok diisi nilai negatif atau bukan bilangan bulat. | Pesan error: *"Stok buku tidak boleh bernilai negatif (minimal 0)."* Request tidak dikirim ke server. |

### EF-004: Judul Buku Mengandung Tag Skrip Berbahaya

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Sistem mendeteksi tag skrip (XSS) pada field Judul. | Input ditolak; pesan error: *"Judul buku mengandung karakter yang tidak diperbolehkan."* |

### EF-005: Hapus Buku Berstatus "Dipinjam"

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Guru mencoba menghapus buku dengan Status "Dipinjam". | Tombol "Hapus" dalam keadaan `disabled` pada baris tersebut (tidak dapat diklik), sesuai Business Rule F002: *"Buku berstatus 'Dipinjam' tidak boleh dihapus dari sistem sebelum dikembalikan."* |

### EF-006: Koneksi Jaringan Gagal Saat Simpan

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Request API gagal (timeout/server down, atau server lokal di PC perpustakaan belum berjalan). | Modal/form tetap terbuka, data isian (termasuk gambar sampul yang sudah dipilih) tidak hilang. Pesan error singkat di atas tombol aksi: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* |

### EF-007: Gambar Sampul Melebihi Ukuran Maksimal atau Format Tidak Didukung *(Baru v1.1)*

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Guru mengunggah file gambar berukuran > 2MB, atau berformat selain JPG/PNG. | Dropzone menampilkan Error State: border `#C1121F`, pesan spesifik di bawah dropzone, mis. *"Ukuran file melebihi 2MB. Silakan kompres gambar terlebih dahulu."* atau *"Format file tidak didukung. Gunakan JPG atau PNG."* Field teks lain pada form tidak terpengaruh dan tidak hilang. |

---

## 10. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Lokasi Rak, Stok, Status, **Path Gambar Sampul (opsional)** | Database → tabel `buku`; file gambar → filesystem lokal `/uploads` |

---

## 11. RELATED PAGES & COMPONENTS (DS v1.5)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Katalog | Table Component (9.4) | Zebra striping, badge status stok, badge "Tidak Aktif" untuk buku non-sirkulasi. |
| Modal Tambah/Edit | Modal Dialog (9.3) | Backdrop blur, `max-w-md`, `shadow-lg`. |
| **Field Gambar Sampul** | **Image Upload (9.11 — baru v1.4/v1.5)** | Dropzone rasio 3:4, opsional, maksimal 2MB, format JPG/PNG, disimpan lokal `/uploads`; posisi di atas field teks lain (Form Design Rules Section 10 DS). |
| Field Lokasi Rak | Text Input (9.2) | Placeholder "Contoh: A1, B3"; validasi format khusus (Section 10 DS). |
| Tombol Hapus | Danger Button (9.1) + Destructive Action Pattern (11.5) | Disabled jika Status "Dipinjam". |
| Pesan Error | Validation — Error State | Merah, 12px, spesifik per field, termasuk error ukuran/format gambar. |

---

## 12. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-002-01 | Guru berhasil menambah buku baru dengan data lengkap dan valid; buku muncul di tabel katalog. |
| AC-002-02 | Sistem menolak penyimpanan jika ID Buku sudah terdaftar. |
| AC-002-03 | Sistem menolak penyimpanan jika Lokasi Rak kosong atau format tidak sesuai. |
| AC-002-04 | Sistem menolak penyimpanan jika Stok bernilai negatif. |
| AC-002-05 | Guru berhasil mengubah data buku, termasuk Lokasi Rak. |
| AC-002-06 | Tombol Hapus dinonaktifkan untuk buku berstatus "Dipinjam". |
| AC-002-07 | Guru berhasil menghapus buku berstatus "Tersedia" setelah konfirmasi modal. |
| AC-002-08 | Pencarian buku memfilter tabel secara live berdasarkan Judul/Tema/ID Buku. |
| **AC-002-09** | **Guru dapat mengunggah Gambar Sampul (opsional) saat menambah/mengubah buku; sistem menolak file > 2MB atau format selain JPG/PNG dengan pesan error spesifik.** |
| **AC-002-10** | **Buku tanpa Gambar Sampul menampilkan placeholder inisial judul secara konsisten pada Card Component publik dan Table Katalog.** |

---

## 13. NOTES

- Field Lokasi Rak wajib diisi saat buku ditambahkan dan tidak boleh kosong (SRS F002).
- Perubahan stok di luar mekanisme peminjaman/pengembalian hanya diperbolehkan melalui fitur ini (F002), sesuai Business Rule F007.
- Data buku yang ditarik dari sirkulasi (misal rusak berat) tidak dihapus permanen, melainkan diberi Status "Tidak Aktif" (SRS Section 7.3 — Data Retention Rules).
- **(Baru v1.1)** Field Gambar Sampul bersifat opsional — tidak memaksa Guru mengunggah gambar untuk buku lama yang sudah terlanjur dicatat sebelum fitur ini ada (DS v1.5 Section 9.11).
- **(Baru v1.1)** Gambar sampul disimpan di filesystem lokal PC perpustakaan (`/uploads`), bukan cloud storage — konsisten dengan konteks deployment single-PC SRS v3.4. Backup gambar sampul mengikuti mekanisme backup manual file/folder yang sama dengan database SQLite (SRS Section 7.3).

---

## 14. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal — belum mencakup field Gambar Sampul (DS masih v1.3, belum ada Image Upload). |
| **1.1** | **2026-07-09** | **Kelompok DPSI BRAYYY** | **Sinkronisasi dengan DS v1.5 Section 9.11 (Image Upload) dan SRS v3.4:** (1) tambah step Main Flow untuk unggah Gambar Sampul (opsional); (2) tambah AF-004 untuk buku tanpa gambar sampul (placeholder); (3) tambah EF-007 untuk error ukuran/format file; (4) tambah field Path Gambar Sampul di Related Data; (5) tambah AC-002-09, AC-002-10; (6) tambah FR-ID Terkait di Header; (7) Notes diperbarui soal sifat opsional dan penyimpanan lokal. |