import { apiClient } from "./base"
import type { AnalyticsData, ApiResponse } from "@/types"

export const analyticsApi = {
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await apiClient.get<ApiResponse<AnalyticsData>>("/analytics")

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get analytics")
  },

  async getUserGrowth(days = 30): Promise<{ date: string; count: number }[]> {
    const response = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>("/analytics/user-growth", {
      params: { days },
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get user growth data")
  },

  async getBookingStats(days = 30): Promise<{ date: string; count: number }[]> {
    const response = await apiClient.get<ApiResponse<{ date: string; count: number }[]>>("/analytics/booking-stats", {
      params: { days },
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get booking stats")
  },
}
