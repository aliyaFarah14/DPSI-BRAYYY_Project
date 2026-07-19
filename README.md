# Sistem Informasi Perpustakaan SD Negeri Tamanan
Proyek ini adalah sistem informasi manajemen perpustakaan berbasis web (Web-Based Library Management System) yang dikembangkan untuk memecahkan masalah pendataan dan sirkulasi buku di SD Negeri Tamanan, Yogyakarta.

## 🔗 Tautan Penting
- **URL Aplikasi (Deployed):** [https://optimistic-radiance-production-045d.up.railway.app](https://optimistic-radiance-production-045d.up.railway.app)
- **URL Repository GitHub:** [https://github.com/aliyaFarah14/DPSI-BRAYYY_Project](https://github.com/aliyaFarah14/DPSI-BRAYYY_Project)

## 👥 Tim Penyusun (DPSI BRAYYY)
Proyek ini disusun oleh mahasiswa Universitas Ahmad Dahlan:
- **Salsa Khaerunnisa** (2400016028)
- **Ichasia Nazahrani W.** (2400016013)
- **Farah Amaliya I.** (2400016019)
- **Citra Gita Nirmala S.** (2400016054)
- **Vitasari** (2400016031)

## Pembagian Peran Anggota
Proyek ini dikembangkan dengan pendekatan kolaboratif menggunakan bantuan AI coding assistant (OpenCode), dengan pembagian penyusun awal/inisiator tiap dokumen sebagai berikut:

| Nama | NIM | Peran |
|---|---|---|
| **Farah Amaliya I.** | 2400016019 | Penyusun awal dokumen Design System, User Flow, dan Class Diagram; pengembangan Frontend (dibantu Salsa Khaerunnisa) dan Backend, termasuk integrasi dengan database SQLite; pengujian end-to-end dan debugging alur aplikasi. |
| **Ichasia Nazahrani W.** | 2400016013 | Penyusun awal dokumen Software Requirements Specification (SRS), Information Architecture, dan System Logic. |
| **Vitasari** | 2400016031 | Penyusun awal dokumen Analisis Kebutuhan dan Data Model. |
| **Salsa Khaerunnisa** | 2400016028 | Penyusun dokumen Data Hasil Wawancara/Observasi; deployment aplikasi ke hosting (Railway) beserta konfigurasi environment variables; turut membantu pengembangan Frontend. |
| **Citra Gita Nirmala S.** | 2400016054 | Turut menyusun dan menyunting README.md; pemeriksaan dan perbaikan kesalahan penulisan pada dokumen proyek. |

> Catatan: Dokumen SoT disusun dan direvisi secara kolaboratif oleh seluruh anggota tim melalui diskusi bersama.

## Teknologi yang Digunakan
| Layer | Teknologi |
|---|---|
| Frontend | React (Vite), TypeScript, Tailwind CSS |
| Backend | Express.js (Node.js) |
| Database | SQLite (file-based) |
| Autentikasi | Session-based (HttpOnly Cookie), bcrypt untuk hashing password |
| Deployment | Railway (single-server, frontend & backend dalam satu layanan) |
| AI Coding Assistant | OpenCode |

## Problem Statement
Observasi dilakukan di SD Negeri Tamanan, Yogyakarta. Beberapa proses di sekolah masih dikelola secara manual, seperti pendataan aset, penyusunan jadwal pelajaran, dan peminjaman fasilitas. Administrasi data siswa telah terintegrasi dengan sistem pusat sehingga tidak dikelola langsung oleh pihak sekolah.

Pengelolaan perpustakaan menjadi permasalahan yang paling kompleks karena melibatkan pencatatan peminjaman dan pengembalian buku, pengelolaan data buku, serta akses informasi oleh siswa dan pengelola. Pencatatan peminjaman dan pengembalian buku masih dilakukan secara manual menggunakan buku tulis. Data pencatatan tersebut tidak terstruktur dan sebagian telah hilang, sehingga riwayat peminjaman dan pengembalian tidak dapat diketahui dengan jelas. Penataan buku di rak tidak terorganisir. Buku ditempatkan secara acak sehingga menyulitkan siswa dalam mencari buku. Ketersediaan dan jumlah stok buku juga tidak dapat diketahui secara pasti karena tidak ada pencatatan yang terpusat. Siswa harus mencari buku secara mandiri tanpa informasi yang jelas mengenai lokasi dan status buku. Kondisi ini membuat proses peminjaman tidak efisien dan menyulitkan akses informasi bagi siswa maupun pengelola perpustakaan.

## Dokumen Sumber (Sources of Truth)
Seluruh dokumen landasan proyek, rancangan UI/UX, arsitektur, dan model data tersimpan secara rapi di dalam folder `Docs/` pada *repository* ini:
- [Software Requirements Specification (SRS)](Docs/srs.md)
- [Design System & UI Components](Docs/design_system.md)
- [Data Model & Database Schema](Docs/data_model.md)
- [Information Architecture](Docs/information_architecture.md)

**Dokumen Eksternal & Hasil Wawancara:**
Tautan Google Drive untuk mengakses dokumen hasil observasi, wawancara, dan dokumen dasar pendukung lainnya:
[🔗 Akses Dokumen Proyek di Google Drive](https://drive.google.com/drive/folders/1wC4U6tjzlQgGVK8cl9P_7K5R7PuTtXvD)

## Panduan Menjalankan Sistem
Proyek ini menggunakan arsitektur terpisah antara Backend (Express.js) dan Frontend (React.js + Vite). Sistem ini dirancang secara khusus untuk **Deployment Lokal (Single-PC)** menggunakan *database* file-based SQLite di perpustakaan sekolah.

### Prasyarat
- [Node.js](https://nodejs.org/) harus sudah terinstal.

### Instalasi & Menjalankan Sistem
1. **Jalankan Server Backend**
   Buka terminal, arahkan ke folder backend, instal dependensi, lalu jalankan.
   ```bash
   cd backend
   npm install
   npm run dev
   # (Server backend akan berjalan di http://localhost:3001, biarkan terminal ini tetap terbuka)
   ```

2. **Jalankan Aplikasi Frontend**
   Buka jendela terminal **baru**, arahkan ke folder frontend (perpustakaan), instal dependensi, lalu jalankan.
   ```bash
   cd perpustakaan
   npm install
   npm run dev
   # (Akses antarmuka sistem di http://localhost:5173)
   ```

## Deployment (Single-Server Production)
Untuk deployment produksi, backend Express akan menyajikan file frontend yang sudah di-build dari direktori yang sama (same-origin), sehingga tidak diperlukan CORS.

### Langkah-langkah
1. **Build frontend**
   ```bash
   cd perpustakaan
   npm install
   npm run build
   # Hasil build akan berada di perpustakaan/dist/
   ```

2. **Atur environment variables**
   Salin `backend/.env.example` menjadi `backend/.env` dan isi nilai yang sesuai untuk produksi:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Jalankan backend dalam mode produksi**
   ```bash
   cd backend
   npm install
   NODE_ENV=production node server.js
   # Server berjalan di http://localhost:3001
   # (Frontend sudah disajikan sebagai static files dari server yang sama)
   ```

### Environment Variables (Production)
| Variable | Wajib | Deskripsi |
|---|---|---|
| `NODE_ENV` | Ya | Set ke `production` untuk mengaktifkan serving frontend dan cookie secure |
| `PORT` | Tidak | Port server (default: 3001) |
| `SESSION_SECRET` | **Ya** | String acak kuat untuk menandatangani cookie sesi (gunakan `openssl rand -hex 64`) |
| `CORS_ORIGIN` | Tidak | Origin frontend untuk development (default: http://localhost:5173) |
| `DB_PATH` | Tidak | Path ke file database SQLite (default: backend/data/perpustakaan.db) |
| `VITE_API_BASE` | Tidak | URL API untuk frontend — di produksi set ke `/api/v1` (relative path) |
| `DENDA_PER_HARI` | Tidak | Denda keterlambatan per hari (default: 500) |
| `DENDA_RUSAK_RINGAN` | Tidak | Denda rusak ringan (default: 2000) |
| `DENDA_RUSAK_BERAT` | Tidak | Denda rusak berat (default: 5000) |