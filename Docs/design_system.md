# Design System (DS) - Source of Truth #3

Document Version: v1.7 (Sempurnakan Category Filter Bar dengan filter tema tertutup Cerita & Dongeng/Lainnya; sinkron aturan tema_buku enum — sinkron srs.md v3.6)
Project: Sistem Informasi Perpustakaan SD Negeri Tamanan
Product: Web-Based Library Management System (LMS)
Status: Draft
Last Updated: 2026-07-11
Author: Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan
Supervisor: Farid Suryanto, S.Pd., MT.

---

## 1. DOCUMENT OVERVIEW

### 1.1 Purpose

Dokumen ini mendefinisikan bahasa visual, standar interaksi, dan komponen UI yang dapat digunakan kembali (reusable UI components) pada seluruh antarmuka Sistem Informasi Perpustakaan SD Negeri Tamanan (Web-Based LMS).

Sebagai Source of Truth #3 (SoT-3), dokumen ini diturunkan langsung dari SoT-1 (SRS v3.4) dan SoT-2 (Information Architecture, sinkron SRS v3.4), serta akan digunakan sebagai landasan mutlak untuk:

- Pembuatan High-Fidelity Prototype (SoT-5).
- Panduan penulisan kode komponen Frontend (React, HTML/CSS).
- Menjaga konsistensi pengalaman pengguna (UX) di seluruh layar aplikasi.
- Mempercepat waktu pelatihan guru melalui pola interaksi yang konsisten dan mudah dipahami.

### 1.2 Related Sources of Truth

| Artifact | Reference | Description |
| --- | --- | --- |
| SoT-1 | SRS v3.4 | Spesifikasi Kebutuhan Perangkat Lunak — struktur Feature ID (F001–F007), Kebutuhan Fungsional (FR-001–FR-029), Business Rules Master List, Data Requirements, NFR, Permission Matrix, Tech Stack (deployment lokal single-PC). |
| SoT-2 | Information Architecture (Revisi — sinkron SRS v3.4) | Struktur navigasi, peta situs, dan pemetaan routing. |
| SoT-4 | User Flows | Rangkaian langkah interaksi pengguna per use-case. |
| SoT-5 | HiFi Prototype | Representasi visual interaktif akhir. |

## 2. DESIGN PRINCIPLES

### 2.1 Design Goals

- **Kesederhanaan Operasional (Operational Simplicity):** Antarmuka dirancang agar dapat dipahami dan dioperasikan oleh guru tanpa latar belakang teknis, mengingat perpustakaan tidak memiliki petugas tetap (lihat SRS v3.4, Section 1 — Tujuan Sistem). Target ini selaras dengan **NFR 9.7 (Usability)** pada SRS v3.4, yang menetapkan waktu pelatihan Guru maksimal 15 menit untuk pengguna baru.
- **Kejelasan Informasi (Visual Clarity):** Elemen penting seperti status ketersediaan buku, indikator stok habis, dan peringatan keterlambatan pengembalian — termasuk **besaran denda** — harus langsung terlihat tanpa perlu interpretasi tambahan. Ini mendukung **NFR 9.1 (Performance)** pada SRS v3.4 — halaman daftar buku dimuat di bawah 1 detik (disesuaikan mengingat komunikasi berlangsung secara lokal/localhost), dan proses pencatatan transaksi selesai di bawah 1 detik.
- **Ramah Pengguna Muda (Child-Friendly Accessibility):** Tampilan halaman publik (siswa) menggunakan nuansa warna hangat namun tegas — kombinasi navy, biru, dan merah di atas latar krem lembut — yang tetap mengundang tanpa terasa generik.

### 2.2 UX Principles

- **Fokus pada Tugas (Task-Focused Layout):** Setiap halaman didedikasikan pada satu tugas utama (catat peminjaman, catat pengembalian, kelola buku) untuk meminimalkan distraksi.
- **Umpan Balik Instan (Instant Feedback):** Setiap aksi penyimpanan, penghapusan, atau pembaruan data harus memicu perubahan status visual instan tanpa memuat ulang seluruh halaman. Ini termasuk **perhitungan denda yang tampil live** saat Guru memilih tanggal pengembalian dan kondisi buku (lihat Section 11.8).
- **Toleransi Kesalahan (Error Tolerance):** Konfirmasi berlapis diberikan hanya pada aksi destruktif seperti menghapus data buku. Formulir menyediakan pesan validasi yang informatif dan mudah dipahami.

---

## 3. BRAND FOUNDATION

### 3.1 Brand Personality

- **Tegas & Hangat:** Navy sebagai warna struktural utama memberi kesan tertib dan tepercaya; krem lembut sebagai latar memberi kehangatan tanpa jatuh ke kesan generik.
- **Terpercaya & Tertib:** Struktur layout yang bersih dan konsisten mencerminkan kerapian pengelolaan data perpustakaan.
- **Sederhana & Fungsional:** Bebas dari elemen dekoratif berlebihan; mengutamakan kemudahan akses informasi buku dan transaksi bagi guru maupun siswa.

### 3.2 Visual Characteristics

- **Bentuk Sudut:** Membulat sedang (Rounded 8px atau `rounded-lg`) untuk kesan modern namun tetap rapi dan mudah dipindai secara visual.
- **Kedalaman Visual:** Menggunakan bayangan lembut (soft shadows) pada komponen mengambang seperti kartu buku, modal form, dan panel konfirmasi untuk menegaskan hierarki tumpukan layar.
- **Motif Kartu Katalog:** Kartu buku pada halaman publik menggunakan strip warna solid di sisi kiri (menyerupai punggung buku di rak), bukan ikon generik — lihat Section 9.6.

