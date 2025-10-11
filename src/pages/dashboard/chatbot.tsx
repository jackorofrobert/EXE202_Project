"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../contexts/auth-context"
import { ChatbotService } from "../../lib/chatbot-service"
import { ConversationService, type Conversation } from "../../lib/conversation-service"
import ChatMessage from "../../components/chatbot/chat-message"
import SuggestionChips from "../../components/chatbot/suggestion-chips"
import UpgradePrompt from "../../components/chatbot/upgrade-prompt"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { PlusIcon, TrashIcon, MessageSquareIcon } from "lucide-react"

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
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [showConversations, setShowConversations] = useState(true) // Mặc định hiển thị sidebar
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatbotService = useRef<ChatbotService | null>(null)
  const conversationService = useRef(new ConversationService())

  useEffect(() => {
    if (user?.id && process.env.REACT_APP_GEMINI_API_KEY) {
      chatbotService.current = new ChatbotService(
        user.tier || "free",
        user.id, 
        process.env.REACT_APP_GEMINI_API_KEY
      )
      loadConversations()
      // Tạo conversation mới ngay lập tức
      createNewConversation()
    }
  }, [user?.id, user?.tier])

  const loadConversations = async () => {
    if (!user?.id) return
    try {
      const convs = await conversationService.current.getConversations(user.id)
      setConversations(convs)
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const conversation = await conversationService.current.getConversation(conversationId)
      if (conversation) {
        const formattedMessages: Message[] = conversation.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === 'user',
          timestamp: msg.timestamp,
        }))
        setMessages(formattedMessages)
        setCurrentConversationId(conversationId)
        if (chatbotService.current) {
          await chatbotService.current.switchConversation(conversationId)
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const createNewConversation = async () => {
    if (!chatbotService.current) return
    
    setMessages([])
    setCurrentConversationId(null)
    await chatbotService.current.createNewConversation()
    // Giữ sidebar hiển thị
    // Reload conversations để hiển thị conversation mới
    await loadConversations()
  }

  const deleteConversation = async (conversationId: string) => {
    if (!chatbotService.current) return
    
    try {
      await chatbotService.current.deleteConversation(conversationId)
      await loadConversations()
      
      if (currentConversationId === conversationId) {
        setMessages([])
        setCurrentConversationId(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  useEffect(() => {
    // Only show welcome message if no conversation is loaded
    if (!currentConversationId && messages.length === 0) {
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
    }
  }, [user?.tier, currentConversationId, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatbotService.current) return

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
      
      // Reload conversations to show updated list
      await loadConversations()
    } catch (error) {
      console.error("Chatbot error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Chatbot AI</h2>
            <p className="text-muted-foreground">
              {user?.tier === "gold"
                ? "Trò chuyện và nhận tư vấn về sức khỏe tâm lý"
                : "Nhận gợi ý địa điểm và hoạt động giảm stress"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={createNewConversation}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              Cuộc trò chuyện mới
            </Button>
          </div>
        </div>
      </div>

      {user?.tier === "free" && <UpgradePrompt />}

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Conversations Sidebar - Luôn hiển thị */}
        <Card className="w-80 flex-shrink-0">
            <CardHeader>
              <CardTitle className="text-lg">Cuộc trò chuyện</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      currentConversationId === conversation.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => loadConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {conversation.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {conversation.updatedAt.toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation.id)
                        }}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Chưa có cuộc trò chuyện nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        {/* Chat Interface */}
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
    </div>
  )
}
