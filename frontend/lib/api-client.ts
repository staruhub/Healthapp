import axios from "axios"

// Cookie utility for syncing auth token with middleware
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor: inject access token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const authStorage = localStorage.getItem("auth-storage")
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.accessToken) {
            config.headers.Authorization = `Bearer ${state.accessToken}`
          }
        } catch (error) {
          console.error("Error parsing auth storage:", error)
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== "undefined") {
        const authStorage = localStorage.getItem("auth-storage")
        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage)
            const refreshToken = state?.refreshToken

            if (refreshToken) {
              try {
                const { data } = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
                  { refresh_token: refreshToken }
                )

                // Update tokens in localStorage and sync cookie
                const updatedStorage = {
                  state: {
                    ...state,
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                  },
                }
                localStorage.setItem("auth-storage", JSON.stringify(updatedStorage))
                // Sync to cookie for middleware access
                setCookie("auth-token", data.access_token, 7)

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`
                return apiClient.request(originalRequest)
              } catch (refreshError) {
                // Refresh failed, clear auth and redirect
                localStorage.removeItem("auth-storage")
                deleteCookie("auth-token")
                window.location.href = "/login"
              }
            } else {
              window.location.href = "/login"
            }
          } catch (error) {
            console.error("Error handling 401:", error)
            window.location.href = "/login"
          }
        } else {
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
