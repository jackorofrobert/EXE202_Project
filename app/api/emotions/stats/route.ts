import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import type { EmotionStats } from "@/types"

export async function GET() {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const entries = await FirestoreService.getEmotionEntries(currentUser.id)

    const stats: EmotionStats = {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
    }

    entries.forEach((entry) => {
      const key = `level${entry.level}` as keyof EmotionStats
      stats[key]++
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in GET /api/emotions/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
