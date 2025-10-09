interface BookingStatsChartProps {
  data: { month: string; bookings: number }[]
}

export default function BookingStatsChart({ data }: BookingStatsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold mb-6">Thống kê đặt lịch</h3>
        <div className="text-center text-muted-foreground">Không có dữ liệu</div>
      </div>
    )
  }

  const maxBookings = Math.max(...data.map((d) => d.bookings))

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Thống kê đặt lịch</h3>
      <div className="flex items-end justify-between gap-4 h-48">
        {data.map((d) => {
          const height = maxBookings > 0 ? (d.bookings / maxBookings) * 100 : 0
          return (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-sm font-medium">{d.bookings}</div>
              <div className="w-full bg-primary rounded-t" style={{ height: `${height}%` }} />
              <div className="text-xs text-muted-foreground">{d.month}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
