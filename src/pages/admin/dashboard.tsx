"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service";
import StatsCard from "../../components/admin/stats-card"
import EmotionChart from "../../components/admin/emotion-chart"
import UserGrowthChart from "../../components/admin/user-growth-chart"
import BookingStatsChart from "../../components/admin/booking-stats-chart"
import type { AnalyticsData } from "../../types"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const analyticsData = await FirestoreService.getAdminAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Không thể tải dữ liệu analytics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">EmoCare Admin</h1>
            <p className="text-sm text-muted-foreground">Xin chào, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Tổng người dùng"
            value={analytics.totalUsers}
            icon="👥"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Người dùng hoạt động"
            value={analytics.activeUsers}
            icon="✅"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Bác sĩ tâm lý"
            value={analytics.totalPsychologists}
            icon="👨‍⚕️"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Lượt đặt lịch"
            value={analytics.totalBookings}
            icon="📅"
            trend={{ value: -3, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionChart data={analytics.emotionDistribution} />
          <UserGrowthChart data={analytics.userGrowth} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BookingStatsChart data={analytics.bookingStats} />
        </div>
      </main>
    </div>
  )
}
