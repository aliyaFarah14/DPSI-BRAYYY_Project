import { useState, useEffect, useMemo, useRef } from "react"
import { Search, BookOpen, Bookmark, User, CalendarDays, Info, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import EmptyState from "@/components/empty-state"
import { db } from "@/lib/db"
import { sanitize, todayStr, generateId, formatDate } from "@/lib/utils"
import type { Buku, Peminjaman, PeminjamanItem } from "@/types"

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00")
  d.setDate(d.getDate() + days)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function isDateAfter(dateStr: string, afterDateStr: string): boolean {
  return new Date(dateStr + "T00:00:00") > new Date(afterDateStr + "T00:00:00")
}

export default function BorrowingPage() {
  const [buku, setBuku] = useState<Buku[]>([])
  const [, setPeminjaman] = useState<Peminjaman[]>([])
  const [keyword, setKeyword] = useState("")
  const [selected, setSelected] = useState<PeminjamanItem[]>([])
  const [siswa, setSiswa] = useState("")
  const [kelas, setKelas] = useState("")
  const [tanggalKembali, setTanggalKembali] = useState(addDays(todayStr(), 7))
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState(false)
  const dialogTitleRef = useRef<HTMLHeadingElement>(null)

  const loadData = () => {
    const allBuku = db.getBuku().filter((b) => b.status_buku === "Aktif" && b.stok > 0)
    setBuku(allBuku)
    setPeminjaman(db.getPeminjaman())
    setLoading(false)
  }
  useEffect(loadData, [])

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase().trim()
    if (!k) return buku
    return buku.filter(
      (b) => b.judul_buku.toLowerCase().includes(k) || b.id_buku.toLowerCase().includes(k)
    )
  }, [buku, keyword])

  const toggleSelect = (b: Buku) => {
    setFieldErrors({})
    if (selected.some((s) => s.id_buku === b.id_buku)) {
      setSelected(selected.filter((s) => s.id_buku !== b.id_buku))
    } else {
      setSelected([...selected, { id_buku: b.id_buku, judul_buku: b.judul_buku, lokasi_rak: b.lokasi_rak }])
    }
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (selected.length === 0) errs.buku = "Pilih minimal satu buku."
    if (!sanitize(siswa)) errs.siswa = "Nama siswa wajib diisi."
    if (!kelas) errs.kelas = "Kelas siswa wajib dipilih."
    if (!tanggalKembali) errs.tanggalKembali = "Tanggal kembali wajib diisi."
    if (tanggalKembali && !isDateAfter(tanggalKembali, todayStr())) {
      errs.tanggalKembali = "Tanggal kembali harus setelah tanggal pinjam."
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const formValid = selected.length > 0 && sanitize(siswa) && kelas && tanggalKembali && isDateAfter(tanggalKembali, todayStr())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    if (!validate()) return
    setShowConfirm(true)
    setTimeout(() => dialogTitleRef.current?.focus(), 100)
  }

  const confirmBorrow = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    try {
      const id = generateId("PJ")
      const record: Peminjaman = {
        id_peminjaman: id,
        items: selected,
        nama_siswa: sanitize(siswa)!,
        kelas_siswa: kelas,
        nama_guru: "-",
        tanggal_pinjam: todayStr(),
        tanggal_kembali: tanggalKembali,
        catatan: sanitize(notes) || "",
        status: "Dipinjam",
      }

      const allPj = db.getPeminjaman()
      allPj.push(record)
      db.setPeminjaman(allPj)

      const allBuku = db.getBuku()
      for (const item of selected) {
        const idx = allBuku.findIndex((b) => b.id_buku === item.id_buku)
        if (idx >= 0) {
          allBuku[idx] = { ...allBuku[idx], stok: Math.max(0, allBuku[idx].stok - 1) }
        }
      }
      db.setBuku(allBuku)

      setShowConfirm(false)
      setSelected([])
      setSiswa("")
      setKelas("")
      setNotes("")
      setTanggalKembali(addDays(todayStr(), 7))
      setSuccessMsg("Peminjaman berhasil dicatat.")
      setTimeout(() => setSuccessMsg(null), 3000)
      loadData()
    } catch {
      setSaveError("Gagal menyimpan data peminjaman. Coba lagi.")
    } finally { setSaving(false) }
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Peminjaman Buku</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Catat peminjaman buku oleh siswa</p>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-secondary-light/80 border border-secondary/30 px-4 py-3 text-sm text-primary font-medium shadow-sm">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Book selection */}
        <Card className="lg:col-span-2 border-border shadow-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen size={18} className="text-primary" /> Pilih Buku
              </CardTitle>
              <span className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-2 py-1">
                Terpilih: {selected.length}
              </span>
            </div>
            <div className="relative mt-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input value={keyword} onChange={(e) => setKeyword(e.target.value)}
                placeholder="Cari judul atau ID buku..."
                className="h-9 pl-9 text-sm rounded-xl" />
            </div>
            {fieldErrors.buku && <p className="text-xs text-destructive font-medium mt-2">{fieldErrors.buku}</p>}
          </CardHeader>
          <CardContent className="pt-3">
            {filtered.length === 0 ? (
              <EmptyState icon={BookOpen} message={keyword ? "Buku tidak ditemukan." : "Tidak ada buku tersedia untuk dipinjam."} compact />
            ) : (
              <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-1">
                {filtered.map((b) => {
                  const isSelected = selected.some((s) => s.id_buku === b.id_buku)
                  return (
                    <button key={b.id_buku} type="button" onClick={() => toggleSelect(b)}
                      className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-primary bg-primary-light shadow-sm"
                          : "border-border bg-white hover:border-primary/30 hover:bg-primary-light/30"
                      }`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{b.judul_buku}</p>
                        <p className="text-[11px] text-muted-foreground">{b.id_buku} &middot; {b.penulis}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-3 shrink-0">
                        <span className="text-[11px] text-muted-foreground bg-muted/30 rounded-md px-2 py-0.5">{b.lokasi_rak}</span>
                        <Badge variant={isSelected ? "Tersedia" : "default"}>{isSelected ? "Dipilih" : `Stok: ${b.stok}`}</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="border-border shadow-card">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bookmark size={18} className="text-primary" /> Data Peminjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {saveError && <p className="text-sm text-destructive font-medium">{saveError}</p>}

              {/* Selected book summary */}
              {selected.length > 0 ? (
                <div className="rounded-xl border border-primary/30 bg-primary-light/30 px-4 py-3 space-y-2">
                  <p className="text-[11px] font-semibold text-primary uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen size={13} /> Buku Dipilih
                  </p>
                  {selected.map((s) => (
                    <div key={s.id_buku} className="flex items-start gap-2">
                      <BookOpen size={14} className="text-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{s.judul_buku}</p>
                        <p className="text-[11px] text-muted-foreground">{s.id_buku} &middot; {s.lokasi_rak}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground/60 flex items-center gap-2">
                    <BookOpen size={14} className="text-muted/40" />
                    Pilih buku terlebih dahulu
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="siswa">
                  <User size={14} className="inline mr-1.5 text-muted" />Nama Siswa <span className="text-destructive">*</span>
                </Label>
                <Input id="siswa" value={siswa} onChange={(e) => setSiswa(e.target.value)}
                  placeholder="Nama lengkap siswa"
                  className={fieldErrors.siswa ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.siswa && <p className="text-xs text-destructive font-medium">{fieldErrors.siswa}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kelas">
                  <GraduationCap size={14} className="inline mr-1.5 text-muted" />Kelas Siswa <span className="text-destructive">*</span>
                </Label>
                <Input id="kelas" value={kelas} onChange={(e) => { setKelas(e.target.value); setFieldErrors((prev) => ({ ...prev, kelas: "" })) }}
                  placeholder="Contoh: 4A, 5B, 6C"
                  className={fieldErrors.kelas ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.kelas && <p className="text-xs text-destructive font-medium">{fieldErrors.kelas}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">
                  <CalendarDays size={14} className="inline mr-1.5 text-muted" />Tanggal Pinjam
                </Label>
                <Input id="date" type="date" value={todayStr()} disabled className="bg-muted/20 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tgl_kembali">
                  <CalendarDays size={14} className="inline mr-1.5 text-muted" />Tanggal Kembali <span className="text-destructive">*</span>
                </Label>
                <Input id="tgl_kembali" type="date" value={tanggalKembali}
                  onChange={(e) => { setTanggalKembali(e.target.value); setFieldErrors((prev) => ({ ...prev, tanggalKembali: "" })) }}
                  className={fieldErrors.tanggalKembali ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.tanggalKembali && <p className="text-xs text-destructive font-medium">{fieldErrors.tanggalKembali}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Catatan tambahan (opsional)"
                  className="flex min-h-[80px] w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-150" />
              </div>

              <Button type="submit" className="w-full h-11 gap-2" disabled={!formValid}>
                <Bookmark size={16} /> Simpan Peminjaman
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={(open) => { if (!open) setShowConfirm(false) }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle ref={dialogTitleRef} tabIndex={-1} className="flex items-center gap-2">
              <Info size={18} className="text-primary" /> Konfirmasi Peminjaman
            </DialogTitle>
            <DialogDescription>
              Pastikan data peminjaman sudah benar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <User size={15} className="text-muted" /> <strong>Siswa:</strong> {sanitize(siswa)} ({kelas})
            </div>
            <div className="flex items-start gap-2 text-sm">
              <BookOpen size={15} className="text-muted shrink-0 mt-0.5" />
              <div>
                <strong>Buku dipinjam ({selected.length}):</strong>
                <ul className="mt-1 space-y-1">
                  {selected.map((s) => (
                    <li key={s.id_buku} className="text-muted-foreground text-xs">- {s.judul_buku} ({s.id_buku})</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={15} className="text-muted" /> <strong>Pinjam:</strong> {formatDate(todayStr())}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays size={15} className="text-muted" /> <strong>Batas Kembali:</strong> {formatDate(tanggalKembali)}
            </div>
          </div>
          {saveError && <p className="text-sm text-destructive font-medium">{saveError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Batal</Button>
            <Button onClick={confirmBorrow} loading={saving}>Konfirmasi & Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
