# Test Plan

Document Version: v0.2

Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)

Status: Draft
Last Updated: 2026-07-12
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

# 1. INTRODUCTION

## 1.1 Purpose

Dokumen ini mendefinisikan rencana pengujian (test plan) untuk sistem Aplikasi Perpustakaan Berbasis Web — Sistem Informasi Perpustakaan SD Negeri Tamanan. Test Plan ini merupakan acuan utama dalam pelaksanaan seluruh aktivitas pengujian, mencakup strategi, lingkup, sumber daya, jadwal, serta kriteria kelulusan.

## 1.2 Objectives

- Memverifikasi bahwa seluruh fitur (F001–F006) berfungsi sesuai dengan Software Requirements Specification (SRS) v3.7.
- Memvalidasi bahwa setiap use case (UC-001–UC-006) berjalan sesuai spesifikasi sistem logic (Docs/system_logic/).
- Mengidentifikasi defect sebelum sistem digunakan di lingkungan sekolah.
- Memastikan sistem memenuhi non-functional requirements (NFR) yang telah ditetapkan, khususnya performa pada lingkungan single-PC lokal.

## 1.3 References

| Document | Version | Location |
| --- | --- | --- |
| Software Requirements Specification (SRS) | v3.7 | `docs/srs.md` |
| User Flow Specifications | v1.3 | `docs/user_flows/` |
| System Logic Specifications | v1.4 | `docs/system_logic/` |
| Design System | v1.8 | `docs/design_system.md` |
| Information Architecture | v3.7 | `docs/information_architecture.md` |
| Class Diagram | v1.1 | `docs/class_diagram.md` |
| Test Case Specification | v0.1 | `docs/test_case_specification.md` |

---

# 2. TEST SCOPE

## 2.1 In Scope

| Feature ID | Feature Name | Related Use Cases | Test Coverage |
| --- | --- | --- | --- |
| F001 | Autentikasi Guru (Login) | UC-001 | 8 TC |
| F002 | Manajemen Data Buku (CRUD + image upload + validasi) | UC-002 | 12 TC |
| F003 | Pencatatan Peminjaman Buku (multi-buku, stock sync, race condition stok=0) | UC-003 | 8 TC |
| F004 | Pencatatan Pengembalian Buku (denda per hari + biaya kondisi, status sync) | UC-004 | 8 TC |
| F005 | Riwayat Peminjaman + Export Excel (search/filter, export .xlsx via bulan/tahun) | UC-005, FR-032 | 10 TC |
| F006 | Katalog Publik (no-auth, filter kategori termasuk aturan Lainnya, search) | UC-006 | 6 TC |

### 2.1.1 Test Types Included

| Test Type | Description |
| --- | --- |
| Functional Testing | Memverifikasi setiap fitur berfungsi sesuai SRS v3.7 dan system logic |
| UI/UX Testing | Memverifikasi tata letak, konsistensi design system v1.8, dan kemudahan penggunaan antarmuka |
| Validation Testing | Memvalidasi input form, business rules (format lokasi rak, stok >= 0, XSS prevention), dan data integrity |
| Error Handling Testing | Menguji response sistem terhadap kondisi error (server offline, koneksi gagal, invalid input, session timeout) |
| Integration Testing | Memverifikasi integrasi frontend-backend, termasuk sinkronisasi stok F007 yang berjalan otomatis |
| Idle Timeout Testing | Menguji mekanisme session timeout 30 menit dengan warning 2 menit sebelumnya |
| Regression Testing | Menguji bahwa perubahan kode tidak merusak fitur yang sudah berjalan |

## 2.2 Out of Scope

- Performance / load testing (sistem hanya melayani satu unit PC — beban sangat rendah)
- Security penetration testing (akan dilakukan di fase terpisah jika diperlukan)
- Multi-PC / LAN access testing (out of scope SRS Section 5 poin 14)
- Mobile native application testing (web browser only pada PC desktop)
- Cross-browser compatibility (hanya Chrome dan Edge — sesuai SRS Section 3.1)
- Integrasi dengan sistem eksternal (Dapodik, dinas pendidikan — out of scope)
- Modul pembayaran denda digital (uang cash manual di luar sistem — SRS F004 BR)
- Backup dan disaster recovery testing (manual oleh pihak sekolah)

---

# 3. TEST STRATEGY

