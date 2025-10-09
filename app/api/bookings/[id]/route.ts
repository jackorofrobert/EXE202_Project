import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    await FirestoreService.updateBookingStatus(params.id, status)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in PATCH /api/bookings/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await FirestoreService.updateBookingStatus(params.id, "cancelled")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/bookings/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
