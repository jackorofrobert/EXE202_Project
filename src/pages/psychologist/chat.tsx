"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { SendIcon, MessageCircleIcon, UserIcon, ClockIcon } from "lucide-react"
import type { ChatMessage } from "../../types"

interface ChatSession {
  id: string
  userId: string
  userName: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
}

export default function PsychologistChatPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeSessionsRef = useRef<(() => void) | null>(null)
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null)

  const loadChatSessions = useCallback(async () => {
    if (!user?.id) return

    // Cleanup previous listener
    if (unsubscribeSessionsRef.current) {
      unsubscribeSessionsRef.current()
      unsubscribeSessionsRef.current = null
    }

    try {
      // Subscribe to real-time updates for chat sessions
      const unsubscribe = FirestoreService.subscribeToPsychologistChatSessions(user.id, (sessions) => {
        setChatSessions(sessions)
        setIsLoading(false)
      })
      
      unsubscribeSessionsRef.current = unsubscribe
    } catch (error) {
      console.error("Error setting up chat sessions listener:", error)
      toast({
        title: "Lỗi",
        description: "Không thể kết nối chat sessions",
        variant: "destructive"
      })
      setIsLoading(false)
    }
  }, [user?.id, toast])

  const loadMessages = useCallback(async (conversationId: string) => {
    // Cleanup previous listener
    if (unsubscribeMessagesRef.current) {
      unsubscribeMessagesRef.current()
      unsubscribeMessagesRef.current = null
    }

    try {
      // Subscribe to real-time updates for messages
      const unsubscribe = FirestoreService.subscribeToChatMessages(conversationId, (newMessages) => {
        setMessages(newMessages)
      })
      
      unsubscribeMessagesRef.current = unsubscribe
    } catch (error) {
      console.error("Error setting up messages listener:", error)
      toast({
        title: "Lỗi",
        description: "Không thể kết nối tin nhắn",
        variant: "destructive"
      })
    }
  }, [toast])

  useEffect(() => {
    loadChatSessions()
  }, [loadChatSessions])

  useEffect(() => {
    if (selectedSession) {
      loadMessages(selectedSession.id)
    }
  }, [selectedSession, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeSessionsRef.current) {
        unsubscribeSessionsRef.current()
      }
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current()
      }
    }
  }, [])

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || !user?.id) return

    setIsSending(true)
    try {
      await FirestoreService.addChatMessage(selectedSession.id, {
        senderId: user.id,
        receiverId: selectedSession.userId,
        content: newMessage.trim(),
        type: "psychologist"
      })

      setNewMessage("")
      // Messages and sessions will be updated automatically via real-time listeners
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        variant: "destructive"
      })
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat Sessions List */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Cuộc trò chuyện</h3>
        <div className="space-y-2">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có cuộc trò chuyện nào</p>
            </div>
          ) : (
            chatSessions.map((session) => (
              <Card
                key={session.id}
                className={`cursor-pointer transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-white'
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">{session.userName}</h4>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {session.lastMessage && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {session.lastMessage}
                        </p>
                      )}
                      {session.lastMessageTime && (
                        <div className="flex items-center gap-1 mt-1">
                          <ClockIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {new Date(session.lastMessageTime).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedSession.userName}</h3>
                  <p className="text-sm text-gray-500">Bệnh nhân</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Đang chat
                  </Badge>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <MessageCircleIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chưa có tin nhắn nào</p>
                  <p className="text-sm">Hãy bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'psychologist' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'psychologist'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'psychologist' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  size="icon"
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Chọn cuộc trò chuyện</h3>
              <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
