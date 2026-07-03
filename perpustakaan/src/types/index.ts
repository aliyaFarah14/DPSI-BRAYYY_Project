export interface Guru {
  id_guru: string
  nama_guru: string
  username: string
  password_hash: string
}

export interface Buku {
  id_buku: string
  judul_buku: string
  penulis: string
  penerbit: string
  tema_buku: string
  lokasi_rak: string
  stok: number
  status_buku: "Aktif" | "Tidak Aktif"
  coverImageUrl?: string
}

export interface PeminjamanItem {
  id_buku: string
  judul_buku: string
  lokasi_rak: string
}

export interface Peminjaman {
  id_peminjaman: string
  items: PeminjamanItem[]
  nama_siswa: string
  kelas_siswa: string
  nama_guru: string
  tanggal_pinjam: string
  tanggal_kembali: string
  catatan: string
  status: "Dipinjam" | "Dikembalikan"
}

export interface Pengembalian {
  id_pengembalian: string
  id_peminjaman: string
  items: PeminjamanItem[]
  nama_siswa: string
  kelas_siswa: string
  nama_guru: string
  tanggal_pinjam: string
  tanggal_kembali: string
  kondisi_buku: BookCondition
  fineLateAmount: number
  fineConditionAmount: number
  fineTotal: number
  catatan: string
}

export interface RiwayatItem {
  id_peminjaman: string
  nama_siswa: string
  nama_guru: string
  items: PeminjamanItem[]
  tanggal_pinjam: string
  tanggal_kembali: string | null
  kondisi_buku: string | null
  fineTotal: number | null
  status: string
}

export interface Session {
  id_guru: string
  nama_guru: string
  username: string
  lastActivity: string
  expiresAt: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

export type BookCondition = "Baik" | "Rusak Ringan" | "Rusak Berat"
