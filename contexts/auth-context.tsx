"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole, UserTier } from "@/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: "user" | "psychologist") => Promise<void>
  logout: () => Promise<void>
  hasRole: (role: UserRole) => boolean
  hasTier: (tier: UserTier) => boolean
  isGoldUser: boolean
  isFreeUser: boolean
  isAdmin: boolean
  isPsychologist: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const MOCK_USERS = {
  admin: {
    id: "admin-1",
    email: "admin@emocare.com",
    name: "Admin User",
    role: "admin" as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  freeUser: {
    id: "user-1",
    email: "user@example.com",
    name: "Free User",
    role: "user" as UserRole,
    tier: "free" as UserTier,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  goldUser: {
    id: "user-2",
    email: "gold@example.com",
    name: "Gold User",
    role: "user" as UserRole,
    tier: "gold" as UserTier,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  psychologist: {
    id: "psych-1",
    email: "doctor@emocare.com",
    name: "Dr. Nguyen",
    role: "psychologist" as UserRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("emocare_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("[v0] Failed to parse stored user:", error)
        localStorage.removeItem("emocare_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Mock login - in production, this would call authApi.login()
      let mockUser: User | null = null

      if (email === "admin@emocare.com") {
        mockUser = MOCK_USERS.admin
      } else if (email === "user@example.com") {
        mockUser = MOCK_USERS.freeUser
      } else if (email === "gold@example.com") {
        mockUser = MOCK_USERS.goldUser
      } else if (email === "doctor@emocare.com") {
        mockUser = MOCK_USERS.psychologist
      }

      if (mockUser) {
        setUser(mockUser)
        localStorage.setItem("emocare_user", JSON.stringify(mockUser))

        // Redirect based on role
        if (mockUser.role === "admin") {
          router.push("/admin")
        } else if (mockUser.role === "psychologist") {
          router.push("/psychologist")
        } else {
          router.push("/dashboard")
        }
      } else {
        throw new Error("Invalid credentials")
      }

      // Production code:
      // const { user, token } = await authApi.login({ email, password })
      // setUser(user)
      // localStorage.setItem("emocare_user", JSON.stringify(user))
      // localStorage.setItem("emocare_token", token)
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string, role: "user" | "psychologist" = "user") => {
    try {
      // Mock registration
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
        tier: role === "user" ? "free" : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setUser(newUser)
      localStorage.setItem("emocare_user", JSON.stringify(newUser))

      // Redirect based on role
      if (role === "psychologist") {
        router.push("/psychologist")
      } else {
        router.push("/dashboard")
      }

      // Production code:
      // const { user, token } = await authApi.register({ name, email, password, role })
      // setUser(user)
      // localStorage.setItem("emocare_user", JSON.stringify(user))
      // localStorage.setItem("emocare_token", token)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // Production code:
      // await authApi.logout()

      setUser(null)
      localStorage.removeItem("emocare_user")
      localStorage.removeItem("emocare_token")
      router.push("/login")
    } catch (error) {
      console.error("[v0] Logout error:", error)
      throw error
    }
  }

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role
  }

  const hasTier = (tier: UserTier): boolean => {
    return user?.tier === tier
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    hasTier,
    isGoldUser: user?.tier === "gold",
    isFreeUser: user?.tier === "free",
    isAdmin: user?.role === "admin",
    isPsychologist: user?.role === "psychologist",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
