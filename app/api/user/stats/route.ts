import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase/config"
import { DatabaseService } from "@/lib/db-service"

export async function GET() {
  try {
    // Get current user from Firebase Auth
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await DatabaseService.getUserStats(currentUser.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in GET /api/user/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
