import { NextResponse } from "next/server"
import { DatabaseService } from "@/lib/db-service"
import { FirestoreService } from "@/lib/firestore-service"
import { ChatbotService } from "@/lib/chatbot-service"
import type { ChatMessage } from "@/types"

export async function POST(request: Request) {
  try {
    const currentUser = await DatabaseService.getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, conversationId } = body

    const isGoldUser = await DatabaseService.isGoldUser(currentUser.id)

    // Save user message
    const userMessageId = await FirestoreService.addChatMessage(conversationId || 'default', {
      senderId: currentUser.id,
      content,
      type: "user",
    })

    // Get chatbot response
    let botResponse
    if (isGoldUser) {
      // Get conversation history for context
      const history = await FirestoreService.getChatMessages(conversationId || 'default')

      const conversationHistory: ChatMessage[] = history.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        type: msg.type,
        createdAt: new Date(msg.createdAt),
      }))

      botResponse = await ChatbotService.getGoldUserResponse(content, conversationHistory)
    } else {
      botResponse = ChatbotService.getFreeUserResponse(content)
    }

    // Save bot message
    const botMessageId = await FirestoreService.addChatMessage(conversationId || 'default', {
      senderId: "bot",
      content: botResponse.message,
      type: "bot",
    })

    const message: ChatMessage = {
      id: botMessageId,
      senderId: "bot",
      content: botResponse.message,
      type: "bot",
      createdAt: new Date(),
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
