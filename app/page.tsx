"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        // Redirect based on role
        if (user?.role === "admin") {
          router.push("/admin")
        } else if (user?.role === "psychologist") {
          router.push("/psychologist")
        } else {
          router.push("/dashboard")
        }
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
