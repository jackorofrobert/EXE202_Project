export type UserRole = "admin" | "user" | "psychologist"
export type UserTier = "free" | "gold"
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled"
export type EmotionLevel = 1 | 2 | 3 | 4 | 5

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tier?: UserTier
  avatar?: string
  createdAt: string
}

export interface EmotionEntry {
  id: string
  userId: string
  level: EmotionLevel
  note?: string
  createdAt: string
}

export interface DiaryEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: EmotionLevel
  createdAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  message: string
  createdAt: string
  read: boolean
}

export interface Booking {
  id: string
  userId: string
  psychologistId: string
  date: string
  time: string
  status: BookingStatus
  notes?: string
  createdAt: string
}

export interface Psychologist {
  id: string
  name: string
  email: string
  specialization: string
  experience: number
  rating: number
  avatar: string
  bio: string
  available: boolean
}

export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalPsychologists: number
  totalBookings: number
  emotionDistribution: { level: number; count: number }[]
  userGrowth: { date: string; users: number }[]
  bookingStats: { month: string; bookings: number }[]
}
