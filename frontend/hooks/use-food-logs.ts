import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { FoodLog, FoodParseRequest, FoodItem } from "@/types/api"
import { toast } from "sonner"
import { format } from "date-fns"

export function useFoodLogs(date: string) {
  return useQuery({
    queryKey: ["food-logs", date],
    queryFn: async () => {
      const { data } = await apiClient.get<FoodLog[]>(`/api/v1/food/logs?date=${date}`)
      return data
    },
  })
}

export function useFoodParse() {
  return useMutation({
    mutationFn: async (request: FoodParseRequest) => {
      const { data} = await apiClient.post<FoodItem[]>("/api/v1/food/parse", request)
      return data
    },
    onError: (error: any) => {
      console.error("Food parse error:", error)
      toast.error(error.response?.data?.detail || "解析失败")
    },
  })
}

export function useAddFoodLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (log: { date: string; food_items: FoodItem[] }) => {
      const { data } = await apiClient.post<FoodLog>("/api/v1/food/logs", log)
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["food-logs", variables.date] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("已添加食物记录")
    },
    onError: (error: any) => {
      console.error("Add food log error:", error)
      toast.error(error.response?.data?.detail || "添加失败")
    },
  })
}

export function useDeleteFoodLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      await apiClient.delete(`/api/v1/food/logs/${id}`)
      return { id, date }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["food-logs", variables.date] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("已删除记录")
    },
    onError: (error: any) => {
      console.error("Delete food log error:", error)
      toast.error(error.response?.data?.detail || "删除失败")
    },
  })
}
