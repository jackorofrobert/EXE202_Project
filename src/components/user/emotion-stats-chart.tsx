import type { EmotionEntry } from "../../types"

interface EmotionStatsChartProps {
  emotions: EmotionEntry[]
}

export default function EmotionStatsChart({ emotions }: EmotionStatsChartProps) {
  const emotionCounts = [1, 2, 3, 4, 5].map((level) => ({
    level,
    count: emotions.filter((e) => e.level === level).length,
  }))

  const total = emotions.length
  const colors = ["#ef4444", "#f59e0b", "#eab308", "#10b981", "#6366f1"]
  const emotionLabels = ["Rất tệ", "Tệ", "Bình thường", "Tốt", "Rất tốt"]

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Thống kê cảm xúc</h3>
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {emotionCounts.map((item, index) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0
              const offset = emotionCounts.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 100, 0)
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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Bản ghi</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {emotionCounts.map((item, index) => (
          <div key={item.level} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span className="text-sm">{emotionLabels[index]}</span>
            </div>
            <span className="text-sm font-medium">
              {item.count} {total > 0 && `(${((item.count / total) * 100).toFixed(1)}%)`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
