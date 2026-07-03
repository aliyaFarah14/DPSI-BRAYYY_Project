import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  message: string
  className?: string
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
}

export default function EmptyState({ icon: Icon, message, className, actionLabel, onAction, compact }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      compact ? "py-8" : "py-14",
      className
    )}>
      <div className={cn(
        "flex items-center justify-center rounded-2xl bg-primary-light/50",
        compact ? "mb-3 h-12 w-12" : "mb-4 h-16 w-16"
      )}>
        <Icon size={compact ? 20 : 24} className="text-muted" />
      </div>
      <p className={cn(
        "text-muted-foreground max-w-xs leading-relaxed",
        compact ? "text-xs" : "text-sm"
      )}>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">{actionLabel}</Button>
      )}
    </div>
  )
}
