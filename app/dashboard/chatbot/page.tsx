"use client"

import { useState, useRef, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserLayout } from "@/components/layout/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessageComponent } from "@/components/chatbot/chat-message"
import { SuggestionChips } from "@/components/chatbot/suggestion-chips"
import { UpgradePrompt } from "@/components/chatbot/upgrade-prompt"
import { useAuth } from "@/contexts/auth-context"
import { ChatbotService } from "@/lib/chatbot-service"
import { Send, Loader2 } from "lucide-react"
import type { ChatMessage } from "@/types"

export default function ChatbotPage() {
  const { isGoldUser, user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initial greeting
    const greeting: ChatMessage = {
      id: "1",
      senderId: "bot",
      content: isGoldUser
        ? `Xin chào ${user?.name}! Tôi là trợ lý AI của EmoCare. Tôi ở đây để lắng nghe và hỗ trợ bạn về sức khỏe tâm lý. Bạn muốn chia sẻ điều gì hôm nay?`
        : `Xin chào ${user?.name}! Tôi có thể gợi ý các địa điểm và hoạt động giúp bạn giảm stress. Hãy hỏi tôi về quán cà phê, hoạt động giải trí, hoặc cách thư giãn!`,
      type: "bot",
      createdAt: new Date(),
    }
    setMessages([greeting])

    if (!isGoldUser) {
      setSuggestions(["Gợi ý quán cà phê", "Hoạt động giảm stress", "Địa điểm ăn uống", "Cách thư giãn"])
    } else {
      setSuggestions(["Tôi cảm thấy buồn", "Tôi đang lo lắng", "Tôi bị stress", "Tôi muốn gặp bác sĩ"])
    }
  }, [isGoldUser, user?.name])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || "user",
      content: messageText,
      type: "user",
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setSuggestions([])

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let response
      if (isGoldUser) {
        response = await ChatbotService.getGoldUserResponse(messageText, messages)
      } else {
        response = ChatbotService.getFreeUserResponse(messageText)
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: "bot",
        content: response.message,
        type: "bot",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      if (response.suggestions) {
        setSuggestions(response.suggestions)
      }
    } catch (error) {
      console.error("[v0] Chatbot error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chatbot AI</h1>
            <p className="text-muted-foreground">
              {isGoldUser ? "Trò chuyện và nhận tư vấn về sức khỏe tâm lý" : "Nhận gợi ý các hoạt động giảm stress"}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Trò chuyện</CardTitle>
                <CardDescription>
                  {isGoldUser ? "AI sẽ lắng nghe và hỗ trợ bạn" : "Hỏi về địa điểm và hoạt động giảm stress"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col h-[500px]">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 pr-2">
                    {messages.map((message) => (
                      <ChatMessageComponent
                        key={message.id}
                        message={message.content}
                        isBot={message.type === "bot"}
                        timestamp={message.createdAt}
                      />
                    ))}
                    {isLoading && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Đang trả lời...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <SuggestionChips suggestions={suggestions} onSelect={handleSuggestionClick} />
                  )}

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder={isGoldUser ? "Nhập tin nhắn..." : "Hỏi về quán cà phê, hoạt động..."}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(input)
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button onClick={() => handleSendMessage(input)} disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="space-y-6">
              {!isGoldUser && <UpgradePrompt />}

              <Card>
                <CardHeader>
                  <CardTitle>Lưu ý</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2 text-muted-foreground">
                  <p>• Chatbot không thay thế bác sĩ tâm lý chuyên nghiệp</p>
                  <p>• Nếu bạn có suy nghĩ tự hại, hãy liên hệ ngay với bác sĩ hoặc đường dây nóng</p>
                  <p>• Thông tin trò chuyện được bảo mật</p>
                  {isGoldUser && <p>• Bạn có thể đặt lịch với bác sĩ tâm lý bất cứ lúc nào</p>}
                </CardContent>
              </Card>

              {isGoldUser && (
                <Card>
                  <CardHeader>
                    <CardTitle>Kỹ thuật nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleSendMessage("Hướng dẫn kỹ thuật hít thở")}
                    >
                      Kỹ thuật hít thở
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleSendMessage("Bài tập thiền")}
                    >
                      Bài tập thiền
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleSendMessage("Cách giảm lo lắng")}
                    >
                      Giảm lo lắng
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  )
}
