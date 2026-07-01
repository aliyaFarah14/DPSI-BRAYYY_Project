# Design System (DS) - Source of Truth #3

Document Version: v1.3 (Revisi — penyelarasan dengan SRS v3.1, penghapusan catatan kontradiksi Tanggal Batas Pengembalian)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-01
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan bahasa visual, standar interaksi, dan komponen UI yang dapat digunakan kembali (reusable UI components) pada seluruh antarmuka Sistem Informasi Perpustakaan SD Negeri Tamanan (Web-Based LMS).

Sebagai Source of Truth #3 (SoT-3), dokumen ini diturunkan langsung dari SoT-1 (SRS v3.0) dan SoT-2 (Information Architecture, sinkron SRS v3.0), serta akan digunakan sebagai landasan mutlak untuk:

- Pembuatan High-Fidelity Prototype (SoT-5).
- Panduan penulisan kode komponen Frontend (React, HTML/CSS).
- Menjaga konsistensi pengalaman pengguna (UX) di seluruh layar aplikasi.
- Mempercepat waktu pelatihan guru melalui pola interaksi yang konsisten dan mudah dipahami.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v3.0 | Spesifikasi Kebutuhan Perangkat Lunak — struktur Feature ID (F001–F007), Business Rules Master List, Data Requirements, NFR, Permission Matrix. |
| SoT-2 | Information Architecture (Revisi — sinkron SRS v3.0) | Struktur navigasi, peta situs, dan pemetaan routing. |
| SoT-4 | User Flows | Rangkaian langkah interaksi pengguna per use-case. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir. |

> **Catatan revisi v1.2:** SRS versi v3.0 (restrukturisasi lengkap) memperkenalkan kembali section **Non-Functional Requirements** (Section 9), termasuk **NFR 9.7 — Usability**, yang menetapkan target waktu pelatihan Guru maksimal 15 menit. Sebelumnya, DS v1.1 menghapus klaim ini karena SRS v2.0 (versi sebelum restrukturisasi) belum memiliki section NFR. Karena requirement tersebut kini benar-benar ada dan bernomor jelas di SRS v3.0, klaim waktu pelatihan **dikembalikan** ke Section 2.1 di bawah ini dengan sitasi yang akurat.

> **Catatan revisi v1.2 (lanjutan):** Beberapa sitasi nomor Business Rule di dokumen v1.1 mengacu ke penomoran SRS versi lama yang sudah tidak berlaku setelah restrukturisasi ke sistem Feature ID (F001–F007). Sitasi-sitasi tersebut telah diperbaiki di seluruh dokumen ini (lihat Section 10, 11.5, 11.6, 11.7, dan 15).

> **Catatan revisi v1.3:** Kontradiksi antara SRS Out-of-Scope poin #4 dan Feature F003 yang tercatat pada DS v1.2 Section 10 telah diselesaikan di sisi sumber — `srs.md` v3.1 merevisi Out-of-Scope poin #4 agar selaras dengan F003 (peminjaman multi-hari kini didukung penuh, tidak lagi terbatas same-day return). Catatan peringatan pada Section 10 dihapus karena sumber kontradiksinya sudah tidak ada.

---

## 2. DESIGN PRINCIPLES

### 2.1 Design Goals

- **Kesederhanaan Operasional (Operational Simplicity):** Antarmuka dirancang agar dapat dipahami dan dioperasikan oleh guru tanpa latar belakang teknis, mengingat perpustakaan tidak memiliki petugas tetap (lihat SRS v3.0, Section 1 — Tujuan Sistem). Target ini selaras dengan **NFR 9.7 (Usability)** pada SRS v3.0, yang menetapkan waktu pelatihan Guru maksimal 15 menit untuk pengguna baru.
- **Kejelasan Informasi (Visual Clarity):** Elemen penting seperti status ketersediaan buku, indikator stok habis, dan peringatan keterlambatan pengembalian harus langsung terlihat tanpa perlu interpretasi tambahan. Ini mendukung **NFR 9.1 (Performance)** pada SRS v3.0 — halaman daftar buku dimuat di bawah 2 detik, dan proses pencatatan transaksi selesai di bawah 1 detik.
- **Ramah Pengguna Muda (Child-Friendly Accessibility):** Tampilan halaman publik (siswa) menggunakan nuansa warna hijau segar yang hangat dan tidak mengintimidasi, mendukung semangat literasi anak.

### 2.2 UX Principles

- **Fokus pada Tugas (Task-Focused Layout):** Setiap halaman didedikasikan pada satu tugas utama (catat peminjaman, catat pengembalian, kelola buku) untuk meminimalkan distraksi.
- **Umpan Balik Instan (Instant Feedback):** Setiap aksi penyimpanan, penghapusan, atau pembaruan data harus memicu perubahan status visual instan tanpa memuat ulang seluruh halaman.
- **Toleransi Kesalahan (Error Tolerance):** Konfirmasi berlapis diberikan hanya pada aksi destruktif seperti menghapus data buku. Formulir menyediakan pesan validasi yang informatif dan mudah dipahami.

---

## 3. BRAND FOUNDATION

### 3.1 Brand Personality

