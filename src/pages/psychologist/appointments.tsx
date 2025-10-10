"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Calendar } from "../../components/ui/calendar"
import { useToast } from "../../hooks/use-toast"
import { CalendarIcon, ClockIcon, UserIcon, CheckIcon, XIcon, ListIcon, GridIcon } from "lucide-react"
import type { Booking, BookingStatus } from "../../types"

export default function PsychologistAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar')
  const { toast } = useToast()

  const loadAppointments = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const data = await FirestoreService.getBookingsForPsychologist(user.id)
      setAppointments(data)
    } catch (error) {
      console.error("Error loading appointments:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lịch hẹn",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await FirestoreService.updateBookingStatus(bookingId, newStatus)
      toast({
        title: "Thành công",
        description: `Cập nhật trạng thái lịch hẹn thành ${newStatus}`
      })
      loadAppointments() // Reload data
    } catch (error) {
      console.error("Error updating appointment status:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái lịch hẹn",
        variant: "destructive"
      })
    }
  }

  const handleViewDetails = (appointment: Booking) => {
    setSelectedAppointment(appointment)
    setNotes(appointment.notes || "")
    setIsModalOpen(true)
  }

  const handleUpdateNotes = async () => {
    if (!selectedAppointment) return

    try {
      await FirestoreService.updateBookingStatus(selectedAppointment.id, selectedAppointment.status, notes)
      toast({
        title: "Thành công",
        description: "Cập nhật ghi chú thành công"
      })
      setIsModalOpen(false)
      loadAppointments()
    } catch (error) {
      console.error("Error updating notes:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ghi chú",
        variant: "destructive"
      })
    }
  }

  const handleCalendarDateClick = (date: string) => {
    const dayAppointments = appointments.filter(apt => apt.date === date)
    if (dayAppointments.length > 0) {
      toast({
        title: `Lịch hẹn ngày ${new Date(date).toLocaleDateString('vi-VN')}`,
        description: `Có ${dayAppointments.length} lịch hẹn trong ngày này`
      })
    }
  }

  const handleCalendarAppointmentClick = (appointment: Booking) => {
    handleViewDetails(appointment)
  }

  const getStatusBadge = (status: BookingStatus) => {
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Lịch hẹn</h2>
          <p className="text-muted-foreground">Quản lý các cuộc hẹn với bệnh nhân</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="flex items-center gap-2"
          >
            <GridIcon className="h-4 w-4" />
            Lịch
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <ListIcon className="h-4 w-4" />
            Danh sách
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải lịch hẹn...</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có lịch hẹn nào</p>
          </CardContent>
        </Card>
      ) : viewMode === 'calendar' ? (
        <Calendar
          appointments={appointments}
          onDateClick={handleCalendarDateClick}
          onAppointmentClick={handleCalendarAppointmentClick}
        />
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Bệnh nhân #{appointment.userId}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(appointment.date).toLocaleDateString("vi-VN")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          {appointment.time}
                        </span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded">
                          {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(appointment)}
                  >
                    Xem chi tiết
                  </Button>
                  
                  {appointment.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Xác nhận
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      >
                        <XIcon className="h-4 w-4 mr-1" />
                        Hủy
                      </Button>
                    </>
                  )}
                  
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Hoàn thành
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
            <DialogDescription>
              Xem và cập nhật thông tin chi tiết về lịch hẹn
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Bệnh nhân</Label>
                <p className="text-sm text-muted-foreground">#{selectedAppointment.userId}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Ngày giờ</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedAppointment.date).toLocaleDateString("vi-VN")} - {selectedAppointment.time}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Trạng thái</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedAppointment.status === 'pending' ? 'Chờ xác nhận' :
                   selectedAppointment.status === 'confirmed' ? 'Đã xác nhận' :
                   selectedAppointment.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm ghi chú về cuộc hẹn..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>
            <Button onClick={handleUpdateNotes}>
              Cập nhật ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
