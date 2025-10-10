"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import type { Psychologist } from "../../types"

interface PsychologistModalProps {
  isOpen: boolean
  onClose: () => void
  psychologist?: Psychologist | null
  onSuccess: () => void
}

export default function PsychologistModal({ isOpen, onClose, psychologist, onSuccess }: PsychologistModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    bio: "",
    hourlyRate: "",
    availability: "available" as "available" | "busy" | "offline",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isEdit = !!psychologist

  const resetForm = () => {
    if (psychologist) {
      setFormData({
        name: psychologist.name,
        email: psychologist.email,
        specialization: psychologist.specialization,
        experience: psychologist.experience?.toString() || "",
        bio: psychologist.bio,
        hourlyRate: psychologist.hourlyRate?.toString() || "",
        availability: psychologist.availability || "available",
        password: ""
      })
    } else {
      setFormData({
        name: "",
        email: "",
        specialization: "",
        experience: "",
        bio: "",
        hourlyRate: "",
        availability: "available",
        password: ""
      })
    }
  }

  useEffect(() => {
    resetForm()
  }, [psychologist])

  useEffect(() => {
    if (!isOpen) {
      resetForm()
    }
  }, [isOpen, psychologist])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEdit) {
        // Update existing psychologist
        await FirestoreService.updatePsychologist(psychologist!.id, {
          name: formData.name,
          email: formData.email,
          specialization: formData.specialization,
          experience: parseInt(formData.experience) || 0,
          bio: formData.bio,
          hourlyRate: parseInt(formData.hourlyRate) || 0,
          availability: formData.availability
        })
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin bác sĩ tâm lý thành công"
        })
      } else {
        // Create new psychologist (this would need to be implemented)
        toast({
          title: "Thông báo",
          description: "Tính năng tạo bác sĩ tâm lý mới sẽ được thêm vào sau"
        })
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving psychologist:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin bác sĩ tâm lý",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!psychologist || !window.confirm("Bạn có chắc chắn muốn xóa bác sĩ tâm lý này?")) return

    setIsLoading(true)
    try {
      await FirestoreService.deleteUser(psychologist.id)
      toast({
        title: "Thành công",
        description: "Xóa bác sĩ tâm lý thành công"
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting psychologist:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa bác sĩ tâm lý",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-200 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa Bác sĩ" : "Thêm Bác sĩ mới"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Tên</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-sm font-medium text-gray-700">Chuyên khoa</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Kinh nghiệm (năm)</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate" className="text-sm font-medium text-gray-700">Giá theo giờ (VND)</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability" className="text-sm font-medium text-gray-700">Trạng thái</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: "available" | "busy" | "offline") => 
                  setFormData(prev => ({ ...prev, availability: value }))
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Có sẵn</SelectItem>
                  <SelectItem value="busy">Bận</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Giới thiệu</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required={!isEdit}
              />
            </div>
          )}

          <DialogFooter className="flex justify-between pt-6 border-t border-gray-100">
            <div>
              {isEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Xóa
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