- **Hangat & Ramah:** Menggunakan nuansa hijau segar yang mengundang dan tidak kaku, mencerminkan suasana perpustakaan sekolah yang terbuka untuk semua siswa.
- **Terpercaya & Tertib:** Struktur layout yang bersih dan konsisten mencerminkan kerapian pengelolaan data perpustakaan.
- **Sederhana & Fungsional:** Bebas dari elemen dekoratif berlebihan; mengutamakan kemudahan akses informasi buku dan transaksi bagi guru maupun siswa.

### 3.2 Visual Characteristics

- **Bentuk Sudut:** Membulat sedang (Rounded 8px atau `rounded-lg`) untuk kesan modern namun tetap rapi dan mudah dipindai secara visual.
- **Kedalaman Visual:** Menggunakan bayangan lembut (soft shadows) pada komponen mengambang seperti kartu buku, modal form, dan panel konfirmasi untuk menegaskan hierarki tumpukan layar.

---

## 4. COLOR SYSTEM

Skema warna dirancang agar nyaman di mata, segar, dan ramah anak — sesuai dengan konteks penggunaan di sekolah dasar.

### 4.1 Primary Colors (Green Brand)

Digunakan untuk elemen tindakan utama, status aktif, dan identitas merek aplikasi perpustakaan.

| Token | Hex Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| color-primary | #16A34A | bg-green-600 | Tombol aksi utama, teks aktif sidebar, ikon utama, badge "Tersedia". |
| color-primary-hover | #15803D | hover:bg-green-700 | Sesi hover pada tombol utama. |
| color-primary-active | #166534 | active:bg-green-800 | Sesi tekan/klik pada tombol utama. |
| color-primary-light | #DCFCE7 | bg-green-100 | Background badge status tersedia, sorotan ringan item aktif sidebar. |

### 4.2 Secondary Colors (Slate Structure)

Digunakan untuk elemen navigasi sekunder, border, dan teks pendukung.

| Token | Hex Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| color-secondary | #475569 | bg-slate-600 | Tombol batal/sekunder, ikon non-aktif. |
| color-secondary-hover | #334155 | hover:bg-slate-700 | Sesi hover tombol sekunder. |
| color-secondary-active | #1E293B | active:bg-slate-800 | Sesi tekan tombol sekunder. |

### 4.3 Semantic Colors (Status & Alerts)

| Token | Hex Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| color-success | #22C55E | bg-green-500 | Badge "Tersedia", badge "Baik" (kondisi buku), notifikasi sukses simpan data. |
| color-warning | #F59E0B | bg-amber-500 | Badge "Masih Dipinjam", badge "Rusak Ringan" (kondisi buku), indikator buku mendekati batas kembali, peringatan sesi akan berakhir. |
| color-error | #EF4444 | bg-red-500 | Badge "Stok Habis", badge "Terlambat", badge "Rusak Berat" (kondisi buku), pesan error form, pesan error koneksi sistem, tombol hapus. |
| color-info | #3B82F6 | bg-blue-500 | Informasi panduan interaksi, status informatif netral. |
| color-neutral-muted | #94A3B8 | bg-slate-200 / text-slate-600 | Badge "Tidak Aktif" untuk buku yang ditarik dari sirkulasi (lihat Section 9.5). |

### 4.4 Neutral Colors (Backgrounds & Text)

| Token | Hex Value | Tailwind Class | Usage |
| --- | --- | --- | --- |
| color-bg-app | #F8FAFC | bg-slate-50 | Latar belakang aplikasi keseluruhan. |
| color-bg-card | #FFFFFF | bg-white | Latar belakang tabel, panel, modal, dan kartu buku. |
| color-text-main | #0F172A | text-slate-900 | Teks judul utama, nama buku, label form. |
| color-text-muted | #64748B | text-slate-500 | Teks deskripsi, kode buku, penanda tanggal. |
| color-border | #E2E8F0 | border-slate-200 | Garis pembatas tabel, pembatas panel, border input. |

---

## 5. TYPOGRAPHY

Sistem menggunakan font **Noto Sans** untuk memastikan legibilitas teks berbahasa Indonesia dan angka tetap tinggi pada layar komputer sekolah berkualitas standar.

| Text Style | Font Family | Weight | Size (px/rem) | Line Height | Usage |
| --- | --- | --- | --- | --- | --- |
| Display Title | Noto Sans | Bold (700) | 32px (2rem) | 1.25 | Judul besar halaman Login, nama sistem di halaman publik siswa. |
| Page Title | Noto Sans | Bold (700) | 24px (1.5rem) | 1.35 | Judul halaman utama pada header (contoh: "Data Buku Perpustakaan"). |
| Section Title | Noto Sans | SemiBold (600) | 18px (1.125rem) | 1.4 | Judul panel form, judul tabel data, judul modal dialog. |
| Body Large | Noto Sans | Regular (400) | 16px (1rem) | 1.5 | Label input form, teks nominal stok buku, nama siswa dalam tabel. |
| Body Medium | Noto Sans | Regular (400) | 14px (0.875rem) | 1.5 | Deskripsi buku, teks menu sidebar, konten baris tabel. |
| Body Small/Muted | Noto Sans | Regular (400) | 12px (0.75rem) | 1.4 | ID Buku, sub-info tambahan, keterangan tanggal. |

---

## 6. ELEVATION & SHADOWS

Kedalaman visual digunakan untuk membantu guru memahami hierarki elemen pada layar secara intuitif.

