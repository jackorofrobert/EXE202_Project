import { NextResponse } from "next/server"
import { FirestoreService } from "@/lib/firestore-service"
import type { Psychologist } from "@/types"

export async function GET() {
  try {
    const psychologists = await FirestoreService.getPsychologists()

    return NextResponse.json(psychologists)
  } catch (error) {
    console.error("[v0] Error in GET /api/psychologists:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
