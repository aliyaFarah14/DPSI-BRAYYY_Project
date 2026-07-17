import { useState, useEffect, useMemo, useRef } from "react"
import { BookOpen, CalendarDays, User, CheckCircle, XCircle, CircleDollarSign, Search, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import EmptyState from "@/components/empty-state"
import { apiFetch } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { FINE_PER_DAY, FINE_DAMAGE_LIGHT, FINE_DAMAGE_HEAVY } from "@/lib/constants"
import type { BookCondition } from "@/types"

interface ActiveLoan {
  id_peminjaman: string
  nama_siswa: string
  kelas_siswa: string
  judul_buku: string
  tgl_peminjaman: string
  tgl_batas_pengembalian: string
  hari_terlambat_saat_ini: number
}

interface LoanGroup {
  key: string
  nama_siswa: string
  kelas_siswa: string
  tgl_peminjaman: string
  tgl_batas_pengembalian: string
  loans: { id_peminjaman: string; judul_buku: string; hari_terlambat_saat_ini: number }[]
  maxHariTerlambat: number
}

interface ReturnResult {
  id_peminjaman: string
  judul_buku: string
  status: "success" | "fail"
  message: string
  total_denda?: number
}

const KONDISI_BIAYA: Record<BookCondition, number> = {
  Baik: 0,
  "Rusak Ringan": FINE_DAMAGE_LIGHT,
  "Rusak Berat": FINE_DAMAGE_HEAVY,
}

function groupActiveLoans(rows: ActiveLoan[]): LoanGroup[] {
  const map = new Map<string, LoanGroup>()
  for (const row of rows) {
    const key = `${row.nama_siswa}|${row.tgl_peminjaman}|${row.tgl_batas_pengembalian}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        nama_siswa: row.nama_siswa,
        kelas_siswa: row.kelas_siswa,
        tgl_peminjaman: row.tgl_peminjaman,
        tgl_batas_pengembalian: row.tgl_batas_pengembalian,
        loans: [],
        maxHariTerlambat: 0,
      })
    }
    const g = map.get(key)!
    g.loans.push({
      id_peminjaman: row.id_peminjaman,
      judul_buku: row.judul_buku,
      hari_terlambat_saat_ini: row.hari_terlambat_saat_ini,
    })
    if (row.hari_terlambat_saat_ini > g.maxHariTerlambat) {
      g.maxHariTerlambat = row.hari_terlambat_saat_ini
    }
  }
  return Array.from(map.values())
}

function calcLateFee(hari: number): number {
  return hari * FINE_PER_DAY
}

function calcCondFee(condition: BookCondition): number {
  return KONDISI_BIAYA[condition]
}

export default function ReturnPage() {
  const [activeLoans, setActiveLoans] = useState<ActiveLoan[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [selectedGroup, setSelectedGroup] = useState<LoanGroup | null>(null)
  const [conditions, setConditions] = useState<Record<string, BookCondition>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [results, setResults] = useState<ReturnResult[] | null>(null)
  const dialogTitleRef = useRef<HTMLHeadingElement>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await apiFetch<ActiveLoan[]>("/loans/active")
      if (res.body.success) setActiveLoans(res.body.data ?? [])
    } catch {
      setSaveError("Gagal memuat data. Periksa koneksi server.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { loadData() }, [])

  const allGroups = useMemo(() => groupActiveLoans(activeLoans), [activeLoans])

  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return allGroups
    return allGroups.filter(
      (g) =>
        g.nama_siswa.toLowerCase().includes(q) ||
        g.loans.some((l) => l.judul_buku.toLowerCase().includes(q))
    )
  }, [allGroups, search])

  const openReturn = (g: LoanGroup) => {
    setSelectedGroup(g)
    const defaults: Record<string, BookCondition> = {}
    for (const l of g.loans) defaults[l.id_peminjaman] = "Baik"
    setConditions(defaults)
    setSaveError(null)
    setResults(null)
    setShowConfirm(true)
    setTimeout(() => dialogTitleRef.current?.focus(), 100)
  }

  const setCond = (id: string, val: BookCondition) => {
    setConditions((prev) => ({ ...prev, [id]: val }))
  }

  const condEntries = useMemo(() => {
    if (!selectedGroup) return []
    return selectedGroup.loans.map((l) => ({
      ...l,
      kondisi: conditions[l.id_peminjaman] || "Baik" as BookCondition,
    }))
  }, [selectedGroup, conditions])

  const feeBreakdown = useMemo(() => {
    if (!selectedGroup) return null
    const perBook = condEntries.map((entry) => {
      const lateFee = calcLateFee(entry.hari_terlambat_saat_ini)
      const condFee = calcCondFee(entry.kondisi)
      return {
        id_peminjaman: entry.id_peminjaman,
        judul_buku: entry.judul_buku,
        hari_terlambat: entry.hari_terlambat_saat_ini,
        kondisi: entry.kondisi,
        lateFee,
        condFee,
        total: lateFee + condFee,
      }
    })
    const grandTotal = perBook.reduce((sum, b) => sum + b.total, 0)
    return { perBook, grandTotal }
  }, [condEntries])

  const confirmReturn = async () => {
    if (!selectedGroup) return
    setSaving(true)
    const returnResults: ReturnResult[] = []

    for (const entry of condEntries) {
      try {
        const { res, body } = await apiFetch<{ total_denda?: number }>("/returns", {
          method: "POST",
          body: JSON.stringify({
            id_peminjaman: entry.id_peminjaman,
            kondisi_buku: entry.kondisi,
          }),
        })
        if (res.ok && body.success) {
          returnResults.push({
            id_peminjaman: entry.id_peminjaman,
            judul_buku: entry.judul_buku,
            status: "success",
            message: "Berhasil dikembalikan",
            total_denda: body.data?.total_denda ?? 0,
          })
        } else {
          returnResults.push({
            id_peminjaman: entry.id_peminjaman,
            judul_buku: entry.judul_buku,
            status: "fail",
            message: body.message || "Gagal",
          })
        }
      } catch {
        returnResults.push({
          id_peminjaman: entry.id_peminjaman,
          judul_buku: entry.judul_buku,
          status: "fail",
          message: "Gagal terhubung ke server.",
        })
      }
    }

    setResults(returnResults)
    setShowConfirm(false)
    setSelectedGroup(null)

    const allSuccess = returnResults.every((r) => r.status === "success")
    if (allSuccess) {
      const totalDenda = returnResults.reduce((s, r) => s + (r.total_denda ?? 0), 0)
      setSuccessMsg(
        `Semua buku berhasil dikembalikan.${totalDenda > 0 ? ` Total denda: Rp${totalDenda.toLocaleString()}` : ""}`
      )
      setTimeout(() => setSuccessMsg(null), 5000)
    } else {
      setSaveError("Beberapa buku gagal dikembalikan. Lihat detail di bawah.")
    }
    setSaving(false)
    loadData()
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Pengembalian Buku</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Proses pengembalian buku yang dipinjam</p>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-secondary-light/80 border border-secondary/30 px-4 py-3 text-sm text-primary font-medium shadow-sm">
          {successMsg}
        </div>
      )}

      {/* Batch results */}
      {results && (
        <Card className="border-border shadow-card">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm font-semibold mb-3">Hasil Pengembalian</p>
            <div className="space-y-2">
              {results.map((r) => (
                <div key={r.id_peminjaman} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${r.status === "success" ? "bg-secondary-light/60" : "bg-destructive-light/60"}`}>
                  {r.status === "success" ? <CheckCircle size={16} className="text-secondary shrink-0" /> : <XCircle size={16} className="text-destructive-dark shrink-0" />}
                  <span className="font-medium">{r.judul_buku}</span>
                  <span className="text-muted-foreground ml-auto">{r.message}</span>
                  {r.total_denda !== undefined && r.total_denda > 0 && (
                    <span className="text-xs font-semibold text-destructive">Rp{r.total_denda.toLocaleString()}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari siswa atau judul buku..."
          className="h-9 pl-9 text-sm rounded-xl" />
      </div>

      {/* Active loans — grouped */}
      {filteredGroups.length === 0 ? (
        <EmptyState icon={BookOpen} message="Tidak ada peminjaman aktif." />
      ) : (
        <Card className="border-border shadow-card">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen size={18} className="text-primary" /> Peminjaman Aktif
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Buku</TableHead>
                  <TableHead>Tanggal Pinjam</TableHead>
                  <TableHead>Batas Kembali</TableHead>
                  <TableHead>Terlambat</TableHead>
                  <TableHead>Estimasi Denda</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((g) => {
                  const estDenda = g.loans.reduce(
                    (sum, l) => sum + calcLateFee(l.hari_terlambat_saat_ini),
                    0
                  )
                  return (
                    <TableRow key={g.key}>
                      <TableCell className="font-medium">{g.nama_siswa}</TableCell>
                      <TableCell>{g.kelas_siswa}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          {g.loans.map((l) => (
                            <span key={l.id_peminjaman} className="block text-xs text-muted-foreground">{l.judul_buku}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(g.tgl_peminjaman)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(g.tgl_batas_pengembalian)}</TableCell>
                      <TableCell>
                        {g.maxHariTerlambat > 0 ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle size={12} /> {g.maxHariTerlambat} hari
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {estDenda > 0
                          ? `Rp${estDenda.toLocaleString()}`
                          : <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => openReturn(g)} className="gap-1.5">
                          <CheckCircle size={15} /> Kembalikan
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Return Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={(open) => { if (!open) setShowConfirm(false) }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle ref={dialogTitleRef} tabIndex={-1} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" /> Konfirmasi Pengembalian
            </DialogTitle>
            <DialogDescription>
              Periksa kondisi setiap buku dan denda sebelum menyelesaikan pengembalian.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={15} className="text-muted" /> <strong>Siswa:</strong> {selectedGroup?.nama_siswa} ({selectedGroup?.kelas_siswa})
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={15} className="text-muted" />
              <strong>Pinjam:</strong> {selectedGroup ? formatDate(selectedGroup.tgl_peminjaman) : ""}
              <span className="text-muted-foreground">&rarr;</span>
              <strong>Kembali:</strong> {selectedGroup ? formatDate(selectedGroup.tgl_batas_pengembalian) : ""}
            </div>

            {/* Per-book condition selectors */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kondisi Setiap Buku</p>
              {condEntries.map((entry) => (
                <div key={entry.id_peminjaman} className="flex items-center justify-between rounded-xl border border-border bg-muted/10 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{entry.judul_buku}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{entry.id_peminjaman}</p>
                  </div>
                  <select
                    value={entry.kondisi}
                    onChange={(e) => setCond(entry.id_peminjaman, e.target.value as BookCondition)}
                    className="ml-3 shrink-0 rounded-lg border-2 border-border bg-white px-3 py-1.5 text-sm outline-none focus:border-primary text-foreground"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan (+Rp{FINE_DAMAGE_LIGHT.toLocaleString()})</option>
                    <option value="Rusak Berat">Rusak Berat (+Rp{FINE_DAMAGE_HEAVY.toLocaleString()})</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Fee breakdown */}
            {feeBreakdown && (
              <div className={`rounded-xl border p-4 space-y-2 ${
                feeBreakdown.grandTotal > 0
                  ? "bg-destructive-light/50 border-destructive/30"
                  : "bg-secondary-light/50 border-secondary/30"
              }`}>
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <CircleDollarSign size={16} className={feeBreakdown.grandTotal > 0 ? "text-destructive" : "text-muted"} />
                  Rincian Denda
                </div>
                {feeBreakdown.perBook.map((b) => (
                  <div key={b.id_peminjaman} className="text-xs space-y-0.5 border-b border-border/30 pb-1.5 mb-1.5 last:border-0 last:mb-0 last:pb-0">
                    <p className="font-medium text-foreground">{b.judul_buku}</p>
                    <div className="grid grid-cols-2 gap-1 text-muted-foreground pl-2">
                      <span>Keterlambatan ({b.hari_terlambat} hari):</span>
                      <span className="text-right font-medium">Rp{b.lateFee.toLocaleString()}</span>
                      <span>Kondisi ({b.kondisi}):</span>
                      <span className="text-right font-medium">
                        {b.condFee > 0 ? `Rp${b.condFee.toLocaleString()}` : "Rp0"}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                  <span className="text-sm font-bold">Total Denda</span>
                  <span className={`text-base font-bold ${feeBreakdown.grandTotal > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    Rp{feeBreakdown.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
          {saveError && <p className="text-sm text-destructive font-medium">{saveError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button>
            <Button onClick={confirmReturn} loading={saving}>Konfirmasi Pengembalian</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}