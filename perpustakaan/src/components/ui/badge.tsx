import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-light text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive-light text-destructive-dark",
        outline: "text-foreground border-border",
        Tersedia: "border-transparent bg-secondary-light text-secondary",
        "Stok Habis": "border-transparent bg-destructive-light text-destructive-dark",
        Dipinjam: "border-transparent bg-secondary-light text-secondary",
        "Masih Dipinjam": "border-transparent bg-secondary-light text-secondary",
        "Sudah Dikembalikan": "border-transparent bg-secondary-light text-secondary",
        "Tidak Aktif": "border-transparent bg-border text-muted",
        Terlambat: "border-transparent bg-destructive-light text-destructive-dark",
        Baik: "border-transparent bg-secondary-light text-secondary",
        "Rusak Ringan": "border-transparent bg-warning-light text-warning",
        "Rusak Berat": "border-transparent bg-destructive-light text-destructive-dark",
        Denda: "border-transparent bg-destructive-light text-destructive-dark",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
