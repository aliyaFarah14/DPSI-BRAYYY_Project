# User Flow — UC-003: Pencatatan Peminjaman Buku

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
| UC ID | UC-003 |
| Use Case Name | Pencatatan Peminjaman Buku |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F003 |
| Page ID (IA) | PAGE-004 |
| Route | /peminjaman |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru berhasil mencatat transaksi peminjaman buku oleh siswa secara akurat — memilih buku yang tersedia, mengisi data siswa peminjam dan tanggal batas pengembalian — sehingga status buku diperbarui secara otomatis dan data transaksi tersimpan di sistem.

---

## 3. TRIGGER

- Guru mengklik menu **"Peminjaman"** pada Sidebar navigasi dari halaman manapun (setelah login).
- Siswa datang ke perpustakaan untuk meminjam buku dan guru perlu mencatat transaksinya.

---

## 4. PRECONDITIONS

- Guru telah berhasil login ke sistem (UC-001 selesai, sesi aktif).
- Minimal satu data buku dengan stok > 0 telah tersedia di katalog (UC-002 sudah dijalankan sebelumnya).
- Guru berada di halaman `/peminjaman` (PAGE-004).

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition
- Data transaksi peminjaman tersimpan di database dengan status "Dipinjam".
- Stok buku yang dipinjam berkurang otomatis sebesar 1.
- Status buku diperbarui menjadi "Dipinjam" jika stok menjadi 0.
- Form peminjaman ter-reset dan siap untuk mencatat transaksi berikutnya.

### 5.2 Failure Postcondition
- Data transaksi tidak tersimpan; sistem menampilkan pesan error.
- Stok dan status buku tidak berubah.

---

## 6. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Mengklik menu **"Peminjaman"** pada Sidebar. | Sistem menampilkan halaman `/peminjaman` (PAGE-004) dengan layout dua panel: Panel Kiri (daftar buku tersedia) dan Panel Kanan (form data peminjaman). |
| 2 | Guru | Melihat daftar buku di **Panel Kiri** dan memilih buku yang akan dipinjam dengan mengkliknya. | Buku yang dipilih ditandai dengan border hijau aktif. Informasi buku (judul, penulis, tema, stok tersedia) muncul di Panel Kanan sebagai ringkasan. |
| 3 | Guru | Di **Panel Kanan**, mengisi field **Nama Siswa** (teks nama lengkap). | — |
| 4 | Guru | Mengisi field **Kelas Siswa** (contoh: "4A", "5B"). | — |
| 5 | Guru | Melihat field **Tanggal Peminjaman** yang sudah terisi otomatis dengan tanggal hari ini (read-only). | Field ditampilkan dengan latar `bg-slate-100` dan keterangan "(Otomatis)" — tidak dapat diubah. |
| 6 | Guru | Mengisi field **Tanggal Batas Pengembalian** menggunakan date picker (minimal: hari ini). | Sistem menampilkan date picker; hanya tanggal hari ini dan setelahnya yang dapat dipilih. |
| 7 | Guru | Mengklik tombol **"Simpan Peminjaman"**. | Tombol berubah ke state `[Loading]`. Sistem memvalidasi seluruh field wajib dan mengirim request POST ke API. |
| 8 | — | — | Data transaksi peminjaman tersimpan. Stok buku berkurang 1 secara otomatis. Status buku diperbarui jika perlu. |
| 9 | — | — | Notifikasi sukses: *"Peminjaman berhasil dicatat."* Form ter-reset (buku ter-deselect, field nama dan kelas dikosongkan, tanggal diperbarui ke hari ini). Siap untuk transaksi berikutnya. |

---

## 7. ALTERNATIVE FLOW

### AF-001: Guru Mencari Buku Tertentu di Panel Kiri

| Step | Condition | Action |
| --- | --- | --- |
| 2A | Daftar buku di Panel Kiri terlalu panjang; guru ingin mencari buku tertentu. | Guru menggunakan kolom pencarian di atas daftar Panel Kiri. Sistem memfilter daftar buku secara real-time sesuai kata kunci. Guru memilih buku dari hasil filter. |

### AF-002: Guru Membatalkan Pencatatan Peminjaman

| Step | Condition | Action |
| --- | --- | --- |
| 7A | Guru mengklik tombol **"Batal"** sebelum menyimpan. | Form ter-reset. Buku di Panel Kiri ter-deselect. Tidak ada data yang disimpan ke database. |

