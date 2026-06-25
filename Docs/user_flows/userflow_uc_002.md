# User Flow — UC-002: Manajemen Data Buku

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
| UC ID | UC-002 |
| Use Case Name | Manajemen Data Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F002 |
| Page ID (IA) | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 |
| Route | /buku |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat mengelola katalog buku perpustakaan secara penuh: menambah buku baru, mengubah data buku yang sudah ada, menghapus buku dari katalog, dan mencari buku berdasarkan kata kunci — sehingga data buku di sistem selalu akurat dan terkini.

---

## 3. TRIGGER

Salah satu dari kondisi berikut memicu use case ini:

- Guru berhasil login (UC-001 selesai) → sistem otomatis menampilkan PAGE-003.
- Guru mengklik menu **"Data Buku"** pada Sidebar navigasi dari halaman lain.

---

## 4. PRECONDITIONS

- Guru telah berhasil login ke sistem (UC-001 selesai, sesi aktif).
- Sistem menampilkan halaman `/buku` (PAGE-003: Manajemen Data Buku).

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition — Tambah Buku
- Data buku baru tersimpan di database; tabel katalog diperbarui dan menampilkan buku yang baru ditambahkan.

### 5.2 Success Postcondition — Edit Buku
- Perubahan data buku tersimpan; tabel katalog menampilkan data terbaru.

### 5.3 Success Postcondition — Hapus Buku
- Data buku dihapus secara permanen dari database; buku tidak lagi muncul di tabel katalog.

### 5.4 Success Postcondition — Cari Buku
- Tabel katalog menampilkan daftar buku yang sesuai dengan kata kunci pencarian.

---

## 6. MAIN FLOW — 6A: TAMBAH BUKU BARU (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Berada di halaman `/buku`. Mengklik tombol **"Tambah Buku Baru"**. | Sistem menampilkan Modal Dialog (PAGE-003-SUB-01) dengan form kosong Tambah Buku Baru di atas halaman. |
| 2 | Guru | Mengisi field **ID Buku** (alfanumerik, unik). | Sistem menampilkan karakter yang diketik. |
| 3 | Guru | Mengisi field **Judul Buku**. | — |
| 4 | Guru | Mengisi field **Penulis**. | — |
| 5 | Guru | Mengisi field **Penerbit**. | — |
| 6 | Guru | Mengisi field **Tema/Kategori Buku**. | — |
| 7 | Guru | Mengisi field **Tahun Terbit** (numerik). | — |
| 8 | Guru | Mengisi field **Stok Awal** (integer ≥ 0). | — |
| 9 | Guru | Mengklik tombol **"Simpan"**. | Tombol berubah ke state `[Loading]`. Sistem memvalidasi seluruh field wajib dan mengirim request POST ke API. |
| 10 | — | — | Validasi berhasil. Data buku baru tersimpan di database. |
| 11 | — | — | Modal tertutup. Tabel katalog diperbarui dan menampilkan buku baru yang ditambahkan. Notifikasi sukses singkat muncul: *"Buku berhasil ditambahkan."* |

---

## 7. MAIN FLOW — 6B: EDIT DATA BUKU (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Di tabel katalog, mengklik tombol **"Edit"** (ikon Pencil) pada baris buku yang ingin diubah. | Sistem menampilkan Modal Dialog (PAGE-003-SUB-02) berisi form Edit Data Buku dengan data buku yang dipilih sudah terisi pada setiap field. |
| 2 | Guru | Mengubah satu atau beberapa field data buku yang perlu diperbarui. | Sistem menampilkan perubahan karakter secara langsung. |
| 3 | Guru | Mengklik tombol **"Simpan"**. | Tombol berubah ke state `[Loading]`. Sistem mengirim request PUT/PATCH ke API. |
| 4 | — | — | Perubahan data tersimpan. Modal tertutup. Tabel katalog menampilkan data terbaru. Notifikasi sukses: *"Data buku berhasil diperbarui."* |

---

## 8. MAIN FLOW — 6C: HAPUS BUKU (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Di tabel katalog, mengklik tombol **"Hapus"** (ikon Trash2, merah) pada baris buku yang ingin dihapus. | Sistem menampilkan Modal Dialog konfirmasi: *"Apakah Anda yakin ingin menghapus buku ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan."* Tombol: "Ya, Hapus" (Danger) dan "Batal" (Secondary). |
| 2 | Guru | Mengklik tombol **"Ya, Hapus"**. | Tombol berubah ke state `[Loading]`. Sistem mengirim request DELETE ke API. |
| 3 | — | — | Data buku dihapus dari database. Modal tertutup. Buku menghilang dari tabel. Notifikasi sukses: *"Buku berhasil dihapus dari sistem."* |

---

