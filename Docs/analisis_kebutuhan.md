# Dokumen Analisis Kebutuhan
## Sistem Informasi Perpustakaan SD Negeri Tamanan

**Project:** Sistem Informasi Perpustakaan SD Negeri Tamanan
**Status:** Draft
**Author:** Kelompok DPSI BRAYYY — Sistem Informasi, Universitas Ahmad Dahlan

---

## 1. PROBLEM STATEMENT

Observasi dilakukan di SD Negeri Tamanan, Yogyakarta. Beberapa proses di sekolah masih dikelola secara manual, seperti pendataan aset, penyusunan jadwal pelajaran, dan peminjaman fasilitas. Administrasi data siswa telah terintegrasi dengan sistem pusat sehingga tidak dikelola langsung oleh pihak sekolah.

Pengelolaan perpustakaan menjadi permasalahan yang paling kompleks karena melibatkan pencatatan peminjaman dan pengembalian buku, pengelolaan data buku, serta akses informasi oleh siswa dan pengelola. Pencatatan peminjaman dan pengembalian buku masih dilakukan secara manual menggunakan buku tulis. Data pencatatan tersebut tidak terstruktur dan sebagian telah hilang, sehingga riwayat peminjaman dan pengembalian tidak dapat diketahui dengan jelas. Penataan buku di rak tidak terorganisir. Buku ditempatkan secara acak sehingga menyulitkan siswa dalam mencari buku. Ketersediaan dan jumlah stok buku juga tidak dapat diketahui secara pasti karena tidak ada pencatatan yang terpusat. Siswa harus mencari buku secara mandiri tanpa informasi yang jelas mengenai lokasi dan status buku. Kondisi ini membuat proses peminjaman tidak efisien dan menyulitkan akses informasi bagi siswa maupun pengelola perpustakaan.

---

## 2. STAKEHOLDER

Mengidentifikasi pihak-pihak yang terlibat dalam proses pengelolaan perpustakaan beserta peran dan masalah yang mereka hadapi.

| Stakeholder | Peran | Masalah yang Dialami |
|---|---|---|
| Siswa | Meminjam buku | Sulit menemukan buku karena penempatan acak, tidak tahu stok buku, dan mencari buku sendiri tanpa informasi yang jelas. |
| Guru/Petugas | Mengelola operasional perpustakaan | Pencatatan masih manual, tidak tahu kondisi dan stok buku secara pasti, kesulitan melacak data peminjaman dan pengembalian, serta keterbatasan SDM. |

---

## 3. FUNCTIONAL REQUIREMENTS (Awal)

Berikut kebutuhan fungsional yang diperoleh berdasarkan permasalahan yang ditemukan pada proses perpustakaan.

1. Sistem harus dapat digunakan admin untuk mencatat transaksi peminjaman buku.
2. Sistem harus dapat digunakan admin untuk mencatat pengembalian buku.
3. Sistem harus dapat digunakan admin untuk mencari data buku.
4. Sistem harus dapat digunakan admin untuk menyimpan data perpustakaan secara terpusat.
5. Sistem harus dapat digunakan admin untuk melihat riwayat peminjaman buku.
6. Sistem harus dapat digunakan siswa untuk melihat ketersediaan buku.

> **Catatan:** Daftar ini merupakan kebutuhan fungsional dasar hasil temuan awal. Elaborasi lebih lanjut (termasuk field detail, business rules, dan fitur pendukung seperti lokasi rak, gambar sampul, kategori tema/tingkat kelas, dan denda keterlambatan) dijabarkan pada `srs.md` sebagai Source of Truth #1.

---

## 4. TRACEABILITY

Keterkaitan antara temuan, permasalahan, stakeholder, dan kebutuhan sistem dapat dilihat pada tabel berikut.

| Temuan | Masalah | Stakeholder | Kebutuhan |
|---|---|---|---|
| Pencatatan dilakukan di buku tulis | Rawan kesalahan pencatatan | Guru/Petugas | Sistem harus dapat digunakan admin untuk mencatat transaksi peminjaman buku |
| Sulit mencari data buku | Pencarian memakan waktu lama. | Guru/Petugas | Sistem harus dapat digunakan admin untuk mencari data buku |
| Data tidak terpusat | Data tidak konsisten. | Guru/Petugas | Sistem harus dapat digunakan admin untuk menyimpan data secara terpusat |
| Tidak ada riwayat peminjaman yang jelas | Sulit melacak peminjaman | Guru/Petugas | Sistem harus dapat digunakan admin untuk melihat riwayat peminjaman buku |
| Siswa harus bertanya ke petugas | Informasi ketersediaan tidak jelas | Siswa | Sistem harus dapat digunakan siswa untuk melihat ketersediaan buku |
| Kendala SDM | Pengelolaan tidak optimal | Guru/Petugas | Sistem harus dapat digunakan petugas untuk menyimpan data perpustakaan |

