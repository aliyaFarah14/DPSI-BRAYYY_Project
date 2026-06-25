# User Flow — UC-005: Melihat Riwayat Peminjaman

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
| UC ID | UC-005 |
| Use Case Name | Melihat Riwayat Peminjaman |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F005 |
| Page ID (IA) | PAGE-006 |
| Route | /riwayat |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat melihat rekap historis seluruh transaksi peminjaman dan pengembalian buku secara lengkap, melakukan pencarian dan filter berdasarkan nama siswa, judul buku, atau rentang tanggal — untuk keperluan monitoring dan pelaporan operasional perpustakaan.

---

## 3. TRIGGER

- Guru mengklik menu **"Riwayat"** pada Sidebar navigasi dari halaman manapun (setelah login).

---

## 4. PRECONDITIONS

- Guru telah berhasil login ke sistem (UC-001 selesai, sesi aktif).
- Guru berada di halaman `/riwayat` (PAGE-006).
- (Opsional) Sudah terdapat data riwayat transaksi dari UC-003 dan UC-004 sebelumnya.

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition
- Guru berhasil melihat daftar riwayat transaksi yang ditampilkan secara kronologis.
- Hasil filter/pencarian menampilkan data riwayat yang sesuai dengan kriteria yang dimasukkan.

### 5.2 No Data Postcondition
- Jika belum ada data riwayat, halaman menampilkan empty state yang informatif.

---

## 6. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Mengklik menu **"Riwayat"** pada Sidebar. | Sistem menampilkan halaman `/riwayat` (PAGE-006). Loading state singkat muncul saat data dimuat dari API. |
| 2 | — | — | Sistem menampilkan tabel riwayat seluruh transaksi secara kronologis (terbaru di atas). Kolom: Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Batas Kembali, Tanggal Kembali Aktual, Kondisi Buku, Status Transaksi. |
| 3 | Guru | Melihat dan menelusuri data riwayat pada tabel. | Tabel menampilkan badge status: Hijau (Sudah Dikembalikan) / Kuning (Masih Dipinjam). Transaksi yang terlambat ditandai dengan teks merah pada kolom tanggal batas kembali. |
| 4 | Guru | (Opsional) Menggunakan **Filter Pencarian** untuk menyempurnakan hasil tampil. | Lihat alur pencarian di bawah (AF-001 s.d. AF-003). |
| 5 | Guru | Selesai memantau riwayat; mengklik menu lain di Sidebar atau keluar dari sistem. | Sistem berpindah ke halaman yang dipilih. |

---

## 7. ALTERNATIVE FLOW

### AF-001: Filter Berdasarkan Nama Siswa

| Step | Condition | Action |
| --- | --- | --- |
| 4A | Guru ingin melihat riwayat transaksi siswa tertentu. | Guru mengetik nama siswa pada kolom pencarian nama. Sistem memfilter tabel secara real-time atau on-submit, menampilkan hanya riwayat transaksi dengan nama siswa yang cocok. |

### AF-002: Filter Berdasarkan Judul Buku

| Step | Condition | Action |
| --- | --- | --- |
| 4A | Guru ingin melihat riwayat peminjaman buku tertentu. | Guru mengetik judul buku pada kolom pencarian judul. Sistem memfilter tabel menampilkan hanya riwayat transaksi dengan judul buku yang cocok. |

### AF-003: Filter Berdasarkan Rentang Tanggal

| Step | Condition | Action |
| --- | --- | --- |
| 4A | Guru ingin melihat riwayat dalam periode tertentu (contoh: bulan ini). | Guru mengisi field Tanggal Mulai dan Tanggal Akhir pada filter rentang tanggal. Sistem memfilter tabel menampilkan transaksi yang tgl pinjamnya berada dalam rentang yang ditentukan. |

### AF-004: Kombinasi Filter

| Step | Condition | Action |
| --- | --- | --- |
| 4A | Guru menggunakan lebih dari satu kriteria filter secara bersamaan. | Sistem menerapkan semua filter secara bersamaan (AND logic). Tabel menampilkan riwayat yang memenuhi seluruh kriteria. |

