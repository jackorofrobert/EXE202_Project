// Database service layer for common operations
import { createServerClient } from "@/lib/supabase/server"

export class DatabaseService {
  // Get current user with role
  static async getCurrentUser() {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

    return userData
  }

  // Check if user is Gold member
  static async isGoldUser(userId: string): Promise<boolean> {
    const supabase = await createServerClient()
    const { data } = await supabase.from("users").select("is_gold").eq("id", userId).single()

    return data?.is_gold || false
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    const supabase = await createServerClient()

    const [emotionEntries, bookings, chatSessions, diaryEntries] = await Promise.all([
      supabase.from("emotion_entries").select("id", { count: "exact" }).eq("user_id", userId),
      supabase
        .from("bookings")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .in("status", ["pending", "confirmed"]),
      supabase.from("chat_messages").select("conversation_id").eq("sender_id", userId).eq("type", "user"),
      supabase.from("diary_entries").select("id", { count: "exact" }).eq("user_id", userId),
    ])

    // Count unique chat sessions
    const uniqueSessions = new Set(chatSessions.data?.map((msg) => msg.conversation_id)).size

    return {
      emotionEntries: emotionEntries.count || 0,
      upcomingBookings: bookings.count || 0,
      chatSessions: uniqueSessions,
      diaryEntries: diaryEntries.count || 0,
    }
  }

  // Get admin analytics
  static async getAdminAnalytics() {
    const supabase = await createServerClient()

    const [totalUsers, goldUsers, totalBookings, totalEmotions] = await Promise.all([
      supabase.from("users").select("id", { count: "exact" }).eq("role", "user"),
      supabase.from("users").select("id", { count: "exact" }).eq("is_gold", true),
      supabase.from("bookings").select("id", { count: "exact" }),
      supabase.from("emotion_entries").select("id", { count: "exact" }),
    ])

    return {
      totalUsers: totalUsers.count || 0,
      goldUsers: goldUsers.count || 0,
      freeUsers: (totalUsers.count || 0) - (goldUsers.count || 0),
      totalBookings: totalBookings.count || 0,
      totalEmotions: totalEmotions.count || 0,
    }
  }
}
