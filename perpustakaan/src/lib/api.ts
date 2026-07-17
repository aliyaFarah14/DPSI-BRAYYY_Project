export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api/v1"

interface ApiResult<T> {
  success: boolean
  data: T | null
  message: string
  errors?: { field: string; message: string }[]
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<{ res: Response; body: ApiResult<T> }> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  })
  const body = await res.json() as ApiResult<T>
  return { res, body }
}