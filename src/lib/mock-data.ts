import type { User, Psychologist, EmotionEntry, AnalyticsData } from "../types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@emocare.com",
    name: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Nguyễn Văn A",
    role: "user",
    tier: "free",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    email: "golduser@example.com",
    name: "Trần Thị B",
    role: "user",
    tier: "gold",
    createdAt: new Date().toISOString(),
  },
]

export const mockPsychologists: Psychologist[] = [
  {
    id: "p1",
    name: "BS. Nguyễn Thị Lan",
    email: "lan.nguyen@emocare.com",
    specialization: "Tâm lý trị liệu",
    experience: 8,
    rating: 4.8,
    avatar: "/female-doctor.png",
    bio: "Chuyên gia tâm lý với hơn 8 năm kinh nghiệm trong lĩnh vực trị liệu tâm lý.",
    available: true,
  },
  {
    id: "p2",
    name: "BS. Lê Văn Minh",
    email: "minh.le@emocare.com",
    specialization: "Tâm lý học lâm sàng",
    experience: 12,
    rating: 4.9,
    avatar: "/male-doctor.png",
    bio: "Bác sĩ tâm lý lâm sàng với kinh nghiệm điều trị các vấn đề về lo âu và trầm cảm.",
    available: true,
  },
]

export const mockEmotions: EmotionEntry[] = [
  { id: "1", userId: "2", level: 4, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "2", userId: "2", level: 3, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "3", userId: "2", level: 5, createdAt: new Date(Date.now() - 259200000).toISOString() },
]

export const mockAnalytics: AnalyticsData = {
  totalUsers: 1247,
  activeUsers: 892,
  totalPsychologists: 24,
  totalBookings: 456,
  emotionDistribution: [
    { level: 1, count: 45 },
    { level: 2, count: 123 },
    { level: 3, count: 234 },
    { level: 4, count: 189 },
    { level: 5, count: 156 },
  ],
  userGrowth: [
    { date: "2024-01", users: 450 },
    { date: "2024-02", users: 620 },
    { date: "2024-03", users: 890 },
    { date: "2024-04", users: 1247 },
  ],
  bookingStats: [
    { month: "T1", bookings: 89 },
    { month: "T2", bookings: 112 },
    { month: "T3", bookings: 145 },
    { month: "T4", bookings: 110 },
  ],
}
