"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserLayout } from "@/components/layout/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PsychologistCard } from "@/components/booking/psychologist-card"
import { BookingModal } from "@/components/booking/booking-modal"
import { BookingList } from "@/components/booking/booking-list"
import { UpgradePrompt } from "@/components/chatbot/upgrade-prompt"
import { useAuth } from "@/contexts/auth-context"
import { Search } from "lucide-react"
import type { Psychologist, Booking } from "@/types"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockPsychologists: Psychologist[] = [
  {
    id: "psy-1",
    name: "TS. Nguyễn Thị Mai",
    title: "Bác sĩ Tâm lý lâm sàng",
    avatar: "/female-doctor.png",
    specialties: ["Lo âu", "Trầm cảm", "Stress công việc"],
    experience: "15 năm kinh nghiệm",
    bio: "Chuyên điều trị các vấn đề về lo âu, trầm cảm và stress. Sử dụng liệu pháp nhận thức hành vi (CBT) và mindfulness.",
    rating: 4.9,
    reviewCount: 127,
    price: 500000,
  },
  {
    id: "psy-2",
    name: "ThS. Trần Văn Hùng",
    title: "Chuyên gia Tâm lý trị liệu",
    avatar: "/male-doctor.png",
    specialties: ["Quan hệ gia đình", "Tư vấn hôn nhân", "Phát triển bản thân"],
    experience: "10 năm kinh nghiệm",
    bio: "Chuyên tư vấn về các vấn đề gia đình, hôn nhân và phát triển cá nhân. Tiếp cận theo hướng nhân văn.",
    rating: 4.8,
    reviewCount: 95,
    price: 450000,
  },
  {
    id: "psy-3",
    name: "BS. Lê Thị Hương",
    title: "Bác sĩ Tâm thần",
    avatar: "/female-psychiatrist.jpg",
    specialties: ["Rối loạn tâm thần", "Trầm cảm nặng", "Rối loạn lưỡng cực"],
    experience: "12 năm kinh nghiệm",
    bio: "Chuyên điều trị các rối loạn tâm thần, có thể kê đơn thuốc khi cần thiết. Kết hợp liệu pháp và thuốc.",
    rating: 4.9,
    reviewCount: 143,
    price: 600000,
  },
  {
    id: "psy-4",
    name: "ThS. Phạm Minh Tuấn",
    title: "Nhà Tâm lý học",
    avatar: "/male-psychologist.png",
    specialties: ["Tâm lý trẻ em", "Tâm lý vị thành niên", "Học đường"],
    experience: "8 năm kinh nghiệm",
    bio: "Chuyên tư vấn tâm lý cho trẻ em và thanh thiếu niên. Giúp giải quyết các vấn đề học đường và phát triển.",
    rating: 4.7,
    reviewCount: 78,
    price: 400000,
  },
]

const mockBookings: Booking[] = [
  {
    id: "book-1",
    userId: "user-1",
    psychologistId: "psy-1",
    psychologistName: "TS. Nguyễn Thị Mai",
    psychologistTitle: "Bác sĩ Tâm lý lâm sàng",
    date: new Date("2025-01-20"),
    time: "14:00",
    status: "confirmed",
    note: "Tôi đang gặp vấn đề về lo âu và stress công việc",
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "book-2",
    userId: "user-1",
    psychologistId: "psy-2",
    psychologistName: "ThS. Trần Văn Hùng",
    psychologistTitle: "Chuyên gia Tâm lý trị liệu",
    date: new Date("2025-01-25"),
    time: "10:00",
    status: "pending",
    note: "Cần tư vấn về mối quan hệ gia đình",
    createdAt: new Date("2025-01-14"),
  },
]

export default function BookingPage() {
  const { isGoldUser } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPsychologist, setSelectedPsychologist] = useState<Psychologist | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)

  const filteredPsychologists = mockPsychologists.filter(
    (psy) =>
      psy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      psy.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleBooking = (psychologistId: string) => {
    if (!isGoldUser) {
      toast({
        title: "Yêu cầu nâng cấp",
        description: "Vui lòng nâng cấp lên Gold để đặt lịch với bác sĩ",
        variant: "destructive",
      })
      return
    }

    const psychologist = mockPsychologists.find((p) => p.id === psychologistId)
    setSelectedPsychologist(psychologist || null)
    setShowBookingModal(true)
  }

  const handleConfirmBooking = (date: Date, time: string, note: string) => {
    if (!selectedPsychologist) return

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      userId: "user-1",
      psychologistId: selectedPsychologist.id,
      psychologistName: selectedPsychologist.name,
      psychologistTitle: selectedPsychologist.title,
      date,
      time,
      status: "pending",
      note,
      createdAt: new Date(),
    }

    setBookings([newBooking, ...bookings])

    toast({
      title: "Đặt lịch thành công",
      description: "Bác sĩ sẽ xác nhận lịch hẹn của bạn trong thời gian sớm nhất",
    })

    console.log("[v0] New booking created:", newBooking)
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings(bookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b)))

    toast({
      title: "Đã hủy lịch hẹn",
      description: "Lịch hẹn của bạn đã được hủy thành công",
    })
  }

  const handleChat = (bookingId: string) => {
    console.log("[v0] Opening chat for booking:", bookingId)
    toast({
      title: "Tính năng đang phát triển",
      description: "Tính năng chat với bác sĩ sẽ sớm được ra mắt",
    })
  }

  if (!isGoldUser) {
    return (
      <ProtectedRoute requiredRole="user">
        <UserLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Đặt lịch bác sĩ</h1>
              <p className="text-muted-foreground">Tính năng dành cho thành viên Gold</p>
            </div>

            <UpgradePrompt />
          </div>
        </UserLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Đặt lịch bác sĩ</h1>
            <p className="text-muted-foreground">Tìm và đặt lịch với bác sĩ tâm lý phù hợp</p>
          </div>

          <Tabs defaultValue="find" className="space-y-6">
            <TabsList>
              <TabsTrigger value="find">Tìm bác sĩ</TabsTrigger>
              <TabsTrigger value="bookings">Lịch hẹn của tôi</TabsTrigger>
            </TabsList>

            <TabsContent value="find" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tìm kiếm bác sĩ</CardTitle>
                  <CardDescription>Tìm theo tên hoặc chuyên môn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm bác sĩ, chuyên môn..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredPsychologists.map((psychologist) => (
                  <PsychologistCard key={psychologist.id} psychologist={psychologist} onBooking={handleBooking} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <BookingList bookings={bookings} onCancel={handleCancelBooking} onChat={handleChat} />
            </TabsContent>
          </Tabs>
        </div>

        <BookingModal
          open={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          psychologist={selectedPsychologist}
          onConfirm={handleConfirmBooking}
        />
      </UserLayout>
    </ProtectedRoute>
  )
}