---

## 5. VALIDASI

Validasi dilakukan melalui observasi dan wawancara dengan pihak yang terlibat langsung dalam pengelolaan perpustakaan, yaitu guru yang bertanggung jawab terhadap kegiatan perpustakaan.

### 5.1 Observasi

Dari hasil observasi, perpustakaan belum memiliki sistem pendataan yang terstruktur. Proses pencatatan peminjaman dan pengembalian buku sebelumnya dilakukan secara manual menggunakan buku tulis, namun data tersebut telah hilang sehingga tidak dapat diketahui riwayat peminjaman dan pengembalian buku. Ketersediaan dan jumlah stok buku tidak dapat diketahui secara pasti. Penempatan buku di rak juga tidak terorganisir dan cenderung acak, sehingga menyulitkan dalam pencarian buku. Pendataan buku yang tersedia sebagai data aset sekolah yang dikelola secara manual menggunakan spreadsheet (Excel), proses pembaruan data belum terintegrasi, sehingga perubahan data seperti penghapusan atau pengembalian buku tidak tercatat secara otomatis.

### 5.2 Transkrip Wawancara

Berikut berdasarkan hasil wawancara dengan pihak terkait.

**Anggota Kelompok:** Kalau data perpustakaan dulu, dicatat bagaimana, Bu?
**Guru:** Dulu data perpustakaan dicatat manual menggunakan buku pencatatan, tetapi sekarang bukunya hilang jadi datanya sudah tidak ada.

**Anggota Kelompok:** Kalau terkait alur peminjaman buku dulu bagaimana?
**Guru:** Dulu peminjaman buku ditulis manual di buku. Biasanya dicatat tanggal peminjaman, siswa dari kelas berapa, dan buku apa yang dipinjam.

**Anggota Kelompok:** Kalau pengembalian bukunya bagaimana?
**Guru:** Pengembaliannya juga manual. Data siswa dicari di buku pencatatan, lalu diberi tanda centang kalau bukunya sudah kembali.

**Anggota Kelompok:** Kalau terlambat mengembalikan buku ada sanksinya tidak?
**Guru:** Tidak ada sanksi.

**Anggota Kelompok:** Dulu buku perpustakaan boleh dibawa pulang?
**Guru:** Dulu boleh dibawa pulang, maksimal sekitar tiga hari.

**Anggota Kelompok:** Kalau sekarang apakah buku masih boleh dibawa pulang?
**Guru:** Sekarang tidak boleh dibawa pulang karena tidak ada petugas perpustakaan. Kalau dipinjam biasanya hanya dipakai di kelas lalu dikembalikan hari itu juga.

**Anggota Kelompok:** Perpustakaan sekarang hanya untuk kegiatan seperti apa?
**Guru:** Untuk kegiatan membaca dan literasi bersama guru, tetapi belum untuk peminjaman buku dibawa pulang.

**Anggota Kelompok:** Kalau buku paket disimpan di perpustakaan juga?
**Guru:** Tidak, buku paket ada di masing-masing kelas.

**Anggota Kelompok:** Kalau buku paket dibawa pulang siswa bagaimana?
**Guru:** Untuk kelas bawah kadang buku paket boleh dibawa pulang, lalu guru kelas mengingatkan siswa supaya dikembalikan lagi karena buku paket termasuk aset sekolah.

**Anggota Kelompok:** Kalau ada buku hilang atau lupa dikembalikan bagaimana mengetahuinya?
**Guru:** Biasanya guru kelas yang terus mengingatkan siswa, terutama untuk buku paket yang dipakai setiap hari.

**Anggota Kelompok:** Data peminjaman itu direkap lagi atau tidak?
**Guru:** Kurang tahu, karena saya bukan petugas perpustakaan.

**Anggota Kelompok:** Kalau siswa ingin mencari buku biasanya bagaimana?
**Guru:** Dulu siswa bertanya langsung kepada petugas perpustakaan. Sekarang karena tidak ada petugas, siswa mencari sendiri buku yang diinginkan.

**Anggota Kelompok:** Bagaimana kondisi buku di perpustakaan sekarang?
**Guru:** Sekarang buku di rak sudah tidak tertata sesuai tema atau kategori sehingga penempatannya masih acak.

**Anggota Kelompok:** Apa kendala utama dalam pengelolaan perpustakaan?
**Guru:** Kendala utamanya karena tidak ada petugas perpustakaan atau kekurangan SDM.