## 3.1 Testing Levels

### Level 1: Component Testing (Unit)

| Aspect | Detail |
| --- | --- |
| **Target** | Setiap fungsi di backend API endpoints |
| **Approach** | Automated unit test (developer responsibility) + manual API testing via curl |
| **Tool** | Vitest (Frontend — React/TypeScript, inline dengan Vite), curl.exe (Windows PowerShell) |
| **Responsibility** | Developer |

### Level 2: API-Level Testing

| Aspect | Detail |
| --- | --- |
| **Target** | Setiap endpoint backend: request/response contract sesuai Docs/system_logic/sys_uc_00X.md |
| **Approach** | Manual testing via curl.exe langsung terhadap backend, memverifikasi status code, response body, dan side effect database |
| **Tool** | curl.exe (Windows PowerShell), browser DevTools (Network tab) |
| **Responsibility** | Tester |

### Level 3: End-to-End UI Testing

| Aspect | Detail |
| --- | --- |
| **Target** | Seluruh user flow dari frontend ke backend hingga database, dijalankan di browser |
| **Approach** | Manual test execution berdasarkan test case specification; memverifikasi bahwa frontend terhubung ke API nyata (bukan mock/localStorage) |
| **Tool** | Browser (Chrome/Edge), browser DevTools (Network tab, Application tab), print dialog browser |
| **Responsibility** | Tester |

### Level 4: System Testing

| Aspect | Detail |
| --- | --- |
| **Target** | Seluruh fitur end-to-end via browser pada PC yang sama |
| **Approach** | Manual test execution berdasarkan test case specification; mencakup skenario negatif (invalid input, 401 session expiry) |
| **Tool** | Browser (Chrome/Edge), browser DevTools (Network tab) |
| **Responsibility** | Tester |

### Level 5: User Acceptance Testing (UAT)

| Aspect | Detail |
| --- | --- |
| **Target** | Skenario bisnis nyata yang dijalankan oleh Guru di perpustakaan |
| **Approach** | Manual exploratory testing oleh end user (Guru) |
| **Tool** | PC perpustakaan sekolah (environment production-like) |
| **Responsibility** | End User (Guru) + Tester |

## 3.2 Testing Approach

### Functional Testing Approach

Setiap test case dieksekusi berdasarkan prioritas fitur:
1. **High Priority (F001, F002, F003, F004, F006):** 100% test case dieksekusi
2. **Medium Priority (F005):** 100% test case dieksekusi

Prioritas tinggi diberikan pada fitur yang langsung digunakan dalam operasional harian perpustakaan: login, manajemen buku, peminjaman, pengembalian, dan katalog publik.

### Dua Level Verifikasi

Pengujian dilakukan pada **dua level** untuk setiap fitur:

1. **API-level testing** — Verifikasi request/response contract secara langsung ke backend menggunakan curl.exe. Memastikan status code, response body, dan side effect database sesuai spesifikasi system logic sebelum frontend dilibatkan.
2. **End-to-end UI testing** — Verifikasi melalui browser bahwa frontend terintegrasi dengan benar ke API nyata (bukan mock/localStorage), dan seluruh user flow berjalan di browser pada PC yang sama.

### Known Risk Flags (Berdasarkan Defect yang Ditemukan Selama Pengembangan)

Berdasarkan bug nyata yang ditemukan dan diperbaiki selama pengembangan, area berikut memerlukan perhatian khusus dalam pengujian:

1. **Mock data regression** — Beberapa halaman frontend (Manajemen Buku, Katalog Publik) sempat menggunakan data mock localStorage alih-alih API nyata. Risiko serupa dapat muncul kembali saat menambah halaman/fitur baru. Setiap halaman baru harus diverifikasi bahwa data bersumber dari API, bukan localStorage.

2. **Timezone/date handling** — Bug kronis ditemukan pada `tgl_pengembalian` dan `tgl_peminjaman` di mana tanggal tampak mundur 1 hari karena penggunaan `toISOString()` (UTC) vs `setHours(0,0,0,0)` (WIB lokal). Setiap fitur yang memproses tanggal (peminjaman, pengembalian, riwayat, export) harus diverifikasi konsistensi zonanya — semua tanggal harus dalam WIB (Asia/Jakarta).

