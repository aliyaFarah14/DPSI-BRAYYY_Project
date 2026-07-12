import { useState, useEffect, useMemo, useRef } from "react"
import { ClipboardList, CircleDollarSign, Download, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EmptyState from "@/components/empty-state"
import { db } from "@/lib/db"
import { formatDate, formatCurrency } from "@/lib/utils"
import type { RiwayatItem } from "@/types"

export default function HistoryPage() {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [appliedFrom, setAppliedFrom] = useState("")
  const [appliedTo, setAppliedTo] = useState("")
  const [exportBulan, setExportBulan] = useState("")
  const [exportTahun, setExportTahun] = useState("")
  const [exportMessage, setExportMessage] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => { setRiwayat(db.getRiwayat()) }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current!)
    debounceRef.current = setTimeout(() => { setDebouncedSearch(searchInput) }, 300)
    return () => clearTimeout(debounceRef.current!)
  }, [searchInput])

  const filtered = useMemo(() => {
    return db.searchRiwayat({
      namaSiswa: debouncedSearch || undefined,
      judulBuku: debouncedSearch || undefined,
      tglMulai: appliedFrom || undefined,
      tglAkhir: appliedTo || undefined,
    })
  }, [riwayat, debouncedSearch, appliedFrom, appliedTo])

  const applyDate = () => { setAppliedFrom(dateFrom); setAppliedTo(dateTo) }
  const reset = () => {
    setSearchInput("")
    setDebouncedSearch("")
    setDateFrom("")
    setDateTo("")
    setAppliedFrom("")
    setAppliedTo("")
  }

  const handleExportExcel = () => {
    if (!exportBulan || !exportTahun) {
      setExportMessage("Pilih bulan dan tahun terlebih dahulu.")
      return
    }
    const bulan = parseInt(exportBulan)
    const tahun = parseInt(exportTahun)
    const matching = riwayat.filter((r) => {
      const d = new Date(r.tanggal_pinjam)
      return d.getMonth() + 1 === bulan && d.getFullYear() === tahun
    })
    if (matching.length === 0) {
      setExportMessage("Tidak ada data riwayat pada periode yang dipilih.")
      return
    }
    setExportMessage("")
    // TODO: replace with real API call to GET /api/v1/history/export?bulan=&tahun= once backend UC-005 is implemented
    console.log(`Would export ${matching.length} rows for ${bulan}/${tahun}`)
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
            <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
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

        {exportMessage && (
          <div className="border-b border-border/60 bg-primary-light/50 px-4 py-2.5 text-center text-sm font-medium text-primary">
            {exportMessage}
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
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <EmptyState icon={ClipboardList} message={
                      debouncedSearch || appliedFrom
                        ? "Riwayat tidak ditemukan."
                        : "Belum ada riwayat transaksi peminjaman."
                    } />
                  </TableCell>
                </TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id_peminjaman}>
                  <TableCell className="font-medium">{r.nama_siswa}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {r.items.map((item) => (
                        <span key={item.id_buku} className="block text-xs text-muted-foreground">{item.judul_buku}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.tanggal_pinjam)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.tanggal_kembali ? formatDate(r.tanggal_kembali) : <span className="italic text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {r.kondisi_buku
                      ? <Badge variant={r.kondisi_buku as "Baik" | "Rusak Ringan" | "Rusak Berat"} className="text-[10px]">{r.kondisi_buku}</Badge>
                      : <span className="text-muted-foreground/50">-</span>}
                  </TableCell>
                  <TableCell>
                    {r.fineTotal != null && r.fineTotal > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive-dark bg-destructive-light/50 rounded-lg px-2 py-0.5">
                        <CircleDollarSign size={12} />
                        {formatCurrency(r.fineTotal)}
                      </span>
                    ) : r.fineTotal != null ? (
                      <span className="text-xs text-muted-foreground/60">Rp0</span>
                    ) : (
                      <span className="text-muted-foreground/50">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Dikembalikan" ? "Sudah Dikembalikan" : "Masih Dipinjam"}>
                      {r.status === "Dikembalikan" ? "Dikembalikan" : "Dipinjam"}
                    </Badge>
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
