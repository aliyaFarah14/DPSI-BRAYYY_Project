import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FilterBarProps {
  searchValue: string
  onSearchChange: (value: string) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onApply: () => void
  onReset: () => void
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onApply,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border/60 bg-muted/20 px-4 py-4">
      <div className="relative min-w-[200px] flex-1">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama atau judul buku..."
          className="pl-9 bg-white"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Dari</label>
        <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className="w-36 bg-white" />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Sampai</label>
        <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className="w-36 bg-white" />
      </div>
      <Button onClick={onApply} size="sm">Terapkan Filter</Button>
      <Button onClick={onReset} variant="outline" size="sm">Reset</Button>
    </div>
  )
}
