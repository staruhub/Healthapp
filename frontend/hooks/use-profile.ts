import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"
import type { ProfileData, User } from "@/types/api"
import { toast } from "sonner"

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/api/v1/auth/me")
      return data
    },
  })
}

export function useUpdateProfile() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const { data } = await apiClient.put<User>("/api/v1/profile", profileData)
      return data
    },
    onSuccess: (data) => {
      setUser(data)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("个人信息已更新")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      console.error("Profile update error:", error)
      toast.error(error.response?.data?.detail || "更新失败")
    },
  })
}
