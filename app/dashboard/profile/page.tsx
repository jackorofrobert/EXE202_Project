"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserLayout } from "@/components/layout/user-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Crown, Mail, UserIcon, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isGoldUser } = useAuth()

  return (
    <ProtectedRoute requiredRole="user">
      <UserLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thông tin cá nhân</h1>
            <p className="text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Thông tin tài khoản</CardTitle>
                <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="flex gap-2">
                    <UserIcon className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex gap-2">
                    <Mail className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input id="email" type="email" defaultValue={user?.email} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joined">Ngày tham gia</Label>
                  <div className="flex gap-2">
                    <Calendar className="h-4 w-4 mt-3 text-muted-foreground" />
                    <Input
                      id="joined"
                      defaultValue={new Date(user?.createdAt || "").toLocaleDateString("vi-VN")}
                      disabled
                    />
                  </div>
                </div>

                <Button>Lưu thay đổi</Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gói dịch vụ</CardTitle>
                  <CardDescription>Gói hiện tại của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Badge variant={isGoldUser ? "default" : "secondary"} className="text-lg px-4 py-2">
                      {isGoldUser ? (
                        <>
                          <Crown className="mr-2 h-4 w-4" />
                          Gold Member
                        </>
                      ) : (
                        "Free Member"
                      )}
                    </Badge>

                    {!isGoldUser && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Nâng cấp lên Gold để:</p>
                        <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                          <li>Trò chuyện không giới hạn với chatbot</li>
                          <li>Đặt lịch với bác sĩ tâm lý</li>
                          <li>Chat trực tiếp với bác sĩ</li>
                          <li>Phân tích cảm xúc chi tiết</li>
                        </ul>
                        <Link href="/dashboard/upgrade">
                          <Button className="w-full mt-4">
                            <Crown className="mr-2 h-4 w-4" />
                            Nâng cấp ngay
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </UserLayout>
    </ProtectedRoute>
  )
}
