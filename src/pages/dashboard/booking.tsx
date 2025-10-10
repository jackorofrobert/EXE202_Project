"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import type { Psychologist, Booking } from "../../types"
import PsychologistCard from "../../components/booking/psychologist-card"
import BookingModal from "../../components/booking/booking-modal"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { CalendarIcon, ClockIcon, UserIcon, StarIcon } from "lucide-react"

export default function BookingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadPsychologists = useCallback(async () => {
    try {
      const psychologistsData = await FirestoreService.getPsychologists()
      setPsychologists(psychologistsData)
    } catch (error) {
      console.error("Error loading psychologists:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách bác sĩ tâm lý",
        variant: "destructive"
      })
    }
  }, [toast])

  const loadBookings = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const bookingsData = await FirestoreService.getBookings(user.id, 'user')
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error loading bookings:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải lịch hẹn",
        variant: "destructive"
      })
    }
  }, [user?.id, toast])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([loadPsychologists(), loadBookings()])
      setIsLoading(false)
    }
    loadData()
  }, [loadPsychologists, loadBookings])

  const handleBookClick = (psychologist: Psychologist) => {
    console.log('BookingPage - handleBookClick called with:', psychologist)
    
    // Kiểm tra tier gold
    if (user?.tier !== 'gold') {
      console.log('BookingPage - User is not gold tier:', user?.tier)
      toast({
        title: "Cần nâng cấp Gold",
        description: "Chỉ thành viên Gold mới có thể đặt lịch tư vấn. Vui lòng nâng cấp để sử dụng tính năng này.",
        variant: "destructive"
      })
      return
    }

    console.log('BookingPage - Opening booking modal for:', psychologist.name)
    setSelectedPsychologist(psychologist)
    setShowBookingModal(true)
  }

  const handleBookingConfirm = async (date: string, timeSlots: string[], notes: string) => {
    if (!user?.id || !selectedPsychologist?.id) return

    try {
      // Create multiple bookings for each time slot
      const bookingPromises = timeSlots.map(timeSlot => 
        FirestoreService.addBooking({
          userId: user.id,
          psychologistId: selectedPsychologist.id,
          date,
          time: timeSlot,
          status: "pending",
          notes: `${notes} (Khung giờ: ${timeSlots.join(', ')})`,
        })
      )

      const bookingIds = await Promise.all(bookingPromises)

      // Add all new bookings to state
      const newBookings: Booking[] = timeSlots.map((timeSlot, index) => ({
        id: bookingIds[index],
        userId: user.id,
        psychologistId: selectedPsychologist.id,
        date,
        time: timeSlot,
        status: "pending",
        notes: `${notes} (Khung giờ: ${timeSlots.join(', ')})`,
        createdAt: new Date().toISOString(),
      }))

      setBookings([...newBookings, ...bookings])
      setShowBookingModal(false)
      toast({
        title: "Thành công",
        description: `Đặt lịch thành công! Đã đặt ${timeSlots.length} khung giờ: ${timeSlots.join(', ')}. Bác sĩ sẽ xác nhận trong thời gian sớm nhất.`
      })
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.",
        variant: "destructive"
      })
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await FirestoreService.updateBookingStatus(bookingId, "cancelled")
      setBookings(bookings.filter(b => b.id !== bookingId))
      toast({
        title: "Thành công",
        description: "Đã hủy lịch hẹn thành công."
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Lỗi",
        description: "Không thể hủy lịch hẹn. Vui lòng thử lại.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Đặt lịch tư vấn</h2>
        <p className="text-muted-foreground">Chọn bác sĩ tâm lý phù hợp với bạn</p>
        {user?.tier !== 'gold' && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Chỉ thành viên Gold mới có thể đặt lịch tư vấn
              </p>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Nâng cấp lên Gold để sử dụng tính năng đặt lịch với bác sĩ tâm lý chuyên nghiệp.
            </p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        </div>
      ) : (
        <>
          {bookings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Lịch hẹn của bạn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const psychologist = psychologists.find((p) => p.id === booking.psychologistId)
                    const getStatusBadge = (status: string) => {
                      switch (status) {
                        case "pending":
                          return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>
                        case "confirmed":
                          return <Badge variant="secondary" className="bg-green-100 text-green-800">Đã xác nhận</Badge>
                        case "completed":
                          return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Hoàn thành</Badge>
                        case "cancelled":
                          return <Badge variant="secondary" className="bg-red-100 text-red-800">Đã hủy</Badge>
                        default:
                          return <Badge variant="secondary">{status}</Badge>
                      }
                    }
                    
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{psychologist?.name || "Bác sĩ không xác định"}</h3>
                            <p className="text-sm text-gray-600">{psychologist?.specialization}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(booking.date).toLocaleDateString("vi-VN")}
                              </span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="h-4 w-4" />
                                {booking.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(booking.status)}
                          {booking.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Hủy lịch
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">Danh sách bác sĩ tâm lý</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {psychologists.map((psychologist) => (
                <PsychologistCard 
                  key={psychologist.id} 
                  psychologist={psychologist} 
                  onBook={handleBookClick} 
                />
              ))}
            </div>
          </div>
        </>
      )}

      <BookingModal
        isOpen={showBookingModal}
        psychologist={selectedPsychologist}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBookingConfirm}
      />
    </div>
  )
}
