"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Crown } from "lucide-react"
import { SidebarNav } from "@/components/user/sidebar-nav"

export function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isGoldUser } = useAuth()

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
            <SidebarNav />
          </div>

          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <Badge variant={isGoldUser ? "default" : "secondary"} className="text-xs">
                  {isGoldUser ? (
                    <>
                      <Crown className="mr-1 h-3 w-3" />
                      Gold
                    </>
                  ) : (
                    "Free"
                  )}
                </Badge>
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
        {/* Mobile Header */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">EC</span>
            </div>
            <span className="font-semibold">EmoCare</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isGoldUser ? "default" : "secondary"}>
              {isGoldUser ? (
                <>
                  <Crown className="mr-1 h-3 w-3" />
                  Gold
                </>
              ) : (
                "Free"
              )}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
