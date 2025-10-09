import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import type { Booking } from "@/types"

export async function GET() {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser || currentUser.role !== 'psychologist') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const bookings = await FirestoreService.getBookings(currentUser.id, 'psychologist')

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error in GET /api/bookings/psychologist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
