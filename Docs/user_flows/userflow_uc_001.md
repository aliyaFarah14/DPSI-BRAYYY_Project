# User Flow — UC-001: Login Guru

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
| UC ID | UC-001 |
| Use Case Name | Login Guru |
| Actor | ACT-01 — Guru |
| Feature ID (SRS) | F001 |
| Page ID (IA) | PAGE-001 |
| Route | /login |
| Priority | High |
| Status | Draft |

---

## 2. GOAL

Guru berhasil masuk ke dalam sistem perpustakaan menggunakan username dan password yang valid, sehingga dapat mengakses seluruh fitur manajemen perpustakaan yang memerlukan autentikasi.

---

## 3. TRIGGER

Salah satu dari kondisi berikut memicu use case ini:

- Guru membuka URL `/login` secara langsung di browser.
- Guru mencoba mengakses halaman yang memerlukan autentikasi (`/buku`, `/peminjaman`, `/pengembalian`, `/riwayat`) tanpa sesi aktif → sistem me-redirect otomatis ke `/login`.
- Sesi login guru habis karena idle timeout 30 menit → sistem mengarahkan kembali ke `/login`.

---

## 4. PRECONDITIONS

- Akun guru (username dan password) telah dibuat dan tersimpan di database sistem oleh administrator.
- Sistem dalam kondisi aktif dan dapat diakses melalui browser.
- Guru membuka browser dan mengakses URL `/login`.

---

## 5. POSTCONDITIONS

### 5.1 Success Postcondition
- Guru berhasil terautentikasi; sesi aktif dibuat dan disimpan sebagai HttpOnly Cookie yang terenkripsi.
- Guru diarahkan otomatis ke halaman `/buku` (PAGE-003: Manajemen Data Buku).

### 5.2 Failure Postcondition
- Guru tidak berhasil login; tidak ada sesi yang dibuat.
- Sistem tetap berada di halaman `/login` dan menampilkan pesan error yang informatif.

---

## 6. MAIN FLOW (Happy Path)

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | Guru | Membuka browser dan mengakses URL `/login`. | Sistem menampilkan halaman Login minimalis (tanpa sidebar): form username, form password, dan tombol "Masuk". |
| 2 | Guru | Mengisi field **Username** dengan username akun guru. | Sistem menampilkan karakter yang diketik pada field username. |
| 3 | Guru | Mengisi field **Password** dengan password akun guru. | Sistem menampilkan karakter tersembunyi (masking: `••••••`). |
| 4 | Guru | Mengklik tombol **"Masuk"**. | Tombol berubah ke state `[Loading]` (spinner aktif, tombol disabled). Sistem mengirim request POST ke API autentikasi. |
| 5 | — | — | Sistem memvalidasi kredensial ke database (mencocokkan username dan hash bcrypt password). |
| 6 | — | — | Kredensial valid. Sistem membuat sesi aktif, menyimpan token sebagai HttpOnly Cookie. |
| 7 | — | — | Sistem me-redirect guru otomatis ke `/buku` (PAGE-003). |

---

## 7. ALTERNATIVE FLOW

### AF-001: Guru Sudah Memiliki Sesi Aktif

| Step | Condition | Action |
| --- | --- | --- |
| 1A | Guru mengakses `/login` namun sudah memiliki sesi aktif yang valid. | Sistem mendeteksi sesi aktif dan langsung me-redirect guru ke `/buku` tanpa menampilkan form login. |

---

## 8. EXCEPTION FLOW

### EF-001: Username atau Password Salah

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Sistem menemukan username tidak terdaftar atau password tidak cocok dengan hash di database. | Tombol kembali ke state `[Default]`. Sistem menampilkan pesan error merah di bawah form: *"Username atau password salah. Silakan periksa kembali dan coba lagi."* Guru tetap berada di halaman `/login`. |

### EF-002: Field Kosong Saat Submit

| Step | Condition | System Response |
| --- | --- | --- |
| 4E | Guru mengklik "Masuk" dengan salah satu atau kedua field masih kosong. | Sistem menampilkan pesan validasi merah di bawah field yang kosong: *"Username wajib diisi."* / *"Password wajib diisi."* Request tidak dikirim ke server. |

### EF-003: Koneksi Jaringan Gagal

| Step | Condition | System Response |
| --- | --- | --- |
| 5E | Request ke API gagal karena koneksi internet terputus. | Tombol kembali ke state `[Default]`. Sistem menampilkan pesan error: *"Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi."* |

---

## 9. RELATED DATA

| Data Object | Fields Used | Source |
| --- | --- | --- |
| Guru | username, password (hashed bcrypt) | Database → tabel `guru` |
| Session Token | HttpOnly Cookie, expire: idle 30 menit | Server-side session / JWT |

---

## 10. RELATED PAGES & COMPONENTS (DS v1.0)

| Element | DS Component | Notes |
| --- | --- | --- |
| Form Username | Text Input — Default & Focus State | Placeholder: "Masukkan username" |
| Form Password | Text Input — Default & Focus State | Type: password (masking aktif) |
| Tombol "Masuk" | Primary Button — semua states | Loading state saat proses validasi berlangsung |
| Pesan Error | Validation — Error State (merah, 12px) | Muncul di bawah form atau di bawah field yang gagal |
| Layout Halaman | Halaman minimalis terpusat, tanpa Sidebar | Sesuai ketentuan IA v1.0 PAGE-001 |

---

## 11. ACCEPTANCE CRITERIA

| AC ID | Criteria |
| --- | --- |
| AC-001-01 | Guru dengan kredensial valid berhasil login dan diarahkan ke `/buku`. |
| AC-001-02 | Guru dengan username salah melihat pesan error yang informatif dan tetap di halaman `/login`. |
| AC-001-03 | Guru dengan password salah melihat pesan error yang informatif dan tetap di halaman `/login`. |
| AC-001-04 | Field kosong saat submit memunculkan pesan validasi tanpa mengirim request ke server. |
| AC-001-05 | Sesi login dibuat sebagai HttpOnly Cookie dan berakhir otomatis setelah 30 menit idle. |
| AC-001-06 | Guru yang sudah memiliki sesi aktif dan mengakses `/login` langsung diarahkan ke `/buku`. |
| AC-001-07 | Tombol "Masuk" menampilkan loading spinner dan dinonaktifkan selama proses validasi berlangsung. |

---

## 12. NOTES

- Tidak ada fitur self-registration; akun guru hanya dapat dibuat oleh administrator sistem (sesuai Business Rule SRS F001).
- Tidak ada fitur "Lupa Password" pada versi ini (berada di luar cakupan SRS v1.0).
- Password disimpan dalam bentuk hash bcrypt di database; tidak pernah tersimpan sebagai plaintext.

---

## 13. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |