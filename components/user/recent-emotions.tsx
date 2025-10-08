import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { EmotionEntry } from "@/types"

interface RecentEmotionsProps {
  entries: EmotionEntry[]
}

const EMOTION_CONFIG = {
  1: { label: "Rất tệ", emoji: "😢", color: "bg-red-100 text-red-700" },
  2: { label: "Tệ", emoji: "😟", color: "bg-orange-100 text-orange-700" },
  3: { label: "Bình thường", emoji: "😐", color: "bg-yellow-100 text-yellow-700" },
  4: { label: "Tốt", emoji: "🙂", color: "bg-lime-100 text-lime-700" },
  5: { label: "Rất tốt", emoji: "😊", color: "bg-green-100 text-green-700" },
}

export function RecentEmotions({ entries }: RecentEmotionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cảm xúc gần đây</CardTitle>
        <CardDescription>Lịch sử ghi nhận cảm xúc của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Chưa có dữ liệu cảm xúc</p>
          ) : (
            entries.map((entry) => {
              const config = EMOTION_CONFIG[entry.level]
              return (
                <div key={entry.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.color}`}>
                      <span className="text-lg">{config.emoji}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{config.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  {entry.note && <p className="text-xs text-muted-foreground max-w-[200px] truncate">{entry.note}</p>}
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