---

## 4. COLOR SYSTEM

**Perubahan besar di v1.4:** seluruh palet hijau/slate pada v1.3 digantikan dengan palet navy–biru–merah di atas latar krem.

### 4.1 Primary Colors (Navy Brand)

Digunakan untuk elemen tindakan utama, struktur navigasi, dan identitas merek aplikasi perpustakaan.

| Token | Hex Value | Usage |
| --- | --- | --- |
| color-primary | #003049 | Tombol aksi utama ("Simpan", "Masuk", "Konfirmasi"), sidebar Guru, teks judul, strip punggung buku, ikon utama. |
| color-primary-hover | #012840 | Sesi hover pada tombol utama dan item sidebar. |
| color-primary-active | #001A2B | Sesi tekan/klik pada tombol utama. |
| color-primary-light | #DCE8ED | Background badge netral, sorotan ringan item aktif sidebar. |

### 4.2 Secondary Colors (Info / Netral-Positif)

Digunakan untuk status netral-positif, elemen navigasi sekunder, dan aksen pendukung.

| Token | Hex Value | Usage |
| --- | --- | --- |
| color-secondary | #669BBC | Badge "Tersedia", badge "Dipinjam" (status normal, bukan terlambat), badge "Sudah Dikembalikan", ikon info. |
| color-secondary-hover | #4F84A6 | Sesi hover elemen sekunder. |
| color-secondary-light | #E1EEF3 | Background badge status netral-positif. |

### 4.3 Semantic Colors (Status & Alerts)

| Token | Hex Value | Usage |
| --- | --- | --- |
| color-danger | #C1121F | Badge "Stok Habis", badge "Terlambat", badge "Rusak Berat", **badge Denda**, tombol hapus, pesan error form/koneksi. |
| color-danger-dark | #780000 | Teks pada badge merah (kontras tinggi di atas `color-danger-light`), penekanan pada nominal denda yang besar. |
| color-danger-light | #FBE1E3 | Background badge status kritis. |
| color-warning | #CA8A04 | Badge "Rusak Ringan", indikator buku mendekati batas kembali, peringatan sesi akan berakhir. Catatan: ini adalah **token semantik fungsional**, berbeda dari warna oranye dekoratif yang sudah tidak dipakai — dipertahankan karena "Rusak Ringan"/"mendekati batas" butuh level urgensi di antara netral dan kritis. |
| color-warning-light | #FDF1D9 | Background badge warning. |
| color-neutral-muted | #A8A196 | Badge "Tidak Aktif" untuk buku yang ditarik dari sirkulasi (lihat Section 9.5). |

### 4.4 Neutral Colors (Backgrounds & Text)

| Token | Hex Value | Usage |
| --- | --- | --- |
| color-bg-app | #FCF6E8 | Latar belakang aplikasi keseluruhan — publik maupun area Guru. |
| color-bg-card | #FFFFFF | Latar belakang tabel, panel, modal, dan kartu buku. |
| color-text-main | #003049 | Teks judul utama, nama buku, label form (memakai warna navy langsung, kontras tinggi di atas krem). |
| color-text-muted | #6B6355 | Teks deskripsi, kode buku, penanda tanggal. |
| color-border | #E4D8BE | Garis pembatas tabel, pembatas panel, border input (turunan krem gelap, bukan abu-abu netral). |

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
| **Nominal Denda** | Noto Sans | Bold (700) | 20px (1.25rem) | 1.3 | **(Baru v1.4)** Angka total denda pada Modal Konfirmasi Pengembalian — dibuat besar dan tebal agar Guru tidak salah baca nominal. |

---

## 6. ELEVATION & SHADOWS
- **Shadow None (`shadow-none`):** Seluruh elemen input teks dan tabel datar (flat).
- **Shadow Small (`shadow-sm`):** Kartu buku pada halaman publik siswa dan panel daftar buku di halaman peminjaman.
- **Shadow Medium (`shadow-md`):** Sidebar navigasi, Topbar, dan panel tabel utama.
- **Shadow Large (`shadow-lg`):** Modal Overlay (Form Tambah/Edit Buku, Form Konfirmasi Pengembalian) dan Dialog Alert Konfirmasi Hapus Data.

---

## 7. GRID & LAYOUT
### 7.1 Desktop Grid (Width ≥ 1024px) — Target Utama
- **Layout Style:** Flexbox / Grid Split Layout.
- **Sidebar Width:** Tetap 260px (dapat diciutkan menjadi 80px via tombol toggle).
- **Content Padding:** 24px (`p-6`).
- **Gutter Grid:** 16px (`gap-4`).

### 7.2 Tablet Grid (Width 768px – 1023px) — Fallback
- **Sidebar Behavior:** Disembunyikan otomatis; dapat ditarik via tombol hamburger.
- **Gutter Grid:** 12px (`gap-3`).

### 7.3 Halaman Catat Peminjaman — Split Layout Khusus
- **Panel Kiri (60%):** Daftar buku tersedia.
- **Panel Kanan (40%):** Form isian data peminjam dan detail transaksi.

---

## 8. ICONOGRAPHY

