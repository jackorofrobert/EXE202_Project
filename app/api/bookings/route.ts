import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import type { Booking } from "@/types"

export async function POST(request: Request) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { psychologistId, date, time, notes } = body

    // Get psychologist info
    const psychologist = await FirestoreService.getUser(psychologistId)
    if (!psychologist) {
      return NextResponse.json({ error: "Psychologist not found" }, { status: 404 })
    }

    const bookingId = await FirestoreService.addBooking({
      userId: currentUser.id,
      psychologistId,
      date,
      time,
      status: "pending",
      notes,
    })

    const booking: Booking = {
      id: bookingId,
      userId: currentUser.id,
      psychologistId,
      date,
      time,
      status: "pending",
      notes,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[v0] Error in POST /api/bookings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
