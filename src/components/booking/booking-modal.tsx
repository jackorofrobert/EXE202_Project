"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import type { Psychologist, Booking } from "../../types"
import { FirestoreService } from "../../lib/firestore-service"

interface BookingModalProps {
  isOpen: boolean
  psychologist: Psychologist | null
  onClose: () => void
  onConfirm: (date: string, timeSlots: string[], notes: string) => void
}

export default function BookingModal({ isOpen, psychologist, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const loadExistingBookings = useCallback(async () => {
    if (!psychologist?.id) return
    
    setIsLoadingBookings(true)
    try {
      const bookings = await FirestoreService.getBookingsForPsychologist(psychologist.id)
      const dayBookings = bookings.filter(booking => booking.date === selectedDate)
      setExistingBookings(dayBookings)
    } catch (error) {
      console.error("Error loading existing bookings:", error)
    } finally {
      setIsLoadingBookings(false)
    }
  }, [psychologist?.id, selectedDate])

  // Load existing bookings when date changes
  useEffect(() => {
    if (selectedDate && psychologist?.id) {
      loadExistingBookings()
    }
  }, [selectedDate, psychologist?.id, loadExistingBookings])

  const isTimeSlotBooked = (timeSlot: string) => {
    return existingBookings.some(booking => booking.time === timeSlot)
  }

  const isTimeSlotSelected = (timeSlot: string) => {
    return selectedTimeSlots.includes(timeSlot)
  }

  const canSelectTimeSlot = (timeSlot: string) => {
    if (isTimeSlotBooked(timeSlot)) return false
    
    // If no slots selected, any available slot can be selected
    if (selectedTimeSlots.length === 0) return true
    
    // Check if this slot is adjacent to any selected slot
    const timeIndex = timeSlots.indexOf(timeSlot)
    return selectedTimeSlots.some(selectedSlot => {
      const selectedIndex = timeSlots.indexOf(selectedSlot)
      return Math.abs(timeIndex - selectedIndex) === 1
    })
  }

  const handleTimeSlotClick = (timeSlot: string) => {
    if (!canSelectTimeSlot(timeSlot)) return

    if (isTimeSlotSelected(timeSlot)) {
      // Remove from selection
      setSelectedTimeSlots(prev => prev.filter(slot => slot !== timeSlot))
    } else {
      // Add to selection
      setSelectedTimeSlots(prev => [...prev, timeSlot].sort())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && selectedTimeSlots.length > 0) {
      onConfirm(selectedDate, selectedTimeSlots, notes)
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedDate("")
    setSelectedTimeSlots([])
    setNotes("")
    setExistingBookings([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen || !psychologist) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Đặt lịch tư vấn</h2>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <img
            src={psychologist.avatar || "/placeholder.svg"}
            alt={psychologist.name}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/caring-doctor.png"
            }}
          />
          <div>
            <h3 className="font-semibold">{psychologist.name}</h3>
            <p className="text-sm text-muted-foreground">{psychologist.specialization}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="date" className="block text-sm font-medium mb-2">
              Chọn ngày
            </label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedTimeSlots([]) // Reset time slots when date changes
              }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          {selectedDate ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Chọn khung giờ {selectedTimeSlots.length > 0 && `(${selectedTimeSlots.length} khung đã chọn)`}
              </label>
              {isLoadingBookings ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Đang tải lịch...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = isTimeSlotBooked(time)
                      const isSelected = isTimeSlotSelected(time)
                      const canSelect = canSelectTimeSlot(time)
                      
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleTimeSlotClick(time)}
                          disabled={!canSelect}
                          className={`px-4 py-2 rounded-lg border transition-colors text-sm ${
                            isBooked
                              ? 'bg-red-100 text-red-600 border-red-300 cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary text-primary-foreground border-primary'
                              : canSelect
                              ? 'border-input hover:bg-muted'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                          title={
                            isBooked 
                              ? 'Khung giờ đã được đặt' 
                              : !canSelect && selectedTimeSlots.length > 0
                              ? 'Chỉ có thể chọn khung giờ liền kề'
                              : ''
                          }
                        >
                          {time}
                          {isBooked && ' ✗'}
                          {isSelected && ' ✓'}
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Booking Summary */}
                  {existingBookings.length > 0 && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium mb-1">⚠️ Khung giờ đã được đặt:</p>
                      <p className="text-sm text-red-700">
                        {existingBookings.map(booking => booking.time).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                      <span className="text-red-600">Đã được đặt</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-primary border border-primary rounded"></div>
                      <span className="text-primary">Đã chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-input rounded"></div>
                      <span className="text-muted-foreground">Có thể chọn</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                      <span className="text-gray-400">Không thể chọn</span>
                    </div>
                  </div>
                  
                  {selectedTimeSlots.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Khung giờ đã chọn:</p>
                      <p className="text-sm text-blue-700">
                        {selectedTimeSlots.join(' → ')} ({selectedTimeSlots.length} giờ)
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">📅</div>
                <p className="text-sm font-medium mb-1">Chọn ngày để xem khung giờ</p>
                <p className="text-xs">Sau khi chọn ngày, bạn sẽ thấy các khung giờ có sẵn và đã được đặt</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Mô tả vấn đề bạn muốn tư vấn..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedDate || selectedTimeSlots.length === 0}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Đặt lịch {selectedTimeSlots.length > 0 && `(${selectedTimeSlots.length} khung giờ)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