Aplikasi menggunakan **satu pustaka ikon konsisten: Lucide React** (atau inline SVG setara), gaya **Outline, stroke 2px**, monokrom mengikuti token warna teks/status yang berlaku di konteksnya. Dipasang via npm package (`lucide-react`) sehingga ikut ter-bundle saat build — tidak memerlukan koneksi CDN saat runtime.
- **Dilarang** mencampur emoji dengan ikon SVG di layar manapun, termasuk pada toast, badge, dan empty state.
- Setiap ikon fungsional dipetakan ke **satu fungsi spesifik** (tabel di bawah) — tidak ada ikon dekoratif tanpa fungsi.
- Warna ikon mengikuti token semantik konteksnya (`color-text-main` untuk netral, `color-danger` untuk aksi hapus/error, dst.) — bukan warna acak/pelangi.
- Ukuran ikon konsisten: 16px untuk ikon inline pada teks/badge, 20px untuk ikon tombol, 24px maksimum untuk ikon dekoratif (mis. logo header).

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
| Denda / Biaya | CircleDollarSign | Ikon lingkaran dengan simbol mata uang, dipakai di badge dan ringkasan denda. |
| Unggah Gambar | ImagePlus | (Baru v1.4) Ikon gambar dengan tanda plus, dipakai pada komponen Image Upload (Section 9.11). |
| Akun Guru Aktif | User | Ikon Siluet Orang |
| Peringatan Sesi Berakhir | Clock | Ikon Jam |
| Kegagalan Koneksi Sistem | WifiOff | Ikon Sinyal Terputus |
| Buku Tidak Aktif | Archive | Ikon Kotak Arsip |

---

## 9. COMPONENT LIBRARY

### 9.1 Button

**Variants & Visual Tokens**

- **Primary Button:** `bg-[#003049]`, `text-white`, `rounded-lg` (8px). Digunakan untuk: "Simpan", "Simpan Peminjaman", "Konfirmasi Pengembalian", "Masuk".
- **Secondary Button:** border `#003049` 1px, teks `#003049`, latar transparan, `rounded-lg` (8px). Digunakan untuk: "Batal".
- **Danger Button:** `bg-[#C1121F]`, `text-white`, `rounded-lg` (8px). Digunakan untuk: "Hapus", "Ya, Hapus".

**States Representation**

| Button State | Visual |
| --- | --- |
| [Default] | `bg-[#003049]`, `text-white` |
| [Hover] | `bg-[#012840]` |
| [Active] | `bg-[#001A2B]` (transform skala tekan 98%) |
| [Disabled] | `bg-[#E4D8BE]`, `text-[#A8A196]` (kursor dilarang) |
| [Loading] | `bg-[#003049]` dengan animasi spinner berputar di dalam tombol |

### 9.2 Text Input

- **Default State:** Border `#E4D8BE`, latar `#FFFFFF`, teks `#003049`, placeholder `#A8A196`.
- **Focus State:** Border berubah `#003049` dengan outline tipis (`ring-2`, warna `#DCE8ED`).
- **Validation — Success State:** Border `#669BBC`, ikon centang di sisi kanan input.
- **Validation — Error State:** Border `#C1121F`, disertai pesan teks error berwarna `#C1121F` di bawah input (12px).

### 9.3 Modal Dialog

- **Overlay Backdrop:** `rgba(0,48,73,0.5)` (navy transparan) dengan efek blur tipis (`backdrop-blur-sm`).
- **Card Container:** Tepat di tengah layar, latar `#FFFFFF`, lebar maksimal 500px (`max-w-md`), sudut membulat `rounded-xl` (12px), bayangan tebal `shadow-lg`.
- **Header:** Judul form dan tombol silang X di pojok kanan.
- **Footer:** Dua tombol sejajar kanan: "Batal" (Secondary) dan "Simpan"/"Konfirmasi" (Primary atau Danger sesuai konteks).

### 9.4 Table Component

- **Header Row (`thead`):** Latar `#DCE8ED`, teks `#003049` tebal (14px/Bold).
- **Body Rows (`tbody`):** Zebra striping — baris ganjil `#FFFFFF`, baris genap `#FCF6E8`.
- **Hover Row State:** `hover:bg-[#E1EEF3]`.
- **Empty State:** Ilustrasi ikon sederhana (rak buku kosong, bukan "BookOpen + tanda tanya" generik) dan teks informatif di tengah area tabel.
- **Baris Buku "Tidak Aktif":** `opacity-70` dan Badge "Tidak Aktif" (lihat 9.5).

### 9.5 Badge / Status Indicator

| Badge Type | Visual (bg / text) | Usage |
| --- | --- | --- |
| Tersedia | `#E1EEF3` / `#003049` | Stok buku tersedia (stok > 0). |
| Stok Habis | `#FBE1E3` / `#780000` | Stok buku 0. |
| Tidak Aktif | `#EFEAE0` / `#6B6355` | Buku ditarik dari sirkulasi (SRS Section 7.3 — Data Retention). |
| Masih Dipinjam | `#E1EEF3` / `#003049` | Status transaksi belum dikembalikan (tepat waktu). |
| Sudah Dikembalikan | `#E1EEF3` / `#003049` | Status transaksi selesai. |
| Terlambat | `#FBE1E3` / `#780000`, `font-semibold` | Indikator keterlambatan pengembalian pada PAGE-005. |
| Denda | `#FBE1E3` / `#780000`, `font-semibold` | Menampilkan nominal denda pada baris riwayat/pengembalian, mis. "Denda Rp 3.000". Ikon `CircleDollarSign` di sisi kiri teks. |
| Baik | `#E1EEF3` / `#003049` | Kondisi buku baik saat dikembalikan. |
| Rusak Ringan | `#FDF1D9` / `#8A5A00` | Kondisi buku rusak ringan. |
| Rusak Berat | `#FBE1E3` / `#780000`, `font-semibold` | Kondisi buku rusak berat. |

