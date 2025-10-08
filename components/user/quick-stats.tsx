import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, BookOpen, MessageCircle } from "lucide-react"

interface QuickStatsProps {
  emotionEntries: number
  upcomingBookings: number
  diaryEntries: number
  chatSessions: number
}

export function QuickStats({ emotionEntries, upcomingBookings, diaryEntries, chatSessions }: QuickStatsProps) {
  const stats = [
    {
      title: "Ghi nhận cảm xúc",
      value: emotionEntries,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Lịch hẹn sắp tới",
      value: upcomingBookings,
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Nhật ký",
      value: diaryEntries,
      icon: BookOpen,
      color: "text-purple-600",
    },
    {
      title: "Cuộc trò chuyện",
      value: chatSessions,
      icon: MessageCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
