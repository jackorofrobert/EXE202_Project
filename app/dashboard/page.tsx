"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserLayout } from "@/components/layout/user-layout"
import { EmotionCheckModal } from "@/components/user/emotion-check-modal"
import { EmotionStatsChart } from "@/components/user/emotion-stats-chart"
import { QuickStats } from "@/components/user/quick-stats"
import { RecentEmotions } from "@/components/user/recent-emotions"
import type { EmotionLevel, EmotionEntry, EmotionStats } from "@/types"

// Mock data
const mockEmotionStats: EmotionStats = {
  level1: 5,
  level2: 12,
  level3: 28,
  level4: 35,
  level5: 20,
}

const mockRecentEmotions: EmotionEntry[] = [
  {
    id: "1",
    userId: "user-1",
    level: 4,
    note: "Hôm nay làm việc hiệu quả",
    createdAt: new Date("2025-01-14T09:00:00"),
  },
  {
    id: "2",
    userId: "user-1",
    level: 3,
    note: "Cảm thấy bình thường",
    createdAt: new Date("2025-01-13T09:00:00"),
  },
  {
    id: "3",
    userId: "user-1",
    level: 5,
    note: "Rất vui vì hoàn thành dự án",
    createdAt: new Date("2025-01-12T09:00:00"),
  },
  {
    id: "4",
    userId: "user-1",
    level: 2,
    note: "Hơi mệt mỏi",
    createdAt: new Date("2025-01-11T09:00:00"),
  },
]

export default function DashboardPage() {
  const [showEmotionCheck, setShowEmotionCheck] = useState(false)
  const [hasCheckedToday, setHasCheckedToday] = useState(false)

  useEffect(() => {
    // Check if user has already checked emotion today
    const lastCheck = localStorage.getItem("last_emotion_check")
    const today = new Date().toDateString()

    if (lastCheck !== today) {
      setShowEmotionCheck(true)
    } else {
      setHasCheckedToday(true)
    }
  }, [])

  const handleEmotionComplete = (level: EmotionLevel, note?: string) => {
    console.log("[v0] Emotion check completed:", { level, note })

    // Save to localStorage
    localStorage.setItem("last_emotion_check", new Date().toDateString())

    // In production, call API:
    // await emotionsApi.createEntry({ level, note })

    setShowEmotionCheck(false)
    setHasCheckedToday(true)
  }

  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chào mừng trở lại!</h1>
            <p className="text-muted-foreground">Đây là tổng quan về sức khỏe tâm lý của bạn</p>
          </div>

          <QuickStats emotionEntries={100} upcomingBookings={2} diaryEntries={45} chatSessions={12} />

          <div className="grid gap-6 lg:grid-cols-2">
            <EmotionStatsChart data={mockEmotionStats} />
            <RecentEmotions entries={mockRecentEmotions} />
          </div>
        </div>

        <EmotionCheckModal open={showEmotionCheck} onComplete={handleEmotionComplete} />
      </UserLayout>
    </ProtectedRoute>
  )
}