### 9.6 Card Component (Buku — Halaman Publik Siswa)

Digunakan pada PAGE-002 untuk menampilkan buku dalam format kartu kepada siswa. — motif kartu diubah dari "kartu generik + ikon buku" menjadi motif, supaya terasa spesifik ke subjek perpustakaan alih-alih template kartu umum.

- **Struktur:** Kartu berbentuk baris horizontal (bukan kotak vertikal), terdiri dari dua bagian:
  - **Strip Kiri (32px):** Latar solid `#003049` (atau `#780000` untuk variasi visual antar kartu — lihat catatan di bawah), berisi **judul buku dituliskan vertikal** (`writing-mode: vertical-rl`) dengan teks putih/krem — meniru tulisan di punggung buku fisik.
  - **Badan Kartu:** Latar `#FFFFFF`, berisi **thumbnail sampul buku** (lihat Section 9.11 — Image Upload untuk sumber gambar ini; jika Guru belum mengunggah sampul, tampilkan placeholder inisial judul di atas `color-primary-light`), judul buku (14px, `#003049`), nama penulis (12px, `#6B6355`), tema buku, dan **chip Lokasi Rak** bergaya stiker nomor panggil (border 1px `#003049`, sedikit rotasi -2°, bukan badge mengambang biasa).
- **Footer:** Badge status ketersediaan (Tersedia / Stok Habis) dan informasi stok tersisa.
- **Variasi warna strip:** Untuk menghindari monotone, strip kiri boleh bervariasi antara `#003049` dan `#780000` secara non-semantik (murni dekoratif per-buku, seperti warna sampul buku berbeda-beda di rak sungguhan) — **bukan** indikator status, supaya tidak tertukar makna dengan badge status.

### 9.7 Radio Button Group (Kondisi Buku)

Digunakan pada Modal Konfirmasi Pengembalian (PAGE-005, F004).

- **Layout:** Tiga opsi sejajar horizontal (atau vertikal jika lebar modal sempit).
- **Opsi:** "Baik" (default terpilih), "Rusak Ringan", "Rusak Berat".
- **Default State:** Lingkaran kosong `border-[#E4D8BE]`.
- **Selected State:** Lingkaran terisi `bg-[#003049]` dengan border `#003049`; label terkait `font-semibold text-[#003049]`.
- **Hover State:** Latar belakang opsi `#FCF6E8`.
- **Wajib Pilih:** Salah satu opsi harus terpilih sebelum tombol "Konfirmasi Pengembalian" aktif.
- **(Baru v1.4) Pemicu Kalkulasi Denda:** Perubahan pilihan pada komponen ini **memicu perhitungan ulang otomatis** pada Panel Ringkasan Denda (Section 11.8) — karena kondisi buku adalah salah satu variabel formula denda.

### 9.8 Filter Bar (Riwayat Peminjaman)

- **Layout:** Baris horizontal di atas Table Component, latar `#FFFFFF`, border bawah `#E4D8BE`, padding `p-4`.
- **Elemen:** Text Input pencarian dengan ikon `Search`, dua Date Picker rentang tanggal, Primary Button "Terapkan Filter", Secondary Button "Reset".
- **Behavior:** Live filtering pada teks (debounce 300ms); tombol filter hanya untuk rentang tanggal.

### 9.9 Header / Topbar (Publik vs Guru)

**Topbar Publik (Siswa — PAGE-002):**
- Latar `#FFFFFF`, `shadow-md`, tanpa sidebar.
- Kiri: Nama sistem dengan Display Title style, warna `#003049`.
- Kanan: Tombol Primary "Login Guru" (ikon `LogIn`).

**Topbar Guru (Area Terautentikasi):**
- Latar `#FFFFFF`, `shadow-md`, berdampingan dengan Sidebar (latar `#003049`, teks putih).
- Kiri: Judul halaman aktif (Page Title style).
- Kanan: Ikon `User` + nama Guru aktif, tombol ikon `LogOut`.

### 9.10 Date Picker

- **Default State:** Border `#E4D8BE`, ikon kalender di sisi kanan input, format `DD/MM/YYYY`.
- **Constraint:** Mendukung atribut `min` untuk mencegah input tanggal yang melanggar business rule.
- **Focus State:** Sama seperti Text Input (`border-[#003049]`, `ring-2` warna `#DCE8ED`).
- **Disabled/Read-Only Variant:** Latar `#EFEAE0`, teks `#6B6355`, kursor `not-allowed` — dipakai untuk field tanggal otomatis (Tanggal Pinjam, Tanggal Pengembalian).

### 9.11 Image Upload

