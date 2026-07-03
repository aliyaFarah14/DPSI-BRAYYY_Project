import { AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertBannerProps {
  message: string
  variant?: "error" | "info"
  onRetry?: () => void
  className?: string
}

export default function AlertBanner({ message, variant = "error", onRetry, className }: AlertBannerProps) {
  const styles = variant === "error"
    ? "bg-destructive-light/80 border-destructive/30 text-destructive-dark"
    : "bg-primary-light/80 border-primary/20 text-primary"

  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm", styles, className)}>
      <AlertCircle size={16} className="shrink-0" />
      <span className="flex-1 font-medium">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
        >
          <RefreshCw size={12} /> Coba Lagi
        </button>
      )}
    </div>
  )
}
