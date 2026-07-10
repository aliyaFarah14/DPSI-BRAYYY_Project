# User Flow — UC-004: Pencatatan Pengembalian Buku

Document Version: v1.1 (Sinkronisasi fitur Denda Keterlambatan — SRS v3.4 F004, DS v1.5 Section 11.8)
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
| UC ID | UC-004 |
| Use Case Name | Pencatatan Pengembalian Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F004 (memicu F007 di background) |
| FR-ID Terkait (SRS v3.4) | FR-015, FR-016, FR-017, FR-018, FR-019, FR-020 |
| Page ID (IA) | PAGE-005 |
| Route | `/pengembalian` |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru dapat mencatat pengembalian buku oleh siswa — termasuk kondisi fisik buku, status keterlambatan, dan nominal denda keterlambatan yang dihitung otomatis oleh sistem — sehingga stok dan status buku tersinkronisasi tanpa perhitungan manual, dan tidak ada risiko salah hitung denda.

---

## 3. AKTOR

**ACT-01 — Guru.** Guru memproses pengembalian buku yang sebelumnya dicatat pada UC-003. Guru tidak mengetik nominal denda secara manual — nilai tersebut murni hasil kalkulasi otomatis sistem.

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
- Data Pengembalian tersimpan (ID Pengembalian, ID Peminjaman referensi, Tanggal Kembali, Kondisi Buku, Status Keterlambatan, Total Denda).
- Stok buku terkait bertambah 1 unit dan Status berubah menjadi "Tersedia" dalam transaksi database yang sama (F007), tercermin instan di PAGE-003, PAGE-004, dan PAGE-002.
- Nominal Total Denda tersimpan sebagai data historis dan tampil sebagai Badge Denda pada PAGE-005 (baris yang baru diproses tidak lagi muncul di daftar aktif) dan PAGE-006 (Riwayat).
- Nominal Total Denda yang sudah tersimpan bersifat immutable — tidak dapat diubah/dihapus melalui antarmuka Guru setelah dikonfirmasi (konsisten dengan sifat read-only data riwayat, F005).

### 6.2 Failure Postcondition
- Pengembalian tidak tersimpan; form/modal konfirmasi tetap terbuka termasuk pilihan Kondisi Buku dan hasil kalkulasi denda yang sudah tampil; pesan error informatif ditampilkan.

---

## 7. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka `/pengembalian`. | Sistem menampilkan tabel Peminjaman Aktif (belum dikembalikan): Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali; indikator keterlambatan (badge merah + jumlah hari) jika melewati batas. |
| 2 | Guru | Mengklik tombol "Proses Pengembalian" pada baris transaksi terkait. | Sistem membuka Modal Konfirmasi Pengembalian berisi ringkasan data peminjaman. |
| 3 | — | Modal menampilkan Tanggal Pengembalian otomatis (Read-Only, tanggal hari ini) dan info keterlambatan (jumlah hari, jika ada). | Sistem menghitung otomatis selisih hari antara Tanggal Pengembalian dan Tanggal Batas Kembali (Tanggal Pengembalian − Tanggal Batas Kembali; jika ≤ 0 hari, dianggap tidak terlambat). |
| 4 | Guru | Memilih Kondisi Buku melalui Radio Button Group: "Baik" (default), "Rusak Ringan", atau "Rusak Berat". | Tombol "Konfirmasi Pengembalian" aktif (non-disabled) setelah salah satu opsi terpilih. Perubahan pilihan memicu perhitungan ulang otomatis pada Panel Ringkasan Denda. |
| 5 | — | Sistem menampilkan Panel Ringkasan Denda tepat di bawah Radio Button Group. | Panel menampilkan rincian: baris "Keterlambatan: N hari × Rp 500 = Rp X", baris "Kondisi buku: [Baik/Rusak Ringan/Rusak Berat] = Rp Y", dan baris Total bergaya tebal-besar: "Total Denda: Rp (X+Y)" — atau "Tidak ada denda" jika Rp 0. Panel bersifat read-only, tidak ada input manual. |
| 6 | Guru | Meninjau Total Denda yang tampil, lalu mengklik tombol "Konfirmasi Pengembalian". | Tombol ke state `[Loading]`. Sistem mengirim request POST ke API. |
| 7 | — | — | Sistem menyimpan data Pengembalian (terhubung ke ID Peminjaman) beserta Total Denda yang sudah dihitung, lalu menjalankan F007: Stok buku +1, Status buku → "Tersedia", dalam satu transaksi database. |
| 8 | — | — | Modal tertutup; tabel Peminjaman Aktif diperbarui (baris terkait hilang dari daftar aktif); toast notifikasi sukses muncul, mis. *"Pengembalian tercatat. Total Denda: Rp X."* |

