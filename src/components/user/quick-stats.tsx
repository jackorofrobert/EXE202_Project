interface QuickStatsProps {
  totalEmotions: number
  averageEmotion: number
  streak: number
}

export default function QuickStats({ totalEmotions, averageEmotion, streak }: QuickStatsProps) {
  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]
  const emotionLabel = emotionLabels[Math.round(averageEmotion) - 1] || "Chưa có dữ liệu"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground mb-2">Tổng bản ghi</div>
        <div className="text-3xl font-bold text-primary">{totalEmotions}</div>
      </div>
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground mb-2">Cảm xúc trung bình</div>
        <div className="text-3xl font-bold text-primary">{emotionLabel}</div>
      </div>
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="text-sm text-muted-foreground mb-2">Chuỗi ngày liên tiếp</div>
        <div className="text-3xl font-bold text-primary">{streak} ngày</div>
      </div>
    </div>
  )
}
