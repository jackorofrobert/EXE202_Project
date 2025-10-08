import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Booking } from "@/types"

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { psychologistId, date, time, note } = body

    // Get psychologist info
    const { data: psychologist, error: psychologistError } = await supabase
      .from("users")
      .select("name, email")
      .eq("id", psychologistId)
      .single()

    if (psychologistError) {
      return NextResponse.json({ error: "Psychologist not found" }, { status: 404 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        psychologist_id: psychologistId,
        date,
        time,
        note,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating booking:", error)
      return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
    }

    const booking: Booking = {
      id: data.id,
      userId: data.user_id,
      psychologistId: data.psychologist_id,
      psychologistName: psychologist.name,
      psychologistTitle: "Bác sĩ tâm lý",
      date: new Date(data.date),
      time: data.time,
      status: data.status,
      note: data.note,
      createdAt: new Date(data.created_at),
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error in POST /api/bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