**Anggota Kelompok:** Bagaimana kondisi data buku di perpustakaan saat ini?
**Guru:** Data buku masih menggunakan data lama dan belum diperbarui oleh dinas. Sekolah baru mengajukan penghapusan buku sehingga data akan berkurang setelah buku diambil oleh dinas.

**Anggota Kelompok:** Apakah jumlah stok setiap jenis buku sudah diketahui?
**Guru:** Belum diketahui pasti karena jumlah bukunya sangat banyak dan belum di cek satu per satu.

**Anggota Kelompok:** Kira-kira ada berapa jumlah buku di perpustakaan?
**Guru:** Jumlahnya sekitar 16 ribu eksemplar dan sebagian masih termasuk data buku yang diajukan untuk penghapusan.

**Anggota Kelompok:** Kalau nanti dibuat sistem perpustakaan, apakah ada komputer yang bisa digunakan?
**Guru:** Ada rencana menyediakan satu unit komputer untuk digunakan di perpustakaan.

**Anggota Kelompok:** Sistem seperti apa yang dibutuhkan?
**Guru:** Sistem yang sederhana untuk membantu pendataan peminjaman dan pengembalian buku, seperti input nama siswa, kelas, dan buku yang dipinjam.

**Anggota Kelompok:** Apakah ada rencana menambah petugas perpustakaan?
**Guru:** Belum ada rencana, karena keterbatasan anggaran honor untuk petugas perpustakaan.

**Link Audio Wawancara:** wawancara SD TAMANAN.mp3

---

## 6. CATATAN EVOLUSI: DARI ANALISIS KEBUTUHAN KE SRS

Beberapa keputusan desain pada `srs.md` berkembang lebih lanjut dari temuan awal di dokumen ini, sebagai hasil elaborasi kebutuhan (bukan kontradiksi terhadap hasil wawancara). Berikut penjelasannya:

### 6.1 Fitur Denda Keterlambatan (F004)

Hasil wawancara menyatakan bahwa sistem manual sebelumnya **tidak menerapkan sanksi keterlambatan**. Namun, pada `srs.md` (sejak v3.2), sistem mengimplementasikan kalkulasi denda otomatis (Rp500/hari keterlambatan + biaya kondisi buku). Fitur ini ditambahkan sebagai **penyempurnaan proaktif**, bukan permintaan eksplisit dari stakeholder, dengan pertimbangan:

- Sistem baru memungkinkan pelacakan tanggal batas kembali secara presisi — sesuatu yang tidak mungkin dilakukan pada pencatatan manual sebelumnya.
- Fitur ini bersifat opsional secara operasional: nominal denda hanya tercatat sebagai data informatif (lihat `srs.md` Business Rule F004), tidak ada modul pelunasan/pembayaran digital, sehingga sekolah tetap bebas menerapkan atau mengabaikan sanksi ini sesuai kebijakan mereka.
- Nominal denda (Rp500/Rp2.000/Rp5.000) berstatus **placeholder** dan tercatat sebagai Open Question di `srs.md` Section 12, menunggu konfirmasi lebih lanjut dari pihak sekolah sebelum go-live.

### 6.2 Fleksibilitas Tanggal Batas Pengembalian

Hasil wawancara menunjukkan kondisi operasional saat ini: buku hanya dipinjam untuk dipakai di kelas dan dikembalikan pada hari yang sama, karena keterbatasan SDM (tidak ada petugas tetap). Pada `srs.md` (Out-of-Scope poin 3), sistem dirancang agar **Guru dapat menentukan tanggal batas pengembalian secara bebas** (tidak wajib hari yang sama), dengan pertimbangan:

- Sistem dirancang untuk mengakomodasi kemungkinan perubahan kebijakan di masa depan (misalnya, jika sekolah kembali mengizinkan buku dibawa pulang), tanpa memerlukan perubahan struktur data.
- Batasan operasional harian (dikembalikan hari itu juga) tetap dapat diterapkan oleh Guru dengan cara mengisi tanggal batas kembali sama dengan tanggal peminjaman — sistem tidak memaksakan salah satu pola, melainkan memberi keleluasaan kepada Guru sebagai pengelola tunggal.

### 6.3 Kesimpulan

Kedua poin di atas mencerminkan bahwa SRS final merupakan hasil elaborasi teknis dari kebutuhan dasar yang ditemukan pada tahap Analisis Kebutuhan ini, bukan penyimpangan dari hasil riset awal. Demikian pula, 6 kebutuhan fungsional dasar pada Section 3 dokumen ini menjadi fondasi yang dijabarkan lebih rinci menjadi FR-001 hingga FR-032 pada `srs.md`.