## 9. MAIN FLOW — 6D: CARI BUKU (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Di halaman `/buku`, mengetikkan kata kunci pada **kolom pencarian** (berdasarkan judul atau tema). | Sistem memfilter tabel secara real-time (atau on-submit) menampilkan buku yang sesuai kata kunci. |
| 2 | Guru | Melihat hasil pencarian pada tabel. | Tabel menampilkan hanya buku yang cocok dengan kata kunci. |
| 3 | Guru | Menghapus isi kolom pencarian. | Tabel kembali menampilkan seluruh data buku. |

---

## 10. ALTERNATIVE FLOW

### AF-001: Guru Membatalkan Tambah/Edit Buku

| Step | Condition | Action |
| --- | --- | --- |
| 9A | Guru mengklik tombol **"Batal"** atau ikon **X** di pojok kanan modal sebelum menyimpan. | Modal tertutup tanpa menyimpan perubahan apapun ke database. Tabel katalog tidak berubah. |

### AF-002: Guru Membatalkan Hapus Buku

| Step | Condition | Action |
| --- | --- | --- |
| 2A | Guru mengklik tombol **"Batal"** pada modal konfirmasi hapus. | Modal tertutup. Data buku tidak dihapus. |

---

## 11. EXCEPTION FLOW

### EF-001: Field Wajib Kosong Saat Simpan

| Step | Condition | System Response |
| --- | --- | --- |
| 9E | Guru mengklik "Simpan" dengan satu atau lebih field wajib masih kosong. | Sistem menampilkan pesan error merah di bawah setiap field yang kosong. Request tidak dikirim ke server. Fokus kursor berpindah ke field pertama yang gagal validasi. |

### EF-002: ID Buku Sudah Terdaftar (Duplikat)

| Step | Condition | System Response |
| --- | --- | --- |
| 10E | ID Buku yang dimasukkan sudah digunakan oleh buku lain di database. | Sistem menampilkan pesan error merah di bawah field ID Buku: *"ID Buku ini sudah digunakan. Gunakan ID yang berbeda."* Data tidak disimpan. |

### EF-003: Stok Bernilai Negatif

| Step | Condition | System Response |
| --- | --- | --- |
| 9E | Guru memasukkan nilai negatif pada field Stok Awal. | Sistem menampilkan pesan validasi: *"Stok buku tidak boleh bernilai negatif (minimal 0)."* |

### EF-004: Tombol Hapus Dinonaktifkan — Buku Masih Dipinjam

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Buku yang akan dihapus berstatus "Dipinjam" (stok aktif dipinjam). | Tombol "Hapus" pada baris tersebut ditampilkan dalam kondisi `[Disabled]` (abu-abu, kursor dilarang). Tooltip muncul saat hover: *"Buku tidak dapat dihapus karena sedang dipinjam."* |

### EF-005: Pencarian Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Kata kunci pencarian tidak cocok dengan judul atau tema buku manapun di katalog. | Tabel menampilkan ilustrasi ikon Search dengan tanda tanya dan teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* |

---

## 12. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | idBuku, judulBuku, penulis, penerbit, temaBuku, tahunTerbit, stok, statusBuku | Database → tabel `buku` |

---

## 13. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Katalog Buku | Table Component — zebra striping, hover state | Kolom: ID, Judul, Penulis, Tema, Tahun, Stok, Status, Aksi |
| Badge Status Stok | Badge — Hijau (Tersedia) / Merah (Stok Habis) | Stok = 0 → badge merah "Stok Habis" |
| Tombol Tambah | Primary Button | Memicu Modal PAGE-003-SUB-01 |
| Tombol Edit | Secondary / Icon Button (Pencil) | Memicu Modal PAGE-003-SUB-02 |
| Tombol Hapus | Danger Button (Trash2) | Disabled jika buku berstatus Dipinjam |
| Modal Form Tambah/Edit | Modal Dialog — header, body form, footer tombol | max-w-md, rounded-xl, shadow-lg |
| Kolom Pencarian | Text Input — Search | Placeholder: "Cari judul atau tema buku..." |
| Empty State | Ilustrasi ikon + teks informatif | Muncul jika tabel kosong atau pencarian tidak ditemukan |

---

## 14. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-002-01 | Guru berhasil menambah buku baru; buku muncul di tabel katalog setelah modal ditutup. |
| AC-002-02 | ID Buku yang duplikat ditolak dengan pesan error yang informatif. |
| AC-002-03 | Stok negatif ditolak dengan pesan validasi. |
| AC-002-04 | Guru berhasil mengubah data buku; perubahan tercermin di tabel katalog. |
| AC-002-05 | Guru berhasil menghapus buku setelah mengonfirmasi pada modal konfirmasi. |
| AC-002-06 | Tombol "Hapus" dinonaktifkan untuk buku yang sedang berstatus "Dipinjam". |
| AC-002-07 | Pencarian buku berhasil memfilter tabel berdasarkan judul atau tema. |
| AC-002-08 | Pencarian yang tidak menemukan hasil menampilkan empty state yang informatif. |
| AC-002-09 | Membatalkan tambah/edit menutup modal tanpa menyimpan perubahan. |

---

## 15. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |