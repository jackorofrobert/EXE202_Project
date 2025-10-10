"use client"

import { useState, useRef } from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { CameraIcon, UploadIcon, XIcon } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (avatarUrl: string) => void
  disabled?: boolean
  className?: string
}

export default function AvatarUpload({ 
  currentAvatar, 
  onAvatarChange, 
  disabled = false,
  className = ""
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary configuration missing. Please check your environment variables.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file ảnh hợp lệ",
        variant: "destructive"
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // Upload to Cloudinary
      const avatarUrl = await uploadToCloudinary(file)
      
      // Update parent component
      onAvatarChange(avatarUrl)
      
      toast({
        title: "Thành công",
        description: "Avatar đã được cập nhật"
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Lỗi",
        description: "Không thể upload avatar. Vui lòng thử lại.",
        variant: "destructive"
      })
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setPreviewUrl(null)
    onAvatarChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const displayAvatar = previewUrl || currentAvatar || "/placeholder-user.jpg"

  return (
    <Card className={`w-fit ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          {/* Avatar Display */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
              <img
                src={displayAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-user.jpg"
                }}
              />
            </div>
            
            {/* Upload Overlay */}
            {!disabled && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                   onClick={() => fileInputRef.current?.click()}>
                <CameraIcon className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          {/* Upload Controls */}
          {!disabled && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2"
              >
                <UploadIcon className="h-4 w-4" />
                {isUploading ? "Đang upload..." : "Chọn ảnh"}
              </Button>
              
              {(currentAvatar || previewUrl) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAvatar}
                  disabled={isUploading}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <XIcon className="h-4 w-4" />
                  Xóa
                </Button>
              )}
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          {/* Upload Progress */}
          {isUploading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Đang upload...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
