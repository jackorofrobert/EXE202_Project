"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../contexts/auth-context"
import { ChatbotService } from "../../lib/chatbot-service"
import ChatMessage from "../../components/chatbot/chat-message"
import SuggestionChips from "../../components/chatbot/suggestion-chips"
import UpgradePrompt from "../../components/chatbot/upgrade-prompt"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatbotPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatbotService = useRef(new ChatbotService(user?.tier || "free"))

  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      text:
        user?.tier === "gold"
          ? "Xin chào! Tôi là trợ lý AI của EmoCare. Tôi ở đây để lắng nghe và hỗ trợ bạn. Bạn muốn chia sẻ điều gì hôm nay?"
          : "Xin chào! Tôi có thể gợi ý cho bạn các địa điểm và hoạt động giúp giảm stress. Bạn cần tìm gì?",
      isUser: false,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])

    if (user?.tier === "free") {
      setSuggestions(["Quán cà phê", "Nhà hàng", "Hoạt động giải trí"])
    } else {
      setSuggestions(["Tôi đang cảm thấy stress", "Tôi cần lời khuyên", "Kỹ thuật thư giãn"])
    }
  }, [user?.tier])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSuggestions([])
    setIsLoading(true)

    try {
      const response = await chatbotService.current.sendMessage(text)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      if (response.suggestions) {
        setSuggestions(response.suggestions)
      }
    } catch (error) {
      console.error("Chatbot error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Chatbot AI</h2>
        <p className="text-muted-foreground">
          {user?.tier === "gold"
            ? "Trò chuyện và nhận tư vấn về sức khỏe tâm lý"
            : "Nhận gợi ý địa điểm và hoạt động giảm stress"}
        </p>
      </div>

      {user?.tier === "free" && <UpgradePrompt />}

      <div className="flex-1 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-border p-4">
          {suggestions.length > 0 && <SuggestionChips suggestions={suggestions} onSelect={handleSendMessage} />}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