- **Shadow None (`shadow-none`):** Seluruh elemen input teks dan tabel datar (flat).
- **Shadow Small (`shadow-sm`):** Kartu buku pada halaman publik siswa dan panel daftar buku di halaman peminjaman.
- **Shadow Medium (`shadow-md`):** Sidebar navigasi, Topbar, dan panel tabel utama.
- **Shadow Large (`shadow-lg`):** Modal Overlay (Form Tambah/Edit Buku, Form Konfirmasi Pengembalian) dan Dialog Alert Konfirmasi Hapus Data.

---

## 7. GRID & LAYOUT

Aplikasi dioptimalkan untuk perangkat layar Desktop PC dan Laptop di lingkungan sekolah, sesuai asumsi satu unit komputer di area perpustakaan (lihat Analisis Kebutuhan — hasil wawancara).

### 7.1 Desktop Grid (Width ≥ 1024px)

- **Layout Style:** Flexbox / Grid Split Layout.
- **Main Container:** Lebar penuh (100vw) tanpa margin luar berlebih.
- **Sidebar Width:** Tetap 260px (dapat diciutkan menjadi 80px via tombol toggle). Sidebar hanya muncul pada area Guru (terautentikasi), sesuai IA Section 1.1(C).
- **Content Padding:** 24px (`p-6`) di sekeliling area kerja konten.
- **Gutter Grid:** 16px (`gap-4`) antar elemen kartu buku di halaman publik siswa.

### 7.2 Tablet Grid (Width 768px – 1023px)

- **Layout Style:** Modul satu kolom responsif atau sidebar disembunyikan (collapsible off-canvas), sesuai IA Section 1.1(C) — Mobile/Tablet Navigation.
- **Sidebar Behavior:** Disembunyikan otomatis; dapat ditarik via tombol hamburger di pojok kiri atas.
- **Gutter Grid:** 12px (`gap-3`).

### 7.3 Halaman Catat Peminjaman — Split Layout Khusus

Sesuai IA (PAGE-004), halaman ini menggunakan split layout dua panel:
- **Panel Kiri (60%):** Daftar buku tersedia (stok > 0), dapat dipilih guru.
- **Panel Kanan (40%):** Form isian data peminjam dan detail transaksi.

---

## 8. ICONOGRAPHY

Aplikasi menggunakan pustaka ikon **Lucide React** (atau inline SVG setara) dengan gaya ikon Outline (stroke 2px) yang konsisten.

| Icon Function | Lucide Icon Name | Visual Representation |
| --- | --- | --- |
| Menu Data Buku | BookOpen | Ikon Buku Terbuka |
| Menu Peminjaman | BookMarked | Ikon Buku dengan Penanda |
| Menu Pengembalian | RotateCcw | Ikon Panah Putar Balik |
| Menu Riwayat | ClipboardList | Ikon Daftar Clipboard |
| Login Guru | LogIn | Ikon Pintu Masuk dengan Panah |
| Logout Guru | LogOut | Ikon Pintu Keluar dengan Panah |
| Tambah Data Buku | Plus | Tanda Plus (+) |
| Edit Data Buku | Pencil | Ikon Pensil |
| Hapus Data Buku | Trash2 | Ikon Tempat Sampah |
| Pencarian Buku | Search | Ikon Kaca Pembesar |
| Informasi Keterlambatan | AlertCircle | Ikon Lingkaran Seru |
| Akun Guru Aktif | User | Ikon Siluet Orang |
| Peringatan Sesi Berakhir | Clock | Ikon Jam (digunakan pada idle timeout warning) |
| Kegagalan Koneksi Sistem | WifiOff | Ikon Sinyal Terputus (digunakan pada Error State sistem) |
| Buku Tidak Aktif | Archive | Ikon Kotak Arsip (digunakan pada Badge "Tidak Aktif", lihat 9.5) |

---

## 9. COMPONENT LIBRARY

### 9.1 Button

**Variants & Visual Tokens**

- **Primary Button:** `bg-green-600`, `text-white`, `rounded-lg` (8px). Digunakan untuk: "Simpan", "Simpan Peminjaman", "Konfirmasi Pengembalian", "Masuk".
- **Secondary Button:** `bg-slate-200`, `text-slate-800`, `rounded-lg` (8px). Digunakan untuk: "Batal".
- **Danger Button:** `bg-red-600`, `text-white`, `rounded-lg` (8px). Digunakan untuk: "Hapus", "Ya, Hapus".

**States Representation**

| Button State | Visual |
| --- | --- |
| [Default] | `bg-green-600`, `text-white` |
| [Hover] | `bg-green-700` (kursor berubah menjadi pointer) |
| [Active] | `bg-green-800` (transform skala tekan 98%) |
| [Disabled] | `bg-slate-300`, `text-slate-500` (kursor dilarang) |
| [Loading] | `bg-green-600` dengan animasi spinner berputar di dalam tombol |

### 9.2 Text Input

Komponen utama untuk formulir tambah/edit buku, form peminjaman, dan kolom pencarian.

