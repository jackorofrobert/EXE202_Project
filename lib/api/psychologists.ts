// API wrapper for psychologists
import type { Psychologist } from "@/types"

export const psychologistsApi = {
  // Get all psychologists
  async getAll(): Promise<Psychologist[]> {
    const response = await fetch("/api/psychologists")

    if (!response.ok) {
      throw new Error("Failed to fetch psychologists")
    }

    return response.json()
  },

  // Get psychologist by ID
  async getById(id: string): Promise<Psychologist> {
    const response = await fetch(`/api/psychologists/${id}`)

    if (!response.ok) {
      throw new Error("Failed to fetch psychologist")
    }

    return response.json()
  },

  // Search psychologists
  async search(query: string): Promise<Psychologist[]> {
    const response = await fetch(`/api/psychologists/search?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Failed to search psychologists")
    }

    return response.json()
  },
}