**Ditambahkan** untuk mendukung unggah gambar sampul buku pada Form Tambah/Edit Buku (F002), memenuhi permintaan tim agar Guru dapat mengunggah foto sampul untuk ditampilkan di Card Component (Section 9.6) dan Table Component.
- **Default State (belum ada gambar):** Kotak dropzone rasio 3:4 (mengikuti proporsi sampul buku), border putus-putus (`dashed`) `#E4D8BE`, latar `#FCF6E8`, berisi ikon `ImagePlus` (24px, `#6B6355`) di tengah dan teks `"Klik atau seret gambar sampul ke sini"` (12px, `#6B6355`) serta keterangan format yang didukung, contoh: `"Format JPG/PNG, maksimal 2MB."`
- **Hover/Drag-Over State:** Border berubah solid `#003049`, latar `#DCE8ED`.
- **Uploading State:** Overlay spinner di atas preview gambar sementara (jika ada), progress diindikasikan dengan animasi spinner — konsisten dengan Loading State (Section 11.1).
- **Filled State (gambar sudah terunggah):** Menampilkan preview gambar penuh pada area dropzone (`object-fit: cover`), dengan tombol ikon kecil di pojok kanan atas overlay (ikon `Trash2`, latar `rgba(0,48,73,0.6)`, ikon putih) untuk menghapus/mengganti gambar.
- **Error State:** Jika file melebihi ukuran maksimal atau format tidak didukung, border `#C1121F`, pesan error spesifik di bawah dropzone, contoh: `"Ukuran file melebihi 2MB. Silakan kompres gambar terlebih dahulu."` — bukan pesan generik.
- **Fallback:** Jika field ini dikosongkan (opsional, bukan wajib), sistem menggunakan placeholder inisial judul buku di Card Component (lihat 9.6) — konsisten dengan behavior sebelum fitur ini ada, supaya tidak memaksa Guru mengunggah gambar untuk buku lama yang sudah terlanjur dicatat.

### 9.12 Category Filter Bar (Halaman Publik) *(Direvisi v1.7)*

Komponen ini digunakan pada halaman publik (PAGE-002, F006) untuk memfilter daftar buku berdasarkan kategori Tingkat Kelas (1–6) atau Tema (Cerita & Dongeng / Lainnya), di samping kolom pencarian teks yang sudah ada.

**Layout:** Baris horizontal tombol kategori berbentuk `radio button group` (horizontal-scroll jika layar sempit), diletakkan di bawah kolom pencarian pada halaman publik.

**Tombol Kategori:**

| Tombol | Background (Default) | Text Color (Default) | Hover State | Selected State |
| --- | --- | --- | --- | --- |
| **Semua** | `bg-[#003049]` (color-primary) | `text-white` | `bg-[#012840]` | `bg-[#003049]` (sama, karena default terpilih) |
| **Kelas 1–6** (masing-masing tombol) | `bg-[#E1EEF3]` (color-secondary-light) | `text-[#669BBC]` (color-secondary) | `bg-[#DCE8ED]` | `bg-[#669BBC] text-white` |
| **Tema/Jenis Buku** | `bg-[#FDF1D9]` (color-warning-light) | `text-[#CA8A04]` (color-warning) | `bg-[#F5E6B8]` | `bg-[#CA8A04] text-white` |

**States:**

| State | Visual |
| --- | --- |
| **Default** | Background dan text sesuai tabel di atas, `rounded-lg` (8px), `px-4 py-2`, `text-sm font-medium` |
| **Hover** | Background lebih pekat (lihat tabel), kursor pointer |
| **Selected** | Background solid sesuai token warna, text putih, border 1px lebih gelap dari token |
| **Focus** | `ring-2 ring-[#DCE8ED]` (color-primary-light) — konsisten dengan Section 9.2 |

**Behavior:**
- Hanya satu tombol yang dapat terpilih dalam satu waktu (mutually exclusive, seperti radio button).
- Saat tombol dipilih, sistem mengirim request `GET /api/v1/books/public?tingkat_kelas=N` (filter kelas) atau `?tema_buku=Cerita & Dongeng`/`?tema_buku=Lainnya` (filter tema) dan memperbarui daftar buku.
- Filter tema hanya menerima dua nilai: "Cerita & Dongeng" atau "Lainnya" — sesuai CHECK constraint pada kolom `tema_buku` di database.
- Tombol "Semua" adalah default saat halaman pertama kali dimuat — menghapus semua filter dan menampilkan seluruh buku aktif.

**Catatan desain:** Tidak memperkenalkan warna baru — seluruh token warna yang digunakan sudah ada di Section 4 (Color System). Warna navy, biru, dan kuning dipilih untuk konsistensi semantik dengan palet aplikasi secara keseluruhan.

---

## 10. FORM DESIGN RULES

- **Labels:** Label selalu diletakkan di atas bidang input (top-aligned labels).
- **Required Fields:** Ditandai dengan karakter bintang merah (*) `#C1121F` di samping label.
- **Read-Only Fields:** Tanggal Pinjam (F003) dan Tanggal Pengembalian (F004) ditampilkan dengan varian Read-Only Date Picker: latar `#EFEAE0`, tidak dapat diedit, disertai keterangan kecil "(Otomatis)".
- **Validation Messages:** Pesan error harus informatif dan spesifik.
  - Benar: `"Stok buku tidak boleh bernilai negatif (minimal 0)."`
  - Salah: `"Stok salah!"`