---

## 8. EXCEPTION FLOW

### EF-001: Field Wajib Kosong Saat Submit

| Step | Condition | System Response |
| --- | --- | --- |
| 7E | Guru mengklik "Simpan Peminjaman" tanpa memilih buku, atau tanpa mengisi nama/kelas siswa, atau tanpa mengisi tanggal batas kembali. | Sistem menampilkan pesan validasi merah di bawah setiap field yang belum diisi. Request tidak dikirim ke server. |

### EF-002: Buku Stok 0 — Tidak Dapat Dipilih

| Step | Condition | System Response |
| --- | --- | --- |
| 2E | Buku yang ingin dipilih guru memiliki stok 0 (semua eksemplar sedang dipinjam). | Kartu buku di Panel Kiri ditampilkan dalam kondisi `[Disabled]` (abu-abu, tidak interaktif) dengan badge merah "Stok Habis". Guru tidak dapat memilih buku tersebut. |

### EF-003: Tidak Ada Buku Tersedia Sama Sekali

| Step | Condition | System Response |
| --- | --- | --- |
| 1E | Semua buku di katalog memiliki stok 0. | Panel Kiri menampilkan Empty State: ikon buku dengan tanda seru dan teks: *"Tidak ada buku yang tersedia untuk dipinjam saat ini."* |

### EF-004: Tanggal Batas Pengembalian Lebih Awal dari Tanggal Pinjam

| Step | Condition | System Response |
| --- | --- | --- |
| 7E | Tanggal batas pengembalian yang dipilih lebih awal dari tanggal hari ini (secara logika seharusnya tidak terjadi karena date picker dibatasi, namun sebagai fallback validasi server). | Sistem menampilkan pesan error: *"Tanggal batas pengembalian harus sama atau setelah tanggal peminjaman."* |

### EF-005: Koneksi Jaringan Gagal Saat Menyimpan

| Step | Condition | System Response |
| --- | --- | --- |
| 8E | Request ke API gagal karena koneksi internet terputus. | Tombol kembali ke state `[Default]`. Sistem menampilkan pesan error: *"Gagal menyimpan data. Periksa koneksi internet dan coba lagi."* Data yang sudah diisi pada form dipertahankan (local state retention). |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Buku | idBuku, judulBuku, penulis, temaBuku, stok, statusBuku | Database → tabel `buku` (read untuk daftar; update stok & status setelah simpan) |
| Peminjaman | idPeminjaman (auto), namaSiswa, kelasSiswa, idBuku, tglPeminjaman (auto), tglBatasPengembalian, statusPeminjaman | Database → tabel `peminjaman` (insert baru) |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Panel Kiri — Daftar Buku | Card Buku (grid) + Badge Stok | Buku stok 0 ditampilkan disabled |
| Kolom Pencarian Buku | Text Input — Search | Filter daftar buku di Panel Kiri |
| Field Nama Siswa | Text Input — Default & Focus State | Label: "Nama Siswa *" |
| Field Kelas Siswa | Text Input — Default & Focus State | Label: "Kelas *" (contoh: 4A, 5B) |
| Field Tanggal Pinjam | Text Input — Read-Only (bg-slate-100) | Otomatis terisi tanggal hari ini |
| Field Tanggal Batas Kembali | Date Picker | Min date: hari ini |
| Tombol "Simpan Peminjaman" | Primary Button — semua states | Loading saat proses simpan |
| Tombol "Batal" | Secondary Button | Reset form tanpa menyimpan |
| Layout Split Panel | Split Layout 60% / 40% | Sesuai IA v1.0 PAGE-004 |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-003-01 | Guru berhasil mencatat peminjaman; data tersimpan dan stok buku berkurang 1. |
| AC-003-02 | Buku dengan stok 0 ditampilkan disabled dan tidak dapat dipilih. |
| AC-003-03 | Field wajib yang kosong memunculkan pesan validasi tanpa mengirim request. |
| AC-003-04 | Tanggal peminjaman terisi otomatis oleh sistem dan tidak dapat diubah guru. |
| AC-003-05 | Date picker tanggal batas kembali hanya memperbolehkan tanggal hari ini atau setelahnya. |
| AC-003-06 | Setelah berhasil simpan, form ter-reset dan siap untuk transaksi berikutnya. |
| AC-003-07 | Jika jaringan gagal, data form dipertahankan (tidak hilang) dan pesan error ditampilkan. |

---

## 12. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |