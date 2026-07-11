import type { Guru, Buku, Peminjaman, Pengembalian, RiwayatItem } from "@/types"

const KEYS = {
  GURU: "perpustakaan_guru",
  BUKU: "perpustakaan_buku",
  PEMINJAMAN: "perpustakaan_peminjaman",
  PENGEMBALIAN: "perpustakaan_pengembalian",
} as const

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]")
  } catch {
    return []
  }
}

function write(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data))
}

export const db = {
  getGuru(): Guru[] {
    return read<Guru>(KEYS.GURU)
  },
  findGuruByUsername(username: string): Guru | null {
    return read<Guru>(KEYS.GURU).find((g) => g.username === username) || null
  },

  getBuku(): Buku[] {
    return read<Buku>(KEYS.BUKU)
  },
  setBuku(list: Buku[]) {
    write(KEYS.BUKU, list)
  },

  getPeminjaman(): Peminjaman[] {
    return read<Peminjaman>(KEYS.PEMINJAMAN)
  },
  setPeminjaman(list: Peminjaman[]) {
    write(KEYS.PEMINJAMAN, list)
  },
  getPeminjamanAktif(): Peminjaman[] {
    return read<Peminjaman>(KEYS.PEMINJAMAN).filter((p) => p.status === "Dipinjam")
  },

  getPengembalian(): Pengembalian[] {
    return read<Pengembalian>(KEYS.PENGEMBALIAN)
  },
  setPengembalian(list: Pengembalian[]) {
    write(KEYS.PENGEMBALIAN, list)
  },

  getRiwayat(): RiwayatItem[] {
    const peminjaman = read<Peminjaman>(KEYS.PEMINJAMAN)
    const pengembalian = read<Pengembalian>(KEYS.PENGEMBALIAN)
    const pengembalianMap = new Map(pengembalian.map((k) => [k.id_peminjaman, k]))
    return peminjaman
      .map((p) => {
        const k = pengembalianMap.get(p.id_peminjaman)
        return {
          id_peminjaman: p.id_peminjaman,
          nama_siswa: p.nama_siswa,
          nama_guru: p.nama_guru,
          items: p.items,
          tanggal_pinjam: p.tanggal_pinjam,
          tanggal_kembali: k ? k.tanggal_kembali : null,
          kondisi_buku: k ? k.kondisi_buku : null,
          fineTotal: k ? k.fineTotal : null,
          status: p.status,
        }
      })
      .sort((a, b) => new Date(b.tanggal_pinjam).getTime() - new Date(a.tanggal_pinjam).getTime())
  },
  searchRiwayat(params: {
    namaSiswa?: string
    judulBuku?: string
    tglMulai?: string
    tglAkhir?: string
  }): RiwayatItem[] {
    let data = this.getRiwayat()
    const searchTerm = params.namaSiswa || params.judulBuku
    if (searchTerm) {
      const k = searchTerm.toLowerCase()
      data = data.filter(
        (r) => r.nama_siswa.toLowerCase().includes(k) || r.items.some((i) => i.judul_buku.toLowerCase().includes(k))
      )
    }
    if (params.tglMulai) data = data.filter((r) => r.tanggal_pinjam >= params.tglMulai!)
    if (params.tglAkhir) data = data.filter((r) => r.tanggal_pinjam <= params.tglAkhir!)
    return data
  },

  seed() {
    if (read<Guru>(KEYS.GURU).length > 0) return
    write(KEYS.GURU, [
      {
        id_guru: "G001",
        nama_guru: "Admin Perpustakaan",
        username: "admin",
        password_hash: btoa("admin123"),
      },
    ])
    write(KEYS.BUKU, [
      { id_buku: "BK001", judul_buku: "Matematika Kelas 4", penulis: "Suparjo", penerbit: "Erlangga", tema_buku: null, tingkatKelas: 4, lokasi_rak: "A1", stok: 3, status_buku: "Aktif" },
      { id_buku: "BK002", judul_buku: "IPA Kelas 5", penulis: "Siti Aminah", penerbit: "Gramedia", tema_buku: null, tingkatKelas: 5, lokasi_rak: "A2", stok: 2, status_buku: "Aktif" },
      { id_buku: "BK003", judul_buku: "Dongeng Nusantara", penulis: "Budi Santoso", penerbit: "Mizan", tema_buku: "Cerita & Dongeng", tingkatKelas: null, lokasi_rak: "B1", stok: 0, status_buku: "Aktif" },
      { id_buku: "BK004", judul_buku: "Cerita Rakyat Jawa", penulis: "Dewi Lestari", penerbit: "Balai Pustaka", tema_buku: "Cerita & Dongeng", tingkatKelas: null, lokasi_rak: "B2", stok: 1, status_buku: "Aktif" },
      { id_buku: "BK005", judul_buku: "Pendidikan Agama Islam", penulis: "Ahmad Fauzi", penerbit: "Tiga Serangkai", tema_buku: "Lainnya", tingkatKelas: null, lokasi_rak: "C1", stok: 4, status_buku: "Aktif" },
    ])
    write(KEYS.PEMINJAMAN, [])
    write(KEYS.PENGEMBALIAN, [])
  },
}
