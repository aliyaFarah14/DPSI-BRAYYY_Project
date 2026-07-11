import { useState, useEffect, useRef } from "react"
import { Plus, Pencil, Trash2, BookOpen, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import EmptyState from "@/components/empty-state"
import { db } from "@/lib/db"
import { sanitize, validateRack, generateId } from "@/lib/utils"
import type { Buku, TemaBuku } from "@/types"

interface BookFormData {
  id_buku: string
  judul_buku: string
  penulis: string
  penerbit: string
  tema_buku: string
  tingkatKelas: string
  lokasi_rak: string
  stok: string
  status_buku: "Aktif" | "Tidak Aktif"
  coverImageUrl: string | undefined
}

const initialForm: BookFormData = {
  id_buku: "",
  judul_buku: "",
  penulis: "",
  penerbit: "",
  tema_buku: "",
  tingkatKelas: "",
  lokasi_rak: "",
  stok: "1",
  status_buku: "Aktif",
  coverImageUrl: undefined,
}

export default function BookManagement() {
  const [buku, setBuku] = useState<Buku[]>([])
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Buku | null>(null)
  const [form, setForm] = useState<BookFormData>(initialForm)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [savingDelete, setSavingDelete] = useState(false)
  const dialogTitleRef = useRef<HTMLHeadingElement>(null)

  const loadData = () => { setBuku(db.getBuku()); setLoading(false) }
  useEffect(loadData, [])

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    const b = sanitize(form.judul_buku)
    if (!b) errs.judul_buku = "Judul buku wajib diisi."
    if (!sanitize(form.penulis)) errs.penulis = "Penulis wajib diisi."
    if (!sanitize(form.penerbit)) errs.penerbit = "Penerbit wajib diisi."
    if (!validateRack(form.lokasi_rak)) errs.lokasi_rak = "Format rak: huruf diikuti angka (contoh: A1, RB3)."
    const stok = parseInt(form.stok, 10)
    if (isNaN(stok) || stok < 0) errs.stok = "Stok harus angka >= 0."
    if (!editing) {
      const exist = db.getBuku().find((x) => x.id_buku === form.id_buku.trim())
      if (exist) errs.id_buku = "ID Buku sudah digunakan."
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const openAdd = () => {
    setEditing(false)
    setForm({ ...initialForm, id_buku: generateId("BK") })
    setFieldErrors({})
    setSaveError(null)
    setSuccessMsg(null)
    setShowModal(true)
    setTimeout(() => dialogTitleRef.current?.focus(), 100)
  }

  const validTemaValues = ["Cerita & Dongeng", "Lainnya"]

  const openEdit = (b: Buku) => {
    setEditing(true)
    const tema = b.tema_buku && validTemaValues.includes(b.tema_buku) ? b.tema_buku : ""
    setForm({
      id_buku: b.id_buku,
      judul_buku: b.judul_buku,
      penulis: b.penulis,
      penerbit: b.penerbit,
      tema_buku: tema,
      tingkatKelas: b.tingkatKelas ? String(b.tingkatKelas) : "",
      lokasi_rak: b.lokasi_rak,
      stok: String(b.stok),
      status_buku: b.status_buku,
      coverImageUrl: b.coverImageUrl,
    })
    setFieldErrors({})
    setSaveError(null)
    setSuccessMsg(null)
    setShowModal(true)
    setTimeout(() => dialogTitleRef.current?.focus(), 100)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)
    if (!validate()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    try {
      const payload: Buku = {
        id_buku: form.id_buku.trim(),
        judul_buku: sanitize(form.judul_buku)!,
        penulis: sanitize(form.penulis)!,
        penerbit: sanitize(form.penerbit)!,
        tema_buku: (validTemaValues.includes(form.tema_buku) ? form.tema_buku : null) as TemaBuku | null,
        tingkatKelas: form.tingkatKelas ? parseInt(form.tingkatKelas, 10) : null,
        lokasi_rak: form.lokasi_rak.trim().toUpperCase(),
        stok: parseInt(form.stok, 10),
        status_buku: form.status_buku,
        coverImageUrl: form.coverImageUrl,
      }

      const existing = db.getBuku()
      if (editing) {
        const idx = existing.findIndex((x) => x.id_buku === payload.id_buku)
        if (idx >= 0) existing[idx] = payload
        db.setBuku(existing)
      } else {
        db.setBuku([...existing, payload])
      }
      loadData()
      setShowModal(false)
      setSuccessMsg(editing ? "Buku berhasil diperbarui." : "Buku berhasil ditambahkan.")
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch {
      setSaveError("Gagal menyimpan data. Coba lagi.")
    } finally { setSaving(false) }
  }

  const openDelete = (b: Buku) => {
    setDeleteError(null)
    setSavingDelete(false)
    setDeleteTarget(b)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleteError(null)
    const peminjaman = db.getPeminjaman().filter((p) => p.status === "Dipinjam")
    if (peminjaman.some((p) => p.items.some((i) => i.id_buku === deleteTarget.id_buku))) {
      setDeleteError("Buku sedang dipinjam dan tidak dapat dihapus.")
      return
    }
    setSavingDelete(true)
    await new Promise((r) => setTimeout(r, 400))
    try {
      db.setBuku(db.getBuku().filter((x) => x.id_buku !== deleteTarget.id_buku))
      loadData()
      setDeleteTarget(null)
      setSuccessMsg("Buku berhasil dihapus.")
      setTimeout(() => setSuccessMsg(null), 3000)
    } catch {
      setDeleteError("Gagal menghapus buku. Coba lagi.")
    } finally { setSavingDelete(false) }
  }

  const closeModal = () => {
    setShowModal(false)
    setSaveError(null)
  }

  if (loading) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Manajemen Buku</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Kelola data buku perpustakaan</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={18} /> Tambah Buku</Button>
      </div>

      {successMsg && (
        <div className="rounded-xl bg-secondary-light/80 border border-secondary/30 px-4 py-3 text-sm text-primary font-medium shadow-sm">
          {successMsg}
        </div>
      )}

      {buku.length === 0 ? (
        <EmptyState icon={BookOpen} message="Belum ada buku." actionLabel="Tambah Buku" onAction={openAdd} />
      ) : (
        <Card className="overflow-hidden border-border shadow-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Buku</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Rak</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buku.map((b) => (
                  <TableRow key={b.id_buku}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{b.id_buku}</TableCell>
                    <TableCell className="font-medium">{b.judul_buku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.penulis}</TableCell>
                    <TableCell><code className="text-xs bg-muted/30 rounded px-1.5 py-0.5 font-mono text-primary">{b.lokasi_rak}</code></TableCell>
                    <TableCell>{b.stok}</TableCell>
                    <TableCell><Badge variant={b.status_buku === "Aktif" ? "Tersedia" : "Stok Habis"}>{b.status_buku}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil size={15} /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openDelete(b)}><Trash2 size={15} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!open) closeModal() }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle ref={dialogTitleRef} tabIndex={-1}>{editing ? "Edit Buku" : "Tambah Buku Baru"}</DialogTitle>
            <DialogDescription>{editing ? "Ubah data buku yang sudah ada." : "Isi data buku baru untuk ditambahkan."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5">
            {saveError && <p className="text-sm text-destructive font-medium">{saveError}</p>}

            {/* Image + ID + Judul (side by side) */}
            <div className="flex gap-5">
              <div className="shrink-0">
                <Label>Sampul Buku</Label>
                <p className="text-[11px] text-muted-foreground mb-2">Opsional</p>
                <ImageUpload
                  value={form.coverImageUrl}
                  onChange={(base64) => setForm({ ...form, coverImageUrl: base64 })}
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 min-w-0">
                <div className="space-y-2">
                  <div className="text-[11px] invisible pointer-events-none select-none mb-2">&nbsp;</div>
                  <Label htmlFor="id_buku">ID Buku <span className="text-destructive">*</span></Label>
                  <Input id="id_buku" value={form.id_buku} onChange={(e) => setForm({ ...form, id_buku: e.target.value })}
                    disabled={editing}
                    className={fieldErrors.id_buku ? "border-destructive ring-destructive/20" : ""} />
                  {fieldErrors.id_buku && <p className="text-xs text-destructive font-medium">{fieldErrors.id_buku}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Buku <span className="text-destructive">*</span></Label>
                  <Input id="judul" value={form.judul_buku} onChange={(e) => setForm({ ...form, judul_buku: e.target.value })}
                    className={fieldErrors.judul_buku ? "border-destructive ring-destructive/20" : ""} />
                  {fieldErrors.judul_buku && <p className="text-xs text-destructive font-medium">{fieldErrors.judul_buku}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="tema">Tema</Label>
                    <p className="text-[11px] text-muted-foreground -mt-1">Opsional</p>
                    <select id="tema" value={form.tema_buku} onChange={(e) => setForm({ ...form, tema_buku: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">—</option>
                      <option value="Cerita & Dongeng">Cerita & Dongeng</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tingkatKelas">Tingkat Kelas</Label>
                    <p className="text-[11px] text-muted-foreground -mt-1">Opsional</p>
                    <select id="tingkatKelas" value={form.tingkatKelas} onChange={(e) => setForm({ ...form, tingkatKelas: e.target.value })}
                      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="">—</option>
                      {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>Kelas {n}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Penulis + Penerbit */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="penulis">Penulis <span className="text-destructive">*</span></Label>
                <Input id="penulis" value={form.penulis} onChange={(e) => setForm({ ...form, penulis: e.target.value })}
                  className={fieldErrors.penulis ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.penulis && <p className="text-xs text-destructive font-medium">{fieldErrors.penulis}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="penerbit">Penerbit <span className="text-destructive">*</span></Label>
                <Input id="penerbit" value={form.penerbit} onChange={(e) => setForm({ ...form, penerbit: e.target.value })}
                  className={fieldErrors.penerbit ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.penerbit && <p className="text-xs text-destructive font-medium">{fieldErrors.penerbit}</p>}
              </div>
            </div>

            {/* Rak + Stok */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rak">Lokasi Rak <span className="text-destructive">*</span></Label>
                <Input id="rak" value={form.lokasi_rak} onChange={(e) => setForm({ ...form, lokasi_rak: e.target.value })}
                  placeholder="Contoh: A1, RB3"
                  className={fieldErrors.lokasi_rak ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.lokasi_rak && <p className="text-xs text-destructive font-medium">{fieldErrors.lokasi_rak}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stok">Stok <span className="text-destructive">*</span></Label>
                <Input id="stok" type="number" min="0" value={form.stok} onChange={(e) => setForm({ ...form, stok: e.target.value })}
                  className={fieldErrors.stok ? "border-destructive ring-destructive/20" : ""} />
                {fieldErrors.stok && <p className="text-xs text-destructive font-medium">{fieldErrors.stok}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <RadioGroup value={form.status_buku} onValueChange={(v) => setForm({ ...form, status_buku: v as "Aktif" | "Tidak Aktif" })}
                className="flex gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Aktif" id="status_aktif" />
                  <Label htmlFor="status_aktif" className="text-sm font-normal">Aktif</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Tidak Aktif" id="status_nonaktif" />
                  <Label htmlFor="status_nonaktif" className="text-sm font-normal">Tidak Aktif</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
              <Button type="submit" loading={saving}>{editing ? "Simpan Perubahan" : "Tambah Buku"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={18} /> Hapus Buku
            </DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deleteTarget?.judul_buku}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <div className="flex items-start gap-2.5 rounded-xl bg-destructive-light/80 border border-destructive/30 px-4 py-3 text-sm text-destructive-dark font-medium">
              <Info size={16} className="shrink-0 mt-0.5" /> {deleteError}
            </div>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="destructive" onClick={confirmDelete} loading={savingDelete}>Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
