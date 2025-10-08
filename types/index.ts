// Core user types
export type UserRole = "admin" | "user" | "psychologist"
export type UserTier = "free" | "gold"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  tier?: UserTier // Only for 'user' role
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

// Emotion tracking types
export type EmotionLevel = 1 | 2 | 3 | 4 | 5

export interface EmotionEntry {
  id: string
  userId: string
  level: EmotionLevel
  note?: string
  createdAt: Date
}

export interface EmotionStats {
  level1: number
  level2: number
  level3: number
  level4: number
  level5: number
}

// Diary types
export interface DiaryEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: EmotionLevel
  createdAt: Date
  updatedAt: Date
}

// Chat types
export interface ChatMessage {
  id: string
  senderId: string
  receiverId?: string // For psychologist chats
  content: string
  type: "user" | "bot" | "psychologist"
  createdAt: Date
}

export interface ChatSession {
  id: string
  userId: string
  psychologistId?: string
  messages: ChatMessage[]
  status: "active" | "closed"
  createdAt: Date
  updatedAt: Date
}

// Booking types
export interface Booking {
  id: string
  userId: string
  psychologistId: string
  scheduledAt: Date
  duration: number // in minutes
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Admin analytics types
export interface AnalyticsData {
  totalUsers: number
  freeUsers: number
  goldUsers: number
  totalPsychologists: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  totalBookings: number
  completedBookings: number
  emotionDistribution: EmotionStats
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
