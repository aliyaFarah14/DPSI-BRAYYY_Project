import { NavLink, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/auth"
import {
  BookOpen,
  BookPlus,
  BookmarkCheck,
  History,
  LogOut,
  Library,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  open: boolean
  onClose: () => void
}

const menuItems = [
  { to: "/buku", label: "Data Buku", icon: BookOpen },
  { to: "/peminjaman", label: "Peminjaman", icon: BookPlus },
  { to: "/pengembalian", label: "Pengembalian", icon: BookmarkCheck },
  { to: "/riwayat", label: "Riwayat", icon: History },
]

export default function Sidebar({ collapsed, onToggle, open, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const inner = (
    <div className="flex h-full flex-col">
      <div className={cn(
        "flex items-center gap-3 border-b border-sidebar-muted/40 px-5",
        collapsed ? "justify-center h-16" : "h-16"
      )}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-active/30">
          <Library size={18} className="text-sidebar-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground leading-tight">Perpustakaan</p>
            <p className="text-[10px] text-sidebar-foreground/60 leading-tight">SD Negeri Tamanan</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose()}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-muted/60 hover:text-sidebar-foreground",
              )
            }
          >
            <item.icon size={18} className={cn("shrink-0", collapsed ? "mx-auto" : "")} />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-muted/40 px-3 py-3">
        {!collapsed ? (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-all duration-150 hover:bg-sidebar-muted/60 hover:text-sidebar-foreground"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sidebar-foreground/70 transition-all duration-150 hover:bg-sidebar-muted/60 hover:text-sidebar-foreground"
            title="Keluar"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>

      <button
        onClick={onToggle}
        className="flex items-center justify-center border-t border-sidebar-muted/40 py-3 text-sidebar-foreground/50 transition-all duration-150 hover:bg-sidebar-muted/60 hover:text-sidebar-foreground"
        aria-label={collapsed ? "Perluas sidebar" : "Persempit sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  )

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar shadow-elevated transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-sidebar-foreground/60 transition-all hover:bg-sidebar-muted/60 hover:text-sidebar-foreground"
          aria-label="Tutup menu"
        >
          <X size={20} />
        </button>
        {inner}
      </aside>
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col bg-sidebar min-h-screen transition-all duration-300",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {inner}
      </aside>
    </>
  )
}
