// API wrapper for chat messages
import type { ChatMessage } from "@/types"

export const chatApi = {
  // Send a message to chatbot
  async sendMessage(
    content: string,
    conversationId?: string,
  ): Promise<{ message: ChatMessage; suggestions?: string[] }> {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, conversationId }),
    })

    if (!response.ok) {
      throw new Error("Failed to send message")
    }

    return response.json()
  },

  // Get chat history
  async getHistory(conversationId: string): Promise<ChatMessage[]> {
    const response = await fetch(`/api/chat/${conversationId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch chat history")
    }

    return response.json()
  },

  // Get user's conversations
  async getConversations(): Promise<Array<{ id: string; lastMessage: string; updatedAt: Date }>> {
    const response = await fetch("/api/chat/conversations")

    if (!response.ok) {
      throw new Error("Failed to fetch conversations")
    }

    return response.json()
  },
}
