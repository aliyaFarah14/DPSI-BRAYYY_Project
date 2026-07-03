import { useEffect } from "react"
import { CheckCircle2, XCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error"
  onClose: () => void
  duration?: number
}

export default function Toast({ message, type = "success", onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const styles = type === "success"
    ? "bg-secondary text-white"
    : "bg-destructive text-destructive-foreground"

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className={cn("flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-elevated", styles)}>
        {type === "success" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 rounded-lg p-1 opacity-70 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
