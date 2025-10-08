"use client"

import type React from "react"

import { useState } from "react"
import type { Psychologist } from "../../types"

interface BookingModalProps {
  isOpen: boolean
  psychologist: Psychologist | null
  onClose: () => void
  onConfirm: (date: string, time: string, notes: string) => void
}

export default function BookingModal({ isOpen, psychologist, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime, notes)
      setSelectedDate("")
      setSelectedTime("")
      setNotes("")
    }
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
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Chọn giờ</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedTime === time
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-input hover:bg-muted"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

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
              onClick={onClose}
              className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime}
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
