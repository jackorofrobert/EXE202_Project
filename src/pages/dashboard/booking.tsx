"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service";
import type { Psychologist, Booking } from "../../types"
import PsychologistCard from "../../components/booking/psychologist-card"
import BookingModal from "../../components/booking/booking-modal"

export default function BookingPage() {
  const { user } = useAuth()
  const [psychologists, setPsychologists] = useState<Psychologist[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const loadPsychologists = useCallback(async () => {
    try {
      const psychologistsData = await FirestoreService.getPsychologists()
      setPsychologists(psychologistsData)
    } catch (error) {
      console.error("Error loading psychologists:", error)
    }
  }, [])

  const loadBookings = useCallback(async () => {
    if (!user?.id) return
    
    try {
      const bookingsData = await FirestoreService.getBookings(user.id, 'user')
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error loading bookings:", error)
    }
  }, [user?.id])

  useEffect(() => {
    loadPsychologists()
    loadBookings()
  }, [loadPsychologists, loadBookings])

  const handleBookClick = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist)
    setShowBookingModal(true)
  }

  const handleBookingConfirm = async (date: string, time: string, notes: string) => {
    if (!user?.id || !selectedPsychologist?.id) return

    try {
      const bookingId = await FirestoreService.addBooking({
        userId: user.id,
        psychologistId: selectedPsychologist.id,
        date,
        time,
        status: "pending",
        notes,
      })

      const newBooking: Booking = {
        id: bookingId,
        userId: user.id,
        psychologistId: selectedPsychologist.id,
        date,
        time,
        status: "pending",
        notes,
        createdAt: new Date().toISOString(),
      }

      setBookings([newBooking, ...bookings])
      setShowBookingModal(false)
      alert("Đặt lịch thành công! Bác sĩ sẽ xác nhận trong thời gian sớm nhất.")
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Đặt lịch tư vấn</h2>
        <p className="text-muted-foreground">Chọn bác sĩ tâm lý phù hợp với bạn</p>
      </div>

      {bookings.length > 0 && (
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Lịch hẹn của bạn</h3>
          <div className="space-y-3">
            {bookings.map((booking) => {
              const psychologist = psychologists.find((p) => p.id === booking.psychologistId)
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{psychologist?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString("vi-VN")} - {booking.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {booking.status === "pending" ? "Chờ xác nhận" : booking.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {psychologists.map((psychologist) => (
          <PsychologistCard key={psychologist.id} psychologist={psychologist} onBook={handleBookClick} />
        ))}
      </div>

      <BookingModal
        isOpen={showBookingModal}
        psychologist={selectedPsychologist}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBookingConfirm}
      />
    </div>
  )
}
