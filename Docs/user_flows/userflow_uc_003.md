# User Flow — UC-003: Pencatatan Peminjaman Buku

Document Version: v1.0 (Referensi SoT diperbarui ke SRS v3.4 / DS v1.5 — tidak ada perubahan substansi flow)
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
| UC ID | UC-003 |
| Use Case Name | Pencatatan Peminjaman Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F003 (memicu F007 di background) |
| FR-ID Terkait (SRS v3.4) | FR-010, FR-011, FR-012, FR-013, FR-014 |
| Page ID (IA) | PAGE-004 |
| Route | `/peminjaman` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat mencatat transaksi peminjaman buku oleh siswa secara digital dengan cepat dan akurat, sehingga stok dan status buku otomatis tersinkronisasi tanpa perhitungan manual.

---

## 3. AKTOR

**ACT-01 — Guru.** Guru mencatat peminjaman atas nama siswa (siswa tidak memiliki akun/login).

---

## 4. TRIGGER

- Guru mengklik menu **"Peminjaman"** pada sidebar setelah login.
- Guru mengakses langsung route `/peminjaman` dengan sesi aktif.

---

## 5. PRE-CONDITION

- Guru telah berhasil login dan memiliki sesi aktif (UC-001 selesai).
- Minimal terdapat satu buku dengan Stok > 0 di katalog (data dari UC-002).

---

## 6. POST-CONDITION

### 6.1 Success Postcondition
- Data transaksi peminjaman baru tersimpan — satu baris transaksi (ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, Tanggal Batas Kembali) untuk setiap buku yang dipilih Guru dalam satu submit form.
- Stok buku terkait berkurang 1 unit dan Status berubah menjadi "Dipinjam" dalam transaksi database yang sama (F007), tercermin instan di PAGE-003, PAGE-004, dan PAGE-002.
- Form peminjaman ter-reset untuk transaksi berikutnya.

### 6.2 Failure Postcondition
- Transaksi tidak tersimpan; form tetap terbuka dengan data isian tidak hilang; pesan error informatif ditampilkan.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka `/peminjaman`. | Sistem menampilkan Split Layout: Panel Kiri (60%) daftar buku dengan Stok > 0 (Lokasi Rak ditampilkan pada tiap kartu); Panel Kanan (40%) form data peminjaman. |
| 2 | Guru | Memilih satu atau lebih buku dari Panel Kiri (dapat memilih beberapa buku sekaligus untuk siswa yang sama dalam satu form). | Sistem menyorot setiap kartu buku yang dipilih (multi-select); daftar ringkas buku terpilih (Judul, Penulis, Tema, Lokasi Rak, Badge Stok) muncul di Panel Kanan. |
| 3 | Guru | Mengisi **Nama Siswa** dan **Kelas Siswa**. | Field **Tanggal Pinjam** otomatis terisi tanggal hari ini (Read-Only, keterangan "Otomatis"). |
| 4 | Guru | Memilih **Tanggal Batas Pengembalian** melalui Date Picker aktif. | Date Picker menerapkan constraint `min` = Tanggal Pinjam (hari ini); Guru dapat memilih tanggal ≥ hari ini. |
| 5 | Guru | Mengklik tombol **"Simpan Peminjaman"**. | Tombol ke state `[Loading]`. Sistem mengirim request POST ke API. |
| 6 | — | — | Sistem memvalidasi: buku masih Stok > 0, Tanggal Batas Kembali ≥ Tanggal Pinjam, Nama Siswa bersih dari tag skrip (XSS). |
| 7 | — | — | Validasi lolos. Sistem menyimpan satu transaksi Peminjaman terpisah untuk setiap buku yang dipilih (satu ID Peminjaman per buku), lalu menjalankan F007 untuk masing-masing buku: Stok buku −1, Status buku → "Dipinjam". Seluruh transaksi buku dalam satu submit diproses dalam rangkaian transaksi database yang sama. |
| 8 | — | — | Panel Kiri, tabel katalog (PAGE-003), dan halaman publik (PAGE-002) diperbarui instan. Form ter-reset; toast notifikasi sukses muncul. |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Buku dengan Stok 0

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Buku tertentu memiliki Stok = 0. | Buku tidak ditampilkan/non-selectable di Panel Kiri dengan badge "Stok Habis" (sesuai Business Rule F003 — buku stok 0 disembunyikan dari daftar pilihan). |

### EF-001: Tanggal Batas Kembali Kurang dari Tanggal Pinjam

| Step | Condition | System Response |
| --- | --- | --- |
| 6E | Guru memilih tanggal batas kembali sebelum tanggal hari ini (secara teknis dicegah oleh constraint `min`, namun tetap divalidasi di backend). | Pesan error di bawah Date Picker: *"Tanggal batas pengembalian tidak boleh sebelum tanggal peminjaman."* |

### EF-002: Nama Siswa Mengandung Tag Skrip Berbahaya

