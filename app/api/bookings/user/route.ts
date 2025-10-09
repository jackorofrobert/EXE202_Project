import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import type { Booking } from "@/types"

export async function GET() {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookings = await FirestoreService.getBookings(currentUser.id, 'user')

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("[v0] Error in GET /api/bookings/user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
