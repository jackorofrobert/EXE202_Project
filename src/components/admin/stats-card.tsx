interface StatsCardProps {
  title: string
  value: number
  icon: string
  trend?: { value: number; isPositive: boolean }
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? "text-secondary" : "text-destructive"}`}>
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value.toLocaleString()}</p>
    </div>
  )
}
