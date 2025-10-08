"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import type { Booking } from "../../types"

export default function PsychologistAppointments() {
  const { user } = useAuth()
  const [appointments] = useState<Booking[]>([
    {
      id: "1",
      userId: "2",
      psychologistId: user?.id || "",
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "10:00",
      status: "pending",
      notes: "Cần tư vấn về vấn đề lo âu",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      userId: "3",
      psychologistId: user?.id || "",
      date: new Date(Date.now() + 172800000).toISOString(),
      time: "14:00",
      status: "confirmed",
      notes: "Tư vấn về stress công việc",
      createdAt: new Date().toISOString(),
    },
  ])

  const handleStatusChange = (bookingId: string, newStatus: "confirmed" | "cancelled") => {
    console.log(`[v0] Updating booking ${bookingId} to ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lịch hẹn</h2>
        <p className="text-muted-foreground">Quản lý các cuộc hẹn với bệnh nhân</p>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-1">Bệnh nhân #{appointment.userId}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(appointment.date).toLocaleDateString("vi-VN")} - {appointment.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.status === "confirmed"
                    ? "bg-secondary/20 text-secondary"
                    : appointment.status === "pending"
                      ? "bg-accent/20 text-accent"
                      : "bg-destructive/20 text-destructive"
                }`}
              >
                {appointment.status === "pending"
                  ? "Chờ xác nhận"
                  : appointment.status === "confirmed"
                    ? "Đã xác nhận"
                    : "Đã hủy"}
              </span>
            </div>

            {appointment.notes && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Ghi chú:</p>
                <p className="text-sm text-muted-foreground">{appointment.notes}</p>
              </div>
            )}

            {appointment.status === "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusChange(appointment.id, "confirmed")}
                  className="flex-1 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => handleStatusChange(appointment.id, "cancelled")}
                  className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Từ chối
                </button>
              </div>
            )}

            {appointment.status === "confirmed" && (
              <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Bắt đầu tư vấn
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