3. **Session expiry (401) handling** — Semua halaman yang memerlukan autentikasi harus menampilkan pesan "Sesi Anda telah berakhir, silakan login kembali." dan redirect ke `/login` saat menerima 401. Perlu diverifikasi bahwa tidak ada halaman yang diam saja (silent failure) atau menampilkan UI basi (stale UI) setelah session habis.

### Konteks Deployment Khusus

Karena sistem berjalan pada **satu unit PC lokal** (SRS Section 3.3), pengujian dilakukan pada:
- Lingkungan staging: PC development/laptop tim penguji
- Lingkungan production: PC perpustakaan SD Negeri Tamanan (saat UAT)

Keduanya harus menggunakan OS Windows dan browser Chrome/Edge.

### Defect Management

| Stage | Action |
| --- | --- |
| Defect Found | Tester mencatat defect di log |
| Severity Level | Critical / Major / Minor / Trivial |
| Critical Defect | Pengujian dihentikan sampai defect diperbaiki |
| Major Defect | Pengujian fitur terkait dihentikan sampai diperbaiki |
| Minor/Trivial | Pengujian tetap berjalan, defect diperbaiki setelahnya |

Severity classification:

| Severity | Definition | Example |
| --- | --- | --- |
| **Critical** | Sistem tidak dapat digunakan / data hilang / fitur utama gagal total | Login tidak berfungsi, transaksi peminjaman tidak tersimpan |
| **Major** | Fitur tidak berfungsi sesuai spesifikasi, ada workaround terbatas | Denda tidak terhitung otomatis, search tidak menemukan data |
| **Minor** | Penyimpangan dari spesifikasi yang tidak mengganggu operasional utama | Warna badge tidak sesuai design system, typo di label |
| **Trivial** | Masalah kosmetik yang tidak mempengaruhi fungsi | Jarak antar elemen tidak rapi, icon tidak konsisten |

---

# 4. TEST ENVIRONMENT

## 4.1 Hardware Requirements

| Perangkat | Spesifikasi Minimum | Keterangan |
| --- | --- | --- |
| PC Desktop (staging) | Processor Intel i3 / AMD Ryzen 3, RAM 4GB, Storage 256GB | Digunakan untuk pengujian oleh tim |
| PC Desktop (production) | Processor Intel i3 / AMD Ryzen 3, RAM 4GB, Storage 256GB | PC perpustakaan SD Negeri Tamanan (SRS Section 3.1) |
| Printer (opsional) | Thermal / Inkjet printer dengan koneksi USB | Untuk cetak struk — tidak wajib (out of scope LMS versi ini) |

## 4.2 Software Requirements

### Frontend Testing

| Software | Version |
| --- | --- |
| Google Chrome | Latest stable |
| Microsoft Edge | Latest stable |

### Backend & API Testing

| Software | Version |
| --- | --- |
| Node.js | v24+ (sesuai environment development) |
| curl.exe | Bawaan Windows 10/11 |
| Browser DevTools (Network tab, Application tab) | Bawaan Chrome/Edge |

### Server URLs

| Service | URL | Keterangan |
| --- | --- | --- |
| Backend API | `http://localhost:3001` | Express.js server, endpoint di `/api/v1/...` |
| Frontend Dev Server | `http://localhost:5173` | Vite dev server (React/TypeScript) |

### Database

| Software | Version |
| --- | --- |
| SQLite | File-based (bawaan aplikasi) — tidak perlu instalasi terpisah |
| SQLite Viewer (VS Code extension) | opsional — untuk inspeksi langsung file `backend/data/perpustakaan.db` |

## 4.3 Network Requirements

- Tidak memerlukan koneksi internet untuk operasional (SRS Section 3.2)
- Koneksi internet hanya diperlukan untuk instalasi awal (npm install)
- Semua komunikasi melalui localhost (HTTP)

## 4.4 Test Data Requirements

| Data Item | Quantity | Description |
| --- | --- | --- |
| Akun Guru | 1 | Username: `guru_sd`, Password: `guru123` (seed data bawaan) |
| Buku aktif | 9 | Seed data: BK001–BK009 dengan variasi stok (0, 1, 2, 3, 4) dan variasi tema/tingkat_kelas |
| Buku dengan stok = 0 | 1 | BK004 — Dongeng Nusantara (stok: 0) |
| Buku dengan cover image | 1+ | Hasil upload via fitur Image Upload (TC-F002-011) |
| Transaksi peminjaman aktif | 1+ | Status "Dipinjam" untuk pengujian pengembalian |
| Transaksi pengembalian | 1+ | Data historis untuk pengujian riwayat dan denda |

