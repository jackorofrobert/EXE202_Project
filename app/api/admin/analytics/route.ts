import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"

export async function GET() {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const analytics = await DatabaseService.getAdminAnalytics()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[v0] Error in GET /api/admin/analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
