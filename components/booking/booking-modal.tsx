"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Clock } from "lucide-react"
import type { Psychologist } from "@/types"

interface BookingModalProps {
  open: boolean
  onClose: () => void
  psychologist: Psychologist | null
  onConfirm: (date: Date, time: string, note: string) => void
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export function BookingModal({ open, onClose, psychologist, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [note, setNote] = useState("")

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime, note)
      onClose()
      // Reset form
      setSelectedDate(new Date())
      setSelectedTime("")
      setNote("")
    }
  }

  if (!psychologist) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đặt lịch với {psychologist.name}</DialogTitle>
          <DialogDescription>{psychologist.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Chọn ngày</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0}
              className="rounded-md border"
            />
          </div>

          <div className="space-y-2">
            <Label>Chọn giờ</Label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="bg-transparent"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="note"
              placeholder="Mô tả vấn đề bạn muốn tư vấn..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <h4 className="font-medium">Thông tin đặt lịch</h4>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-muted-foreground">Bác sĩ:</span> {psychologist.name}
              </p>
              <p>
                <span className="text-muted-foreground">Ngày:</span>{" "}
                {selectedDate?.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <span className="text-muted-foreground">Giờ:</span> {selectedTime || "Chưa chọn"}
              </p>
              <p>
                <span className="text-muted-foreground">Giá:</span>{" "}
                <span className="font-bold">{psychologist.price.toLocaleString("vi-VN")}đ</span>
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Hủy
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedDate || !selectedTime} className="flex-1">
              Xác nhận đặt lịch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
