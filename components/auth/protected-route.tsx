"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole, UserTier } from "@/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
  requiredTier?: UserTier
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRole, requiredTier, fallbackPath = "/login" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        if (user?.role === "admin") {
          router.push("/admin")
        } else if (user?.role === "psychologist") {
          router.push("/psychologist")
        } else {
          router.push("/dashboard")
        }
        return
      }

      if (requiredTier && user?.tier !== requiredTier) {
        router.push("/upgrade")
        return
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, requiredTier, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null
  }

  if (requiredTier && user?.tier !== requiredTier) {
    return null
  }

  return <>{children}</>
}
