import type { EmotionEntry } from "../../types"

interface RecentEmotionsProps {
  emotions: EmotionEntry[]
}

export default function RecentEmotions({ emotions }: RecentEmotionsProps) {
  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]
  const emotionColors = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"]

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-6">Cảm xúc gần đây</h3>
      <div className="space-y-3 flex-1 overflow-y-auto">
        {emotions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chưa có bản ghi cảm xúc nào</p>
          </div>
        ) : (
          emotions.slice(0, 5).map((emotion) => (
            <div
              key={emotion.id}
              className="flex items-center justify-between py-3 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: emotionColors[emotion.level - 1] }} />
                <div>
                  <div className="font-medium">{emotionLabels[emotion.level - 1]}</div>
                  {emotion.note && <div className="text-sm text-muted-foreground mt-1">{emotion.note}</div>}
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
