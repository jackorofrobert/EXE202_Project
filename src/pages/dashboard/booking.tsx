"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import type { Psychologist, Booking } from "../../types"
import { mockPsychologists } from "../../lib/mock-data"
import PsychologistCard from "../../components/booking/psychologist-card"
import BookingModal from "../../components/booking/booking-modal"

export default function BookingPage() {
  const { user } = useAuth()
  const [psychologists] = useState<Psychologist[]>(mockPsychologists)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const handleBookClick = (psychologist: Psychologist) => {
    setSelectedPsychologist(psychologist)
    setShowBookingModal(true)
  }

  const handleBookingConfirm = (date: string, time: string, notes: string) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      userId: user?.id || "",
      psychologistId: selectedPsychologist?.id || "",
      date,
      time,
      status: "pending",
      notes,
      createdAt: new Date().toISOString(),
    }
    setBookings([...bookings, newBooking])
    setShowBookingModal(false)
    alert("Đặt lịch thành công! Bác sĩ sẽ xác nhận trong thời gian sớm nhất.")
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
