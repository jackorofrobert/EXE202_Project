"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { PsychologistLayout } from "@/components/psychologist/psychologist-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Check, X, MessageCircle } from "lucide-react"
import type { Booking } from "@/types"
import { useToast } from "@/hooks/use-toast"

// Mock data - same bookings from user perspective
const mockAppointments: Booking[] = [
  {
    id: "book-1",
    userId: "user-1",
    psychologistId: "psy-1",
    psychologistName: "Nguyễn Văn A",
    psychologistTitle: "Người dùng",
    date: new Date("2025-01-20"),
    time: "14:00",
    status: "confirmed",
    note: "Tôi đang gặp vấn đề về lo âu và stress công việc",
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "book-2",
    userId: "user-2",
    psychologistId: "psy-1",
    psychologistName: "Trần Thị B",
    psychologistTitle: "Người dùng",
    date: new Date("2025-01-25"),
    time: "10:00",
    status: "pending",
    note: "Cần tư vấn về mối quan hệ gia đình",
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "book-3",
    userId: "user-3",
    psychologistId: "psy-1",
    psychologistName: "Lê Văn C",
    psychologistTitle: "Người dùng",
    date: new Date("2025-01-15"),
    time: "15:00",
    status: "completed",
    note: "Tư vấn về trầm cảm",
    createdAt: new Date("2025-01-10"),
  },
]

const STATUS_CONFIG = {
  pending: { label: "Chờ xác nhận", variant: "secondary" as const },
  confirmed: { label: "Đã xác nhận", variant: "default" as const },
  completed: { label: "Hoàn thành", variant: "outline" as const },
  cancelled: { label: "Đã hủy", variant: "destructive" as const },
}

export default function PsychologistAppointmentsPage() {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState<Booking[]>(mockAppointments)

  const handleConfirm = (appointmentId: string) => {
    setAppointments(appointments.map((a) => (a.id === appointmentId ? { ...a, status: "confirmed" as const } : a)))
    toast({
      title: "Đã xác nhận lịch hẹn",
      description: "Bệnh nhân sẽ nhận được thông báo xác nhận",
    })
  }

  const handleReject = (appointmentId: string) => {
    setAppointments(appointments.map((a) => (a.id === appointmentId ? { ...a, status: "cancelled" as const } : a)))
    toast({
      title: "Đã từ chối lịch hẹn",
      description: "Bệnh nhân sẽ nhận được thông báo",
    })
  }

  const handleComplete = (appointmentId: string) => {
    setAppointments(appointments.map((a) => (a.id === appointmentId ? { ...a, status: "completed" as const } : a)))
    toast({
      title: "Đã hoàn thành buổi tư vấn",
      description: "Cảm ơn bạn đã hoàn thành buổi tư vấn",
    })
  }

  const pendingAppointments = appointments.filter((a) => a.status === "pending")
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed")
  const completedAppointments = appointments.filter((a) => a.status === "completed")

  const renderAppointmentCard = (appointment: Booking, showActions = false) => {
    const status = STATUS_CONFIG[appointment.status]

    return (
      <Card key={appointment.id}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{appointment.psychologistName}</CardTitle>
              <CardDescription>Bệnh nhân</CardDescription>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(appointment.date).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.time}</span>
            </div>
          </div>

          {appointment.note && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium mb-1">Ghi chú từ bệnh nhân:</p>
              <p className="text-sm text-muted-foreground">{appointment.note}</p>
            </div>
          )}

          {showActions && (
            <div className="flex gap-2">
              {appointment.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => handleConfirm(appointment.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    Xác nhận
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(appointment.id)}
                    className="bg-transparent"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                </>
              )}
              {appointment.status === "confirmed" && (
                <>
                  <Button size="sm" onClick={() => handleComplete(appointment.id)}>
                    Hoàn thành
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <ProtectedRoute requiredRole="psychologist">
      <PsychologistLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lịch hẹn</h1>
            <p className="text-muted-foreground">Quản lý lịch hẹn với bệnh nhân</p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList>
              <TabsTrigger value="pending">
                Chờ xác nhận
                {pendingAppointments.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingAppointments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận ({confirmedAppointments.length})</TabsTrigger>
              <TabsTrigger value="completed">Hoàn thành ({completedAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Không có lịch hẹn chờ xác nhận</p>
                  </CardContent>
                </Card>
              ) : (
                pendingAppointments.map((appointment) => renderAppointmentCard(appointment, true))
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              {confirmedAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Không có lịch hẹn đã xác nhận</p>
                  </CardContent>
                </Card>
              ) : (
                confirmedAppointments.map((appointment) => renderAppointmentCard(appointment, true))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedAppointments.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">Chưa có lịch hẹn hoàn thành</p>
                  </CardContent>
                </Card>
              ) : (
                completedAppointments.map((appointment) => renderAppointmentCard(appointment, false))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PsychologistLayout>
    </ProtectedRoute>
  )
}
