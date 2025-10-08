"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import type { EmotionStats } from "@/types"

interface EmotionStatsChartProps {
  data: EmotionStats
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"]

const EMOTION_LABELS = {
  level1: "Rất tệ",
  level2: "Tệ",
  level3: "Bình thường",
  level4: "Tốt",
  level5: "Rất tốt",
}

export function EmotionStatsChart({ data }: EmotionStatsChartProps) {
  const chartData = [
    { name: EMOTION_LABELS.level1, value: data.level1, level: 1 },
    { name: EMOTION_LABELS.level2, value: data.level2, level: 2 },
    { name: EMOTION_LABELS.level3, value: data.level3, level: 3 },
    { name: EMOTION_LABELS.level4, value: data.level4, level: 4 },
    { name: EMOTION_LABELS.level5, value: data.level5, level: 5 },
  ]

  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ cảm xúc của bạn</CardTitle>
        <CardDescription>Phân bố cảm xúc trong suốt quá trình sử dụng</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            level1: { label: EMOTION_LABELS.level1, color: COLORS[0] },
            level2: { label: EMOTION_LABELS.level2, color: COLORS[1] },
            level3: { label: EMOTION_LABELS.level3, color: COLORS[2] },
            level4: { label: EMOTION_LABELS.level4, color: COLORS[3] },
            level5: { label: EMOTION_LABELS.level5, color: COLORS[4] },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="mt-4 text-center text-sm text-muted-foreground">Tổng số lần ghi nhận: {total}</div>
      </CardContent>
    </Card>
  )
}
