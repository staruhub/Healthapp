import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { DailyInsight, GenerateInsightRequest } from "@/types/api"
import { toast } from "sonner"

export function useDailyInsight(date: string) {
  return useQuery({
    queryKey: ["daily-insight", date],
    queryFn: async () => {
      const { data } = await apiClient.get<DailyInsight>(`/api/v1/insight/daily?date=${date}`)
      return data
    },
    retry: false, // Don't retry on 404
  })
}

export function useGenerateInsight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (request: GenerateInsightRequest) => {
      const { data } = await apiClient.post<DailyInsight>("/api/v1/insight/generate", request)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["daily-insight", variables.date] })
      toast.success("洞察已生成")
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "生成失败")
    },
  })
}
