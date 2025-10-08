// API wrapper for emotion entries
import type { EmotionEntry, EmotionLevel, EmotionStats } from "@/types"

export const emotionsApi = {
  // Create a new emotion entry
  async createEntry(data: { level: EmotionLevel; note?: string }): Promise<EmotionEntry> {
    const response = await fetch("/api/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create emotion entry")
    }

    return response.json()
  },

  // Get user's emotion entries
  async getEntries(limit?: number): Promise<EmotionEntry[]> {
    const url = limit ? `/api/emotions?limit=${limit}` : "/api/emotions"
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch emotion entries")
    }

    return response.json()
  },

  // Get emotion statistics
  async getStats(): Promise<EmotionStats> {
    const response = await fetch("/api/emotions/stats")

    if (!response.ok) {
      throw new Error("Failed to fetch emotion stats")
    }

    return response.json()
  },

  // Delete an emotion entry
  async deleteEntry(id: string): Promise<void> {
    const response = await fetch(`/api/emotions/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete emotion entry")
    }
  },
}