- **Default State:** Border `border-slate-300`, latar `bg-white`, teks `text-slate-900`, placeholder `text-slate-400`.
- **Focus State:** Border berubah `border-green-500` dengan outline tipis hijau terang (`ring-2 ring-green-200`).
- **Validation — Success State:** Border `border-green-500`, dilengkapi ikon centang hijau di sisi kanan input.
- **Validation — Error State:** Border `border-red-500`, disertai pesan teks error berwarna merah di bawah input (ukuran 12px).

### 9.3 Modal Dialog

Digunakan untuk form Tambah Buku Baru, Edit Data Buku, dan Form Konfirmasi Pengembalian — tanpa memindahkan guru dari halaman utama sesuai ketentuan IA.

- **Overlay Backdrop:** `bg-slate-900/50` dengan efek blur tipis (`backdrop-blur-sm`).
- **Card Container:** Tepat di tengah layar, latar `bg-white`, lebar maksimal 500px (`max-w-md`), sudut membulat `rounded-xl` (12px), bayangan tebal `shadow-lg`.
- **Header:** Berisi judul form (contoh: "Tambah Buku Baru", "Konfirmasi Pengembalian") dan tombol silang X di pojok kanan untuk menutup modal.
- **Footer:** Berisi dua tombol sejajar kanan: "Batal" (Secondary) dan "Simpan" / "Konfirmasi" (Primary atau Danger sesuai konteks).

### 9.4 Table Component

Digunakan di PAGE-003 (Katalog Buku), PAGE-005 (Peminjaman Aktif), PAGE-006 (Riwayat), dan PAGE-002 (Halaman Publik Siswa).

- **Header Row (`thead`):** Latar `bg-slate-100`, teks `text-slate-700` tebal (14px/Bold).
- **Body Rows (`tbody`):** Zebra striping — baris ganjil `bg-white`, baris genap `bg-slate-50/50`.
- **Hover Row State:** Baris yang ditunjuk kursor berubah `hover:bg-green-50/30` untuk memperjelas baris yang sedang dilihat guru.
- **Empty State:** Jika tabel kosong, tampilkan ilustrasi ikon sederhana dan teks informatif di tengah area tabel.
- **Baris Buku "Tidak Aktif":** Ditampilkan dengan opasitas sedikit diredupkan (`opacity-70`) dan Badge "Tidak Aktif" (lihat 9.5) untuk membedakan dari buku yang masih aktif bersirkulasi, sesuai SRS v3.0 Section 7.3 (Data Retention Rules).

### 9.5 Badge / Status Indicator

Digunakan untuk menampilkan status buku, status transaksi, dan kondisi buku secara visual di seluruh tabel.

| Badge Type | Visual | Usage |
| --- | --- | --- |
| Tersedia | `bg-green-100 text-green-700` | Stok buku masih tersedia (stok > 0). |
| Dipinjam / Stok Habis | `bg-red-100 text-red-700` | Stok buku 0 atau semua eksemplar sedang dipinjam. |
| **Tidak Aktif** | `bg-slate-200 text-slate-600` | Buku ditarik dari sirkulasi (misal rusak berat) namun tidak dihapus agar riwayat historis tetap tersimpan, sesuai SRS v3.0 Section 7.3 — Data Retention Rules. |
| Masih Dipinjam | `bg-amber-100 text-amber-700` | Status transaksi pada tabel riwayat yang belum dikembalikan. |
| Sudah Dikembalikan | `bg-green-100 text-green-700` | Status transaksi pada tabel riwayat yang sudah selesai. |
| Terlambat | `bg-red-100 text-red-700 font-semibold` | Indikator keterlambatan pengembalian pada PAGE-005. |
| **Baik** | `bg-green-100 text-green-700` | Kondisi buku saat dikembalikan dalam keadaan baik (field `kondisiBuku`, Class Pengembalian). |
| **Rusak Ringan** | `bg-amber-100 text-amber-700` | Kondisi buku saat dikembalikan dengan kerusakan ringan. |
| **Rusak Berat** | `bg-red-100 text-red-700 font-semibold` | Kondisi buku saat dikembalikan dengan kerusakan berat. |

### 9.6 Card Component (Buku — Halaman Publik Siswa)

Digunakan pada PAGE-002 untuk menampilkan buku dalam format kartu kepada siswa.

- **Visual:** Border tipis `border-slate-200`, layout grid vertikal, sudut `rounded-lg`.
- **Top:** Placeholder inisial judul buku berukuran besar dengan latar `bg-green-100`, teks `text-green-700`.
- **Body:** Judul buku tebal (14px, `text-slate-900`), nama penulis (12px, `text-slate-500`), tema buku, dan **chip Lokasi Rak** (lihat Section 3.4 pada IA — label lokasi rak wajib tampil konsisten di setiap tempat buku ditampilkan).
- **Footer:** Badge status ketersediaan (Tersedia / Stok Habis) dan informasi stok tersisa.

### 9.7 Radio Button Group (Kondisi Buku)

Digunakan secara spesifik pada Modal Konfirmasi Pengembalian (PAGE-005, F004) untuk memilih kondisi fisik buku sesuai field `kondisiBuku` pada Class Pengembalian (Praktikum 2).

