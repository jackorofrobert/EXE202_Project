"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"

export default function SidebarNav() {
  const location = useLocation()
  const { user } = useAuth()
  const isGoldUser = user?.tier === "gold"

  const navItems = [
    { path: "/dashboard", label: "Trang chủ", icon: "🏠", available: true },
    { path: "/dashboard/diary", label: "Nhật ký", icon: "📔", available: true },
    { path: "/dashboard/chatbot", label: "Chatbot", icon: "💬", available: true },
    { path: "/dashboard/booking", label: "Đặt lịch", icon: "📅", available: isGoldUser },
    { path: "/dashboard/profile", label: "Thông tin", icon: "👤", available: true },
  ]

  return (
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
  )
}
