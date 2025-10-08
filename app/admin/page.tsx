"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { AdminHeader } from "@/components/layout/admin-header"
import { StatsCard } from "@/components/admin/stats-card"
import { EmotionChart } from "@/components/admin/emotion-chart"
import { UserGrowthChart } from "@/components/admin/user-growth-chart"
import { BookingStatsChart } from "@/components/admin/booking-stats-chart"
import { Users, UserCheck, Calendar, Activity } from "lucide-react"
import { mockAnalyticsData, mockUserGrowth, mockBookingStats } from "@/lib/mock-data"

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container py-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
              <p className="text-muted-foreground">Thống kê và phân tích hoạt động của nền tảng EmoCare</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Tổng người dùng"
                value={mockAnalyticsData.totalUsers.toLocaleString()}
                description={`Free: ${mockAnalyticsData.freeUsers} | Gold: ${mockAnalyticsData.goldUsers}`}
                icon={Users}
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="Người dùng hoạt động"
                value={mockAnalyticsData.dailyActiveUsers.toLocaleString()}
                description="Hoạt động trong 24h qua"
                icon={Activity}
                trend={{ value: 8.2, isPositive: true }}
              />
              <StatsCard
                title="Bác sĩ tâm lý"
                value={mockAnalyticsData.totalPsychologists}
                description="Đang hoạt động trên nền tảng"
                icon={UserCheck}
              />
              <StatsCard
                title="Lịch hẹn"
                value={mockAnalyticsData.totalBookings}
                description={`Hoàn thành: ${mockAnalyticsData.completedBookings}`}
                icon={Calendar}
                trend={{ value: 15.3, isPositive: true }}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <EmotionChart data={mockAnalyticsData.emotionDistribution} />
              <div className="space-y-4">
                <div className="grid gap-4">
                  <StatsCard
                    title="Người dùng tuần này"
                    value={mockAnalyticsData.weeklyActiveUsers.toLocaleString()}
                    description="Hoạt động trong 7 ngày qua"
                    icon={Activity}
                  />
                  <StatsCard
                    title="Người dùng tháng này"
                    value={mockAnalyticsData.monthlyActiveUsers.toLocaleString()}
                    description="Hoạt động trong 30 ngày qua"
                    icon={Activity}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <UserGrowthChart data={mockUserGrowth} />
              <BookingStatsChart data={mockBookingStats} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
