"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import AvatarUpload from "../../components/user/avatar-upload"
import { UserIcon, CrownIcon } from "lucide-react"

export default function UserProfile() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: ""
  })

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const userData = await FirestoreService.getUser(user.id)
      if (userData) {
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          avatar: userData.avatar || ""
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin hồ sơ",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, toast])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleSaveProfile = async () => {
    if (!user?.id) return

    setIsSaving(true)
    try {
      await FirestoreService.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      })

      // Refresh user data in context
      await refreshUser()

      toast({
        title: "Thành công",
        description: "Cập nhật hồ sơ thành công"
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hồ sơ",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarChange = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar: avatarUrl }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Hồ sơ cá nhân</h2>
        <p className="text-muted-foreground">Quản lý thông tin cá nhân và avatar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Avatar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload
                currentAvatar={formData.avatar}
                onAvatarChange={handleAvatarChange}
                disabled={isSaving}
              />
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Status */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.avatar || "/placeholder-user.jpg"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-user.jpg"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{formData.name || "Chưa có tên"}</h3>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="secondary" 
                      className={user?.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}
                    >
                      <CrownIcon className="h-3 w-3 mr-1" />
                      {user?.tier === 'gold' ? 'Gold Member' : 'Free Member'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập tên của bạn"
                    disabled={isSaving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Nhập email của bạn"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="min-w-[120px]"
                >
                  {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
