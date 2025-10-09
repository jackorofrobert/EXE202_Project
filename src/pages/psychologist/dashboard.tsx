"use client"

import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import PsychologistAppointments from "./appointments"
import PsychologistProfile from "./profile"

export default function PsychologistDashboard() {
  const { logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: "/psychologist", label: "Lịch hẹn", icon: "📅" },
    { path: "/psychologist/chat", label: "Tin nhắn", icon: "💬" },
    { path: "/psychologist/profile", label: "Hồ sơ", icon: "👤" },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold">EmoCare</h1>
          <p className="text-sm text-muted-foreground">Bác sĩ tâm lý</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          onClick={logout}
          className="w-full mt-8 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Routes>
          <Route index element={<PsychologistAppointments />} />
          <Route path="chat" element={<div>Tin nhắn - Coming soon</div>} />
          <Route path="profile" element={<PsychologistProfile />} />
          <Route path="*" element={<Navigate to="/psychologist" replace />} />
        </Routes>
      </main>
    </div>
  )
}
