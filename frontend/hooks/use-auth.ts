import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/api"
import { toast } from "sonner"

export function useLogin() {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await apiClient.post<AuthResponse>("/api/v1/auth/login", data)
      return response.data
    },
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token)

      // Fetch user profile
      try {
        const userResponse = await apiClient.get<User>("/api/v1/auth/me")
        setUser(userResponse.data)

        toast.success("登录成功")

        // Redirect based on profile completion
        if (userResponse.data.profile) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        toast.error("获取用户信息失败")
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error)
      toast.error(error.response?.data?.detail || "登录失败,请检查用户名和密码")
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const { setTokens, setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await apiClient.post<AuthResponse>("/api/v1/auth/register", data)
      return response.data
    },
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token)

      // Fetch user profile
      try {
        const userResponse = await apiClient.get<User>("/api/v1/auth/me")
        setUser(userResponse.data)

        toast.success("注册成功")
        router.push("/onboarding")
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
      }
    },
    onError: (error: any) => {
      console.error("Register error:", error)
      toast.error(error.response?.data?.detail || "注册失败")
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const { clearAuth } = useAuthStore()

  return () => {
    clearAuth()
    toast.success("已退出登录")
    router.push("/login")
  }
}
