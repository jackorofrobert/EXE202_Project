"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Calendar, MessageCircle, User, BarChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function PsychologistLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    {
      title: "Tổng quan",
      href: "/psychologist",
      icon: BarChart,
    },
    {
      title: "Lịch hẹn",
      href: "/psychologist/appointments",
      icon: Calendar,
    },
    {
      title: "Tin nhắn",
      href: "/psychologist/messages",
      icon: MessageCircle,
    },
    {
      title: "Hồ sơ",
      href: "/psychologist/profile",
      icon: User,
    },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/40 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">EC</span>
            </div>
            <span className="ml-2 text-lg font-semibold">EmoCare</span>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", isActive && "bg-secondary")}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Bác sĩ tâm lý</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