- **Error Presentation:** Fokus kursor otomatis berpindah ke field pertama yang gagal validasi saat tombol "Simpan" ditekan.
- **Placeholder & Validasi Lokasi Rak:** Field Lokasi Rak (F002) menggunakan placeholder `"Contoh: A1, B3"`; error spesifik jika format tidak valid.
- **Tanggal Batas Pengembalian:** Bukan Read-Only — Date Picker aktif (Section 9.10) dengan constraint `min` = Tanggal Pinjam, sesuai SRS v3.4 Feature F003.
- **(Baru v1.4) Field Gambar Sampul:** Menggunakan komponen Image Upload (Section 9.11), diposisikan di bagian atas Form Tambah/Edit Buku (sebelum field teks), bersifat **opsional** — tidak ditandai bintang merah.

---

## 11. INTERACTION PATTERNS

### 11.1 Loading State

- Tombol aksi menampilkan spinner dan dinonaktifkan sementara untuk mencegah double submit.
- Overlay transparan tipis pada sisa halaman.

### 11.2 Empty State

- Ilustrasi ikon sederhana (rak buku kosong) di tengah area tabel, bukan icon generik bertumpuk tanda tanya.
- Teks informatif sesuai konteks:
  - PAGE-003: `"Belum ada data buku. Klik 'Tambah Buku Baru' untuk mulai mengisi katalog perpustakaan."`
  - PAGE-005: `"Tidak ada peminjaman aktif saat ini."`
  - PAGE-006: `"Belum ada riwayat transaksi peminjaman."`

### 11.3 Search — No Result State

- Ikon `Search` di tengah area hasil.
- Teks: `"Buku tidak ditemukan. Pastikan ejaan judul atau tema sudah benar."`

### 11.4 Confirmation Pattern

Setiap kali guru menekan tombol "Proses Pengembalian" pada PAGE-005:

- Modal konfirmasi meringkas data peminjaman.
- Guru memilih kondisi buku (Radio Button Group, 9.7).
- **(Baru v1.4)** Panel Ringkasan Denda (lihat 11.8) muncul dan diperbarui otomatis berdasarkan tanggal pengembalian aktual dan kondisi buku.
- Guru mengklik "Konfirmasi Pengembalian" untuk menyelesaikan proses.

### 11.5 Destructive Action Pattern

1. Guru mengklik tombol "Hapus" (ikon `Trash2`, `#C1121F`) pada baris data buku.
2. Modal konfirmasi: *"Apakah Anda yakin ingin menghapus buku ini secara permanen dari sistem? Tindakan ini tidak dapat dibatalkan."*
3. Tombol: **"Ya, Hapus"** (Danger) dan **"Batal"** (Secondary).
4. Tombol "Hapus" dinonaktifkan jika buku berstatus "Dipinjam", sesuai SRS v3.4 Feature F002.

### 11.6 Idle Session Timeout Pattern

1. Setelah 28 menit tidak ada interaksi: toast notification non-blocking pojok kanan atas, ikon `Clock`, latar `#FDF1D9`, teks `"Sesi Anda akan berakhir dalam 2 menit karena tidak ada aktivitas."`, tombol "Tetap di Sini".
2. Jika tidak ada respons hingga menit ke-30: logout otomatis ke halaman Login.
3. Halaman Login: `"Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masuk kembali."` (ikon `AlertCircle`, warna info `#669BBC`).

### 11.7 System Error State (Kegagalan Koneksi/API)

- Request API gagal: Inline Alert Banner, latar `#FBE1E3`, border kiri `#C1121F` (4px), ikon `WifiOff`, teks: `"Gagal terhubung ke server. Periksa koneksi atau coba lagi beberapa saat."`, tombol "Coba Lagi" (Secondary).
- Aksi simpan/transaksi gagal: modal/form tetap terbuka (data tidak hilang), tombol submit aktif kembali, pesan error singkat warna `#C1121F`.
- Berlaku konsisten di PAGE-003, PAGE-004, PAGE-005, PAGE-006.
- Catatan (sinkron SRS v3.3): karena backend berjalan di PC yang sama (localhost), pesan ini realistisnya lebih sering muncul akibat server lokal belum dijalankan/berhenti, bukan gangguan jaringan eksternal — teks pesan tetap generik dan berlaku untuk kedua kemungkinan.

### 11.8 Kalkulasi & Ringkasan Denda Keterlambatan (Baru — v1.4)

**Kapan muncul:** Di dalam Modal Konfirmasi Pengembalian (PAGE-005), tepat di bawah Radio Button Group Kondisi Buku (Section 9.7), sebagai **Panel Ringkasan Denda** — muncul otomatis begitu Tanggal Pengembalian ≥ Batas Kembali, atau kondisi buku bukan "Baik".

**Formula (usulan, perlu konfirmasi nominal):**

```
Denda Keterlambatan = Rp 500 × jumlah hari terlambat
                       (dihitung otomatis: Tanggal Pengembalian − Batas Kembali;
                        jika ≤ 0 hari, komponen ini = Rp 0)

Biaya Kondisi Buku   = Rp 0        jika kondisi "Baik"
                       Rp 2.000    jika kondisi "Rusak Ringan"
                       Rp 5.000    jika kondisi "Rusak Berat"

Total Denda          = Denda Keterlambatan + Biaya Kondisi Buku
```

**Visual Panel Ringkasan Denda:**

