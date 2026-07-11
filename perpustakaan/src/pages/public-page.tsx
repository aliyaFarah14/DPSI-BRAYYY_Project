import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, LogIn, BookOpen, MapPin, Phone, Mail, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmptyState from "@/components/empty-state"
import AlertBanner from "@/components/alert-banner"
import { db } from "@/lib/db"
import type { Buku, TemaBuku } from "@/types"

export default function PublicPage() {
  const navigate = useNavigate()
  const [buku, setBuku] = useState<Buku[]>([])
  const [keyword, setKeyword] = useState("")
  const [category, setCategory] = useState("Semua")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      setBuku(db.getBuku().filter((b) => b.status_buku !== "Tidak Aktif"))
    } catch {
      setError("Gagal memuat data buku.")
    } finally { setLoading(false) }
  }, [])

  const filtered = useMemo(() => {
    let result = buku
    // Keyword filter
    const k = keyword.toLowerCase().trim()
    if (k) {
      result = result.filter(
        (b) => b.judul_buku.toLowerCase().includes(k) || b.penulis.toLowerCase().includes(k)
      )
    }
    // Category filter
    if (category === "Semua") {
      // no filter
    } else if (category.startsWith("Kelas ")) {
      const kelasNum = parseInt(category.replace("Kelas ", ""), 10)
      result = result.filter((b) => b.tingkatKelas === kelasNum)
    } else if (category === "Cerita & Dongeng") {
      result = result.filter((b) => b.tema_buku === "Cerita & Dongeng")
    } else if (category === "Lainnya") {
      result = result.filter((b) => b.tema_buku === "Lainnya" || (!b.tingkatKelas && !b.tema_buku))
    }
    return result
  }, [buku, keyword, category])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light overflow-hidden">
              <img src="/SDNTamanan.jpeg" alt="Logo SD Negeri Tamanan" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">Perpustakaan SD Negeri Tamanan</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Sistem Informasi Perpustakaan</p>
            </div>
          </div>
          <Button onClick={() => navigate("/login")} variant="outline" size="sm" className="gap-2">
            <LogIn size={15} /> Login Guru
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light/50">
            <BookOpen size={28} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Ketersediaan &amp; Lokasi Buku</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Cari buku berdasarkan judul atau tema
          </p>
        </div>

        <div className="relative mx-auto mb-8 max-w-xl">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari judul atau tema buku..."
            className="h-12 pl-11 pr-4 text-base rounded-2xl border-2 border-border bg-white shadow-card transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {error && <AlertBanner message={error} onRetry={() => window.location.reload()} className="max-w-xl mx-auto mb-6" />}

        {/* Category Filter Bar */}
        <div className="mx-auto mb-6 max-w-3xl overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {["Semua", "Kelas 1", "Kelas 2", "Kelas 3", "Kelas 4", "Kelas 5", "Kelas 6", "Cerita & Dongeng", "Lainnya"].map((cat) => {
              const isSelected = category === cat
              let btnClass = ""
              if (cat === "Semua") {
                btnClass = isSelected
                  ? "bg-[#003049] text-white shadow-md"
                  : "bg-[#003049]/80 text-white hover:bg-[#003049]"
              } else if (cat.startsWith("Kelas ")) {
                btnClass = isSelected
                  ? "bg-[#669BBC] text-white shadow-md"
                  : "bg-[#E1EEF3] text-[#669BBC] hover:bg-[#DCE8ED]"
              } else {
                btnClass = isSelected
                  ? "bg-[#CA8A04] text-white shadow-md"
                  : "bg-[#FDF1D9] text-[#CA8A04] hover:bg-[#F5E6B8]"
              }
              return (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${btnClass}`}>
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {!error && filtered.length === 0 ? (
          <EmptyState icon={BookOpen} message={keyword ? "Buku tidak ditemukan. Coba kata kunci lain." : "Belum ada data buku di katalog."} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {keyword ? `Menampilkan ${filtered.length} hasil` : `${filtered.length} buku tersedia`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((b) => {

                return (
                  <div key={b.id_buku}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                    {/* Cover area */}
                    <div className="relative aspect-[3/4] w-full bg-primary-light/30">
                      {b.coverImageUrl ? (
                        <img src={b.coverImageUrl} alt={b.judul_buku}
                          className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen size={24} className="text-primary" />
                        </div>
                      )}
                      <span className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-medium text-foreground border border-border/40 shadow-xs">
                        {b.lokasi_rak}
                      </span>
                    </div>

                    {/* Info area */}
                    <div className="flex flex-1 flex-col gap-1.5 p-3">
                      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">{b.judul_buku}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{b.penulis}</p>
                      {b.tingkatKelas ? (
                        <span className="self-start rounded-md bg-[#E1EEF3] px-2 py-0.5 text-[10px] font-medium text-[#669BBC]">Kelas {b.tingkatKelas}</span>
                      ) : b.tema_buku ? (
                        <span className="self-start rounded-md bg-[#FDF1D9] px-2 py-0.5 text-[10px] font-medium text-[#CA8A04]">{b.tema_buku}</span>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between pt-1.5 border-t border-border/40">
                        <Badge variant={b.stok > 0 ? "Tersedia" : "Stok Habis"}>
                          {b.stok > 0 ? "Tersedia" : "Stok Habis"}
                        </Badge>
                        <span className="text-xs text-muted-foreground/70 font-medium">
                          Stok: {b.stok}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      <footer>
        {/* Footer Atas */}
        <div className="bg-[#003049] text-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Kolom 1: Identitas */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 overflow-hidden">
                    <img src="/SDNTamanan.jpeg" alt="Logo SD Negeri Tamanan" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-tight">Perpustakaan SD Negeri Tamanan</h3>
                    <p className="text-[10px] text-white/60 leading-tight">Sistem Informasi Perpustakaan</p>
                  </div>
                </div>
                <p className="text-xs text-white/80 italic leading-relaxed">
                  "Membaca Membuka Jendela Dunia"
                </p>
              </div>

              {/* Kolom 2: Kontak & Lokasi */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold tracking-wide">Kontak &amp; Lokasi</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-white/80">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-white/60" />
                    <span>Jalan Pasopati No. 21 Kauman, Tamanan, Banguntapan, Kec. Banguntapan, Kab. Bantul, Prov. D.I. Yogyakarta</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/80">
                    <Phone size={14} className="shrink-0 text-white/60" />
                    <span>(0274) 4281847</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-white/80">
                    <Mail size={14} className="shrink-0 text-white/60" />
                    <span>sdtamanan@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Kolom 3: Jam Operasional */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold tracking-wide">Jam Operasional</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-white/80">
                    <Clock size={14} className="shrink-0 mt-0.5 text-white/60" />
                    <div>
                      <p>Senin–Kamis: 07.00–15.00 WIB</p>
                      <p className="mt-1">Jumat: 07.00–14.00 WIB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bawah */}
        <div className="border-t border-white/10 bg-[#003049]">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <p className="text-center text-[11px] text-white/40">
              &copy; {new Date().getFullYear()} SD Negeri Tamanan. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
