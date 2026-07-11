import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BookOpen, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { login, isAuthenticated } from "@/lib/auth"

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const timeoutMsg = searchParams.get("timeout") === "1"
    ? "Sesi Anda telah berakhir. Silakan masuk kembali."
    : null

  if (isAuthenticated()) {
    navigate("/buku", { replace: true })
    return null
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!username.trim()) errs.username = "Username wajib diisi."
    if (!password) errs.password = "Password wajib diisi."
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validate()) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    try {
      const result = login(username.trim(), password)
      if (result.success) {
        navigate("/buku", { replace: true })
      } else {
        setError(result.error || "Login gagal.")
      }
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi.")
    } finally { setLoading(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-light/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary-light/30 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm shadow-elevated border-border overflow-hidden">
        <div className="h-1.5 bg-primary" />

        <CardHeader className="items-center pt-8 pb-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light/50 overflow-hidden">
            <img src="/SDNTamanan.jpeg" alt="Logo SD Negeri Tamanan" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Perpustakaan SDN Tamanan</h1>
          <p className="text-sm text-muted-foreground">Masuk untuk mengelola sistem perpustakaan</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {timeoutMsg && (
              <div className="flex items-center gap-2.5 rounded-xl border border-secondary/40 bg-secondary-light/80 px-4 py-3 text-sm text-primary">
                <AlertCircle size={16} className="shrink-0" /> {timeoutMsg}
              </div>
            )}
            {error && (
              <div className="rounded-xl bg-destructive-light/80 border border-destructive/30 px-4 py-3 text-sm text-destructive-dark font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className={fieldErrors.username ? "border-destructive ring-destructive/20" : ""} />
              {fieldErrors.username && <p className="text-xs text-destructive font-medium">{fieldErrors.username}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className={fieldErrors.password ? "border-destructive ring-destructive/20" : ""} />
              {fieldErrors.password && <p className="text-xs text-destructive font-medium">{fieldErrors.password}</p>}
            </div>
            <Button type="submit" loading={loading} className="w-full h-11 text-base">Masuk</Button>
            <div className="text-center pt-2">
              <a href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-secondary transition-colors">
                <BookOpen size={14} />
                Kembali ke halaman publik
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="absolute bottom-6 text-[11px] text-muted-foreground/50">
        Sistem Informasi Perpustakaan SD Negeri Tamanan
      </p>
    </div>
  )
}