---

# 5. ROLES & RESPONSIBILITIES

| Role | Name / Team | Responsibility |
| --- | --- | --- |
| Test Manager | System Analyst AI (Kelompok DPSI BRAYYY) | Menyusun test plan, mengawasi pelaksanaan, melaporkan hasil |
| Tester | QA Team (Kelompok DPSI BRAYYY) | Mengeksekusi test case, mencatat defect, memverifikasi perbaikan |
| Developer | Dev Team (Kelompok DPSI BRAYYY) | Memperbaiki defect yang ditemukan |
| End User (Guru) | Guru SD Negeri Tamanan | Menjalankan UAT, memberikan feedback |
| Project Supervisor | Farid Suryanto, S.Pd., MT. | Menyetujui hasil pengujian dan keputusan rilis |

---

# 6. TEST SCHEDULE

## 6.1 Phases

| Phase | Activity | Duration | Deliverable |
| --- | --- | --- | --- |
| **P1: Test Planning** | Menyusun test plan, menyiapkan lingkungan dan data uji | 2 hari | Test Plan Document (`test_plan.md`) |
| **P2: Test Case Preparation** | Menyusun test case specification berdasarkan SRS dan user flow | 2 hari | Test Case Specification (`test_case_specification.md`) |
| **P3: Test Execution** | Menjalankan 52 test case, mencatat hasil pass/fail | 3 hari | Test Execution Report |
| **P4: Defect Fixing** | Developer memperbaiki defect yang ditemukan | 2 hari | Fixed Build |
| **P5: Re-testing** | Verifikasi perbaikan, regression test pada fitur terkait | 1 hari | Updated Test Report |
| **P6: UAT** | User acceptance testing oleh Guru SD Negeri Tamanan | 1 hari | UAT Sign-off |
| **P7: Test Closure** | Menyusun laporan akhir pengujian | 1 hari | Test Summary Report |

**Total estimasi:** 12 hari kerja

**Catatan:** Jadwal ini bersifat indikatif dan dapat disesuaikan dengan ketersediaan tim dan pihak sekolah.

---

# 7. ENTRY & EXIT CRITERIA

## 7.1 Entry Criteria

| No | Criteria |
| --- | --- |
| EC-01 | SRS v3.7, User Flow v1.3, System Logic v1.4, dan Test Case Specification sudah di-review dan disetujui |
| EC-02 | Lingkungan pengujian (staging) sudah siap — Node.js terinstal, aplikasi dapat dijalankan |
| EC-03 | Test data sudah siap (seed data otomatis dari aplikasi saat pertama kali dijalankan) |
| EC-04 | Tester sudah memahami test case dan skenario pengujian |
| EC-05 | Browser Chrome/Edge versi terbaru sudah terinstal |

## 7.2 Exit Criteria

| No | Criteria |
| --- | --- |
| XC-01 | 100% test case (52 TC) telah dieksekusi |
| XC-02 | Tidak ada defect dengan severity Critical atau Major yang masih open |
| XC-03 | Seluruh defect Minor/Trivial sudah didokumentasikan dan diterima sebagai known issue |
| XC-04 | UAT sudah selesai dan mendapatkan sign-off dari Guru SD Negeri Tamanan |
| XC-05 | Test Summary Report sudah disusun dan disetujui |

## 7.3 Suspension Criteria

| No | Criteria |
| --- | --- |
| SC-01 | Terdapat critical defect yang menghalangi pengujian lebih dari 50% test case (misal: aplikasi tidak bisa dijalankan sama sekali) |
| SC-02 | Lingkungan pengujian tidak stabil — Node.js crash, database korup, atau PC tidak dapat digunakan |
| SC-03 | Perubahan kebutuhan mendadak yang signifikan (major requirement change) dari pihak sekolah |

---

# 8. TEST DELIVERABLES

