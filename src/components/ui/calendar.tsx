"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

interface CalendarProps {
  className?: string
  appointments: Array<{
    id: string
    date: string
    time: string
    status: string
    userId: string
    notes?: string
  }>
  users?: Array<{
    id: string
    name: string
  }>
  onDateClick?: (date: string) => void
  onAppointmentClick?: (appointment: any) => void
}

export function Calendar({ className, appointments, users = [], onDateClick, onAppointmentClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  const monthNames = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ]
  
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    
    return days
  }
  
  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return appointments.filter(apt => apt.date === dateStr)
  }
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  const goToToday = () => {
    setCurrentDate(new Date())
  }
  
  const days = getDaysInMonth(currentDate)
  
  return (
    <div className={cn("bg-white rounded-lg border shadow-sm", className)}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hôm nay
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-20" />
            }
            
            const dayAppointments = getAppointmentsForDate(day)
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
            
            return (
              <div
                key={day}
                className={cn(
                  "h-20 border border-gray-200 p-1 cursor-pointer hover:bg-gray-50 transition-colors",
                  isToday && "bg-blue-50 border-blue-300"
                )}
                onClick={() => onDateClick?.(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
              >
                <div className={cn("text-sm font-medium mb-1", isToday && "text-blue-600")}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "text-xs p-1 rounded cursor-pointer truncate",
                        appointment.status === 'pending' && "bg-yellow-100 text-yellow-800",
                        appointment.status === 'confirmed' && "bg-green-100 text-green-800",
                        appointment.status === 'completed' && "bg-blue-100 text-blue-800",
                        appointment.status === 'cancelled' && "bg-red-100 text-red-800"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        onAppointmentClick?.(appointment)
                      }}
                    >
                      {appointment.time} - {users.find(u => u.id === appointment.userId)?.name || `#${appointment.userId}`}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 2} khác
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}