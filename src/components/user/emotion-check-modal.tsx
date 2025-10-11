"use client"

import type React from "react"

import { useState } from "react"
import type { EmotionLevel } from "../../types"

interface EmotionCheckModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (level: EmotionLevel, note: string) => void
  onSkip?: () => void
}

export default function EmotionCheckModal({ isOpen, onClose, onSubmit, onSkip }: EmotionCheckModalProps) {
  const [emotionLevel, setEmotionLevel] = useState<EmotionLevel>(3)
  const [note, setNote] = useState("")

  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]
  const emotionColors = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"]

  const resetForm = () => {
    setEmotionLevel(3)
    setNote("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(emotionLevel, note)
    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSkip = () => {
    resetForm()
    if (onSkip) {
      onSkip()
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-2">Hôm nay bạn cảm thấy thế nào?</h2>
        <p className="text-muted-foreground mb-6">Hãy chia sẻ cảm xúc của bạn để chúng tôi có thể hỗ trợ tốt hơn</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Mức độ cảm xúc</span>
              <span className="text-lg font-bold" style={{ color: emotionColors[emotionLevel - 1] }}>
                {emotionLabels[emotionLevel - 1]}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={emotionLevel}
              onChange={(e) => setEmotionLevel(Number(e.target.value) as EmotionLevel)}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${emotionColors.join(", ")})`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="note" className="block text-sm font-medium mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              rows={3}
              placeholder="Chia sẻ thêm về cảm xúc của bạn..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Bỏ qua
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