- **Layout:** Tiga opsi sejajar horizontal (atau vertikal jika lebar modal sempit), masing-masing dengan label teks dan lingkaran radio.
- **Opsi:** "Baik" (default terpilih), "Rusak Ringan", "Rusak Berat".
- **Default State:** Lingkaran kosong `border-slate-300`.
- **Selected State:** Lingkaran terisi `bg-green-600` dengan border `border-green-600`; label terkait berubah `font-semibold text-slate-900`.
- **Hover State:** Latar belakang opsi `bg-slate-50` saat kursor diarahkan.
- **Wajib Pilih:** Salah satu opsi harus terpilih sebelum tombol "Konfirmasi Pengembalian" aktif (non-disabled).

### 9.8 Filter Bar (Riwayat Peminjaman)

Digunakan pada PAGE-006 (Riwayat Peminjaman) untuk memenuhi kebutuhan **SRS v3.0 Feature F005 — Riwayat Peminjaman**, khususnya requirement "Sistem harus menyediakan pencarian riwayat berdasarkan nama siswa, judul buku, atau rentang tanggal."

- **Layout:** Baris horizontal di atas Table Component, latar `bg-white`, border bawah `border-slate-200`, padding `p-4`.
- **Elemen:**
  - Text Input "Cari nama siswa atau judul buku" dengan ikon `Search` di sisi kiri input.
  - Dua Date Picker berdampingan untuk rentang tanggal ("Dari Tanggal" — "Sampai Tanggal").
  - Primary Button kecil "Terapkan Filter" dan Secondary Button kecil "Reset".
- **Behavior:** Filter diterapkan secara instan (live filtering) saat teks pencarian diketik (debounce 300ms), tanpa perlu menekan tombol "Terapkan Filter" — tombol tersebut hanya digunakan untuk filter rentang tanggal yang dipilih dari Date Picker.

### 9.9 Header / Topbar (Publik vs Guru)

**Topbar Publik (Siswa — PAGE-002):**
- Latar `bg-white`, `shadow-md`, tanpa sidebar.
- Kiri: Nama sistem ("Perpustakaan SD Negeri Tamanan") dengan Display Title style.
- Kanan: Tombol Secondary "Login Guru" (ikon `LogIn`) yang mengarahkan ke halaman Login.

**Topbar Guru (Area Terautentikasi):**
- Latar `bg-white`, `shadow-md`, berdampingan dengan Sidebar.
- Kiri: Judul halaman aktif (Page Title style, contoh: "Data Buku Perpustakaan").
- Kanan: Ikon `User` + nama Guru aktif, serta tombol ikon `LogOut` untuk keluar dari sesi.

### 9.10 Date Picker (Baru — v1.2)

**Ditambahkan pada v1.2** untuk melengkapi spesifikasi field "Tanggal Batas Pengembalian" pada F003 (lihat catatan penting di Section 10) — komponen ini sebelumnya belum didefinisikan secara eksplisit di Component Library meski sudah dirujuk di beberapa bagian dokumen.

- **Default State:** Border `border-slate-300`, ikon kalender di sisi kanan input, format tampilan `DD/MM/YYYY`.
- **Constraint:** Mendukung atribut `min` (tanggal minimum yang dapat dipilih) untuk mencegah input tanggal yang melanggar business rule (contoh: tanggal batas pengembalian tidak boleh kurang dari tanggal peminjaman).
- **Focus State:** Sama seperti Text Input (`border-green-500`, `ring-2 ring-green-200`).
- **Disabled/Read-Only Variant:** Latar `bg-slate-100`, teks `text-slate-500`, kursor `not-allowed` — dipakai untuk field tanggal otomatis seperti Tanggal Pinjam dan Tanggal Pengembalian (lihat Section 10).

---

## 10. FORM DESIGN RULES

- **Labels:** Label selalu diletakkan di atas bidang input (top-aligned labels) untuk memudahkan pemindaian form secara vertikal.
- **Required Fields:** Ditandai dengan karakter bintang merah (*) langsung di samping teks label (contoh: `Judul Buku *`).
- **Read-Only Fields:** Field yang diisi otomatis oleh sistem dan **tidak dapat diubah** oleh Guru — yaitu **Tanggal Pinjam** (F003) dan **Tanggal Pengembalian** (F004) — ditampilkan dengan varian Read-Only pada Date Picker (Section 9.10): latar abu-abu `bg-slate-100`, tidak dapat diedit, disertai keterangan kecil "(Otomatis)".
- **Validation Messages:** Pesan error harus informatif dan spesifik, tidak boleh hanya menampilkan kata "Input salah".
  - Benar: `"Stok buku tidak boleh bernilai negatif (minimal 0)."`
  - Salah: `"Stok salah!"`
- **Error Presentation:** Fokus kursor otomatis berpindah ke field pertama yang gagal validasi saat tombol "Simpan" ditekan.
- **Placeholder & Validasi Lokasi Rak (Baru — v1.2):** Field Lokasi Rak pada Form Tambah/Edit Buku (F002) menggunakan placeholder `"Contoh: A1, B3"`. Jika format tidak sesuai (bukan kombinasi kode rak huruf + nomor), sistem menampilkan pesan error spesifik: `"Format Lokasi Rak tidak valid. Gunakan kombinasi kode rak (huruf) dan nomor, contoh: A1, B3."` — bukan pesan generik seperti "Lokasi salah".
- **Tanggal Batas Pengembalian:** Field ini **bukan** Read-Only. Sesuai **SRS v3.1 Feature F003** (Requirements: *"Sistem harus menyediakan kolom tanggal batas pengembalian yang dapat diatur oleh Guru"*; Business Rule: *"Tanggal batas pengembalian harus selalu lebih besar atau sama dengan tanggal peminjaman"*) dan `information_architecture.md` (PAGE-004: *"Tanggal Batas Pengembalian (date picker)"*), field ini menggunakan varian **Date Picker aktif** (Section 9.10) dengan constraint `min` = Tanggal Pinjam (hari ini). Tanggal Pinjam sendiri tetap Read-Only otomatis.
---

