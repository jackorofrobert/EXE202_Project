import { apiClient } from "./base"
import type { User, ApiResponse } from "@/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
  role?: "user" | "psychologist"
}

export interface AuthResponse {
  user: User
  token: string
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", credentials)

    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    throw new Error(response.error || "Login failed")
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data)

    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data
    }

    throw new Error(response.error || "Registration failed")
  },

  async logout(): Promise<void> {
    apiClient.setToken(null)
    await apiClient.post("/auth/logout")
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/auth/me")

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get current user")
  },

  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>("/auth/refresh")

    if (response.success && response.data) {
      apiClient.setToken(response.data.token)
      return response.data.token
    }

    throw new Error(response.error || "Failed to refresh token")
  },
}
