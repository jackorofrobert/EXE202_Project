"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import AvatarUpload from "../../components/user/avatar-upload"
import { UserIcon, CrownIcon, LockIcon, ShieldIcon } from "lucide-react"

export default function UserProfile() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
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
      // Use user from context first, then fetch from Firestore if needed
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      })
      
      // Also fetch latest data from Firestore
      const userData = await FirestoreService.getUser(user.id)
      
      if (userData) {
        setFormData({
          name: userData.name || user.name || "",
          email: userData.email || user.email || "",
          avatar: userData.avatar || user.avatar || ""
        })
      }
    } catch (error) {
      console.error("Error loading profile:", error)
      // Fallback to context data
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || ""
      })
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin hồ sơ từ server",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

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

  // Calculate Gold membership expiration info
  const getGoldExpirationInfo = () => {
    if (!user?.goldExpiresAt) {
      return { 
        message: "Thành viên Gold vĩnh viễn", 
        isExpiring: false,
        daysLeft: null
      }
    }
    
    const expirationDate = new Date(user.goldExpiresAt)
    const now = new Date()
    const timeLeft = expirationDate.getTime() - now.getTime()
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24))
    
    if (daysLeft <= 0) {
      return { 
        message: "Thành viên Gold đã hết hạn", 
        isExpiring: true,
        daysLeft: 0
      }
    } else if (daysLeft <= 7) {
      return { 
        message: `Thành viên Gold còn ${daysLeft} ngày`, 
        isExpiring: true,
        daysLeft: daysLeft
      }
    } else {
      return { 
        message: `Thành viên Gold còn ${daysLeft} ngày`, 
        isExpiring: false,
        daysLeft: daysLeft
      }
    }
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
        <div className="lg:col-span-1 space-y-6">
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

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Bảo mật tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Quản lý mật khẩu và bảo mật tài khoản
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/change-password")}
                  className="w-full"
                >
                  <LockIcon className="h-4 w-4 mr-2" />
                  Thay đổi mật khẩu
                </Button>
              </div>
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
                    src={formData.avatar || user?.avatar || "/placeholder-user.jpg"}
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
                    {user?.tier === 'gold' && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        getGoldExpirationInfo().isExpiring 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {getGoldExpirationInfo().message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Gold Membership Info */}
              {user?.tier === 'gold' && (
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <CrownIcon className="h-4 w-4" />
                    Thông tin Gold Membership
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-700">Trạng thái:</span>
                      <span className={`font-medium ${
                        getGoldExpirationInfo().isExpiring ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {getGoldExpirationInfo().message}
                      </span>
                    </div>
                    {getGoldExpirationInfo().daysLeft !== null && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Ngày hết hạn:</span>
                        <span className="text-yellow-800 font-medium">
                          {user.goldExpiresAt ? new Date(user.goldExpiresAt).toLocaleDateString('vi-VN') : 'Không xác định'}
                        </span>
                      </div>
                    )}
                    {getGoldExpirationInfo().isExpiring && getGoldExpirationInfo().daysLeft !== null && (
                      <div className="mt-3 p-2 bg-orange-100 rounded text-xs text-orange-800">
                        ⚠️ Gold membership sẽ hết hạn sớm. Hãy gia hạn để tiếp tục sử dụng các tính năng premium.
                      </div>
                    )}
                  </div>
                </div>
              )}

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
