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

    // Check if user is admin
    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const analytics = await DatabaseService.getAdminAnalytics()

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("[v0] Error in GET /api/admin/analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
