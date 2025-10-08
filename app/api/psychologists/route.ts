import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import type { Psychologist } from "@/types"

export async function GET() {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "psychologist")
      .order("name", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching psychologists:", error)
      return NextResponse.json({ error: "Failed to fetch psychologists" }, { status: 500 })
    }

    const psychologists: Psychologist[] = data.map((item) => ({
      id: item.id,
      name: item.name,
      title: item.title || "Bác sĩ tâm lý",
      avatar: item.avatar,
      specialties: item.specialties || [],
      experience: item.experience || "Nhiều năm kinh nghiệm",
      bio: item.bio || "",
      rating: item.rating || 4.5,
      reviewCount: item.review_count || 0,
      price: item.price || 500000,
    }))

    return NextResponse.json(psychologists)
  } catch (error) {
    console.error("[v0] Error in GET /api/psychologists:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
