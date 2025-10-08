import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { DatabaseService } from "@/lib/db-service"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await DatabaseService.getUserStats(user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Error in GET /api/user/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
