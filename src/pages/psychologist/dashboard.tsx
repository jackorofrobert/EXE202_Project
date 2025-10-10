"use client"

import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import Logo from "../../components/ui/logo"
import PsychologistAppointments from "./appointments"
import PsychologistChatPage from "./chat"
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
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="flex-1 p-4">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Logo size="lg" iconOnly={true} className="scale-125" />
            </div>
            <h1 className="text-xl font-bold text-primary">Psychologist Dashboard</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>
          
          <div className="mt-4">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Routes>
          <Route index element={<PsychologistAppointments />} />
          <Route path="chat" element={<PsychologistChatPage />} />
          <Route path="profile" element={<PsychologistProfile />} />
          <Route path="*" element={<Navigate to="/psychologist" replace />} />
        </Routes>
      </main>
    </div>
  )
}