"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, MessageCircle, Calendar, BookOpen, User, Crown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function SidebarNav() {
  const pathname = usePathname()
  const { isGoldUser } = useAuth()

  const navItems = [
    {
      title: "Trang chủ",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Chatbot",
      href: "/dashboard/chatbot",
      icon: MessageCircle,
    },
    {
      title: "Đặt lịch bác sĩ",
      href: "/dashboard/booking",
      icon: Calendar,
      goldOnly: true,
    },
    {
      title: "Nhật ký",
      href: "/dashboard/diary",
      icon: BookOpen,
    },
    {
      title: "Thông tin cá nhân",
      href: "/dashboard/profile",
      icon: User,
    },
  ]

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        const isLocked = item.goldOnly && !isGoldUser

        return (
          <Link key={item.href} href={isLocked ? "/dashboard/upgrade" : item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-secondary")}
              disabled={isLocked}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
              {item.goldOnly && (
                <Badge variant="secondary" className="ml-auto">
                  <Crown className="h-3 w-3" />
                </Badge>
              )}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
