import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types/api"

// Cookie utility functions for syncing auth state with middleware
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens: (access: string, refresh: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (access, refresh) => {
        // Sync to cookie for middleware access
        setCookie("auth-token", access, 7)
        set({ accessToken: access, refreshToken: refresh })
      },
      setUser: (user) => set({ user }),
      clearAuth: () => {
        // Clear cookie when logging out
        deleteCookie("auth-token")
        set({ accessToken: null, refreshToken: null, user: null })
      },
      isAuthenticated: () => {
        const state = get()
        return !!(state.accessToken && state.user)
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // Sync cookie on hydration (page load)
        if (state?.accessToken) {
          setCookie("auth-token", state.accessToken, 7)
        }
      },
    }
  )
)