## 11. INTERACTION PATTERNS

### 11.1 Loading State

Setiap kali sistem melakukan komunikasi REST API ke backend (menyimpan data buku, memuat riwayat, memproses transaksi):

- Tombol aksi yang memicu proses menampilkan animasi spinner di samping tulisan tombol dan dinonaktifkan sementara (disabled) untuk mencegah double submit.
- Sisa halaman dipasangi overlay transparan tipis agar guru tidak dapat menekan elemen lain sebelum proses selesai.

### 11.2 Empty State

Jika tabel tidak memiliki data (contoh: belum ada buku terdaftar, atau belum ada transaksi aktif):

- Tampilkan ilustrasi ikon sederhana (contoh: `BookOpen` dengan tanda tanya) di tengah area tabel.
- Sertakan teks informatif sesuai konteks, contoh:
  - PAGE-003: `"Belum ada data buku. Klik 'Tambah Buku Baru' untuk mulai mengisi katalog perpustakaan."`
  - PAGE-005: `"Tidak ada peminjaman aktif saat ini."`
  - PAGE-006: `"Belum ada riwayat transaksi peminjaman."`

### 11.3 Search — No Result State

Jika pencarian buku tidak menemukan hasil (berlaku di PAGE-002, PAGE-003, PAGE-006):

- Tampilkan ikon `Search` dengan tanda tanya di tengah area hasil.
- Sertakan teks: `"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."`

### 11.4 Confirmation Pattern

Setiap kali guru menekan tombol "Proses Pengembalian" pada PAGE-005:

- Sistem menampilkan modal konfirmasi yang meringkas data peminjaman yang akan diproses.
- Guru memilih kondisi buku menggunakan **Radio Button Group** (lihat Section 9.7) dan mengklik "Konfirmasi Pengembalian" untuk menyelesaikan proses.

### 11.5 Destructive Action Pattern

Ketika guru bermaksud menghapus data buku dari katalog (PAGE-003):

1. Guru mengklik tombol "Hapus" (ikon `Trash2`, warna merah) pada baris data buku.
2. Muncul modal konfirmasi: *"Apakah Anda yakin ingin menghapus buku ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan."*
3. Pilihan tombol: **"Ya, Hapus"** (Danger — latar merah) dan **"Batal"** (Secondary — latar abu-abu).
4. Catatan: Tombol "Hapus" dinonaktifkan (`disabled`) jika buku berstatus "Dipinjam", sesuai **SRS v3.0 Feature F002 (Business Rules)**: *"Buku berstatus 'Dipinjam' tidak boleh dihapus dari sistem sebelum dikembalikan."*

### 11.6 Idle Session Timeout Pattern

Memenuhi **SRS v3.0 Feature F001 (Business Rules)** dan Business Rules Master List Section 6, poin 2: sesi login Guru wajib berakhir otomatis setelah 30 menit tidak aktif.

1. Setelah 28 menit tidak ada interaksi (mendekati batas), sistem menampilkan **toast notification** non-blocking di pojok kanan atas: ikon `Clock`, latar `bg-amber-500`, teks `"Sesi Anda akan berakhir dalam 2 menit karena tidak ada aktivitas."` dengan tombol kecil "Tetap di Sini" untuk me-reset timer.
2. Jika tidak ada respons hingga menit ke-30, sistem otomatis melakukan logout dan mengarahkan ke halaman Login.
3. Halaman Login menampilkan pesan informatif: `"Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masuk kembali."` menggunakan style pesan info (`color-info`, ikon `AlertCircle`).

### 11.7 System Error State (Kegagalan Koneksi/API)

Mengantisipasi kegagalan komunikasi antara Frontend dan Backend (dua project terpisah via REST API, sesuai **SRS v3.0 Section 3 — Tech Stack**), serta mendukung **NFR 9.4 (Reliability)**: *"Sistem harus mampu menangani kegagalan jaringan sementara tanpa menghilangkan data form yang sedang diisi Guru (local state retention sebelum submit)."*

- **Saat request API gagal** (timeout, server down, atau response error 5xx): tampilkan **Inline Alert Banner** di atas konten halaman — latar `bg-red-50`, border kiri `border-red-500` (4px), ikon `WifiOff`, teks: `"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."` disertai tombol kecil "Coba Lagi" (Secondary).
- **Pada aksi simpan/transaksi yang gagal** (mis. submit form): modal/form tetap terbuka (data isian tidak hilang — memenuhi NFR 9.4 di atas), tombol submit kembali aktif, dan pesan error singkat muncul di atas tombol aksi dengan warna `color-error`.
- Pola ini berlaku konsisten di seluruh halaman yang melakukan komunikasi REST API: PAGE-003, PAGE-004, PAGE-005, PAGE-006.

