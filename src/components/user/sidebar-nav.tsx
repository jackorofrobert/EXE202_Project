"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import { Badge } from "../ui/badge"
import { CrownIcon } from "lucide-react"

export default function SidebarNav() {
  const location = useLocation()
  const { user } = useAuth()
  const isGoldUser = user?.tier === "gold"

  const navItems = [
    { path: "/dashboard", label: "Trang chủ", icon: "🏠", available: true },
    { path: "/dashboard/diary", label: "Nhật ký", icon: "📔", available: true },
    { path: "/dashboard/chatbot", label: "Chatbot", icon: "💬", available: true },
    { path: "/dashboard/chat", label: "Chat với bác sĩ", icon: "👨‍⚕️", available: isGoldUser },
    { path: "/dashboard/booking", label: "Đặt lịch", icon: "📅", available: isGoldUser },
    { path: "/dashboard/profile", label: "Thông tin", icon: "👤", available: true },
  ]

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <img
              src={user?.avatar || "/placeholder-user.jpg"}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-user.jpg"
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{user?.name || "User"}</h3>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Badge 
          variant="secondary" 
          className={`text-xs w-full justify-center ${
            isGoldUser ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          <CrownIcon className="h-3 w-3 mr-1" />
          {isGoldUser ? 'Gold Member' : 'Free Member'}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const isDisabled = !item.available

          return (
            <Link
              key={item.path}
              to={isDisabled ? "#" : item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isDisabled
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : "hover:bg-muted"
              }`}
              onClick={(e) => isDisabled && e.preventDefault()}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {isDisabled && (
                <span className="ml-auto text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Gold</span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
