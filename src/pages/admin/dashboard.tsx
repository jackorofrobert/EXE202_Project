"use client"

import { useAuth } from "../../contexts/auth-context"
import { mockAnalytics } from "../../lib/mock-data"
import StatsCard from "../../components/admin/stats-card"
import EmotionChart from "../../components/admin/emotion-chart"
import UserGrowthChart from "../../components/admin/user-growth-chart"
import BookingStatsChart from "../../components/admin/booking-stats-chart"

export default function AdminDashboard() {
  const { user, logout } = useAuth()

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
            value={mockAnalytics.totalUsers}
            icon="👥"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Người dùng hoạt động"
            value={mockAnalytics.activeUsers}
            icon="✅"
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Bác sĩ tâm lý"
            value={mockAnalytics.totalPsychologists}
            icon="👨‍⚕️"
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="Lượt đặt lịch"
            value={mockAnalytics.totalBookings}
            icon="📅"
            trend={{ value: -3, isPositive: false }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmotionChart data={mockAnalytics.emotionDistribution} />
          <UserGrowthChart data={mockAnalytics.userGrowth} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BookingStatsChart data={mockAnalytics.bookingStats} />
        </div>
      </main>
    </div>
  )
}
