import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { EmotionEntry } from "@/types"

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
    const { level, note } = body

    const { data, error } = await supabase
      .from("emotion_entries")
      .insert({
        user_id: user.id,
        level,
        note,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating emotion entry:", error)
      return NextResponse.json({ error: "Failed to create emotion entry" }, { status: 500 })
    }

    const entry: EmotionEntry = {
      id: data.id,
      userId: data.user_id,
      level: data.level,
      note: data.note,
      createdAt: new Date(data.created_at),
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("[v0] Error in POST /api/emotions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    let query = supabase
      .from("emotion_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (limit) {
      query = query.limit(Number.parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching emotion entries:", error)
      return NextResponse.json({ error: "Failed to fetch emotion entries" }, { status: 500 })
    }

    const entries: EmotionEntry[] = data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      level: item.level,
      note: item.note,
      createdAt: new Date(item.created_at),
    }))

    return NextResponse.json(entries)
  } catch (error) {
    console.error("[v0] Error in GET /api/emotions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
