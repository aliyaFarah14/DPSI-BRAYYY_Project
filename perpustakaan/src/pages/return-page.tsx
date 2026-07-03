import { useState, useEffect, useRef } from "react"
import { BookOpen, CalendarDays, User, CheckCircle, CircleDollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import EmptyState from "@/components/empty-state"
import { db } from "@/lib/db"
import { todayStr, formatDate, calcLateDays, calcFineLate, calcFineCondition, generateId } from "@/lib/utils"
import { FINE_PER_DAY, FINE_DAMAGE_LIGHT, FINE_DAMAGE_HEAVY } from "@/lib/constants"
import type { Peminjaman, Pengembalian } from "@/types"

export default function ReturnPage() {
  const [active, setActive] = useState<Peminjaman[]>([])
  const [selected, setSelected] = useState<Peminjaman | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [condition, setCondition] = useState<"Baik" | "Rusak Ringan" | "Rusak Berat">("Baik")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const dialogTitleRef = useRef<HTMLHeadingElement>(null)

  const loadData = () => {
    setActive(db.getPeminjaman().filter((p) => p.status === "Dipinjam"))
    setLoading(false)
  }
  useEffect(loadData, [])

  const openReturn = (p: Peminjaman) => {
    setSelected(p)
    setCondition("Baik")
    setSaveError(null)
    setShowModal(true)
    setTimeout(() => dialogTitleRef.current?.focus(), 100)
  }

  const confirmReturn = async () => {
    if (!selected) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    try {
      const tglKembali = todayStr()
      const lateDays = calcLateDays(selected.tanggal_pinjam, tglKembali)
      const fineLate = calcFineLate(lateDays)
      const fineCondition = calcFineCondition(condition)
      const fineTotal = fineLate + fineCondition

      const ret: Pengembalian = {
        id_pengembalian: generateId("KM"),
        id_peminjaman: selected.id_peminjaman,
        items: selected.items,
        nama_siswa: selected.nama_siswa,
        kelas_siswa: selected.kelas_siswa,
        nama_guru: selected.nama_guru,
        tanggal_pinjam: selected.tanggal_pinjam,
        tanggal_kembali: tglKembali,
        kondisi_buku: condition,
        fineLateAmount: fineLate,
        fineConditionAmount: fineCondition,
        fineTotal,
        catatan: "",
      }

      const allRet = db.getPengembalian()
      allRet.push(ret)
      db.setPengembalian(allRet)

      const allPj = db.getPeminjaman()
      const idx = allPj.findIndex((p) => p.id_peminjaman === selected.id_peminjaman)
      if (idx >= 0) allPj[idx].status = "Dikembalikan"
      db.setPeminjaman(allPj)

      const allBuku = db.getBuku()
      for (const item of selected.items) {
        const bi = allBuku.findIndex((b) => b.id_buku === item.id_buku)
        if (bi >= 0) allBuku[bi] = { ...allBuku[bi], stok: allBuku[bi].stok + 1 }
      }
      db.setBuku(allBuku)

      setShowModal(false)
      setSuccessMsg("Pengembalian berhasil dicatat.")
      setTimeout(() => setSuccessMsg(null), 3000)
      loadData()
    } catch {
      setSaveError("Gagal menyimpan data pengembalian. Coba lagi.")
    } finally { setSaving(false) }
  }

  if (loading) return null

  const lateDays = selected ? calcLateDays(selected.tanggal_pinjam, todayStr()) : 0
  const fineLate = calcFineLate(lateDays)
  const fineCondition = calcFineCondition(condition)
  const fineTotal = fineLate + fineCondition

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

      {active.length === 0 ? (
        <EmptyState icon={BookOpen} message="Tidak ada peminjaman aktif." />
      ) : (
        <Card className="overflow-hidden border-border shadow-card">
          <CardHeader className="pb-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen size={18} className="text-primary" /> Peminjaman Aktif
            </CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Buku</TableHead>
                  <TableHead>Tgl Pinjam</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {active.map((p) => (
                  <TableRow key={p.id_peminjaman}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.id_peminjaman}</TableCell>
                    <TableCell className="font-medium">{p.nama_siswa}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        {p.items.map((item) => (
                          <span key={item.id_buku} className="block text-xs text-muted-foreground">{item.judul_buku}</span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(p.tanggal_pinjam)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => openReturn(p)} className="gap-1.5">
                        <CheckCircle size={15} /> Kembalikan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Return Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!open) setShowModal(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle ref={dialogTitleRef} tabIndex={-1} className="flex items-center gap-2">
              <CheckCircle size={18} className="text-primary" /> Konfirmasi Pengembalian
            </DialogTitle>
            <DialogDescription>
              Periksa kondisi buku dan denda sebelum menyelesaikan pengembalian.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={15} className="text-muted" /> <strong>Siswa:</strong> {selected?.nama_siswa}
            </div>
            <div className="flex items-start gap-2 text-sm">
              <BookOpen size={15} className="text-muted shrink-0 mt-0.5" />
              <div>
                <strong>Buku:</strong>
                <ul className="mt-1 space-y-1">
                  {selected?.items.map((s) => (
                    <li key={s.id_buku} className="text-muted-foreground text-xs">- {s.judul_buku} ({s.id_buku})</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={15} className="text-muted" />
              <strong>Tanggal Pinjam:</strong> {selected ? formatDate(selected.tanggal_pinjam) : ""}
              <span className="text-muted-foreground">&rarr;</span>
              <strong>Kembali:</strong> {formatDate(todayStr())}
            </div>

            {/* Kondisi Buku */}
            <div className="space-y-2">
              <Label>Kondisi Buku <span className="text-destructive">*</span></Label>
              <RadioGroup value={condition} onValueChange={(v) => setCondition(v as typeof condition)}
                className="flex flex-col gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Baik" id="kond_baik" />
                  <Label htmlFor="kond_baik" className="text-sm font-normal">Baik</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Rusak Ringan" id="kond_ringan" />
                  <Label htmlFor="kond_ringan" className="text-sm font-normal">Rusak Ringan (denda Rp{FINE_DAMAGE_LIGHT.toLocaleString()})</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Rusak Berat" id="kond_berat" />
                  <Label htmlFor="kond_berat" className="text-sm font-normal">Rusak Berat (denda Rp{FINE_DAMAGE_HEAVY.toLocaleString()})</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Fine Panel */}
            <div className={`rounded-xl border p-4 space-y-2 ${
              fineTotal > 0
                ? "bg-destructive-light/50 border-destructive/30"
                : "bg-secondary-light/50 border-secondary/30"
            }`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <CircleDollarSign size={16} className={fineTotal > 0 ? "text-destructive" : "text-muted"} />
                Rincian Denda
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-muted-foreground">Keterlambatan ({lateDays} hari x Rp{FINE_PER_DAY.toLocaleString()}):</span>
                <span className="text-right font-medium">Rp{fineLate.toLocaleString()}</span>
                <span className="text-muted-foreground">Kondisi buku ({condition}):</span>
                <span className="text-right font-medium">Rp{fineCondition.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                <span className="text-sm font-bold">Total Denda</span>
                <span className={`text-base font-bold ${fineTotal > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  Rp{fineTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {saveError && <p className="text-sm text-destructive font-medium">{saveError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Batal</Button>
            <Button onClick={confirmReturn} loading={saving}>Konfirmasi Pengembalian</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