---

## 12. RESPONSIVE BEHAVIOR

Sistem dirancang responsif untuk mendukung akses oleh guru menggunakan komputer di area perpustakaan maupun perangkat tablet jika tersedia, serta akses publik siswa via tablet/mobile (SRS v3.0 Section 3.1 — Operating Environment).

**[Viewport: Mobile (< 768px)]**
- Sidebar disembunyikan total; hanya diakses via drawer hamburger menu.
- Tabel menampilkan kolom esensial saja; pengguna dapat scroll horizontal.
- Halaman publik siswa menampilkan daftar buku dalam format kartu satu kolom.

**[Viewport: Tablet (768px – 1023px)]**
- Sidebar terlipat menjadi ikon (lebar 80px) untuk memaksimalkan area konten.
- Split layout PAGE-004 beralih menjadi satu kolom vertikal (panel daftar buku di atas, form di bawah).
- Tabel menampilkan kolom penting saja.

**[Viewport: Desktop (≥ 1024px)]**
- Sidebar terbuka penuh secara permanen (lebar 260px).
- PAGE-004 menggunakan split layout dua panel berdampingan (60% / 40%).
- Seluruh kolom tabel ditampilkan lengkap.

---

## 13. ACCESSIBILITY (a11y)

- **Contrast Ratio:** Teks dan label form memenuhi standar WCAG 2.1 AA dengan rasio kontras minimal 4.5:1 terhadap latar belakang putih/terang.
- **Keyboard Navigation:** Guru dapat berpindah antar field form menggunakan tombol Tab dan mengonfirmasi pilihan menggunakan tombol Enter pada modal dialog.
- **Screen Reader Support:** Setiap ikon aksi (`Edit`, `Hapus`) dilengkapi atribut `aria-label` yang deskriptif.
- **Focus Indicator:** Elemen yang sedang aktif/fokus memiliki outline visual yang jelas (`ring-2 ring-green-400`) agar mudah diidentifikasi tanpa bergantung pada warna saja.

---

## 14. DESIGN TOKENS TABLE

| Token Name | Token Category | Token Value | Mapped CSS / Tailwind |
| --- | --- | --- | --- |
| token-font-main | Typography | Noto Sans, sans-serif | font-sans |
| token-color-primary | Color | #16A34A | bg-green-600 |
| token-color-primary-hover | Color | #15803D | hover:bg-green-700 |
| token-color-primary-light | Color | #DCFCE7 | bg-green-100 |
| token-color-danger | Color | #EF4444 | bg-red-500 |
| token-color-warning | Color | #F59E0B | bg-amber-500 |
| token-color-neutral-muted | Color | #94A3B8 | bg-slate-200 |
| token-color-bg-app | Color | #F8FAFC | bg-slate-50 |
| token-color-bg-card | Color | #FFFFFF | bg-white |
| token-color-text-main | Color | #0F172A | text-slate-900 |
| token-color-text-muted | Color | #64748B | text-slate-500 |
| token-color-border | Color | #E2E8F0 | border-slate-200 |
| token-border-radius | Layout | 8px | rounded-lg |
| token-border-radius-modal | Layout | 12px | rounded-xl |
| token-shadow-modal | Depth | 0px 10px 15px -3px rgba(0,0,0,0.1) | shadow-lg |
| token-shadow-sidebar | Depth | 0px 4px 6px -1px rgba(0,0,0,0.07) | shadow-md |
| token-sidebar-width | Layout | 260px | w-64 |
| token-sidebar-collapsed | Layout | 80px | w-20 |
| token-content-padding | Layout | 24px | p-6 |

---

## 15. TRACEABILITY MATRIX (SRS v3.1 → DS v1.3)
Setiap elemen visual dan aturan komponen dalam dokumen ini diturunkan untuk menjamin terpenuhinya spesifikasi fungsional dari SRS v3.0. Kolom "Target Components" memastikan seluruh komponen yang dirujuk benar-benar terdefinisi di Section 9.

