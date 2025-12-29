import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api-client"
import { useAuthStore } from "@/store/auth-store"
import type { ProfileData, User } from "@/types/api"
import { toast } from "sonner"

// Backend profile create/update request shape
interface BackendProfileRequest {
  goal_type: string
  height_cm: number
  start_weight_kg: number
  target_weight_kg?: number
  activity_level: string
  age?: number
  gender?: string
}

// Transform frontend ProfileData to backend format
function transformToBackendProfile(profileData: ProfileData): BackendProfileRequest {
  return {
    goal_type: profileData.goal,
    height_cm: profileData.height,
    start_weight_kg: profileData.weight,
    target_weight_kg: profileData.weight, // Default to current weight
    activity_level: "moderate", // Default activity level
    age: profileData.age,
    gender: profileData.gender,
  }
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await apiClient.get<User>("/api/v1/auth/me")
      return data
    },
  })
}

// For creating new profile during onboarding
export function useCreateProfile() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const backendData = transformToBackendProfile(profileData)
      const { data } = await apiClient.post("/api/v1/profile", backendData)
      return data
    },
    onSuccess: async () => {
      // Refetch user to get updated profile
      const { data: user } = await apiClient.get<User>("/api/v1/auth/me")
      setUser(user)
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("设置完成!")
      router.push("/dashboard")
    },
    onError: (error: any) => {
      console.error("Profile create error:", error)
      toast.error(error.response?.data?.detail || "设置失败")
    },
  })
}

// For updating existing profile
export function useUpdateProfile() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      const backendData = transformToBackendProfile(profileData)
      const { data } = await apiClient.put("/api/v1/profile", backendData)
      return data
    },
    onSuccess: async () => {
      const { data: user } = await apiClient.get<User>("/api/v1/auth/me")
      setUser(user)
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
