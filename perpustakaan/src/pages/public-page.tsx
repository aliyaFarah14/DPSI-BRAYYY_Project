import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, LogIn, BookOpen, Library } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EmptyState from "@/components/empty-state"
import AlertBanner from "@/components/alert-banner"
import { db } from "@/lib/db"
import type { Buku } from "@/types"

export default function PublicPage() {
  const navigate = useNavigate()
  const [buku, setBuku] = useState<Buku[]>([])
  const [keyword, setKeyword] = useState("")
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
    const k = keyword.toLowerCase().trim()
    if (!k) return buku
    return buku.filter(
      (b) => b.judul_buku.toLowerCase().includes(k) || b.tema_buku.toLowerCase().includes(k)
    )
  }, [buku, keyword])

  if (loading) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 h-16">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-light">
              <Library size={18} className="text-primary" />
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

        {!error && filtered.length === 0 ? (
          <EmptyState icon={BookOpen} message={keyword ? "Buku tidak ditemukan. Coba kata kunci lain." : "Belum ada data buku di katalog."} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {keyword ? `Menampilkan ${filtered.length} hasil` : `${filtered.length} buku tersedia`}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {filtered.map((b) => {

                return (
                  <div key={b.id_buku}
                    className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1">
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
                      <span className="absolute right-2 top-2 rounded-lg bg-card/80 px-2 py-0.5 text-[10px] font-medium text-foreground border border-border shadow-sm">
                        {b.lokasi_rak}
                      </span>
                    </div>

                    {/* Info area */}
                    <div className="flex flex-1 flex-col gap-1.5 p-3">
                      <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">{b.judul_buku}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{b.penulis}</p>
                      <span className="self-start rounded-md bg-secondary-light/60 px-2 py-0.5 text-[10px] font-medium text-secondary">{b.tema_buku}</span>
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

      <footer className="border-t border-border bg-card/50 py-6 mt-12">
        <p className="text-center text-[11px] text-muted-foreground/60">
          &copy; {new Date().getFullYear()} Perpustakaan SD Negeri Tamanan
        </p>
      </footer>
    </div>
  )
}
