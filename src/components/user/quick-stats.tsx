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
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="text-sm text-muted-foreground mb-1">Tổng bản ghi</div>
        <div className="text-2xl font-bold">{totalEmotions}</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="text-sm text-muted-foreground mb-1">Cảm xúc trung bình</div>
        <div className="text-2xl font-bold">{emotionLabel}</div>
      </div>
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="text-sm text-muted-foreground mb-1">Chuỗi ngày liên tiếp</div>
        <div className="text-2xl font-bold">{streak} ngày</div>
      </div>
    </div>
  )
}
