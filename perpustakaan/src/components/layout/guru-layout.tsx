import { useState, useEffect, useCallback } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Menu } from "lucide-react"
import Sidebar from "./sidebar"
import { getSessionState, touchSession, getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function GuruLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)

  useEffect(() => {
    const state = getSessionState()
    if (state === "none") {
      navigate("/login", { replace: true })
    } else if (state === "expired") {
      navigate("/login?timeout=1", { replace: true })
    }
  }, [navigate])

  const checkSession = useCallback(() => {
    const state = getSessionState()
    if (state === "none") {
      navigate("/login", { replace: true })
      return
    }
    if (state === "expired") {
      navigate("/login?timeout=1", { replace: true })
      return
    }
    const session = getSession()
    if (!session) {
      navigate("/login", { replace: true })
      return
    }
    const expiresAt = new Date(session.expiresAt).getTime()
    const now = Date.now()
    const remainingMs = expiresAt - now
    if (remainingMs <= 0) {
      navigate("/login?timeout=1", { replace: true })
    } else if (remainingMs <= 2 * 60 * 1000) {
      setShowTimeoutWarning(true)
    } else {
      setShowTimeoutWarning(false)
    }
  }, [navigate])

  useEffect(() => {
    checkSession()
    const interval = setInterval(checkSession, 30000)
    return () => clearInterval(interval)
  }, [checkSession])

  const handleStay = () => {
    touchSession()
    setShowTimeoutWarning(false)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/95 backdrop-blur-sm px-4 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden rounded-xl p-2 text-muted-foreground hover:bg-primary-light transition-colors"
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-bold text-foreground truncate">
            Sistem Informasi Perpustakaan
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-muted-foreground font-medium tracking-wide uppercase">
              SD Negeri Tamanan
            </span>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <span className="text-[11px] text-muted-foreground/70">
              {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 animate-fade-in-up">
          <Outlet />
        </main>

        <footer className="border-t border-border/60 bg-white/50 px-6 py-3">
          <p className="text-[11px] text-muted-foreground/60 text-center">
            &copy; {new Date().getFullYear()} Perpustakaan SD Negeri Tamanan &mdash; Sistem Informasi Perpustakaan
          </p>
        </footer>
      </div>

      {showTimeoutWarning && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up">
          <div className="flex items-center gap-4 rounded-xl border border-warning/30 bg-warning-light px-5 py-3 shadow-elevated">
            <p className="text-sm text-warning font-medium">
              Sesi akan berakhir. Perpanjang?
            </p>
            <Button onClick={handleStay} size="sm" className="bg-warning text-white hover:brightness-110">
              Tetap di Sini
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
