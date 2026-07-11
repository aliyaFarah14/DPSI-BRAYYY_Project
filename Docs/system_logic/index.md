# System Logic Specifications

## Sistem Informasi Perpustakaan SD Negeri Tamanan

**Document Version:** v1.4 (Update versi sys_uc_002.md → v1.4 dan sys_uc_006.md → v1.4 — sinkron data_model.md v1.5 & srs.md v3.6)

**Project:** Sistem Informasi Perpustakaan SD Negeri Tamanan

**Product:** Web-Based Library Information System

**Status:** Draft

**Last Updated:** 2026-07-10

**Author:** Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan

**Supervisor:** Farid Suryanto, S.Pd., MT.

---

# 1. PURPOSE

Dokumen ini berfungsi sebagai **master index** untuk seluruh **System Logic Specifications** pada Sistem Informasi Perpustakaan SD Negeri Tamanan.

Setiap **System Logic** berisi sequence diagram, alur komunikasi sistem, business logic, serta spesifikasi API yang diturunkan langsung dari:

- **SoT-1:** `srs.md` v3.4 (Feature ID F001–F007, FR-001–FR-029).
- **SoT-2:** `information_architecture.md` (sinkron SRS v3.4).
- **SoT-3:** `design_system.md` v1.5.
- **SoT-4:** `user_flows` v1.1 (index.md + UC-001 s.d. UC-006), termasuk AC-ID per use case.
- **SoT-6:** `data_model.md` v1.3 — sumber utama nama kolom, tipe data, dan skema SQLite.

### 1.1 Catatan Revisi Besar v1.1

Revisi v1.1 memperbaiki 4 gap kritis pada draft v1.0:

1. **Model autentikasi** diubah total dari **Bearer Token** menjadi **session-cookie murni (HttpOnly Cookie)**, konsisten dengan `srs.md` v3.4 Section 9.2 dan `userflow_uc_001.md`. Draft v1.0 sebelumnya kontradiktif — mengembalikan token di response body sekaligus mensyaratkan header `Authorization: Bearer` di semua endpoint, padahal HttpOnly Cookie secara desain tidak bisa dibaca JavaScript untuk ditempel sebagai header.
2. **Entity `siswa`** yang sempat diasumsikan sebagai tabel master dengan endpoint `GET /api/v1/students` **dihapus**. Sesuai `data_model.md` v1.3 Section 2, data siswa (nama, kelas) disimpan langsung sebagai kolom bebas di tabel `peminjaman` — Guru mengetik manual, bukan memilih dari daftar siswa.
3. **Logika Denda Keterlambatan** (F004) ditambahkan penuh ke UC-004 — sebelumnya sama sekali tidak ada di draft v1.0, padahal sudah menjadi bagian wajib SRS sejak v3.2.
4. **Business rule "Rusak Berat → status Tidak Aktif otomatis"** pada UC-004 draft v1.0 **dihapus** karena tidak ada dasarnya di SRS — status buku setelah pengembalian selalu kembali "Tersedia", terlepas dari kondisi buku (perubahan ke "Tidak Aktif" hanya keputusan manual Guru via F002).

Selain itu, seluruh field naming pada API contract diselaraskan dengan nama kolom di `data_model.md` v1.3 (mis. `judul_buku` bukan `judul`, `tgl_peminjaman` bukan `tanggal_pinjam`), dan Traceability Matrix diarahkan ke **FR-ID** (SRS v3.4) dan **AC-ID** (User Flow v1.1) yang sesungguhnya, menggantikan skema ID buatan (`F00X-REQ-00X`) yang tidak dapat ditelusuri ke dokumen manapun.

### 1.2 Catatan Revisi v1.2 (Struktur Dokumen)

Seluruh dokumen System Logic (UC-001 s.d. UC-006) dilengkapi section **"Related Screens"** dan **"Related Entities"** di awal dokumen, sesuai checklist minimal isi UCIC. Tabel Catalog (Section 3) dan Mapping (Section 4) pada index ini diperbarui agar nomor versi setiap file sinkron dengan versi terbaru masing-masing.

---

# 2. FILE STRUCTURE

```text
system_logics/
├── index.md
├── sys_uc_001.md
├── sys_uc_002.md
├── sys_uc_003.md
├── sys_uc_004.md
├── sys_uc_005.md
└── sys_uc_006.md
```

---

# 3. SYSTEM LOGIC CATALOG

| Use Case ID | Use Case Name | File Path | Status | Version |
| --- | --- | --- | --- | --- |
| UC-001 | Autentikasi Guru (Login) | ./sys_uc_001.md | Draft | v1.3 |
| UC-002 | Manajemen Data Buku | ./sys_uc_002.md | Draft | v1.4 |
| UC-003 | Pencatatan Peminjaman Buku | ./sys_uc_003.md | Draft | v1.2 |
| UC-004 | Pencatatan Pengembalian Buku | ./sys_uc_004.md | Draft | v1.2 |
| UC-005 | Riwayat Peminjaman | ./sys_uc_005.md | Draft | v1.2 |
| UC-006 | Akses Ketersediaan & Lokasi Buku (Publik) | ./sys_uc_006.md | Draft | v1.4 |

---

# 4. USER FLOW → SYSTEM LOGIC MAPPING

