import { db } from "./db"
import type { Session, LoginResult } from "@/types"

const SESSION_KEY = "perpustakaan_session"
const SESSION_DURATION_MS = 30 * 60 * 1000

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const s: Session = JSON.parse(raw)
    if (new Date(s.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return s
  } catch {
    return null
  }
}

function writeSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function login(username: string, password: string): LoginResult {
  const guru = db.findGuruByUsername(username)
  if (!guru) return { success: false, error: "Username atau password salah." }
  const hash = btoa(password)
  if (guru.password_hash !== hash) return { success: false, error: "Username atau password salah." }
  const now = new Date()
  const session: Session = {
    id_guru: guru.id_guru,
    nama_guru: guru.nama_guru,
    username: guru.username,
    lastActivity: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
  }
  writeSession(session)
  return { success: true }
}

export type SessionState = "authenticated" | "expired" | "none"

export function getSessionState(): SessionState {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return "none"
    const s: Session = JSON.parse(raw)
    if (new Date(s.expiresAt) < new Date()) {
      return "expired"
    }
    return "authenticated"
  } catch {
    return "none"
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): Session | null {
  return readSession()
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function touchSession() {
  const s = readSession()
  if (!s) return
  const now = new Date()
  s.lastActivity = now.toISOString()
  s.expiresAt = new Date(now.getTime() + SESSION_DURATION_MS).toISOString()
  writeSession(s)
}
