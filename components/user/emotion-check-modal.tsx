"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { EmotionLevel } from "@/types"

interface EmotionCheckModalProps {
  open: boolean
  onComplete: (level: EmotionLevel, note?: string) => void
}

const EMOTION_LABELS = {
  1: { label: "Rất tệ", color: "text-red-600", emoji: "😢" },
  2: { label: "Tệ", color: "text-orange-600", emoji: "😟" },
  3: { label: "Bình thường", color: "text-yellow-600", emoji: "😐" },
  4: { label: "Tốt", color: "text-lime-600", emoji: "🙂" },
  5: { label: "Rất tốt", color: "text-green-600", emoji: "😊" },
}

export function EmotionCheckModal({ open, onComplete }: EmotionCheckModalProps) {
  const [level, setLevel] = useState<EmotionLevel>(3)
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    onComplete(level, note || undefined)
  }

  const currentEmotion = EMOTION_LABELS[level]

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Hôm nay bạn cảm thấy thế nào?</DialogTitle>
          <DialogDescription>Hãy chia sẻ cảm xúc của bạn để chúng tôi có thể hỗ trợ tốt hơn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-2">{currentEmotion.emoji}</div>
              <p className={`text-xl font-semibold ${currentEmotion.color}`}>{currentEmotion.label}</p>
            </div>

            <div className="space-y-2">
              <Label>Mức độ cảm xúc (1-5)</Label>
              <Slider
                value={[level]}
                onValueChange={(value) => setLevel(value[0] as EmotionLevel)}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rất tệ</span>
                <span>Rất tốt</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="note"
              placeholder="Bạn muốn chia sẻ gì về cảm xúc của mình..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Tiếp tục
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