---

## 8. ALTERNATIVE/EXCEPTION FLOW

### AF-001: Pengembalian Terlambat

| Step | Condition | System Response |
| --- | --- | --- |
| 1A | Tanggal hari ini melewati Tanggal Batas Kembali transaksi terkait. | Baris transaksi ditandai badge merah "Terlambat" pada tabel Peminjaman Aktif; modal konfirmasi menampilkan jumlah hari keterlambatan dan Panel Ringkasan Denda dengan komponen Denda Keterlambatan (Rp 500 × jumlah hari terlambat) terhitung otomatis, sesuai Business Rule F004 SRS v3.4. |

### AF-002: Tidak Ada Peminjaman Aktif

| Step | Condition | System Response |
| --- | --- | --- |
| 1B | Belum ada transaksi peminjaman berstatus "Dipinjam". | Sistem menampilkan Empty State: ikon `BookOpen` + teks *"Tidak ada peminjaman aktif saat ini."* |

### AF-003: Pengembalian Tepat Waktu dengan Kondisi Buku Rusak

| Step | Condition | System Response |
| --- | --- | --- |
| 1C | Tanggal Pengembalian ≤ Tanggal Batas Kembali (tidak terlambat), namun Guru memilih Kondisi Buku "Rusak Ringan" atau "Rusak Berat". | Panel Ringkasan Denda tetap muncul (dipicu oleh kondisi buku bukan "Baik", bukan hanya oleh keterlambatan); komponen Denda Keterlambatan = Rp 0, Biaya Kondisi Buku = Rp 2.000 (Rusak Ringan) atau Rp 5.000 (Rusak Berat); Total Denda = Biaya Kondisi Buku saja. |

### EF-001: Kondisi Buku Belum Dipilih

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Guru mencoba mengklik "Konfirmasi Pengembalian" tanpa memilih Kondisi Buku. | Tombol tetap dalam state `disabled`; Radio Button Group wajib dipilih terlebih dahulu (Business Rule DS 9.7). Panel Ringkasan Denda belum tampil karena kondisi buku belum ditentukan. |

### EF-002: Koneksi Jaringan Gagal

| Step | Condition | System Response |
| --- | --- | --- |
| 6E | Request API gagal (timeout/server down, atau server lokal di PC perpustakaan belum berjalan). | Modal tetap terbuka, pilihan Kondisi Buku dan hasil kalkulasi Panel Ringkasan Denda tidak hilang. Pesan error singkat di atas tombol aksi: *"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."* Tombol submit kembali aktif. |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | ID Peminjaman, ID Siswa, ID Buku, Tanggal Pinjam, Tanggal Batas Kembali | Database → tabel `peminjaman` |
| Pengembalian | ID Pengembalian, ID Peminjaman (referensi), Tanggal Kembali, Kondisi Buku, Status Keterlambatan, Jumlah Hari Terlambat, Denda Keterlambatan, Biaya Kondisi Buku, Total Denda | Database → tabel `pengembalian` |
| Buku | Stok, Status | Database → tabel `buku` |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.5)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Peminjaman Aktif | Table Component (9.4) | Badge Terlambat (merah) jika melewati batas kembali; Badge Denda (9.5) tampil setelah transaksi selesai diproses (terlihat di Riwayat, PAGE-006). |
| Modal Konfirmasi | Modal Dialog (9.3) + Confirmation Pattern (11.4) | Ringkasan data + info keterlambatan + Panel Ringkasan Denda. |
| Kondisi Buku | Radio Button Group (9.7) | "Baik" / "Rusak Ringan" / "Rusak Berat"; wajib dipilih sebelum submit; perubahan pilihan memicu kalkulasi ulang denda. |
| Panel Ringkasan Denda | Interaction Pattern 11.8 | Container `#FBE1E3` jika Total Denda > 0, `#E1EEF3` jika Rp 0; ikon `CircleDollarSign`; teks Total memakai style Nominal Denda (Bold 20px, Section 5 DS); read-only. |
| Field Tanggal Kembali | Date Picker — varian Read-Only (9.10) | Otomatis terisi tanggal hari ini. |
| Error Koneksi | System Error State (11.7) | Data pilihan modal (termasuk hasil kalkulasi denda) tidak hilang saat gagal submit. |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-004-01 | Guru dapat memproses pengembalian dari daftar Peminjaman Aktif. |
| AC-004-02 | Tanggal Pengembalian terisi otomatis dan tidak dapat diubah manual. |
| AC-004-03 | Sistem menghitung dan menampilkan jumlah hari keterlambatan secara otomatis, apabila ada. |
| AC-004-04 | Tombol "Konfirmasi Pengembalian" hanya aktif setelah Kondisi Buku dipilih. |
| AC-004-05 | Sistem menghitung dan menampilkan Total Denda (Denda Keterlambatan + Biaya Kondisi Buku) secara otomatis dan real-time — sebelum Guru mengklik "Konfirmasi Pengembalian" — tanpa input manual dari Guru. |
| AC-004-06 | Perubahan pilihan Kondisi Buku memicu perhitungan ulang Panel Ringkasan Denda secara instan. |
| AC-004-07 | Setelah pengembalian tersimpan, Stok buku bertambah 1 dan Status berubah menjadi "Tersedia" secara instan (F007). |
| AC-004-08 | Data Pengembalian (termasuk Total Denda) tersimpan terpisah namun tetap terhubung ke ID Peminjaman terkait. |
| AC-004-09 | Nominal Total Denda yang sudah tersimpan tidak dapat diubah/dihapus melalui antarmuka Guru setelah dikonfirmasi (immutable). |