- Container dengan latar `#FBE1E3` jika Total Denda > 0 (atau `#E1EEF3` jika Rp 0 — netral, tidak terkesan "kritis" kalau tidak ada denda), border-radius 8px, padding 12px.
- Baris rincian (2 baris kecil, 12px, `#6B6355`): "Keterlambatan: 3 hari × Rp 500 = Rp 1.500" dan "Kondisi buku: Rusak Ringan = Rp 2.000".
- Baris Total (style **Nominal Denda**, Section 5): "Total Denda: Rp 3.500", warna `#780000` jika > 0, warna `#003049` jika Rp 0 (menampilkan "Tidak ada denda").
- Ikon `CircleDollarSign` di sisi kiri baris Total.
- Panel ini **read-only** — Guru tidak mengetik nominal denda secara manual, murni hasil kalkulasi otomatis, sesuai prinsip Instant Feedback (2.2) dan mencegah kesalahan input manual.

**Setelah konfirmasi:** Nominal Total Denda tersimpan pada record transaksi dan ditampilkan sebagai Badge Denda (Section 9.5) pada Table Riwayat (PAGE-006) dan Table Peminjaman Aktif (PAGE-005), sehingga riwayat denda tetap terlihat tanpa perlu membuka ulang modal.

---

## 12. RESPONSIVE BEHAVIOR
**[Viewport: Mobile (< 768px) — fallback]**
- Sidebar disembunyikan total; diakses via drawer hamburger menu.
- Tabel menampilkan kolom esensial saja; scroll horizontal.
- Halaman publik siswa: kartu satu kolom.

**[Viewport: Tablet (768px – 1023px) — fallback]**
- Sidebar terlipat menjadi ikon (80px).
- Split layout PAGE-004 menjadi satu kolom vertikal.

**[Viewport: Desktop (≥ 1024px) — target utama]**
- Sidebar terbuka penuh (260px).
- PAGE-004 split layout dua panel (60% / 40%).

---

## 13. ACCESSIBILITY (a11y)

- **Contrast Ratio:** WCAG 2.1 AA, rasio kontras minimal 4.5:1. Navy `#003049` di atas krem `#FCF6E8` maupun putih memenuhi ini dengan baik; telah diverifikasi untuk seluruh kombinasi teks-di-atas-badge pada Section 9.5.
- **Keyboard Navigation:** Tab dan Enter pada modal dialog, termasuk navigasi ke Panel Ringkasan Denda (11.8).
- **Screen Reader Support:** Setiap ikon aksi dilengkapi `aria-label` deskriptif, termasuk ikon baru `ImagePlus` (aria-label: "Unggah gambar sampul buku") dan `CircleDollarSign` (aria-label: "Jumlah denda").
- **Focus Indicator:** Outline visual jelas (`ring-2`, warna `#003049` pada 40% opacity) agar mudah diidentifikasi tanpa bergantung pada warna saja.

---

## 14. DESIGN TOKENS TABLE

| Token Name | Token Category | Token Value |
| --- | --- | --- |
| token-font-main | Typography | Noto Sans, sans-serif (self-hosted, bukan Google Fonts CDN) |
| token-color-primary | Color | #003049 |
| token-color-primary-hover | Color | #012840 |
| token-color-primary-active | Color | #001A2B |
| token-color-primary-light | Color | #DCE8ED |
| token-color-secondary | Color | #669BBC |
| token-color-secondary-hover | Color | #4F84A6 |
| token-color-secondary-light | Color | #E1EEF3 |
| token-color-danger | Color | #C1121F |
| token-color-danger-dark | Color | #780000 |
| token-color-danger-light | Color | #FBE1E3 |
| token-color-warning | Color | #CA8A04 |
| token-color-warning-light | Color | #FDF1D9 |
| token-color-neutral-muted | Color | #A8A196 |
| token-color-bg-app | Color | #FCF6E8 |
| token-color-bg-card | Color | #FFFFFF |
| token-color-text-main | Color | #003049 |
| token-color-text-muted | Color | #6B6355 |
| token-color-border | Color | #E4D8BE |
| token-border-radius | Layout | 8px |
| token-border-radius-modal | Layout | 12px |
| token-shadow-modal | Depth | 0px 10px 15px -3px rgba(0,48,73,0.15) |
| token-shadow-sidebar | Depth | 0px 4px 6px -1px rgba(0,48,73,0.1) |
| token-sidebar-width | Layout | 260px |
| token-sidebar-collapsed | Layout | 80px |
| token-content-padding | Layout | 24px |
| **token-denda-per-hari** | **Business Logic (placeholder)** | **Rp 500** |
| **token-denda-rusak-ringan** | **Business Logic (placeholder)** | **Rp 2.000** |
| **token-denda-rusak-berat** | **Business Logic (placeholder)** | **Rp 5.000** |
| **token-image-upload-maxsize** | **Business Logic** | **2 MB** |
| **token-image-upload-format** | **Business Logic** | **JPG, PNG** |
| **token-image-storage** | **Business Logic** | **Local filesystem (folder `/uploads` di PC yang sama), bukan cloud storage** |

---

## 15. TRACEABILITY MATRIX (SRS v3.6 → DS v1.7)

