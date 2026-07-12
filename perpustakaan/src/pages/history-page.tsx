import { useState, useEffect } from "react"
import { ClipboardList, CircleDollarSign, Download, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EmptyState from "@/components/empty-state"
import { API_BASE } from "@/lib/api"
import { formatDate } from "@/lib/utils"

interface HistoryRow {
  id_peminjaman: string
  nama_siswa: string
  kelas_siswa: string
  judul_buku: string
  tema_buku: string | null
  tgl_peminjaman: string
  tgl_batas_pengembalian: string
  tgl_pengembalian: string | null
  kondisi_buku: string | null
  keterlambatan_hari: number | null
  total_denda: number | null
  status_peminjaman: string
}

function fmtRp(value: number | null): string {
  if (value == null) return "-"
  if (value === 0) return "Rp0"
  return `Rp${value.toLocaleString("id-ID")}`
}

export default function HistoryPage() {
  const [riwayat, setRiwayat] = useState<HistoryRow[]>([])
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [appliedFrom, setAppliedFrom] = useState("")
  const [appliedTo, setAppliedTo] = useState("")
  const [dateError, setDateError] = useState("")
  const [exportBulan, setExportBulan] = useState("")
  const [exportTahun, setExportTahun] = useState("")
  const [exportMessage, setExportMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const fetchHistory = async (from?: string, to?: string) => {
    setLoading(true)
    setFetchError(null)
    try {
      const params = new URLSearchParams()
      if (from) params.append("tgl_mulai", from)
      if (to) params.append("tgl_akhir", to)
      const qs = params.toString()
      const res = await fetch(`${API_BASE}/history${qs ? `?${qs}` : ""}`, { credentials: "include" })
      const body = await res.json()
      if (body.success && body.data) {
        setRiwayat(body.data)
      } else {
        setFetchError(body.message || "Gagal memuat data.")
      }
    } catch {
      setFetchError("Gagal terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const applyDate = () => {
    if (dateTo && dateFrom && dateTo < dateFrom) {
      setDateError("Tanggal akhir tidak boleh lebih kecil dari tanggal mulai.")
      return
    }
    setDateError("")
    setAppliedFrom(dateFrom)
    setAppliedTo(dateTo)
    fetchHistory(dateFrom || undefined, dateTo || undefined)
  }

  const reset = () => {
    setSearch("")
    setDateFrom("")
    setDateTo("")
    setAppliedFrom("")
    setAppliedTo("")
    setDateError("")
    fetchHistory()
  }

  const filtered = riwayat.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase().trim()
    return r.nama_siswa.toLowerCase().includes(q) || r.judul_buku.toLowerCase().includes(q)
  })

  const handleExportExcel = async () => {
    if (!exportBulan || !exportTahun) {
      setExportMessage("Pilih bulan dan tahun terlebih dahulu.")
      return
    }
    setExportMessage("")
    try {
      const res = await fetch(
        `${API_BASE}/history/export?bulan=${exportBulan}&tahun=${exportTahun}`,
        { credentials: "include" }
      )
      if (res.status === 404) {
        setExportMessage("Tidak ada data peminjaman untuk periode ini.")
        return
      }
      if (!res.ok) {
        setExportMessage("Gagal mengekspor data.")
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `riwayat-peminjaman-${exportBulan}-${exportTahun}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setExportMessage("Gagal terhubung ke server.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Riwayat Peminjaman</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Arsip transaksi peminjaman dan pengembalian</p>
      </div>

      <Card className="overflow-hidden border-border shadow-card">
        <div className="flex flex-wrap items-end gap-3 border-b border-border/60 bg-muted/20 px-4 py-4">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau judul buku..."
              className="pl-9 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Dari</label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-36 bg-white" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Sampai</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-36 bg-white" />
          </div>
          <Button onClick={applyDate} size="sm">Terapkan Filter</Button>
          <Button onClick={reset} variant="outline" size="sm">Reset</Button>
          <div className="w-px h-8 bg-border/60 self-center hidden sm:block" />
          <div className="flex items-center gap-2">
            <select value={exportBulan} onChange={(e) => { setExportBulan(e.target.value); setExportMessage("") }}
              className="flex h-9 w-28 rounded-lg border border-input bg-white px-2.5 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Bulan</option>
              {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map((nama, i) => (
                <option key={i + 1} value={i + 1}>{nama}</option>
              ))}
            </select>
            <select value={exportTahun} onChange={(e) => { setExportTahun(e.target.value); setExportMessage("") }}
              className="flex h-9 w-24 rounded-lg border border-input bg-white px-2.5 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <option value="">Tahun</option>
              {(() => {
                const taun = new Date().getFullYear()
                return Array.from({ length: 5 }, (_, i) => taun - 2 + i)
              })().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <Button onClick={handleExportExcel} size="sm"><Download size={14} />Export ke Excel</Button>
          </div>
        </div>

        {dateError && (
          <div className="border-b border-border/60 bg-destructive-light/50 px-4 py-2.5 text-center text-sm font-medium text-destructive-dark">
            {dateError}
          </div>
        )}

        {exportMessage && (
          <div className="border-b border-border/60 bg-primary-light/50 px-4 py-2.5 text-center text-sm font-medium text-primary">
            {exportMessage}
          </div>
        )}

        {fetchError && (
          <div className="border-b border-border/60 bg-destructive-light/50 px-4 py-2.5 text-center text-sm font-medium text-destructive-dark">
            {fetchError}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Siswa</TableHead>
                <TableHead>Buku</TableHead>
                <TableHead>Tgl Pinjam</TableHead>
                <TableHead>Tgl Kembali</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Denda</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <div className="flex items-center justify-center py-16">
                      <p className="text-sm text-muted-foreground">Memuat data...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <EmptyState icon={ClipboardList} message={
                      search || appliedFrom
                        ? "Riwayat tidak ditemukan."
                        : "Belum ada riwayat transaksi peminjaman."
                    } />
                  </TableCell>
                </TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id_peminjaman}>
                  <TableCell className="font-medium">{r.nama_siswa}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.judul_buku}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.tgl_peminjaman)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.tgl_pengembalian ? formatDate(r.tgl_pengembalian) : <span className="italic text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {r.kondisi_buku
                      ? <Badge variant={r.kondisi_buku as "Baik" | "Rusak Ringan" | "Rusak Berat"} className="text-[10px]">{r.kondisi_buku}</Badge>
                      : <span className="text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {r.total_denda != null && r.total_denda > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive-dark bg-destructive-light/50 rounded-lg px-2 py-0.5">
                        <CircleDollarSign size={12} />
                        {fmtRp(r.total_denda)}
                      </span>
                    ) : r.total_denda != null ? (
                      <span className="text-xs text-muted-foreground/60">Rp0</span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {r.status_peminjaman === "Sudah Dikembalikan" ? (
                      <Badge variant="Sudah Dikembalikan">Dikembalikan</Badge>
                    ) : (
                      <Badge variant="Masih Dipinjam">Dipinjam</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}