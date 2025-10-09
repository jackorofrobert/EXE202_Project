"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "../../contexts/auth-context"
import { FirestoreService } from "../../lib/firestore-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { useToast } from "../../hooks/use-toast"
import type { Psychologist } from "../../types"

export default function PsychologistProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Psychologist | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: 0,
    bio: "",
    available: true,
    rating: 0,
    totalRatings: 0
  })
  const { toast } = useToast()

  const loadProfile = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const psychologists = await FirestoreService.getPsychologists()
      const currentProfile = psychologists.find(p => p.id === user.id)
      if (currentProfile) {
        setProfile(currentProfile)
        setFormData({
          name: currentProfile.name,
          email: currentProfile.email,
          specialization: currentProfile.specialization,
          experience: currentProfile.experience,
          bio: currentProfile.bio,
          available: currentProfile.available,
          rating: currentProfile.rating,
          totalRatings: currentProfile.totalRatings || 0
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

    try {
      await FirestoreService.updatePsychologist(user.id, formData)
      toast({
        title: "Thành công",
        description: "Cập nhật hồ sơ thành công"
      })
      setIsModalOpen(false)
      loadProfile()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hồ sơ",
        variant: "destructive"
      })
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

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Không tìm thấy thông tin hồ sơ</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Hồ sơ cá nhân</h2>
          <p className="text-muted-foreground">Quản lý thông tin hồ sơ của bạn</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          Chỉnh sửa hồ sơ
        </Button>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Tên</Label>
                <p className="text-sm text-muted-foreground">{profile.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Chuyên môn</Label>
                <p className="text-sm text-muted-foreground">{profile.specialization}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Kinh nghiệm</Label>
                <p className="text-sm text-muted-foreground">{profile.experience} năm</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin nghề nghiệp</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Trạng thái</Label>
                <p className="text-sm text-muted-foreground">
                  {profile.available ? "Có sẵn" : "Bận"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Đánh giá</Label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{profile.rating}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-sm ${
                          star <= Math.floor(profile.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({profile.totalRatings || 0} đánh giá)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {profile.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Chuyên môn</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                placeholder="VD: Lo âu, Trầm cảm, Stress công việc"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Kinh nghiệm (năm)</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Mô tả về bản thân và kinh nghiệm..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, available: checked }))}
              />
              <Label htmlFor="available">Có sẵn</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveProfile}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
