"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MessageCircle, X } from "lucide-react"
import type { Booking } from "@/types"

interface BookingListProps {
  bookings: Booking[]
  onCancel: (bookingId: string) => void
  onChat?: (bookingId: string) => void
}

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", variant: "secondary" as const },
  confirmed: { label: "Đã xác nhận", variant: "default" as const },
  completed: { label: "Hoàn thành", variant: "outline" as const },
  cancelled: { label: "Đã hủy", variant: "destructive" as const },
}

export function BookingList({ bookings, onCancel, onChat }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">Bạn chưa có lịch hẹn nào</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const status = STATUS_CONFIG[booking.status]
        const canCancel = booking.status === "pending" || booking.status === "confirmed"
        const canChat = booking.status === "confirmed"

        return (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{booking.psychologistName}</CardTitle>
                  <CardDescription>{booking.psychologistTitle}</CardDescription>
                </div>
                <Badge variant={status.variant}>{status.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(booking.date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.time}</span>
                </div>
              </div>

              {booking.note && (
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">{booking.note}</p>
                </div>
              )}

              <div className="flex gap-2">
                {canChat && onChat && (
                  <Button variant="outline" size="sm" onClick={() => onChat(booking.id)} className="bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat với bác sĩ
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outline" size="sm" onClick={() => onCancel(booking.id)} className="bg-transparent">
                    <X className="mr-2 h-4 w-4" />
                    Hủy lịch
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
