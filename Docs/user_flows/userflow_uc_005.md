# User Flow — UC-005: Melihat Riwayat Peminjaman

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
| UC ID | UC-005 |
| Use Case Name | Melihat Riwayat Peminjaman |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F005 |
| Page ID (IA) | PAGE-006 |
| Route | `/riwayat` |
| Priority | Medium |
| Status | Draft |

---

## 2. GOAL

Guru dapat melihat dan mencari seluruh riwayat transaksi peminjaman dan pengembalian buku kapan saja tanpa perhitungan atau pencatatan manual di buku tulis.

---

## 3. AKTOR

**ACT-01 — Guru.** Guru mengakses riwayat sebagai data read-only untuk keperluan monitoring dan pelaporan.

---

## 4. TRIGGER

- Guru mengklik menu **"Riwayat"** pada sidebar setelah login.
- Guru mengakses langsung route `/riwayat` dengan sesi aktif.

---

## 5. PRE-CONDITION

- Guru telah berhasil login dan memiliki sesi aktif (UC-001 selesai).
- (Opsional) Sudah terdapat transaksi Peminjaman/Pengembalian dari UC-003/UC-004 — jika belum ada, sistem menampilkan Empty State.

---

## 6. POST-CONDITION

### 6.1 Success Postcondition
- Guru melihat daftar riwayat transaksi secara kronologis, dapat difilter berdasarkan nama siswa, judul buku, atau rentang tanggal.
- Tidak ada perubahan data — seluruh interaksi bersifat read-only.

### 6.2 Failure Postcondition
- Tabel riwayat gagal dimuat karena kegagalan koneksi; sistem menampilkan Inline Alert Banner error.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka `/riwayat`. | Sistem menampilkan Filter Bar di atas Table Component, dan tabel riwayat seluruh transaksi secara kronologis: Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Tgl Kembali Aktual, Kondisi Buku, Status. |
| 2 | Guru | Mengetik nama siswa atau judul buku pada Text Input pencarian. | Sistem memfilter tabel secara live (debounce 300ms) tanpa perlu tombol "Terapkan Filter". |
| 3 | Guru | Memilih rentang tanggal ("Dari Tanggal" — "Sampai Tanggal") pada Date Picker, lalu mengklik **"Terapkan Filter"**. | Sistem memfilter tabel riwayat sesuai rentang tanggal transaksi. |
| 4 | Guru | Meninjau status setiap transaksi pada Badge (Hijau: Sudah Dikembalikan, Kuning: Masih Dipinjam). | Sistem menampilkan seluruh kolom riwayat sesuai filter aktif. |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Reset Filter

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Guru mengklik tombol **"Reset"** pada Filter Bar. | Sistem mengosongkan seluruh filter (teks & rentang tanggal) dan menampilkan kembali seluruh riwayat transaksi. |

### AF-002: Belum Ada Riwayat Transaksi

| Step | Condition | System Response |
| --- | --- | --- |
| 1B | Belum ada satupun transaksi peminjaman/pengembalian tercatat. | Sistem menampilkan Empty State: ikon `ClipboardList`/`BookOpen` + teks *"Belum ada riwayat transaksi peminjaman."* |

### EF-001: Filter Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Kata kunci atau rentang tanggal tidak cocok dengan data manapun. | Sistem menampilkan ikon `Search` + teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* (atau pesan setara untuk nama siswa/tanggal). |

### EF-002: Koneksi Jaringan Gagal Saat Memuat Riwayat

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Request API gagal (timeout/server down) saat memuat data riwayat. | Inline Alert Banner: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* dengan tombol "Coba Lagi". |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Tanggal Batas Kembali | Database → tabel `peminjaman` (join `siswa`, `buku`) |
| Pengembalian | Tanggal Kembali Aktual, Kondisi Buku, Status Keterlambatan | Database → tabel `pengembalian` |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.3)

| Element | DS Component | Notes |
| --- | --- | --- |
| Filter Bar | Filter Bar (9.8) | Live filtering teks (debounce 300ms); tombol "Terapkan Filter" khusus rentang tanggal. |
| Tabel Riwayat | Table Component (9.4) — read-only | Zebra striping; badge status transaksi. |
| Badge Status | Badge/Status Indicator (9.5) | Hijau: Sudah Dikembalikan; Kuning: Masih Dipinjam. |
| Empty/No-Result State | Empty State (11.2) / Search No-Result State (11.3) | Ikon + teks informatif sesuai konteks. |
| Error Koneksi | System Error State (11.7) | Inline Alert Banner dengan tombol "Coba Lagi". |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-005-01 | Guru dapat melihat seluruh riwayat transaksi secara kronologis. |
| AC-005-02 | Guru dapat mencari riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal. |
| AC-005-03 | Status setiap transaksi (Dipinjam/Dikembalikan/Terlambat) ditampilkan dengan badge yang jelas. |
| AC-005-04 | Data riwayat bersifat read-only — tidak tersedia aksi ubah/hapus pada antarmuka. |
| AC-005-05 | Tabel riwayat menampilkan Empty State saat belum ada transaksi. |

---

## 12. NOTES

- Data riwayat bersifat read-only dan tidak dapat diubah atau dihapus oleh Guru melalui antarmuka sistem (Business Rule F005 & Master List poin 7).
- Data peminjaman dan pengembalian wajib disimpan permanen minimal 3 tahun ajaran untuk keperluan audit (SRS Section 7.3 — Data Retention Rules).