---

## 12. NOTES

-  Sistem menerapkan denda keterlambatan otomatis — bukan lagi out-of-scope. Formula: Denda Keterlambatan = Rp 500 × jumlah hari terlambat; Biaya Kondisi Buku = Rp 0 (Baik) / Rp 2.000 (Rusak Ringan) / Rp 5.000 (Rusak Berat); Total Denda = jumlah keduanya (SRS v3.4, Business Rule F004; DS v1.5 Section 11.8).
- Nominal Rp 500/hari, Rp 2.000, dan Rp 5.000 masih berstatus placeholder menurut SRS Section 12 (Open Questions #1) — dapat berubah sebelum go-live setelah dikonfirmasi pihak sekolah. Sama halnya belum ada batas maksimal (cap) denda untuk keterlambatan sangat lama (Open Questions #2).
- Denda bersifat pencatatan informatif — sistem ini tidak menyediakan modul pembayaran/pelunasan digital (status Lunas/Belum Lunas, transfer, dsb). Pembayaran dilakukan manual di luar sistem oleh pihak sekolah (SRS Section 4.2 F004; Future Considerations #5).
- Jika terjadi kesalahan pencatatan kondisi buku setelah pengembalian dikonfirmasi, koreksi hanya dapat dilakukan oleh administrator langsung di database — tidak melalui antarmuka Guru (Out-of-Scope poin #13).
- Data Pengembalian disimpan terpisah dari data Peminjaman, namun tetap terhubung melalui ID Peminjaman (Business Rule Master List poin 8).
- Perubahan stok dan status wajib terjadi dalam satu transaksi database yang sama dengan pencatatan pengembalian (Business Rule F007).

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal — masih menyatakan sistem TIDAK menerapkan denda (sesuai SRS v3.1 Out-of-Scope poin #3 versi lama). |
| **1.1** | **2026-07-09** | **Kelompok DPSI BRAYYY** | **Sinkronisasi dengan SRS v3.4 (Business Rule F004, FR-018/FR-019) dan DS v1.5 (Section 11.8 Panel Ringkasan Denda, Badge Denda 9.5, style Nominal Denda Section 5):** (1) Main Flow ditambah step kalkulasi & tampilan Panel Ringkasan Denda sebelum konfirmasi; (2) AF-001 direvisi — keterlambatan kini memicu komponen Denda Keterlambatan (bukan lagi "tanpa denda"); (3) tambah AF-003 untuk kasus kondisi buku rusak tanpa keterlambatan; (4) tambah field Total Denda pada Related Data & Post-condition (bersifat immutable setelah dikonfirmasi); (5) tambah AC-004-05, AC-004-06, AC-004-09; (6) Section 12 Notes diperbarui total, menghapus rujukan ke Out-of-Scope lama; (7) tambah FR-ID Terkait di Header. |