import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Booking } from "@/types"

export async function GET() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        psychologist:users!bookings_psychologist_id_fkey(name, email)
      `,
      )
      .eq("user_id", user.id)
      .order("date", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching user bookings:", error)
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
    }

    const bookings: Booking[] = data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      psychologistId: item.psychologist_id,
      psychologistName: item.psychologist.name,
      psychologistTitle: "Bác sĩ tâm lý",
      date: new Date(item.date),
      time: item.time,
      status: item.status,
      note: item.note,
      createdAt: new Date(item.created_at),
    }))

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error in GET /api/bookings/user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