| User Flow | System Logic | Description |
| --- | --- | --- |
| userflow_uc_001.md v1.0 | sys_uc_001.md v1.3 | Authentication process, session-cookie management, dan login/logout API |
| userflow_uc_002.md v1.3 | sys_uc_002.md v1.4 | CRUD data buku, validasi, upload gambar sampul, serta sinkronisasi data buku |
| userflow_uc_003.md v1.0 | sys_uc_003.md v1.2 | Proses peminjaman buku, validasi stok, pencatatan transaksi (nama/kelas siswa manual), dan sinkronisasi stok otomatis |
| userflow_uc_004.md v1.1 | sys_uc_004.md v1.2 | Proses pengembalian buku, kalkulasi keterlambatan & denda otomatis, dan sinkronisasi stok otomatis |
| userflow_uc_005.md v1.1 | sys_uc_005.md v1.2 | Pengambilan data riwayat peminjaman beserta filter pencarian dan nominal denda |
| userflow_uc_006.md v1.2 | sys_uc_006.md v1.4 | Akses publik terhadap informasi ketersediaan, lokasi, dan stok buku |

---

# 5. API OVERVIEW

## Base URL

```text
http://localhost:<port>/api/v1
```

Sesuai `srs.md` v3.4, backend Express.js menyajikan API dan static file frontend dari satu proses/origin yang sama di PC lokal perpustakaan — tidak ada CORS, tidak ada HTTPS wajib.

## Authentication (Direvisi total v1.1 — Session-Cookie, bukan Bearer Token)

Sistem menggunakan **session-cookie murni**, bukan Bearer Token:

- Saat login berhasil, backend mengirim `Set-Cookie: session_id=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=1800`.
- Browser otomatis menyertakan cookie ini pada setiap request berikutnya ke origin yang sama — frontend **tidak perlu** membaca atau menempelkan token secara manual (dan secara desain **tidak bisa**, karena `HttpOnly`).
- Endpoint yang memerlukan autentikasi divalidasi oleh **middleware `requireAuth`** di backend, yang mencocokkan `session_id` dari cookie terhadap tabel `session` (lihat `data_model.md` v1.3 Section 3.6), memeriksa `expires_at`, lalu memperbarui `last_activity`.
- Endpoint publik (UC-006) tidak memerlukan cookie/session sama sekali.

```text
Cookie: session_id=<token>   (dikirim otomatis oleh browser, tidak diatur manual oleh frontend)
```

---

## Common Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Success",
  "errors": []
}
```

---

## HTTP Status Codes

| Code | Description |
| --- | --- |
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (sesi tidak ada/kadaluarsa) |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict (mis. ID sudah ada, stok habis, sudah dikembalikan) |
| 500 | Internal Server Error |

---

# 6. SYSTEM LOGIC NOTES

### Embedded Logic (F007)

Feature **F007 — Sinkronisasi Stok & Status Otomatis** tidak memiliki dokumen System Logic tersendiri karena merupakan bagian dari transaksi atomik pada:

- **UC-003 (Pencatatan Peminjaman Buku)** — mengurangi stok buku, mengubah status buku menjadi **Dipinjam** jika stok mencapai 0, menyimpan transaksi peminjaman dalam satu database transaction.
- **UC-004 (Pencatatan Pengembalian Buku)** — menambah stok buku, mengubah status buku menjadi **Tersedia** (tanpa pengecualian kondisi buku), mengubah status transaksi menjadi **Sudah Dikembalikan**, dan menghitung Total Denda.

Seluruh proses tersebut dilakukan secara atomik untuk menjaga konsistensi data.

### Data Siswa (Bukan Entity Terpisah)

Sejak v1.1, seluruh System Logic tidak lagi mengasumsikan tabel master `siswa`. Field `nama_siswa` dan `kelas_siswa` dikirim langsung sebagai teks bebas dalam request `POST /api/v1/loans` (UC-003), sesuai `data_model.md` v1.3.

---

# 7. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Initial Draft System Logic Index yang diturunkan dari User Flows Index (SoT-4). |
| 1.1 | 2026-07-09 | Kelompok DPSI BRAYYY | Perbaikan 4 gap kritis: (1) model autentikasi diubah dari Bearer Token ke session-cookie murni; (2) penghapusan asumsi entity `siswa` terpisah; (3) penambahan logika Denda Keterlambatan pada UC-004; (4) penghapusan business rule "Rusak Berat → Tidak Aktif otomatis" yang tidak berdasar SRS. Juga: field naming API diselaraskan dengan `data_model.md` v1.3, Traceability Matrix diarahkan ke FR-ID/AC-ID yang sesungguhnya (bukan skema ID buatan), Base URL diperjelas konteks localhost. |
| **1.3** | **2026-07-10** | **Kelompok DPSI BRAYYY** | **Update Catalog (Section 3): sys_uc_002.md → v1.3, sys_uc_006.md → v1.3; update Mapping (Section 4): userflow_uc_002.md v1.2 → sys_uc_002.md v1.3, userflow_uc_006.md v1.1 → sys_uc_006.md v1.3. Sinkron data_model.md v1.4 & srs.md v3.5.** |
| **1.4** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Update Catalog: sys_uc_002.md → v1.4, sys_uc_006.md → v1.4; update Mapping: userflow_uc_002.md v1.3 → sys_uc_002.md v1.4, userflow_uc_006.md v1.2 → sys_uc_006.md v1.4. Sinkron data_model.md v1.5 & srs.md v3.6.** |