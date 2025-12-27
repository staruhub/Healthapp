import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { DashboardData } from "@/types/api"

export function useDashboard(days: number = 7) {
  return useQuery({
    queryKey: ["dashboard", days],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardData>(`/api/v1/dashboard?days=${days}`)
      return data
    },
  })
}
