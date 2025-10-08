"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserLayout } from "@/components/layout/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"

export default function UpgradePage() {
  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Nâng cấp lên Gold</h1>
            <p className="text-muted-foreground">Trải nghiệm đầy đủ các tính năng chăm sóc sức khỏe tâm lý</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Gói miễn phí</CardDescription>
                <div className="text-3xl font-bold">0đ</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Ghi nhận cảm xúc hàng ngày</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Nhật ký cá nhân</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Chatbot gợi ý hoạt động</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Biểu đồ cảm xúc cơ bản</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  Gói hiện tại
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                PHỔ BIẾN
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Gold
                </CardTitle>
                <CardDescription>Gói cao cấp</CardDescription>
                <div className="text-3xl font-bold">299.000đ/tháng</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Tất cả tính năng Free +
                </Badge>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Trò chuyện không giới hạn với AI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Đặt lịch với bác sĩ tâm lý</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Chat trực tiếp với bác sĩ</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Phân tích cảm xúc chi tiết</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Hỗ trợ ưu tiên 24/7</span>
                  </li>
                </ul>
                <Button className="w-full">
                  <Crown className="mr-2 h-4 w-4" />
                  Nâng cấp ngay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  )
}
