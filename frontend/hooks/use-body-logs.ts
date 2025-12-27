import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { BodyLog, WorkoutLog } from "@/types/api"
import { toast } from "sonner"

export function useBodyLogs(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["body-logs", startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get<BodyLog[]>(
        `/api/v1/body/logs?date_from=${startDate}&date_to=${endDate}`
      )
      return data
    },
  })
}

export function useAddBodyLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (log: { date: string; weight_kg: number; notes?: string }) => {
      const { data } = await apiClient.post<BodyLog>("/api/v1/body/logs", log)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["body-logs"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("已记录体重")
    },
  })
}

export function useWorkoutLogs(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["workout-logs", startDate, endDate],
    queryFn: async () => {
      const { data } = await apiClient.get<WorkoutLog[]>(
        `/api/v1/workout/logs?date_from=${startDate}&date_to=${endDate}`
      )
      return data
    },
  })
}

export function useAddWorkoutLog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (log: {
      date: string
      workout_type: string
      duration_minutes: number
      notes?: string
    }) => {
      const { data } = await apiClient.post<WorkoutLog>("/api/v1/workout/logs", log)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workout-logs"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("已记录运动")
    },
  })
}