| Step | Condition | System Response |
| --- | --- | --- |
| 6E | Sistem mendeteksi tag skrip (XSS) pada field Nama Siswa. | Input ditolak; pesan error: *"Nama siswa mengandung karakter yang tidak diperbolehkan."* |

### EF-003: Field Wajib Kosong

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Guru mengklik "Simpan Peminjaman" tanpa memilih buku, atau field Nama Siswa/Kelas/Tanggal Batas Kembali kosong. | Fokus otomatis berpindah ke field pertama yang gagal validasi; pesan error spesifik muncul di bawah field terkait. Request tidak dikirim. |

### EF-004: Stok Buku Habis Saat Disimpan (Race Condition)

| Step | Condition | System Response |
| --- | --- | --- |
| 6E | Buku yang dipilih ternyata sudah Stok 0 (misal terjadi peminjaman lain lebih dulu). | Sistem menolak transaksi; pesan error: *"Buku ini sudah tidak tersedia. Silakan pilih buku lain."* Panel Kiri diperbarui otomatis. |

### EF-005: Koneksi Jaringan/Server Lokal Gagal

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Request API gagal — pada konteks deployment single-PC (SRS v3.4), penyebab realistisnya lebih sering karena server backend lokal belum dijalankan/berhenti. | Form tetap terbuka, data isian tidak hilang (NFR 9.4). Inline Alert Banner: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* dengan tombol "Coba Lagi". |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | ID Buku, Judul, Stok, Status, Lokasi Rak | Database → tabel `buku` |
| Siswa | Nama, Kelas (data referensi, bukan akun login) | Database → tabel `siswa` |
| Peminjaman | ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, Tanggal Batas Kembali | Database → tabel `peminjaman` |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.5)

| Element | DS Component | Notes |
| --- | --- | --- |
| Panel Kiri (Daftar Buku) | Card Buku (9.6 varian Guru) + Split Layout (7.3) | Menampilkan Lokasi Rak agar Guru cepat mengambil buku fisik. |
| Field Tanggal Pinjam | Date Picker — varian Read-Only (9.10) | Latar `#EFEAE0`, keterangan "(Otomatis)". |
| Field Tanggal Batas Kembali | Date Picker — varian aktif (9.10) | Constraint `min` = Tanggal Pinjam. |
| Tombol Simpan | Primary Button (9.1) | State Loading saat proses submit. |
| Error Koneksi | System Error State (11.7) — Inline Alert Banner | Data form tidak hilang saat gagal submit. |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-003-01 | Guru berhasil mencatat peminjaman untuk buku dengan Stok > 0. |
| AC-003-02 | Buku dengan Stok 0 tidak muncul/tidak dapat dipilih pada daftar peminjaman. |
| AC-003-03 | Tanggal Pinjam terisi otomatis dan tidak dapat diubah manual. |
| AC-003-04 | Tanggal Batas Kembali dapat diatur Guru dan tidak boleh kurang dari Tanggal Pinjam. |
| AC-003-05 | Setelah transaksi tersimpan, Stok buku berkurang 1 dan Status berubah menjadi "Dipinjam" secara instan (F007). |
| AC-003-06 | Data form tidak hilang saat terjadi kegagalan koneksi selama submit. |
| AC-003-07 | Guru dapat memilih lebih dari satu buku sekaligus dalam satu submit form peminjaman untuk siswa yang sama; setiap buku tersimpan sebagai transaksi peminjaman terpisah. |

---

## 12. NOTES

- Guru dapat memilih lebih dari satu buku sekaligus dalam satu form peminjaman untuk siswa yang sama; setiap buku dicatat sebagai transaksi independen (satu ID Peminjaman per buku) — tidak ada entity/kolom "sesi peminjaman" pada database, pengelompokan tampilan (mis. Panel Peminjaman Aktif) murni berdasarkan kombinasi nama siswa + tanggal peminjaman + tanggal batas kembali (Business Rule F003).
- Buku dipinjam untuk digunakan di lingkungan sekolah dan tidak wajib dikembalikan pada hari yang sama, selama masih dalam periode yang ditentukan Guru (SRS v3.4, Out-of-Scope poin #4).
- Perubahan stok dan status wajib terjadi dalam satu transaksi database yang sama dengan pencatatan peminjaman (Business Rule F007) — tidak boleh terpisah/tertunda.

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal, mengacu srs.md v3.1 dan design_system.md v1.3. |
| 1.0 (housekeeping) | 2026-07-09 | Kelompok DPSI BRAYYY | Update referensi versi header ke srs.md v3.4 dan design_system.md v1.5; tambah FR-ID Terkait di Header; EF-005 diperjelas soal konteks server lokal single-PC; rujukan Out-of-Scope poin #4 diarahkan ke versi SRS terbaru. Tidak ada perubahan pada Main Flow/AC — substansi flow peminjaman tidak terdampak perubahan SRS v3.2–v3.4 (fitur denda hanya berlaku di pengembalian/UC-004). |