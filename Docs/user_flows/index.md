# User Flows (UF) - Source of Truth #4 — Index

Document Version: v1.3 (Update versi userflow_uc_002.md → v1.3 dan userflow_uc_006.md → v1.2; update FR-ID traceability — sinkron srs.md v3.6)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-11
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini berfungsi sebagai indeks utama (master index) untuk seluruh User Flow (UF) Sistem Informasi Perpustakaan SD Negeri Tamanan. Sebagai Source of Truth #4 (SoT-4), dokumen ini diturunkan langsung dari:

- **SoT-1:** `srs.md` v3.4 — sebagai sumber fitur (Feature ID F001–F007), Kebutuhan Fungsional (FR-001–FR-029), dan business rules, termasuk fitur Denda Keterlambatan (F004) dan konteks deployment single-PC lokal.
- **SoT-2:** `information_architecture.md` (sinkron SRS v3.4) — sebagai sumber struktur halaman dan routing, termasuk kolom Denda pada Riwayat dan Panel Ringkasan Denda pada Pengembalian.
- **SoT-3:** `design_system.md` v1.5 — sebagai sumber komponen UI dan interaction patterns, termasuk Panel Ringkasan Denda (11.8), Badge Denda (9.5), dan Image Upload (9.11).

Setiap user flow dalam dokumen ini menggambarkan rangkaian langkah interaksi aktor (Guru / Siswa) untuk menyelesaikan satu use case secara lengkap, mencakup trigger, preconditions, main flow, alternative flow, exception flow, dan postconditions.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | `srs.md` v3.4 | Spesifikasi Kebutuhan Perangkat Lunak — Feature ID F001–F007, Kebutuhan Fungsional FR-001–FR-029, Business Rules Master List, Data Requirements, NFR, Permission Matrix, Tech Stack deployment single-PC lokal. |
| SoT-2 | `information_architecture.md` (sinkron SRS v3.4) | Struktur navigasi, peta situs, dan pemetaan routing, termasuk kolom Denda dan Image Upload. |
| SoT-3 | `design_system.md` v1.5 | Panduan token visual, warna, tipografi, dan komponen UI, termasuk Panel Ringkasan Denda, Badge Denda, dan Image Upload. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir (menggunakan SoT-4 sebagai input). |
| SoT-6 | Data Model | Model data sistem (menggunakan SoT-4 sebagai input utama). |
| SoT-7 | UCIC | Use Case Integration Contract per use case. |

---

## 2. ACTOR SUMMARY

| Actor ID | Actor Name | Access Type | Description |
| --- | --- | --- | --- |
| ACT-01 | Guru | Authenticated | Bertindak sebagai pengelola perpustakaan (tidak ada petugas perpustakaan tetap). Mengelola data buku dan seluruh transaksi perpustakaan setelah login, termasuk kalkulasi denda otomatis saat pengembalian. |
| ACT-02 | Siswa | Public (Unauthenticated) | Pengguna publik. Hanya dapat melihat ketersediaan, lokasi rak, dan mencari buku tanpa login (tidak ada akun/login untuk Siswa — lihat `srs.md` Section 5, Out-of-Scope poin 5). |

---

## 3. USE CASE INVENTORY

| UC ID | Use Case Name | Actor | Feature ID (SRS) | Page ID (IA) | Route | Priority | File | UF Version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UC-001 | Login Guru | ACT-01 | F001 | PAGE-001 | /login | High | userflow_uc_001.md | v1.0 |
| UC-002 | Manajemen Data Buku | ACT-01 | F002 | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 | /buku | High | userflow_uc_002.md | **v1.3** |
| UC-003 | Pencatatan Peminjaman Buku | ACT-01 | F003 (memicu F007) | PAGE-004 | /peminjaman | High | userflow_uc_003.md | v1.0 |
| UC-004 | Pencatatan Pengembalian Buku | ACT-01 | F004 (memicu F007) | PAGE-005 | /pengembalian | High | userflow_uc_004.md | **v1.1** |
| UC-005 | Melihat Riwayat Peminjaman | ACT-01 | F005 | PAGE-006 | /riwayat | Medium | userflow_uc_005.md | **v1.1** |
| UC-006 | Akses Ketersediaan & Lokasi Buku (Publik) | ACT-02 | F006 | PAGE-002 | / | High | userflow_uc_006.md | **v1.2** |

### 3.1 Catatan tentang F007

**F007 — Sinkronisasi Stok & Status Otomatis** tidak memiliki UC ID tersendiri karena bukan interaksi yang dipicu langsung oleh aktor, melainkan logika sistem (server-side) yang berjalan otomatis dalam satu transaksi database yang sama saat UC-003 atau UC-004 berhasil disimpan. Alur ini didokumentasikan sebagai bagian dari **Main Flow** dan **Postconditions** pada `userflow_uc_003.md` dan `userflow_uc_004.md`.

