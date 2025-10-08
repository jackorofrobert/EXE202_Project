import type { EmotionEntry } from "../../types"

interface RecentEmotionsProps {
  emotions: EmotionEntry[]
}

export default function RecentEmotions({ emotions }: RecentEmotionsProps) {
  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]
  const emotionColors = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"]

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-4">Cảm xúc gần đây</h3>
      <div className="space-y-3">
        {emotions.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chưa có bản ghi cảm xúc nào</p>
        ) : (
          emotions.slice(0, 5).map((emotion) => (
            <div
              key={emotion.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotionColors[emotion.level - 1] }} />
                <div>
                  <div className="font-medium">{emotionLabels[emotion.level - 1]}</div>
                  {emotion.note && <div className="text-sm text-muted-foreground">{emotion.note}</div>}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(emotion.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
