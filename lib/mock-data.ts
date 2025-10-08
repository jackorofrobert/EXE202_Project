// Mock data for development
import type { AnalyticsData } from "@/types"

export const mockAnalyticsData: AnalyticsData = {
  totalUsers: 1247,
  freeUsers: 892,
  goldUsers: 355,
  totalPsychologists: 24,
  dailyActiveUsers: 342,
  weeklyActiveUsers: 856,
  monthlyActiveUsers: 1089,
  totalBookings: 428,
  completedBookings: 387,
  emotionDistribution: {
    level1: 89,
    level2: 234,
    level3: 456,
    level4: 312,
    level5: 156,
  },
}

export const mockUserGrowth = [
  { date: "2025-01-01", count: 45 },
  { date: "2025-01-02", count: 52 },
  { date: "2025-01-03", count: 48 },
  { date: "2025-01-04", count: 61 },
  { date: "2025-01-05", count: 55 },
  { date: "2025-01-06", count: 67 },
  { date: "2025-01-07", count: 72 },
  { date: "2025-01-08", count: 58 },
  { date: "2025-01-09", count: 63 },
  { date: "2025-01-10", count: 71 },
  { date: "2025-01-11", count: 68 },
  { date: "2025-01-12", count: 75 },
  { date: "2025-01-13", count: 82 },
  { date: "2025-01-14", count: 79 },
]

export const mockBookingStats = [
  { date: "2025-01-01", count: 12 },
  { date: "2025-01-02", count: 15 },
  { date: "2025-01-03", count: 18 },
  { date: "2025-01-04", count: 14 },
  { date: "2025-01-05", count: 22 },
  { date: "2025-01-06", count: 19 },
  { date: "2025-01-07", count: 25 },
  { date: "2025-01-08", count: 21 },
  { date: "2025-01-09", count: 23 },
  { date: "2025-01-10", count: 28 },
  { date: "2025-01-11", count: 26 },
  { date: "2025-01-12", count: 31 },
  { date: "2025-01-13", count: 29 },
  { date: "2025-01-14", count: 33 },
]
