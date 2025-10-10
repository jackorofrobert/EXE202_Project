"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "./button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./dialog"
import { Textarea } from "./textarea"
import { Label } from "./label"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rating: number, comment: string) => void
  psychologistName: string
  appointmentDate: string
  appointmentTime: string
}

export function RatingModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  psychologistName, 
  appointmentDate, 
  appointmentTime 
}: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (rating === 0) return
    onSubmit(rating, comment)
    setRating(0)
    setComment("")
    onClose()
  }

  const handleClose = () => {
    setRating(0)
    setComment("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đánh giá bác sĩ</DialogTitle>
          <DialogDescription>
            Hãy chia sẻ trải nghiệm của bạn về cuộc tư vấn với {psychologistName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appointment Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Thông tin cuộc hẹn</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Bác sĩ:</span> {psychologistName}</p>
              <p><span className="font-medium">Ngày:</span> {appointmentDate}</p>
              <p><span className="font-medium">Giờ:</span> {appointmentTime}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Đánh giá chất lượng dịch vụ</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating === 0 ? "Chọn sao đánh giá" : 
                 rating === 1 ? "Rất không hài lòng" :
                 rating === 2 ? "Không hài lòng" :
                 rating === 3 ? "Bình thường" :
                 rating === 4 ? "Hài lòng" : "Rất hài lòng"}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-base font-semibold">
              Nhận xét (tùy chọn)
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Lưu ý:</strong> Đánh giá này chỉ có thể thực hiện một lần và không thể thay đổi sau khi gửi.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
