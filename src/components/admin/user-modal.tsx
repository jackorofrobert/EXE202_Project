"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { FirestoreService } from "../../lib/firestore-service"
import { useToast } from "../../hooks/use-toast"
import type { User, UserRole, UserTier } from "../../types"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  onSuccess: () => void
}

export default function UserModal({ isOpen, onClose, user, onSuccess }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as UserRole,
    tier: "free" as UserTier,
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isEdit = !!user

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        tier: user.tier || "free",
        password: ""
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "user",
        tier: "free",
        password: ""
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isEdit) {
        // Update existing user
        await FirestoreService.updateUser(user!.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          tier: formData.tier
        })
        toast({
          title: "Thành công",
          description: "Cập nhật thông tin user thành công"
        })
      } else {
        // Create new user (this would need to be implemented in FirestoreService)
        toast({
          title: "Thông báo",
          description: "Tính năng tạo user mới sẽ được thêm vào sau"
        })
      }
      
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving user:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu thông tin user",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!user || !window.confirm("Bạn có chắc chắn muốn xóa user này?")) return

    setIsLoading(true)
    try {
      await FirestoreService.deleteUser(user.id)
      toast({
        title: "Thành công",
        description: "Xóa user thành công"
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi xóa user",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-2 border-gray-200 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-800">
            {isEdit ? "Chỉnh sửa User" : "Thêm User mới"}
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
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="psychologist">Bác sĩ tâm lý</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier" className="text-sm font-medium text-gray-700">Gói dịch vụ</Label>
              <Select
                value={formData.tier}
                onValueChange={(value: UserTier) => setFormData(prev => ({ ...prev, tier: value }))}
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
