import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, Component, type ReactNode } from "react"
import { AlertTriangle } from "lucide-react"
import GuruLayout from "@/components/layout/guru-layout"
import PublicLayout from "@/components/layout/public-layout"
import { getSessionState } from "@/lib/auth"
import { db } from "@/lib/db"
import LoginPage from "@/pages/login-page"
import PublicPage from "@/pages/public-page"
import BookManagement from "@/pages/book-management"
import BorrowingPage from "@/pages/borrowing-page"
import ReturnPage from "@/pages/return-page"
import HistoryPage from "@/pages/history-page"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const state = getSessionState()
  if (state === "none") {
    return <Navigate to="/login" replace />
  }
  if (state === "expired") {
    return <Navigate to="/login?timeout=1" replace />
  }
  return <>{children}</>
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-muted/40">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Halaman tidak ditemukan.</p>
        <a href="/" className="mt-4 inline-block text-sm text-secondary hover:underline">Kembali ke halaman utama</a>
      </div>
    </div>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  handleReset = () => {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("perpustakaan_"))
      keys.forEach((k) => localStorage.removeItem(k))
    } catch {}
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="max-w-md text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive-light">
              <AlertTriangle size={28} className="text-destructive" />
            </div>
            <h1 className="text-lg font-bold text-foreground mb-2">Terjadi Kesalahan</h1>
            <p className="text-sm text-muted-foreground mb-4">
              Aplikasi mengalami gangguan. Coba muat ulang halaman.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-hover transition-all"
              >
                Muat Ulang
              </button>
              <button
                onClick={this.handleReset}
                className="rounded-xl border-2 border-border bg-white px-5 py-2.5 text-sm font-medium text-foreground hover:bg-primary-light transition-all"
              >
                Reset & Muat Ulang
              </button>
            </div>
            {this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">Detail teknis</summary>
                <pre className="mt-2 text-[10px] text-muted-foreground/60 bg-muted/20 rounded-lg p-3 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  useEffect(() => {
    try {
      const STORAGE_VERSION = "v3"
      const version = localStorage.getItem("perpustakaan_version")
      if (version !== STORAGE_VERSION) {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("perpustakaan_"))
        keys.forEach((k) => localStorage.removeItem(k))
        localStorage.setItem("perpustakaan_version", STORAGE_VERSION)
      }
    } catch {}
    try {
      db.seed()
    } catch {
      try {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("perpustakaan_"))
        keys.forEach((k) => localStorage.removeItem(k))
        db.seed()
      } catch {}
    }
  }, [])

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="/buku" element={<ProtectedRoute><GuruLayout /></ProtectedRoute>}>
            <Route index element={<BookManagement />} />
          </Route>
          <Route path="/peminjaman" element={<ProtectedRoute><GuruLayout /></ProtectedRoute>}>
            <Route index element={<BorrowingPage />} />
          </Route>
          <Route path="/pengembalian" element={<ProtectedRoute><GuruLayout /></ProtectedRoute>}>
            <Route index element={<ReturnPage />} />
          </Route>
          <Route path="/riwayat" element={<ProtectedRoute><GuruLayout /></ProtectedRoute>}>
            <Route index element={<HistoryPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