### AF-005: Reset Filter

| Step | Condition | Action |
| --- | --- | --- |
| 4A | Guru ingin menghapus semua filter dan kembali melihat seluruh riwayat. | Guru mengklik tombol **"Reset Filter"** (jika tersedia) atau mengosongkan semua field filter. Tabel kembali menampilkan seluruh data riwayat. |

---

## 8. EXCEPTION FLOW

### EF-001: Belum Ada Data Riwayat

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Database belum memiliki data transaksi (sistem baru pertama digunakan). | Tabel menampilkan Empty State: ikon clipboard kosong dan teks: *"Belum ada riwayat transaksi peminjaman. Mulai catat peminjaman buku pertama Anda."* |

### EF-002: Filter Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Kriteria filter yang dimasukkan guru tidak cocok dengan data riwayat manapun di database. | Tabel menampilkan Empty State: ikon Search dengan tanda tanya dan teks: *"Tidak ditemukan riwayat yang sesuai dengan pencarian Anda. Coba ubah kata kunci atau rentang tanggal."* |

### EF-003: Gagal Memuat Data Riwayat (API Error)

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Request ke API riwayat gagal (server error atau koneksi terputus). | Sistem menampilkan pesan error di area tabel: *"Gagal memuat data riwayat. Periksa koneksi internet dan muat ulang halaman."* Disertai tombol "Coba Lagi". |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | idPeminjaman, namaSiswa, kelasSiswa, idBuku, tglPeminjaman, tglBatasPengembalian, statusPeminjaman | Database → tabel `peminjaman` |
| Pengembalian | idPengembalian, idPeminjaman, tglPengembalian, kondisiBuku | Database → tabel `pengembalian` |
| Buku | judulBuku | Database → tabel `buku` (JOIN untuk tampilan judul) |

> Catatan: Seluruh data pada halaman ini bersifat **read-only**. Tidak ada operasi INSERT, UPDATE, atau DELETE yang dapat dilakukan dari PAGE-006.

---

## 10. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Riwayat | Table Component — read-only, zebra striping, hover state | Tidak ada kolom Aksi (Edit/Hapus) |
| Badge "Sudah Dikembalikan" | Badge — Hijau (`bg-green-100 text-green-700`) | Status transaksi yang sudah selesai |
| Badge "Masih Dipinjam" | Badge — Kuning (`bg-amber-100 text-amber-700`) | Status transaksi yang masih aktif |
| Kolom Pencarian Nama Siswa | Text Input — Search | Placeholder: "Cari nama siswa..." |
| Kolom Pencarian Judul Buku | Text Input — Search | Placeholder: "Cari judul buku..." |
| Filter Rentang Tanggal | Date Picker — Tanggal Mulai & Tanggal Akhir | Filter berdasarkan tanggal pinjam |
| Tombol Reset Filter | Secondary Button | Mengosongkan semua filter aktif |
| Empty State | Ilustrasi ikon + teks informatif | Dua varian: belum ada data / tidak ada hasil filter |
| Loading State | Spinner overlay tipis | Muncul saat data dimuat dari API |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-005-01 | Halaman riwayat menampilkan seluruh transaksi secara kronologis (terbaru di atas). |
| AC-005-02 | Transaksi yang sudah dikembalikan ditandai badge hijau; yang masih aktif ditandai badge kuning. |
| AC-005-03 | Filter nama siswa menampilkan hanya transaksi dengan nama yang cocok. |
| AC-005-04 | Filter judul buku menampilkan hanya transaksi dengan judul yang cocok. |
| AC-005-05 | Filter rentang tanggal menampilkan transaksi dalam periode yang dipilih. |
| AC-005-06 | Kombinasi filter bekerja secara bersamaan (AND logic). |
| AC-005-07 | Filter yang tidak menemukan hasil menampilkan empty state yang informatif. |
| AC-005-08 | Tidak ada tombol Edit atau Hapus pada halaman riwayat (data bersifat read-only). |
| AC-005-09 | Jika belum ada data, halaman menampilkan empty state yang sesuai. |

---

## 12. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |