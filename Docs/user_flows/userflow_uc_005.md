# User Flow — UC-005: Melihat Riwayat Peminjaman

Document Version: v1.2 (Tambah Export Riwayat ke Excel — AF-004, EF-003; sinkron srs.md v3.7 & design_system.md v1.8)
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
| UC ID | UC-005 |
| Use Case Name | Melihat Riwayat Peminjaman |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F005 |
| FR-ID Terkait (SRS v3.7) | FR-021, FR-022, FR-023, FR-032 |
| Page ID (IA) | PAGE-006 |
| Route | `/riwayat` |
| Priority | Medium |
| Status | Draft |

---

## 2. GOAL

Guru dapat melihat dan mencari seluruh riwayat transaksi peminjaman dan pengembalian buku — **termasuk nominal denda yang sudah tercatat pada masing-masing transaksi** — kapan saja tanpa perhitungan atau pencatatan manual di buku tulis, **serta mengekspor data riwayat ke Excel berdasarkan bulan/tahun tertentu.**

---

## 3. AKTOR

**ACT-01 — Guru.** Guru mengakses riwayat sebagai data read-only untuk keperluan monitoring dan pelaporan, termasuk meninjau riwayat denda yang sudah tercatat.

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
- Guru melihat nominal denda (jika ada) untuk setiap transaksi pengembalian yang sudah dikonfirmasi, ditampilkan sebagai Badge Denda.
- Tidak ada perubahan data — seluruh interaksi bersifat read-only, termasuk nominal denda yang sudah tersimpan (immutable, lihat UC-004 Section 6.1).

### 6.2 Failure Postcondition
- Tabel riwayat gagal dimuat karena kegagalan koneksi; sistem menampilkan Inline Alert Banner error.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka `/riwayat`. | Sistem menampilkan Filter Bar di atas Table Component, dan tabel riwayat seluruh transaksi secara kronologis: Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Tgl Kembali Aktual, Kondisi Buku, **Denda**, Status. |
| 2 | — | **(Baru v1.1)** Untuk setiap baris transaksi yang sudah dikonfirmasi pengembaliannya (UC-004) dengan Total Denda > 0. | Sistem menampilkan **Badge Denda** (ikon `CircleDollarSign`, latar `#FBE1E3`, teks `#780000`) pada kolom Denda, mis. "Denda Rp 3.000". Jika Total Denda = Rp 0 atau transaksi belum dikembalikan, kolom menampilkan strip "—" (netral, tanpa badge). |
| 3 | Guru | Mengetik nama siswa atau judul buku pada Text Input pencarian. | Sistem memfilter tabel secara live (debounce 300ms) tanpa perlu tombol "Terapkan Filter". |
| 4 | Guru | Memilih rentang tanggal ("Dari Tanggal" — "Sampai Tanggal") pada Date Picker, lalu mengklik **"Terapkan Filter"**. | Sistem memfilter tabel riwayat sesuai rentang tanggal transaksi. |
| 5 | Guru | Meninjau status setiap transaksi pada Badge (Hijau: Sudah Dikembalikan, Kuning: Masih Dipinjam) beserta Badge Denda yang menyertainya. | Sistem menampilkan seluruh kolom riwayat sesuai filter aktif. |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Reset Filter

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Guru mengklik tombol **"Reset"** pada Filter Bar. | Sistem mengosongkan seluruh filter (teks & rentang tanggal) dan menampilkan kembali seluruh riwayat transaksi beserta Badge Denda masing-masing. |

### AF-002: Belum Ada Riwayat Transaksi

| Step | Condition | System Response |
| --- | --- | --- |
| 1B | Belum ada satupun transaksi peminjaman/pengembalian tercatat. | Sistem menampilkan Empty State: ikon `ClipboardList`/`BookOpen` + teks *"Belum ada riwayat transaksi peminjaman."* |

### AF-003: Transaksi Tanpa Denda

| Step | Condition | System Response |
| --- | --- | --- |
| 1C | Transaksi dikembalikan tepat waktu dengan Kondisi Buku "Baik" (Total Denda = Rp 0). | Kolom Denda menampilkan strip "—" tanpa Badge, agar tidak menimbulkan kesan "kritis" pada transaksi yang sebenarnya bersih. |

### AF-004: Export Riwayat ke Excel

| Step | Condition | System Response |
| --- | --- | --- |
| 1D | Guru memilih Bulan dan Tahun pada dropdown filter, lalu mengklik "Export ke Excel". | Sistem memvalidasi ada tidaknya data pada periode tersebut. |
| 2D | Data tersedia untuk periode tersebut. | Sistem men-generate file .xlsx berisi seluruh kolom tabel Riwayat, difilter sesuai bulan/tahun, dan memicu unduhan file di browser Guru. |

### EF-003: Tidak Ada Data untuk Periode yang Dipilih

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Guru memilih Bulan/Tahun yang tidak memiliki transaksi apa pun. | Sistem menampilkan pesan informatif: "Tidak ada data riwayat pada periode yang dipilih." tanpa men-generate file. |

### EF-001: Filter Tidak Menemukan Hasil

| Step | Condition | System Response |
| --- | --- | --- |
| 3E | Kata kunci atau rentang tanggal tidak cocok dengan data manapun. | Sistem menampilkan ikon `Search` + teks: *"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."* (atau pesan setara untuk nama siswa/tanggal). |

### EF-002: Koneksi Jaringan Gagal Saat Memuat Riwayat

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Request API gagal (timeout/server down, atau server lokal di PC perpustakaan belum berjalan) saat memuat data riwayat. | Inline Alert Banner: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* dengan tombol "Coba Lagi". |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Tanggal Batas Kembali | Database → tabel `peminjaman` (join `siswa`, `buku`) |
| Pengembalian | Tanggal Kembali Aktual, Kondisi Buku, Status Keterlambatan, **Total Denda** | Database → tabel `pengembalian` |
| Export Riwayat | Seluruh kolom di atas, difilter berdasarkan bulan/tahun pada `tgl_peminjaman` | Database → VIEW `riwayat_peminjaman` |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.5)

| Element | DS Component | Notes |
| --- | --- | --- |
| Filter Bar | Filter Bar (9.8) | Live filtering teks (debounce 300ms); tombol "Terapkan Filter" khusus rentang tanggal. |
| Tabel Riwayat | Table Component (9.4) — read-only | Zebra striping; badge status transaksi; **kolom Denda baru**. |
| Badge Status | Badge/Status Indicator (9.5) | Hijau: Sudah Dikembalikan; Kuning: Masih Dipinjam. |
| **Badge Denda** | **Badge/Status Indicator (9.5) — baru v1.4/v1.5** | `#FBE1E3` / `#780000`, `font-semibold`, ikon `CircleDollarSign` di sisi kiri teks; muncul hanya jika Total Denda > 0. |
| Empty/No-Result State | Empty State (11.2) / Search No-Result State (11.3) | Ikon + teks informatif. |
| Error Koneksi | System Error State (11.7) | Inline Alert Banner dengan tombol "Coba Lagi". |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-005-01 | Guru dapat melihat seluruh riwayat transaksi secara kronologis. |
| AC-005-02 | Guru dapat mencari riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal. |
| AC-005-03 | Status setiap transaksi (Dipinjam/Dikembalikan/Terlambat) ditampilkan dengan badge yang jelas. |
| AC-005-04 | Data riwayat bersifat read-only — tidak tersedia aksi ubah/hapus pada antarmuka, termasuk nominal denda. |
| AC-005-05 | Tabel riwayat menampilkan Empty State saat belum ada transaksi. |
| **AC-005-06** | **Setiap transaksi pengembalian dengan Total Denda > 0 menampilkan Badge Denda dengan nominal yang sesuai dengan yang sudah dikonfirmasi pada UC-004.** |
| **AC-005-07** | **Transaksi dengan Total Denda = Rp 0 (tepat waktu, kondisi Baik) menampilkan strip "—" tanpa Badge Denda.** |
| **AC-005-08** | **Guru dapat mengekspor data riwayat ke file .xlsx untuk bulan/tahun tertentu, berisi kolom yang sama dengan tabel Riwayat.** |
| **AC-005-09** | **Jika tidak ada data pada periode yang dipilih, sistem menampilkan pesan informatif tanpa mengunduh file kosong.** |

---

## 12. NOTES

- Data riwayat bersifat read-only dan tidak dapat diubah atau dihapus oleh Guru melalui antarmuka sistem (Business Rule F005 & Master List poin 7) — ini berlaku juga untuk nominal denda yang sudah tersimpan (Business Rule F004, Master List poin 12).
- Data peminjaman dan pengembalian wajib disimpan permanen minimal 3 tahun ajaran untuk keperluan audit (SRS Section 7.3 — Data Retention Rules), termasuk riwayat nominal denda untuk keperluan pelaporan ke pihak sekolah.
- **(Baru v1.1)** Jika terjadi kesalahan pencatatan kondisi buku/denda setelah dikonfirmasi, koreksi hanya dapat dilakukan administrator langsung di database, bukan melalui antarmuka Riwayat (Out-of-Scope SRS poin #13).

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal — kolom tabel riwayat belum mencantumkan Denda (masih mengacu SRS v3.1 yang belum ada fitur denda). |
| **1.1** | **2026-07-09** | **Kelompok DPSI BRAYYY** | **Sinkronisasi dengan SRS v3.4 (Business Rule F004/F005) dan DS v1.5 (Badge Denda Section 9.5, Traceability Matrix Section 15):** (1) tambah kolom "Denda" pada tabel Riwayat di Main Flow; (2) tambah step 2 Main Flow untuk Badge Denda; (3) tambah AF-003 untuk transaksi tanpa denda; (4) tambah field Total Denda di Related Data & Related Components; (5) tambah AC-005-06, AC-005-07; (6) tambah FR-ID Terkait di Header; (7) Notes diperbarui soal immutability denda. |
| **1.2** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Tambah Export Riwayat ke Excel (AF-004, EF-003):** (1) tambah FR-032 di Header; (2) perluas GOAL untuk menyebut export; (3) tambah AF-004 (Export sukses) dan EF-003 (tidak ada data); (4) tambah baris Export di Related Data; (5) tambah AC-005-08 dan AC-005-09 di Acceptance Criteria. Sinkron dengan srs.md v3.7 & design_system.md v1.8. |