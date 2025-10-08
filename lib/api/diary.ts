import { apiClient } from "./base"
import type { DiaryEntry, EmotionLevel, ApiResponse, PaginatedResponse } from "@/types"

export interface CreateDiaryEntryData {
  title: string
  content: string
  mood: EmotionLevel
}

export interface UpdateDiaryEntryData extends Partial<CreateDiaryEntryData> {}

export const diaryApi = {
  async createEntry(data: CreateDiaryEntryData): Promise<DiaryEntry> {
    const response = await apiClient.post<ApiResponse<DiaryEntry>>("/diary", data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to create diary entry")
  },

  async getEntries(page = 1, pageSize = 10): Promise<PaginatedResponse<DiaryEntry>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<DiaryEntry>>>("/diary", {
      params: { page, pageSize },
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get diary entries")
  },

  async getEntry(id: string): Promise<DiaryEntry> {
    const response = await apiClient.get<ApiResponse<DiaryEntry>>(`/diary/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to get diary entry")
  },

  async updateEntry(id: string, data: UpdateDiaryEntryData): Promise<DiaryEntry> {
    const response = await apiClient.patch<ApiResponse<DiaryEntry>>(`/diary/${id}`, data)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.error || "Failed to update diary entry")
  },

  async deleteEntry(id: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<void>>(`/diary/${id}`)

    if (!response.success) {
      throw new Error(response.error || "Failed to delete diary entry")
    }
  },
}
