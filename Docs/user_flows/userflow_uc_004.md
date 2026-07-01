# User Flow — UC-004: Pencatatan Pengembalian Buku

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
| UC ID | UC-004 |
| Use Case Name | Pencatatan Pengembalian Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F004 (memicu F007 di background) |
| Page ID (IA) | PAGE-005 |
| Route | `/pengembalian` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat mencatat pengembalian buku oleh siswa, termasuk kondisi fisik buku dan status keterlambatan (informatif, tanpa denda), sehingga stok dan status buku otomatis tersinkronisasi.

---

## 3. AKTOR

**ACT-01 — Guru.** Guru memproses pengembalian buku yang sebelumnya dicatat pada UC-003.

---

## 4. TRIGGER

- Guru mengklik menu **"Pengembalian"** pada sidebar setelah login.
- Guru mengakses langsung route `/pengembalian` dengan sesi aktif.

---

## 5. PRE-CONDITION

- Guru telah berhasil login dan memiliki sesi aktif (UC-001 selesai).
- Terdapat minimal satu transaksi Peminjaman berstatus "Dipinjam" (belum dikembalikan) dari UC-003.

---

## 6. POST-CONDITION

### 6.1 Success Postcondition
- Data Pengembalian tersimpan (ID Pengembalian, ID Peminjaman referensi, Tanggal Kembali, Kondisi Buku, Status Keterlambatan).
- Stok buku terkait bertambah 1 unit dan Status berubah menjadi "Tersedia" dalam transaksi database yang sama (F007), tercermin instan di PAGE-003, PAGE-004, dan PAGE-002.

### 6.2 Failure Postcondition
- Pengembalian tidak tersimpan; form konfirmasi tetap terbuka; pesan error informatif ditampilkan.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka `/pengembalian`. | Sistem menampilkan tabel Peminjaman Aktif (belum dikembalikan): Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali; indikator keterlambatan (badge merah) jika melewati batas. |
| 2 | Guru | Mengklik tombol **"Proses Pengembalian"** pada baris transaksi terkait. | Sistem membuka Modal Konfirmasi Pengembalian berisi ringkasan data peminjaman. |
| 3 | Guru | Modal menampilkan **Tanggal Pengembalian** otomatis (Read-Only, tanggal hari ini) dan info keterlambatan (jumlah hari, jika ada). | Sistem menghitung otomatis selisih hari antara Tanggal Pengembalian dan Tanggal Batas Kembali. |
| 4 | Guru | Memilih **Kondisi Buku** melalui Radio Button Group: "Baik" (default), "Rusak Ringan", atau "Rusak Berat". | Tombol "Konfirmasi Pengembalian" aktif (non-disabled) setelah salah satu opsi terpilih. |
| 5 | Guru | Mengklik tombol **"Konfirmasi Pengembalian"**. | Tombol ke state `[Loading]`. Sistem mengirim request POST ke API. |
| 6 | — | — | Sistem menyimpan data Pengembalian (terhubung ke ID Peminjaman), lalu menjalankan F007: Stok buku +1, Status buku → "Tersedia", dalam satu transaksi database. |
| 7 | — | — | Modal tertutup; tabel Peminjaman Aktif diperbarui (baris terkait hilang dari daftar aktif); toast notifikasi sukses muncul. |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Pengembalian Terlambat

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Tanggal hari ini melewati Tanggal Batas Kembali transaksi terkait. | Baris transaksi ditandai badge merah "Terlambat" pada tabel Peminjaman Aktif; modal konfirmasi menampilkan jumlah hari keterlambatan secara informatif — **tanpa denda**, sesuai Out-of-Scope SRS poin #3. |

### AF-002: Tidak Ada Peminjaman Aktif

| Step | Condition | System Response |
| --- | --- | --- |
| 1B | Belum ada transaksi peminjaman berstatus "Dipinjam". | Sistem menampilkan Empty State: ikon `BookOpen` + teks *"Tidak ada peminjaman aktif saat ini."* |

### EF-001: Kondisi Buku Belum Dipilih

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Guru mencoba mengklik "Konfirmasi Pengembalian" tanpa memilih Kondisi Buku. | Tombol tetap dalam state `disabled`; Radio Button Group wajib dipilih terlebih dahulu (Business Rule DS 9.7). |

### EF-002: Koneksi Jaringan Gagal

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Request API gagal (timeout/server down). | Modal tetap terbuka, data pilihan (kondisi buku) tidak hilang. Pesan error singkat di atas tombol aksi: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* Tombol submit kembali aktif. |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, Tanggal Batas Kembali | Database → tabel `peminjaman` |
| Pengembalian | ID Pengembalian, ID Peminjaman (referensi), Tanggal Kembali, Kondisi Buku, Status Keterlambatan | Database → tabel `pengembalian` |
| Buku | Stok, Status | Database → tabel `buku` |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.3)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Peminjaman Aktif | Table Component (9.4) | Badge Terlambat (merah) jika melewati batas kembali. |
| Modal Konfirmasi | Modal Dialog (9.3) + Confirmation Pattern (11.4) | Ringkasan data + info keterlambatan. |
| Kondisi Buku | Radio Button Group (9.7) | "Baik" / "Rusak Ringan" / "Rusak Berat"; wajib dipilih sebelum submit. |
| Field Tanggal Kembali | Date Picker — varian Read-Only (9.10) | Otomatis terisi tanggal hari ini. |
| Error Koneksi | System Error State (11.7) | Data pilihan modal tidak hilang saat gagal submit. |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-004-01 | Guru dapat memproses pengembalian dari daftar Peminjaman Aktif. |
| AC-004-02 | Tanggal Pengembalian terisi otomatis dan tidak dapat diubah manual. |
| AC-004-03 | Sistem menghitung dan menampilkan jumlah hari keterlambatan tanpa menerapkan denda. |
| AC-004-04 | Tombol "Konfirmasi Pengembalian" hanya aktif setelah Kondisi Buku dipilih. |
| AC-004-05 | Setelah pengembalian tersimpan, Stok buku bertambah 1 dan Status berubah menjadi "Tersedia" secara instan (F007). |
| AC-004-06 | Data Pengembalian tersimpan terpisah namun tetap terhubung ke ID Peminjaman terkait. |

---

## 12. NOTES

- Tidak ada sistem denda/sanksi atas keterlambatan pengembalian — kebijakan sekolah negeri tidak memberlakukan denda (Out-of-Scope poin #3).
- Data Pengembalian disimpan terpisah dari data Peminjaman, namun tetap terhubung melalui ID Peminjaman (Business Rule Master List poin 8).
- Perubahan stok dan status wajib terjadi dalam satu transaksi database yang sama dengan pencatatan pengembalian (Business Rule F007).