### 3.2 Catatan tentang Fitur Denda (F004)

Sejak `srs.md` v3.2, Feature F004 mencakup kalkulasi denda keterlambatan otomatis (Rp 500/hari + biaya kondisi buku). Fitur ini terdokumentasi pada `userflow_uc_004.md` v1.1 (Panel Ringkasan Denda saat konfirmasi pengembalian) dan berdampak lanjutan pada `userflow_uc_005.md` v1.1 (Badge Denda pada tabel Riwayat). UC-001, UC-003, dan UC-006 tidak terdampak karena tidak bersinggungan langsung dengan proses pengembalian/denda.

---

## 4. DEPENDENCY MAP

Peta dependensi antar use case menunjukkan urutan dan ketergantungan antar UC sebelum dapat dijalankan.

```
UC-001 (Login Guru)
    └── UC-002 (Manajemen Data Buku)       ← Memerlukan UC-001 selesai
    └── UC-003 (Pencatatan Peminjaman)     ← Memerlukan UC-001 + data buku dari UC-002
    └── UC-004 (Pencatatan Pengembalian)   ← Memerlukan UC-001 + transaksi aktif dari UC-003
    └── UC-005 (Riwayat Peminjaman)        ← Memerlukan UC-001 + data transaksi (termasuk Denda) dari UC-003/UC-004

UC-006 (Akses Publik Siswa)               ← Independen, tidak memerlukan login
    └── (Membaca data buku & status yang dikelola via UC-002, UC-003, UC-004)
```

---

## 5. TRACEABILITY MATRIX (SRS v3.6 → IA → UF v1.3)

| Feature ID | FR-ID Terkait | Feature Name | UC ID | Page ID | Route | DS Components (v1.5) |
| --- | --- | --- | --- | --- | --- | --- |
| F001 | FR-001 – FR-004 | Autentikasi Guru (Login) | UC-001 | PAGE-001 | /login | Text Input, Primary Button, Error Message, Idle Session Timeout Pattern (11.6) |
| F002 | FR-005 – FR-009, FR-030 | Manajemen Data Buku | UC-002 | PAGE-003, PAGE-003-SUB-01, PAGE-003-SUB-02 | /buku | Table, Modal Dialog, Badge Status, Badge "Tidak Aktif", Danger Button, **Image Upload (9.11)** |
| F003 | FR-010 – FR-014 | Pencatatan Peminjaman Buku | UC-003 | PAGE-004 | /peminjaman | Split Layout, Card Buku, Text Input, Date Picker (Read-Only & Aktif), Primary Button |
| F004 | FR-015 – FR-020 | Pencatatan Pengembalian Buku | UC-004 | PAGE-005 | /pengembalian | Table, Badge Terlambat, Modal Konfirmasi, Radio Button Group, Badge Kondisi Buku, **Panel Ringkasan Denda (11.8)**, **Badge Denda (9.5)** |
| F005 | FR-021 – FR-023 | Riwayat Peminjaman | UC-005 | PAGE-006 | /riwayat | Table (read-only), Filter Bar, Badge Status Transaksi, **Badge Denda (9.5)** |
| F006 | FR-024 – FR-026, FR-031 | Akses Ketersediaan & Lokasi Buku (Publik) | UC-006 | PAGE-002 | / | Card Buku, Table Publik, Search Bar, Badge Ketersediaan, Topbar Publik |
| F007 | FR-027 – FR-029 | Sinkronisasi Stok & Status Otomatis | — (embedded dalam UC-003 & UC-004) | — | — | Badge Status, Table Component (update instan) |

---

## 6. REVISION HISTORY

| Version | Date | Author | Description |
|---|---|---|---|
| 1.0 | 2026-07-01 | Kelompok DPSI BRAYYY | Draft awal SoT-4 mengikuti template header/goal/trigger/precondition/postcondition/main-alt-exception-flow, diturunkan dari srs.md v3.1, information_architecture.md, dan design_system.md v1.3. |
| **1.2** | **2026-07-10** | **Kelompok DPSI BRAYYY** | **Update versi userflow_uc_002.md → v1.2 dan userflow_uc_006.md → v1.1 di Use Case Inventory (Section 3); update FR-ID pada Traceability Matrix (Section 5) baris F002 → FR-005–FR-009, FR-030 dan F006 → FR-024–FR-026, FR-031. Sinkron srs.md v3.5.** |
| **1.3** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Update versi userflow_uc_002.md → v1.3 dan userflow_uc_006.md → v1.2 di Use Case Inventory; update Traceability Matrix header. Sinkron srs.md v3.6.** |