import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { ChatbotService } from "@/lib/chatbot-service"
import type { ChatMessage } from "@/types"

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
    const { content, conversationId } = body

    // Get user role to determine chatbot tier
    const { data: userData } = await supabase.from("users").select("role, is_gold").eq("id", user.id).single()

    const isGoldUser = userData?.is_gold || false

    // Save user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from("chat_messages")
      .insert({
        sender_id: user.id,
        content,
        type: "user",
        conversation_id: conversationId || null,
      })
      .select()
      .single()

    if (userMessageError) {
      console.error("[v0] Error saving user message:", userMessageError)
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    // Get chatbot response
    let botResponse
    if (isGoldUser) {
      // Get conversation history for context
      const { data: history } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: true })
        .limit(10)

      const conversationHistory: ChatMessage[] =
        history?.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          content: msg.content,
          type: msg.type,
          createdAt: new Date(msg.created_at),
        })) || []

      botResponse = await ChatbotService.getGoldUserResponse(content, conversationHistory)
    } else {
      botResponse = ChatbotService.getFreeUserResponse(content)
    }

    // Save bot message
    const { data: botMessage, error: botMessageError } = await supabase
      .from("chat_messages")
      .insert({
        sender_id: "bot",
        content: botResponse.message,
        type: "bot",
        conversation_id: conversationId || null,
      })
      .select()
      .single()

    if (botMessageError) {
      console.error("[v0] Error saving bot message:", botMessageError)
      return NextResponse.json({ error: "Failed to save bot response" }, { status: 500 })
    }

    const message: ChatMessage = {
      id: botMessage.id,
      senderId: botMessage.sender_id,
      content: botMessage.content,
      type: botMessage.type,
      createdAt: new Date(botMessage.created_at),
    }

    return NextResponse.json({
      message,
      suggestions: botResponse.suggestions,
    })
  } catch (error) {
    console.error("[v0] Error in POST /api/chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
