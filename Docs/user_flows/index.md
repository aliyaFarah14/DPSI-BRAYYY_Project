# User Flows (UF) - Source of Truth #4 — Index

Document Version: v1.0
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-06-25
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini berfungsi sebagai indeks utama (master index) untuk seluruh User Flow (UF) Sistem Informasi Perpustakaan SD Negeri Tamanan. Sebagai Source of Truth #4 (SoT-4), dokumen ini diturunkan langsung dari:

- **SoT-1:** SRS v1.0 — sebagai sumber fitur dan business rules.
- **SoT-2:** IA v1.0 — sebagai sumber struktur halaman dan routing.
- **SoT-3:** DS v1.0 — sebagai sumber komponen UI dan interaction patterns.

Setiap user flow dalam dokumen ini menggambarkan rangkaian langkah interaksi aktor (Guru / Siswa) untuk menyelesaikan satu use case secara lengkap, mencakup trigger, preconditions, main flow, alternative flow, exception flow, dan postconditions.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v1.0 | Spesifikasi Kebutuhan Perangkat Lunak dasar. |
| SoT-2 | IA v1.0 | Struktur navigasi, peta situs, dan pemetaan routing. |
| SoT-3 | DS v1.0 | Panduan token visual, warna, tipografi, dan komponen UI. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir (menggunakan SoT-4 sebagai input). |
| SoT-6 | Data Model | Model data sistem (menggunakan SoT-4 sebagai input utama). |
| SoT-7 | UCIC | Use Case Integration Contract per use case. |

---

## 2. ACTOR SUMMARY

| Actor ID | Actor Name | Access Type | Description |
| --- | --- | --- | --- |
| ACT-01 | Guru | Authenticated | Administrator sistem. Mengelola data buku dan seluruh transaksi perpustakaan setelah login. |
| ACT-02 | Siswa | Public (Unauthenticated) | Pengguna publik. Hanya dapat melihat ketersediaan dan mencari buku tanpa login. |

---

## 3. USE CASE INVENTORY

| UC ID | Use Case Name | Actor | Feature ID (SRS) | Page ID (IA) | Route | Priority | File |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UC-001 | Login Guru | ACT-01 | F001 | PAGE-001 | /login | High | userflow_uc_001.md |
| UC-002 | Manajemen Data Buku | ACT-01 | F002 | PAGE-003 | /buku | High | userflow_uc_002.md |
| UC-003 | Pencatatan Peminjaman Buku | ACT-01 | F003 | PAGE-004 | /peminjaman | High | userflow_uc_003.md |
| UC-004 | Pencatatan Pengembalian Buku | ACT-01 | F004 | PAGE-005 | /pengembalian | High | userflow_uc_004.md |
| UC-005 | Melihat Riwayat Peminjaman | ACT-01 | F005 | PAGE-006 | /riwayat | High | userflow_uc_005.md |
| UC-006 | Akses Ketersediaan Buku (Publik) | ACT-02 | F006 | PAGE-002 | / | Medium | userflow_uc_006.md |

---

## 4. DEPENDENCY MAP

Peta dependensi antar use case menunjukkan urutan dan ketergantungan antar UC sebelum dapat dijalankan.

```
UC-001 (Login Guru)
    └── UC-002 (Manajemen Data Buku)       ← Memerlukan UC-001 selesai
    └── UC-003 (Pencatatan Peminjaman)     ← Memerlukan UC-001 + data buku dari UC-002
    └── UC-004 (Pencatatan Pengembalian)   ← Memerlukan UC-001 + transaksi aktif dari UC-003
    └── UC-005 (Riwayat Peminjaman)        ← Memerlukan UC-001 + data transaksi dari UC-003/UC-004

UC-006 (Akses Publik Siswa)               ← Independen, tidak memerlukan login
    └── (Membaca data buku yang dikelola via UC-002)
```

---

## 5. TRACEABILITY MATRIX (SRS v1.0 → IA v1.0 → UF v1.0)

| Feature ID | Feature Name | UC ID | Page ID | Route | DS Components |
| --- | --- | --- | --- | --- | --- |
| F001 | Autentikasi Guru (Login) | UC-001 | PAGE-001 | /login | Text Input, Primary Button, Error Message |
| F002 | Manajemen Data Buku | UC-002 | PAGE-003 | /buku | Table, Modal Dialog, Badge Status, Danger Button |
| F003 | Pencatatan Peminjaman Buku | UC-003 | PAGE-004 | /peminjaman | Split Layout, Card Buku, Text Input, Date Picker, Primary Button |
| F004 | Pencatatan Pengembalian Buku | UC-004 | PAGE-005 | /pengembalian | Table, Badge Terlambat, Modal Konfirmasi, Radio Button |
| F005 | Riwayat Peminjaman | UC-005 | PAGE-006 | /riwayat | Table (read-only), Filter Bar, Badge Status Transaksi |
| F006 | Akses Ketersediaan Buku (Publik) | UC-006 | PAGE-002 | / | Card Buku, Table Publik, Search Bar, Badge Ketersediaan |

---

## 6. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft — Index User Flows SoT-4 berdasarkan SRS v1.0, IA v1.0, dan DS v1.0. |