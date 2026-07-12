import { API_BASE } from "./api"
import type { LoginResult } from "@/types"

const AUTH_USER_KEY = "perpustakaan_user"

export interface StoredUser {
  id_guru: string
  nama_guru: string
  username: string
}

function readStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStoredUser(user: StoredUser) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY)
}

export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
    const body = await res.json()
    if (res.ok && body.success) {
      writeStoredUser(body.data.user || body.data)
      return { success: true }
    }
    return { success: false, error: body.message || "Login gagal." }
  } catch {
    return { success: false, error: "Gagal terhubung ke server. Periksa koneksi internet Anda dan coba lagi." }
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
  } catch {
    /* best-effort — always clear local state regardless */
  }
  clearStoredUser()
}

export async function checkSession(): Promise<StoredUser | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" })
    if (res.ok) {
      const body = await res.json()
      if (body.success) {
        const userData = body.data.user || body.data
        writeStoredUser(userData)
        return userData
      }
    }
    clearStoredUser()
    return null
  } catch {
    clearStoredUser()
    return null
  }
}

export type SessionState = "authenticated" | "expired" | "none"

export function getSessionState(): SessionState {
  return readStoredUser() ? "authenticated" : "none"
}

export function getSession(): StoredUser | null {
  return readStoredUser()
}
