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
  goldExpiresAt?: string
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
  receiverId?: string
  content: string
  type: "user" | "psychologist"
  conversationId?: string
  createdAt: string
}

export interface Booking {
  id: string
  userId: string
  psychologistId: string
  date: string
  time: string
  status: BookingStatus
  notes?: string
  rating?: number
  ratingComment?: string
  ratedAt?: string
  createdAt: string
}

export interface Psychologist {
  id: string
  name: string
  email: string
  specialization: string
  experience: number
  rating: number
  totalRatings?: number
  avatar: string
  bio: string
  available: boolean
  hourlyRate?: number
  availability?: "available" | "busy" | "offline"
}

export interface Rating {
  id: string
  psychologistId: string
  userId: string
  rating: number
  review?: string
  createdAt: string
}

export type TransactionStatus = "pending" | "approved" | "rejected"
export type TransactionType = "upgrade_to_gold"
export type VoucherStatus = "active" | "inactive" | "expired"
export type VoucherType = "percentage" | "fixed_amount"

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  paymentProof?: string
  adminNotes?: string
  planType?: "monthly" | "yearly"
  voucherCode?: string
  originalAmount?: number
  discountAmount?: number
  createdAt: string
  updatedAt: string
}

export interface Voucher {
  id: string
  code: string
  name: string
  description?: string
  type: VoucherType
  value: number // percentage (1-100) or fixed amount
  minOrderAmount?: number
  maxDiscountAmount?: number
  usageLimit?: number
  usedCount: number
  status: VoucherStatus
  validFrom: string
  validTo: string
  createdAt: string
  updatedAt: string
  createdBy: string // admin user ID
}

export interface VoucherUsage {
  id: string
  voucherId: string
  userId: string
  transactionId: string
  discountAmount: number
  usedAt: string
}

export interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  totalPsychologists: number
  totalBookings: number
  emotionDistribution: { level: number; count: number }[]
}