| Deliverable | Description | Due |
| --- | --- | --- |
| Test Plan | Dokumen perencanaan pengujian ini | Akhir P1 |
| Test Case Specification | Detail test case untuk setiap fitur (52 TC) | Akhir P2 |
| Test Execution Report | Hasil eksekusi test case (pass/fail) per fitur | Akhir P3 |
| Defect Log | Daftar defect yang ditemukan selama pengujian | Akhir P3 |
| Re-test Report | Hasil verifikasi perbaikan defect | Akhir P5 |
| UAT Sign-off | Persetujuan dari Guru SD Negeri Tamanan | Akhir P6 |
| Test Summary Report | Laporan akhir pengujian — ringkasan hasil, defect, rekomendasi | Akhir P7 |

---

# 9. RISK & MITIGATION

| Risk ID | Risk Description | Probability | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R-01 | Lingkungan staging (PC tim) tidak representatif dengan PC production sekolah (spesifikasi lebih rendah) | Medium | High | Gunakan konfigurasi Node.js dan browser yang identik; pastikan RAM tidak menjadi bottleneck |
| R-02 | Data tidak sengaja terhapus saat pengujian (localStorage/test database) | Low | Medium | Lakukan backup file database SQLite sebelum pengujian fitur destructive |
| R-03 | Test data tidak mencakup semua skenario ekstrem | Low | Medium | Lakukan review test data collaboratif sebelum eksekusi |
| R-04 | Perubahan requirement di tengah pengujian | Low | High | Freeze requirement sebelum P3 dimulai; jika perubahan tak terhindarkan, dokumentasikan sebagai change request |
| R-05 | Guru tidak tersedia untuk UAT pada jadwal yang direncanakan | Medium | Medium | Koordinasikan jadwal UAT jauh-jauh hari dengan pihak sekolah; siapkan alternatif jadwal |

### Real Defect Flags (Ditemukan Selama Pengujian Manual)

Berikut defect nyata yang ditemukan selama siklus pengembangan-pengujian dan telah diperbaiki. Area ini harus mendapat perhatian khusus pada regression test:

| Defect ID | Deskripsi | Severity | Fix |
| --- | --- | --- | --- |
| D-01 | Frontend book-management.tsx menggunakan mock localStorage alih-alih API nyata — data tidak sinkron dengan backend | Critical | Diganti dengan fetch ke `GET/POST/PUT/DELETE /api/v1/books` |
| D-02 | Katalog publik (public-page.tsx) menggunakan mock db lokal — data tidak mencerminkan perubahan di backend | Major | Diganti dengan fetch ke `GET /api/v1/books/public` |
| D-03 | tgl_pengembalian mundur 1 hari (timezone bug) — `toISOString()` vs `setHours()` menghasilkan selisih UTC/WIB | Critical | Diganti dengan `toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })` dan `dateFromWIB()` |
| D-04 | tgl_peminjaman tidak konsisten dengan tgl_pengembalian — satu pakai UTC, satu pakai WIB | Critical | Diseragamkan menggunakan helper `todayWIB()` di loans.js dan returns.js |
| D-05 | Login redirect menyebabkan React "Cannot update component while rendering" | Major | Dipindahkan ke `useEffect` |

---

# 10. APPROVAL

| Role | Name | Signature | Date |
| --- | --- | --- | --- |
| Test Manager | Kelompok DPSI BRAYYY | | |
| Developer Lead | Kelompok DPSI BRAYYY | | |
| Project Supervisor | Farid Suryanto, S.Pd., MT. | | |
| End User (Guru) | Perwakilan SD Negeri Tamanan | | |

---

# 11. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 0.1 | 2026-07-10 | Kelompok DPSI BRAYYY | Initial Draft — Test Plan untuk Sistem Informasi Perpustakaan SD Negeri Tamanan, mencakup strategi pengujian 6 fitur (F001–F006 + embedded F007), 38 test case, jadwal 12 hari, konteks deployment single-PC lokal. |
| 0.2 | 2026-07-12 | Kelompok DPSI BRAYYY | Sinkronisasi test plan dengan hasil implementasi aktual — seluruh backend API (6 use case) dan frontend integration sudah selesai; scope diperluas mencakup fitur Export Excel (FR-032); penambahan dua level verifikasi (API-level via curl dan E2E UI via browser); penambahan risk flags berdasarkan defect nyata yang ditemukan (timezone bug, mock data regression, 401 handling); update referensi dokumen ke versi terbaru (SRS v3.7, system logic v1.4, design system v1.8, class diagram v1.1); update test case count dari 38 ke 52 TC; update environment details (server URLs, alat uji, seed data). |
