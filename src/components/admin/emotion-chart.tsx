interface EmotionChartProps {
  data: { level: number; count: number }[]
}

export default function EmotionChart({ data }: EmotionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold mb-6">Phân bố cảm xúc</h3>
        <div className="text-center text-muted-foreground">Không có dữ liệu</div>
      </div>
    )
  }

  const total = data.reduce((sum, item) => sum + item.count, 0)
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"]
  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Phân bố cảm xúc</h3>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100
              const offset = data.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 100, 0)
              return (
                <circle
                  key={item.level}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index]}
                  strokeWidth="20"
                  strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                  strokeDashoffset={-offset * 2.51}
                />
              )
            })}
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.level} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span className="text-sm">{emotionLabels[index]}</span>
            </div>
            <span className="text-sm font-medium">
              {item.count} ({((item.count / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