| Feature ID | Feature Name | Design System Target Components | Applied Design / Interaction Rules |
| --- | --- | --- | --- |
| F001 | Autentikasi Guru (Login) | Halaman Login minimalis, Text Input (username & password), Primary Button "Masuk". | Layout terpusat tanpa sidebar. Pesan error merah jika kredensial salah. Tidak ada self-registration. Idle Session Timeout Pattern (11.6) aktif setelah login berhasil. |
| F002 | Manajemen Data Buku | Table Component, Modal Dialog (Tambah/Edit), Danger Button (Hapus), Badge Status Stok, Badge "Tidak Aktif" (9.5). | Modal overlay backdrop-blur. Validasi real-time field input, termasuk format Lokasi Rak (lihat Section 10). Tombol Hapus dinonaktifkan jika buku berstatus "Dipinjam". Badge merah untuk stok habis; badge netral untuk buku "Tidak Aktif" (retensi data, Section 7.3 SRS). |
| F003 | Pencatatan Peminjaman Buku | Split Layout Dua Panel, Card Buku (Panel Kiri), Text Input, Read-Only Date Picker (Tanggal Pinjam) & Date Picker aktif (Tanggal Batas Pengembalian) (9.10), Primary Button "Simpan Peminjaman". | Buku stok 0 ditampilkan non-selectable. Tanggal Pinjam read-only otomatis; Tanggal Batas Pengembalian adalah date picker aktif dengan constraint `min` = tanggal peminjaman (diperbarui v1.2, lihat Section 10 untuk catatan konsistensi dengan SRS). Feedback sukses/gagal instan. |
| F004 | Pencatatan Pengembalian Buku | Table Peminjaman Aktif, Badge Terlambat (merah), Modal Konfirmasi Pengembalian, Radio Button Group Kondisi Buku (9.7), Badge Kondisi Buku (9.5). | Indikator keterlambatan visual (badge merah + jumlah hari). Tidak ada denda — hanya informasi. Field tanggal pengembalian read-only. Kondisi buku wajib dipilih sebelum konfirmasi. |
| F005 | Riwayat Peminjaman | Table Component (read-only), Filter Bar (9.8) (Nama Siswa, Judul, Rentang Tanggal), Badge Status Transaksi. | Zebra striping tabel. Badge hijau (Sudah Dikembalikan), kuning (Masih Dipinjam). Live filtering pada pencarian teks. Data bersifat read-only sepenuhnya. |
| F006 | Akses Ketersediaan Buku Siswa | Topbar Publik (9.9), Card Buku, Table Buku, Kolom Pencarian, Badge Ketersediaan. | Nuansa hijau segar ramah anak. Tombol "Login Guru" di pojok kanan atas Topbar Publik. Tidak ada aksi penulisan data. Informasi peminjam tidak ditampilkan. |
| F007 | Sinkronisasi Stok & Status Otomatis | Tidak ada komponen UI dedicated — logika berjalan otomatis di backend, terpicu saat submit form pada PAGE-004 (F003) dan PAGE-005 (F004). | Perubahan status/stok tercermin secara instan pada Badge (9.5) dan Table Component (9.4) di seluruh halaman terkait tanpa perlu refresh manual (Instant Feedback, Section 2.2). |
| Lintas Fitur | Komunikasi REST API (FE–BE) | System Error State (11.7) — Inline Alert Banner. | Diterapkan pada seluruh halaman yang melakukan request API: PAGE-003, PAGE-004, PAGE-005, PAGE-006. Mendukung NFR 9.4 (Reliability). |

---

## 16. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft — DS Sistem Informasi Perpustakaan SD Negeri Tamanan berdasarkan SRS v1.0 dan IA v1.0 (Chain of Truth SoT-3). |
| 1.1 | 2026-06-30 | Kelompok DPSI BRAYYY | Revisi kelengkapan: (1) menambahkan komponen Radio Button Group Kondisi Buku (9.7), (2) menambahkan komponen Filter Bar Riwayat (9.8), (3) menambahkan Badge Kondisi Buku — Baik/Rusak Ringan/Rusak Berat (9.5), (4) menghapus klaim referensi NFR-Usability yang tidak ada di SRS v2.0, (5) menambahkan Idle Session Timeout Pattern (11.6), (6) menambahkan komponen Header/Topbar Publik vs Guru (9.9), (7) mengubah Tanggal Batas Pengembalian menjadi Read-Only (asumsi same-day return), (8) menambahkan System Error State (11.7), (9) memperbarui Traceability Matrix. |
| **1.2** | **2026-07-01** | **Kelompok DPSI BRAYYY** | **Sinkronisasi penuh terhadap SRS v3.0 (restrukturisasi Feature ID F001–F007) dan IA (sinkron SRS v3.0):** (1) mengembalikan referensi NFR-Usability (kini valid — SRS v3.0 Section 9.7) ke Design Goals (2.1); (2) **membatalkan aturan Read-Only "same-day return" pada Tanggal Batas Pengembalian** — dikembalikan menjadi Date Picker aktif sesuai SRS F003 & IA PAGE-004, disertai catatan kontradiksi Out-of-Scope #4 vs F003 yang perlu diselaraskan tim SRS; (3) menambahkan komponen **Date Picker (9.10)** yang sebelumnya belum terdefinisi; (4) menambahkan **Badge "Tidak Aktif" (9.5)** dan token warna netral (4.3) untuk buku yang ditarik dari sirkulasi (SRS Section 7.3 — Data Retention); (5) menambahkan aturan placeholder & pesan error untuk field Lokasi Rak (Section 10); (6) memperbaiki seluruh sitasi Business Rule yang salah nomor akibat restrukturisasi SRS ke sistem Feature ID (Section 10, 11.5, 11.6, 11.7); (7) memperbarui seluruh referensi versi "SRS v2.0" → "SRS v3.0" dan "IA v1.0" → "IA (sinkron SRS v3.0)"; (8) menambahkan baris F007 pada Traceability Matrix (15); (9) menambahkan catatan NFR 9.1 (Performance) dan NFR 9.4 (Reliability) sebagai landasan Design Goals dan System Error State. |
| 1.3 | 2026-07-01 | Kelompok DPSI BRAYYY | Menghapus catatan peringatan kontradiksi pada Section 10 (Tanggal Batas Pengembalian) setelah srs.md v3.1 merevisi Out-of-Scope poin #4 agar selaras dengan F003. Tidak ada perubahan pada aturan visual/komponen — Date Picker aktif untuk Tanggal Batas Pengembalian tetap sesuai spesifikasi sebelumnya. |