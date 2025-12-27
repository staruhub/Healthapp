import { useMutation, useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { IngredientAnalysisRequest, IngredientAnalysisResult, IngredientCheckResponse } from "@/types/api"
import { toast } from "sonner"

export function useIngredientAnalysis() {
  return useMutation({
    mutationFn: async (request: IngredientAnalysisRequest) => {
      const { data } = await apiClient.post<IngredientAnalysisResult>(
        "/api/v1/ingredient/analyze",
        request
      )
      return data
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "分析失败")
    },
  })
}

export function useIngredientHistory() {
  return useQuery({
    queryKey: ["ingredient-history"],
    queryFn: async () => {
      const { data } = await apiClient.get<IngredientCheckResponse[]>("/api/v1/ingredient/checks")
      return data
    },
  })
}
