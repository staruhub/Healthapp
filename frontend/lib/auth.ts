import { useAuthStore } from "@/store/auth-store"

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  const store = useAuthStore.getState()
  return store.accessToken
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  const store = useAuthStore.getState()
  return store.isAuthenticated()
}

export function logout() {
  const store = useAuthStore.getState()
  store.clearAuth()
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}
