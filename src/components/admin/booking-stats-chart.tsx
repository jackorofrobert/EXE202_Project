"use client"

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Lịch hẹn',
        data: data.map(d => d.bookings),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context: any) {
            return `Tháng: ${context[0].label}`
          },
          label: function(context: any) {
            return `Lịch hẹn: ${context.parsed.y}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          }
        }
      },
    },
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Thống kê đặt lịch</h3>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
