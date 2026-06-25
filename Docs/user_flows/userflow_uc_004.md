# User Flow — UC-004: Pencatatan Pengembalian Buku

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
| UC ID | UC-004 |
| Use Case Name | Pencatatan Pengembalian Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F004 |
| Page ID (IA) | PAGE-005 |
| Route | /pengembalian |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru berhasil memproses pengembalian buku dari siswa — memilih transaksi peminjaman yang aktif, mencatat kondisi buku saat dikembalikan, dan mengonfirmasi pengembalian — sehingga stok buku diperbarui otomatis dan data pengembalian tersimpan di sistem.

---

## 3. TRIGGER

- Guru mengklik menu **"Pengembalian"** pada Sidebar navigasi.
- Siswa datang ke perpustakaan untuk mengembalikan buku dan guru perlu memproses pengembaliannya.

---

## 4. PRECONDITIONS

- Guru telah berhasil login ke sistem (UC-001 selesai, sesi aktif).
- Terdapat minimal satu transaksi peminjaman aktif yang belum dikembalikan (UC-003 sudah dijalankan sebelumnya).
- Guru berada di halaman `/pengembalian` (PAGE-005).

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition
- Data pengembalian tersimpan di database (tabel `pengembalian`) terhubung dengan ID Peminjaman.
- Status transaksi peminjaman berubah menjadi "Sudah Dikembalikan".
- Stok buku bertambah 1 secara otomatis.
- Status buku diperbarui menjadi "Tersedia".
- Baris transaksi tersebut menghilang dari daftar peminjaman aktif di PAGE-005.

### 5.2 Failure Postcondition
- Data pengembalian tidak tersimpan; status buku dan stok tidak berubah.

---

## 6. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Mengklik menu **"Pengembalian"** pada Sidebar. | Sistem menampilkan halaman `/pengembalian` (PAGE-005) berisi tabel daftar seluruh transaksi peminjaman yang masih aktif (belum dikembalikan). |
| 2 | Guru | Melihat tabel peminjaman aktif dan mencari transaksi siswa yang akan mengembalikan buku. Menggunakan kolom pencarian jika diperlukan. | Tabel menampilkan: Nama Siswa, Kelas, Judul Buku, Tanggal Pinjam, Tanggal Batas Kembali, dan Status (badge Terlambat / On-Time). |
| 3 | Guru | Menemukan baris transaksi yang relevan dan mengklik tombol **"Proses Pengembalian"** pada baris tersebut. | Sistem menampilkan Modal Dialog konfirmasi pengembalian berisi ringkasan data: nama siswa, kelas, judul buku, tanggal pinjam, tanggal batas kembali, tanggal pengembalian (hari ini, otomatis), dan informasi keterlambatan jika ada. |
| 4 | Guru | Memeriksa ringkasan data pada modal. Memilih **Kondisi Buku** menggunakan Radio Button: **Baik** / **Rusak Ringan** / **Rusak Berat**. | Sistem menampilkan pilihan kondisi; radio button "Baik" dipilih sebagai default. |
| 5 | Guru | Mengklik tombol **"Konfirmasi Pengembalian"**. | Tombol berubah ke state `[Loading]`. Sistem mengirim request POST ke API pengembalian. |
| 6 | — | — | Data pengembalian tersimpan. Stok buku bertambah 1. Status transaksi berubah "Sudah Dikembalikan". Status buku berubah "Tersedia". |
| 7 | — | — | Modal tertutup. Baris transaksi menghilang dari tabel peminjaman aktif. Notifikasi sukses: *"Pengembalian buku berhasil dicatat."* |

---

## 7. ALTERNATIVE FLOW

### AF-001: Pengembalian Terlambat — Informasi Ditampilkan

| Step | Condition | Action |
| --- | --- | --- |
| 2A | Tanggal hari ini sudah melewati tanggal batas pengembalian buku. | Baris transaksi ditampilkan dengan badge merah **"Terlambat X hari"** pada kolom status di tabel. Ketika modal konfirmasi dibuka (langkah 3), informasi keterlambatan juga ditampilkan secara jelas: *"Terlambat: 3 hari dari batas pengembalian."* Tidak ada denda — hanya informasi (sesuai business rule SRS F004). Alur berlanjut normal. |

### AF-002: Guru Membatalkan Proses Pengembalian

| Step | Condition | Action |
| --- | --- | --- |
| 5A | Guru mengklik tombol **"Batal"** atau ikon X pada modal sebelum mengonfirmasi. | Modal tertutup. Data pengembalian tidak disimpan. Status buku dan stok tidak berubah. Transaksi tetap aktif di tabel. |

