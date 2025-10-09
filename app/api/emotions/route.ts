import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import type { EmotionEntry } from "@/types"

export async function POST(request: Request) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { level, note } = body

    const entryId = await FirestoreService.addEmotionEntry(currentUser.id, {
      level,
      note,
    })

    const entry: EmotionEntry = {
      id: entryId,
      userId: currentUser.id,
      level,
      note,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("[v0] Error in POST /api/emotions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    const entries = await FirestoreService.getEmotionEntries(
      currentUser.id,
      limit ? Number.parseInt(limit) : undefined
    )

    return NextResponse.json(entries)
  } catch (error) {
    console.error("[v0] Error in GET /api/emotions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
