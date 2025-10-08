"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { UserRole, UserTier } from "@/types"

interface RoleGateProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  allowedTiers?: UserTier[]
  fallback?: React.ReactNode
}

export function RoleGate({ children, allowedRoles, allowedTiers, fallback = null }: RoleGateProps) {
  const { user } = useAuth()

  if (!user) {
    return <>{fallback}</>
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  if (allowedTiers && user.tier && !allowedTiers.includes(user.tier)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
