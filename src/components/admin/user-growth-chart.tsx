"use client"

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface UserGrowthChartProps {
  data: { date: string; users: number }[]
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
        <h3 className="text-lg font-semibold mb-6">Tăng trưởng người dùng</h3>
        <div className="text-center text-muted-foreground">Không có dữ liệu</div>
      </div>
    )
  }

  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Người dùng',
        data: data.map(d => d.users),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
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
            return `Người dùng: ${context.parsed.y}`
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
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(99, 102, 241)',
      },
    },
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold mb-6">Tăng trưởng người dùng</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
