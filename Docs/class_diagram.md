# Class Diagram — Sistem Informasi Perpustakaan SD Negeri Tamanan 
```mermaid
classDiagram
    class Guru {
        +String id_guru
        +String nama_guru
        +String username
        +String password_hash
        +login(username, password)
        +logout()
        +kelolaDataBuku()
        +catatPeminjaman()
        +catatPengembalian()
        +lihatRiwayat()
    }

    class Buku {
        +String id_buku
        +String judul_buku
        +String penulis
        +String penerbit
        +String tema_buku
        +int tahun_terbit
        +String lokasi_rak
        +int stok
        +String status_buku
        +String gambar_sampul
        +tambah()
        +ubah()
        +hapus()
        +cari(keyword)
        +kurangiStok()
        +tambahStok()
        +uploadGambarSampul()
    }

    class Peminjaman {
        +String id_peminjaman
        +String id_buku
        +String nama_siswa
        +String kelas_siswa
        +Date tgl_peminjaman
        +Date tgl_batas_pengembalian
        +String status_peminjaman
        +simpan()
        +lihatDaftarAktif()
    }

    class Pengembalian {
        +String id_pengembalian
        +String id_peminjaman
        +Date tgl_pengembalian
        +String kondisi_buku
        +int keterlambatan_hari
        +int denda_keterlambatan
        +int biaya_kondisi
        +int total_denda
        +konfirmasi()
        +hitungKeterlambatan()
        +hitungDenda()
    }

    class Session {
        +String id_session
        +String id_guru
        +DateTime created_at
        +DateTime last_activity
        +DateTime expires_at
        +buatSesi()
        +perpanjangSesi()
        +hapusSesi()
    }

    class RiwayatPeminjaman {
        <<view>>
        +lihatSemua()
        +filter(nama_siswa, judul_buku, rentang_tanggal)
    }

    Guru "1" -- "0..*" Session : memiliki
    Guru "1" -- "0..*" Buku : mengelola
    Guru "1" -- "0..*" Peminjaman : mencatat
    Guru "1" -- "0..*" Pengembalian : mencatat
    Buku "1" -- "0..*" Peminjaman : dipinjam_dalam
    Peminjaman "1" -- "0..1" Pengembalian : dikembalikan_melalui
    Peminjaman "1" -- "0..1" RiwayatPeminjaman : muncul_di
    Pengembalian "1" -- "0..1" RiwayatPeminjaman : muncul_di
```