### AF-003: Guru Mencari Transaksi Tertentu

| Step | Condition | Action |
| --- | --- | --- |
| 2A | Daftar transaksi aktif panjang; guru ingin menemukan transaksi siswa tertentu dengan cepat. | Guru menggunakan kolom pencarian di atas tabel (berdasarkan nama siswa atau judul buku). Sistem memfilter tabel secara real-time. |

---

## 8. EXCEPTION FLOW

### EF-001: Tidak Ada Transaksi Peminjaman Aktif

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Tidak ada transaksi peminjaman yang berstatus aktif (semua buku sudah dikembalikan). | Tabel menampilkan Empty State: ikon buku dengan centang dan teks: *"Tidak ada peminjaman aktif saat ini. Semua buku telah dikembalikan."* |

### EF-002: Kondisi Buku Tidak Dipilih Saat Konfirmasi

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Guru mengklik "Konfirmasi Pengembalian" tanpa memilih kondisi buku (jika default radio tidak terpilih). | Sistem menampilkan pesan validasi: *"Kondisi buku wajib dipilih sebelum mengonfirmasi pengembalian."* Request tidak dikirim. |

### EF-003: Koneksi Jaringan Gagal Saat Menyimpan

| Step | Condition | System Response |
| --- | --- | --- |
| 6E | Request ke API gagal karena koneksi internet terputus. | Tombol kembali ke state `[Default]`. Modal tetap terbuka. Sistem menampilkan pesan error: *"Gagal menyimpan data pengembalian. Periksa koneksi internet dan coba lagi."* |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Peminjaman | idPeminjaman, namaSiswa, kelasSiswa, idBuku, tglPeminjaman, tglBatasPengembalian, statusPeminjaman | Database → tabel `peminjaman` (read untuk daftar; update status setelah konfirmasi) |
| Pengembalian | idPengembalian (auto), idPeminjaman, tglPengembalian (auto: hari ini), kondisiBuku, statusPengembalian | Database → tabel `pengembalian` (insert baru) |
| Buku | idBuku, stok, statusBuku | Database → tabel `buku` (update stok +1 dan status setelah konfirmasi) |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Tabel Peminjaman Aktif | Table Component — zebra striping, hover state | Kolom: Nama Siswa, Kelas, Judul Buku, Tgl Pinjam, Batas Kembali, Status, Aksi |
| Badge Terlambat | Badge — Merah (`bg-red-100 text-red-700 font-semibold`) | Muncul jika hari ini > tgl batas kembali |
| Badge On-Time | Badge — Hijau (`bg-green-100 text-green-700`) | Muncul jika masih dalam batas waktu |
| Tombol "Proses Pengembalian" | Primary Button — per baris tabel | Memicu Modal Konfirmasi |
| Modal Konfirmasi Pengembalian | Modal Dialog — header, ringkasan data, radio button, footer | max-w-md, rounded-xl, shadow-lg |
| Radio Button Kondisi Buku | Radio Button Group | Pilihan: Baik / Rusak Ringan / Rusak Berat; default: Baik |
| Field Tanggal Pengembalian | Text Input — Read-Only (bg-slate-100) | Otomatis terisi tanggal hari ini |
| Kolom Pencarian | Text Input — Search | Filter tabel berdasarkan nama siswa atau judul buku |
| Empty State | Ilustrasi ikon + teks informatif | Muncul jika tidak ada transaksi aktif |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-004-01 | Guru berhasil memproses pengembalian; data tersimpan, stok buku bertambah 1, baris menghilang dari tabel aktif. |
| AC-004-02 | Transaksi yang terlambat menampilkan badge merah dan informasi jumlah hari keterlambatan di modal. |
| AC-004-03 | Tidak ada denda yang dikenakan; keterlambatan hanya bersifat informatif. |
| AC-004-04 | Tanggal pengembalian terisi otomatis dan tidak dapat diubah guru. |
| AC-004-05 | Kondisi buku (Baik/Rusak Ringan/Rusak Berat) wajib dipilih sebelum konfirmasi. |
| AC-004-06 | Membatalkan proses menutup modal tanpa menyimpan data apapun. |
| AC-004-07 | Jika tidak ada transaksi aktif, halaman menampilkan empty state yang informatif. |
| AC-004-08 | Jika jaringan gagal, modal tetap terbuka dan pesan error ditampilkan. |

---

## 12. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |