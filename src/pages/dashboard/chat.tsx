"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { SendIcon, MessageCircleIcon, UserIcon, StarIcon } from "lucide-react"
import type { Psychologist, ChatMessage, Booking } from "../../types"

export default function ChatPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [userBookings, setUserBookings] = useState<Booking[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  const loadPsychologists = useCallback(async () => {
    try {
      const data = await FirestoreService.getPsychologists()
      setPsychologists(data)
    } catch (error) {
      console.error("Error loading psychologists:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bác sĩ tâm lý",
        variant: "destructive"
      })
    }
  }, [toast])

  const loadUserBookings = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const bookings = await FirestoreService.getBookings(user.id, 'user')
      setUserBookings(bookings)
    } catch (error) {
      console.error("Error loading bookings:", error)
    }
  }, [user?.id])

  const loadMessages = useCallback(async (psychologistId: string) => {
    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    try {
      const conversationId = `${user?.id}_${psychologistId}`
      
      // Subscribe to real-time updates
      const unsubscribe = FirestoreService.subscribeToChatMessages(conversationId, (newMessages) => {
        setMessages(newMessages)
      })
      
      unsubscribeRef.current = unsubscribe
    } catch (error) {
      console.error("Error setting up chat listener:", error)
      toast({
        title: "Lỗi",
        description: "Không thể kết nối chat",
        variant: "destructive"
      })
    }
  }, [user?.id, toast])

  useEffect(() => {
    loadPsychologists()
    loadUserBookings()
  }, [loadPsychologists, loadUserBookings])

  useEffect(() => {
    if (selectedPsychologist) {
      loadMessages(selectedPsychologist.id)
    }
  }, [selectedPsychologist, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [])

  const hasBookingWithPsychologist = useCallback((psychologistId: string) => {
    return userBookings.some(booking => 
      booking.psychologistId === psychologistId && 
      (booking.status === 'confirmed' || booking.status === 'completed')
    )
  }, [userBookings])

  const canChatWithPsychologist = useCallback((psychologistId: string) => {
    // Kiểm tra tier Gold
    if (user?.tier !== 'gold') return false
    
    // Kiểm tra có booking đã được xác nhận hoặc hoàn thành
    return hasBookingWithPsychologist(psychologistId)
  }, [user?.tier, hasBookingWithPsychologist])

  const handlePsychologistSelect = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist)
    setMessages([])
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPsychologist || !user?.id) return

    // Kiểm tra có thể chat với psychologist này không
    if (!canChatWithPsychologist(selectedPsychologist.id)) {
      toast({
        title: "Không thể chat",
        description: "Bạn cần đặt lịch hẹn và được xác nhận với bác sĩ này trước khi có thể chat.",
        variant: "destructive"
      })
      return
    }

    setIsSending(true)
    try {
      // Ensure consistent conversationId format
      const conversationId = `${user.id}_${selectedPsychologist.id}`
      
      await FirestoreService.addChatMessage(conversationId, {
        senderId: user.id,
        receiverId: selectedPsychologist.id,
        content: newMessage.trim(),
        type: "user",
        conversationId: conversationId // Explicitly set conversationId
      })

      setNewMessage("")
      // Messages will be updated automatically via real-time listener
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

  if (user?.tier !== 'gold') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Chat với bác sĩ tâm lý</h2>
          <p className="text-muted-foreground">Giao tiếp trực tiếp với các chuyên gia</p>
        </div>
        
        <Card>
          <CardContent className="text-center py-12">
            <StarIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cần nâng cấp Gold</h3>
            <p className="text-gray-600 mb-4">
              Chỉ thành viên Gold mới có thể chat trực tiếp với bác sĩ tâm lý.
            </p>
            <p className="text-sm text-gray-500">
              Nâng cấp lên Gold để được tư vấn trực tiếp từ các chuyên gia tâm lý.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Psychologist List */}
      <div className="w-80 border-r bg-gray-50 p-4">
        <h3 className="font-semibold mb-4">Bác sĩ tâm lý</h3>
        <div className="space-y-2">
          {psychologists.filter(psychologist => hasBookingWithPsychologist(psychologist.id)).map((psychologist) => {
            const booking = userBookings.find(b => b.psychologistId === psychologist.id)
            return (
              <Card
                key={psychologist.id}
                className={`cursor-pointer transition-colors ${
                  selectedPsychologist?.id === psychologist.id
                    ? 'bg-blue-50 border-blue-300'
                    : 'hover:bg-white'
                }`}
                onClick={() => handlePsychologistSelect(psychologist)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{psychologist.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{psychologist.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-yellow-600">⭐</span>
                          <span className="text-xs text-gray-500">{psychologist.rating}</span>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            booking?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking?.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking?.status === 'confirmed' ? 'Đã xác nhận' :
                           booking?.status === 'completed' ? 'Hoàn thành' : 'Có lịch hẹn'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {psychologists.filter(psychologist => hasBookingWithPsychologist(psychologist.id)).length === 0 && (
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircleIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Chưa có bác sĩ nào để chat</p>
                <p className="text-xs text-gray-500">
                  Bạn cần đặt lịch hẹn và được xác nhận với bác sĩ trước khi có thể chat.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedPsychologist ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedPsychologist.name}</h3>
                  <p className="text-sm text-gray-500">{selectedPsychologist.specialization}</p>
                </div>
                <div className="ml-auto">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Online
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
                    className={`flex items-end gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'psychologist' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        <img
                          src={selectedPsychologist?.avatar || "/placeholder-user.jpg"}
                          alt="Psychologist"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-user.jpg"
                          }}
                        />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 flex-shrink-0">
                        <img
                          src={user?.avatar || "/placeholder-user.jpg"}
                          alt="You"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-user.jpg"
                          }}
                        />
                      </div>
                    )}
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
            <div className="text-center text-gray-500 max-w-md">
              <MessageCircleIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Chọn bác sĩ tâm lý</h3>
              <p className="mb-4">Chọn một bác sĩ từ danh sách để bắt đầu cuộc trò chuyện</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-800 mb-2">💡 Lưu ý quan trọng:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chỉ có thể chat với bác sĩ đã đặt lịch hẹn</li>
                  <li>• Lịch hẹn phải được xác nhận hoặc hoàn thành</li>
                  <li>• Cần có tài khoản Gold để sử dụng tính năng chat</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