| Feature ID | Feature Name | Design System Target Components | Applied Design / Interaction Rules |
| --- | --- | --- | --- |
| F001 | Autentikasi Guru (Login) | Halaman Login minimalis, Text Input, Primary Button "Masuk" (`#003049`). | Layout terpusat tanpa sidebar. Pesan error merah jika kredensial salah. Idle Session Timeout Pattern (11.6) aktif setelah login. |
| F002 | Manajemen Data Buku | Table Component, Modal Dialog (Tambah/Edit), **Image Upload (9.11 — baru, penyimpanan lokal)**, Danger Button (Hapus), Badge Status Stok, Badge "Tidak Aktif", **Category Filter Bar (9.12 — baru)**. | Modal overlay backdrop-blur navy. Validasi real-time termasuk format Lokasi Rak. Field gambar sampul opsional. Tombol Hapus dinonaktifkan jika buku "Dipinjam". |
| F003 | Pencatatan Peminjaman Buku | Split Layout Dua Panel, Card Buku bermotif punggung buku (9.6 — direvisi), Read-Only Date Picker (Tanggal Pinjam) & Date Picker aktif (Tanggal Batas Pengembalian). | Buku stok 0 non-selectable. Tanggal Batas Pengembalian date picker aktif, constraint `min` = tanggal peminjaman. Feedback sukses/gagal instan. |
| **F004** | **Pencatatan Pengembalian Buku** | Table Peminjaman Aktif, Badge Terlambat, **Badge Denda (baru)**, Modal Konfirmasi Pengembalian, Radio Button Group Kondisi Buku, **Panel Ringkasan Denda (11.8 — baru)**. | Indikator keterlambatan visual + jumlah hari. **Denda dihitung otomatis dari hari terlambat dan kondisi buku** Field tanggal pengembalian read-only. Kondisi buku wajib dipilih sebelum konfirmasi. |
| F005 | Riwayat Peminjaman | Table Component (read-only), Filter Bar, Badge Status Transaksi, **Badge Denda (baru, jika ada)**. | Zebra striping. Live filtering. Data read-only, termasuk riwayat denda yang sudah tercatat. |
| F006 | Akses Ketersediaan Buku Siswa | Topbar Publik, Card Buku (motif punggung buku), Table Buku, Kolom Pencarian, Badge Ketersediaan, **Category Filter Bar (9.12 — baru)**. | Nuansa navy-krem ramah anak. Tombol "Login Guru" Primary di Topbar Publik. Tidak ada aksi penulisan data. |
| F007 | Sinkronisasi Stok & Status Otomatis | Tidak ada komponen UI dedicated — logika backend. | Perubahan status/stok tercermin instan pada Badge dan Table Component tanpa refresh manual. |
| Lintas Fitur | Komunikasi REST API (FE–BE, localhost) | System Error State (11.7) — Inline Alert Banner. | Diterapkan di PAGE-003, PAGE-004, PAGE-005, PAGE-006. Mendukung NFR 9.4 (Reliability). |

---

## 16. REVISION HISTORY

| Version | Date | Author | Description |
| --- | --- | --- | --- |
| 1.0 | 2026-06-25 | Kelompok DPSI BRAYYY | Initial Draft. |
| 1.1 | 2026-06-30 | Kelompok DPSI BRAYYY | Penambahan Radio Button Group, Filter Bar, Badge Kondisi Buku, Idle Session Timeout, Topbar Publik/Guru, System Error State. |
| 1.2 | 2026-07-01 | Kelompok DPSI BRAYYY | Sinkronisasi penuh terhadap SRS v3.0 (Feature ID F001–F007), penambahan Date Picker, Badge "Tidak Aktif", aturan Lokasi Rak. |
| 1.3 | 2026-07-01 | Kelompok DPSI BRAYYY | Penghapusan catatan kontradiksi Tanggal Batas Pengembalian setelah srs.md v3.1 merevisi Out-of-Scope poin #4. |
| 1.4 | 2026-07-03 | Kelompok DPSI BRAYYY | Revisi besar atas permintaan tim: (1) Pergantian total palet warna dari hijau/slate ke navy `#003049` / biru `#669BBC` / merah `#C1121F` di atas latar krem `#FCF6E8` (Section 4, 14) — oranye yang sempat dieksplorasi pada tahap draf tidak jadi dipakai; (2) penegasan aturan Iconography (Section 8) — satu pustaka ikon konsisten (Lucide outline), larangan campur emoji, pemetaan fungsi eksplisit; (3) komponen baru Image Upload (9.11) untuk unggah gambar sampul buku pada F002, termasuk field opsional di Form Design Rules (Section 10); (4) fitur baru Denda Keterlambatan (Section 11.8) — kalkulasi otomatis berdasarkan jumlah hari terlambat dan kondisi buku, Badge Denda baru (9.5), Panel Ringkasan Denda pada Modal Konfirmasi Pengembalian; (5) revisi motif Card Component (9.6) menjadi gaya "punggung buku di rak" menggantikan kartu generik. |
| **1.6** | **2026-07-10** | **Kelompok DPSI BRAYYY** | **Tambah Section 9.12 — Category Filter Bar (Halaman Publik) untuk filter Tingkat Kelas 1–6 dan Tema pada halaman publik (F006), dengan spesifikasi warna Default/Hover/Selected menggunakan token existing (Section 4). Update Section 15 Traceability Matrix baris F002 dan F006. Sinkron dengan srs.md v3.5.** |
| **1.7** | **2026-07-11** | **Kelompok DPSI BRAYYY** | **Sempurnakan Section 9.12 — filter tema berubah dari teks bebas menjadi enum tertutup (`'Cerita & Dongeng'` / `'Lainnya'`) sesuai CHECK constraint database; perbarui Behavior untuk endpoint `?tema_buku=`. Update Traceability Matrix header v3.6→v1.7. Sinkron dengan srs.md v3.6.** |