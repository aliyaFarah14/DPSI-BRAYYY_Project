import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FINE_PER_DAY, FINE_DAMAGE_LIGHT, FINE_DAMAGE_HEAVY } from "./constants"
import type { BookCondition } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const XSS_PATTERN = /<[^>]*>|javascript:|on\w+\s*=|alert\(|prompt\(|confirm\(/i

export function isXSSSafe(value: string): boolean {
  return !XSS_PATTERN.test(value)
}

export function sanitize(value: string): string {
  return value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-"
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

export function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function calcLateDays(returnDate: string, deadlineDate: string): number {
  const r = new Date(returnDate + "T00:00:00")
  const d = new Date(deadlineDate + "T00:00:00")
  const diff = r.getTime() - d.getTime()
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

export function calcFineLate(lateDays: number): number {
  return FINE_PER_DAY * Math.max(0, lateDays)
}

export function calcFineCondition(condition: BookCondition): number {
  switch (condition) {
    case "Baik": return 0
    case "Rusak Ringan": return FINE_DAMAGE_LIGHT
    case "Rusak Berat": return FINE_DAMAGE_HEAVY
  }
}

export function calcFineTotal(lateDays: number, condition: BookCondition): {
  fineLateAmount: number
  fineConditionAmount: number
  fineTotal: number
} {
  const fineLateAmount = calcFineLate(lateDays)
  const fineConditionAmount = calcFineCondition(condition)
  return {
    fineLateAmount,
    fineConditionAmount,
    fineTotal: fineLateAmount + fineConditionAmount,
  }
}

export function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`
}

let counter = 0

export function generateId(prefix: string): string {
  counter++
  const ts = Date.now().toString(36).toUpperCase()
  const r = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${ts}${r}${counter}`
}

export function isRackLocationValid(value: string): boolean {
  return /^[A-Za-z]+[0-9]+$/.test(value)
}

export const validateRack = isRackLocationValid

export function isStockValid(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}
