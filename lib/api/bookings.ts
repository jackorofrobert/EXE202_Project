// API wrapper for bookings
import type { Booking } from "@/types"

export const bookingsApi = {
  // Create a new booking
  async createBooking(data: {
    psychologistId: string
    date: Date
    time: string
    note?: string
  }): Promise<Booking> {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create booking")
    }

    return response.json()
  },

  // Get user's bookings
  async getUserBookings(): Promise<Booking[]> {
    const response = await fetch("/api/bookings/user")

    if (!response.ok) {
      throw new Error("Failed to fetch bookings")
    }

    return response.json()
  },

  // Get psychologist's appointments
  async getPsychologistAppointments(): Promise<Booking[]> {
    const response = await fetch("/api/bookings/psychologist")

    if (!response.ok) {
      throw new Error("Failed to fetch appointments")
    }

    return response.json()
  },

  // Update booking status
  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error("Failed to update booking")
    }

    return response.json()
  },

  // Cancel a booking
  async cancelBooking(id: string): Promise<void> {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to cancel booking")
    }
  },
}
