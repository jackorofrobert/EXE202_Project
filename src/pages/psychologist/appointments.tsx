"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { useToast } from "../../hooks/use-toast"
import type { Booking, BookingStatus } from "../../types"

export default function PsychologistAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<Booking | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notes, setNotes] = useState("")
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Lịch hẹn</h2>
        <p className="text-muted-foreground">Quản lý các cuộc hẹn với bệnh nhân</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải lịch hẹn...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Chưa có lịch hẹn nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Bệnh nhân #{appointment.userId}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.date).toLocaleDateString("vi-VN")} - {appointment.time}
                  </p>
                  {appointment.notes && (
                    <p className="text-sm mt-2">{appointment.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status === 'pending' ? 'Chờ xác nhận' :
                     appointment.status === 'confirmed' ? 'Đã xác nhận' :
                     appointment.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                  </span>
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
                    >
                      Xác nhận
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                    >
                      Hủy
                    </Button>
                  </>
                )}
                
                {appointment.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                  >
                    Hoàn thành
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
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
