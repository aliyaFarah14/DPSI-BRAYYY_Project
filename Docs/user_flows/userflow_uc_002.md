# User Flow — UC-002: Manajemen Data Buku

Document Version: v1.0
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-01
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
| Page ID (IA) | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 |
| Route | `/buku` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat menambah, mengubah, menghapus, dan mencari data buku — termasuk field Lokasi Rak — agar katalog perpustakaan selalu akurat dan posisi fisik buku dapat diketahui secara pasti.

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
- Tabel katalog pada PAGE-003 dan halaman publik siswa (PAGE-002) diperbarui secara instan, sesuai F007.

### 6.2 Failure Postcondition
- Data tidak tersimpan/terubah/terhapus; modal form tetap terbuka dengan pesan error yang informatif, data isian tidak hilang (NFR 9.4).

---

## 7. MAIN FLOW — Tambah Buku Baru (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Berada di PAGE-003, mengklik tombol **"Tambah Buku Baru"**. | Sistem membuka Modal Dialog (PAGE-003-SUB-01) dengan backdrop blur, judul "Tambah Buku Baru". |
| 2 | Guru | Mengisi field: ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, **Lokasi Rak** (contoh: "A1"), Stok Awal (≥ 0). | Sistem menampilkan input real-time; label required ditandai (*). |
| 3 | Guru | Mengklik tombol **"Simpan"**. | Tombol berubah ke state `[Loading]` (spinner, disabled). Sistem mengirim request POST ke API. |
| 4 | — | — | Sistem memvalidasi: ID Buku belum terdaftar, Lokasi Rak terisi & sesuai format (huruf + nomor), Stok bertipe integer ≥ 0, Judul bersih dari tag skrip (XSS). |
| 5 | — | — | Validasi lolos. Sistem menyimpan data buku baru dengan Status default "Tersedia". |
| 6 | — | — | Modal tertutup otomatis; tabel katalog pada PAGE-003 diperbarui menampilkan buku baru; toast notifikasi sukses muncul. |

---

## 8. ALTERNATIVE FLOW

### AF-001: Ubah Data Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1A | Guru mengklik ikon **Edit (Pencil)** pada baris buku di tabel. | Sistem membuka Modal Dialog (PAGE-003-SUB-02) "Form Edit Data Buku" terisi otomatis dengan data buku terkait. |
| 2A | Guru mengubah field yang diperlukan (termasuk Lokasi Rak) lalu mengklik "Simpan". | Sistem menjalankan validasi yang sama seperti Main Flow step 4–6; data buku ter-update di tabel. |

### AF-002: Hapus Data Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1B | Guru mengklik ikon **Hapus (Trash2)** pada baris buku berstatus "Tersedia". | Sistem menampilkan modal konfirmasi: *"Apakah Anda yakin ingin menghapus buku ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan."* dengan tombol "Ya, Hapus" (Danger) dan "Batal" (Secondary). |
| 2B | Guru mengklik "Ya, Hapus". | Sistem menghapus data buku; tabel katalog diperbarui; toast notifikasi sukses muncul. |

### AF-003: Pencarian Buku

| Step | Action | System Response |
| --- | --- | --- |
| 1C | Guru mengetik kata kunci pada kolom pencarian (Judul/Tema/ID Buku). | Sistem memfilter tabel katalog secara live sesuai kata kunci. |
| 2C | Kata kunci tidak menemukan hasil. | Sistem menampilkan ikon `Search` dengan teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* |

---

## 9. EXCEPTION FLOW

### EF-001: ID Buku Sudah Terdaftar

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Sistem menemukan ID Buku yang diinput sudah ada di database. | Modal tetap terbuka, tombol "Simpan" kembali aktif. Pesan error di bawah field ID Buku: *"ID Buku sudah terdaftar, gunakan ID lain."* |

### EF-002: Lokasi Rak Kosong atau Format Salah

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Field Lokasi Rak kosong, atau tidak sesuai format kode huruf + nomor. | Pesan error spesifik di bawah field: *"Format Lokasi Rak tidak valid. Gunakan kombinasi kode rak (huruf) dan nomor, contoh: A1, B3."* Fokus kursor otomatis berpindah ke field ini. |

### EF-003: Stok Bernilai Negatif atau Bukan Integer

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Field Stok diisi nilai negatif atau bukan bilangan bulat. | Pesan error: *"Stok buku tidak boleh bernilai negatif (minimal 0)."* Request tidak dikirim ke server. |

### EF-004: Judul Buku Mengandung Tag Skrip Berbahaya

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Sistem mendeteksi tag skrip (XSS) pada field Judul. | Input ditolak; pesan error: *"Judul buku mengandung karakter yang tidak diperbolehkan."* |

### EF-005: Hapus Buku Berstatus "Dipinjam"

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Guru mencoba menghapus buku dengan Status "Dipinjam". | Tombol "Hapus" dalam keadaan `disabled` pada baris tersebut (tidak dapat diklik), sesuai Business Rule F002: *"Buku berstatus 'Dipinjam' tidak boleh dihapus dari sistem sebelum dikembalikan."* |

### EF-006: Koneksi Jaringan Gagal Saat Simpan

| Step | Condition | System Response |
| --- | --- | --- |
| 3E | Request API gagal (timeout/server down). | Modal/form tetap terbuka, data isian tidak hilang. Pesan error singkat di atas tombol aksi: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* |

---

## 10. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | ID Buku, Judul, Penulis, Penerbit, Tema, Tahun Terbit, Lokasi Rak, Stok, Status | Database → tabel `buku` |

---

## 11. RELATED PAGES & COMPONENTS (DS v1.3)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Katalog | Table Component (9.4) | Zebra striping, badge status stok, badge "Tidak Aktif" untuk buku non-sirkulasi. |
| Modal Tambah/Edit | Modal Dialog (9.3) | Backdrop blur, `max-w-md`, `shadow-lg`. |
| Field Lokasi Rak | Text Input (9.2) | Placeholder "Contoh: A1, B3"; validasi format khusus (Section 10 DS). |
| Tombol Hapus | Danger Button (9.1) + Destructive Action Pattern (11.5) | Disabled jika Status "Dipinjam". |
| Pesan Error | Validation — Error State | Merah, 12px, spesifik per field. |

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

---

## 13. NOTES

- Field Lokasi Rak wajib diisi saat buku ditambahkan dan tidak boleh kosong (SRS F002).
- Perubahan stok di luar mekanisme peminjaman/pengembalian hanya diperbolehkan melalui fitur ini (F002), sesuai Business Rule F007.
- Data buku yang ditarik dari sirkulasi (misal rusak berat) tidak dihapus permanen, melainkan diberi Status "Tidak Aktif" (SRS Section 7.3 — Data Retention Rules).