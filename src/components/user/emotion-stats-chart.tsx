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
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border h-full flex flex-col">
      <h3 className="text-xl font-semibold mb-6">Thống kê cảm xúc</h3>
      <div className="flex items-center justify-center mb-6 flex-1">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {emotionCounts.map((item, index) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0
              const offset = total > 0 ? emotionCounts.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 100, 0) : 0
              const circumference = 2 * Math.PI * 40 // 2πr where r=40
              const strokeDasharray = total > 0 ? `${percentage * circumference / 100} ${circumference}` : `0 ${circumference}`
              const strokeDashoffset = total > 0 ? -offset * circumference / 100 : 0
              
              return (
                <circle
                  key={item.level}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={colors[index]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{total}</div>
              <div className="text-sm text-muted-foreground">Bản ghi</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {emotionCounts.map((item, index) => (
          <div key={item.level} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[index] }} />
              <span className="text-sm font-medium">{emotionLabels[index]}</span>
            </div>
            <span className="text-sm font-semibold">
              {item.count} {total > 0 && `(${((item.count / total) * 100).toFixed(1)}%)`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
