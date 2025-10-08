import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { EmotionStats } from "@/types"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase.from("emotion_entries").select("level").eq("user_id", user.id)

    if (error) {
      console.error("[v0] Error fetching emotion stats:", error)
      return NextResponse.json({ error: "Failed to fetch emotion stats" }, { status: 500 })
    }

    const stats: EmotionStats = {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
    }

    data.forEach((entry) => {
      const key = `level${entry.level}` as keyof EmotionStats
      stats[key]++
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in GET /api/emotions/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
