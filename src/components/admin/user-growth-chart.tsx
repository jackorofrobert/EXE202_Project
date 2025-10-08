interface UserGrowthChartProps {
  data: { date: string; users: number }[]
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const maxUsers = Math.max(...data.map((d) => d.users))
  const chartHeight = 200

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Tăng trưởng người dùng</h3>
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight} className="overflow-visible">
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="2"
            points={data
              .map((d, i) => {
                const x = (i / (data.length - 1)) * 100
                const y = chartHeight - (d.users / maxUsers) * (chartHeight - 40)
                return `${x}%,${y}`
              })
              .join(" ")}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = chartHeight - (d.users / maxUsers) * (chartHeight - 40)
            return <circle key={i} cx={`${x}%`} cy={y} r="4" fill="#6366f1" />
          })}
        </svg>
      </div>
      <div className="flex justify-between mt-4">
        {data.map((d) => (
          <div key={d.date} className="text-center">
            <div className="text-xs text-muted-foreground">{d.date}</div>
            <div className="text-sm font-medium">{d.users}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
