import type { Booking } from "../types"

/**
 * Kiểm tra xem có thể hủy đặt lịch hay không dựa trên thời gian
 * @param booking - Thông tin đặt lịch
 * @param minHoursBefore - Số giờ tối thiểu trước giờ hẹn để có thể hủy (mặc định 2 giờ)
 * @returns true nếu có thể hủy, false nếu không
 */
export const canCancelBooking = (booking: Booking, minHoursBefore: number = 2): boolean => {
  const now = new Date()
  const bookingDateTime = new Date(`${booking.date} ${booking.time}`)
  const timeDifference = bookingDateTime.getTime() - now.getTime()
  const hoursUntilAppointment = timeDifference / (1000 * 60 * 60)
  
  // Không cho phép hủy nếu còn ít hơn minHoursBefore giờ trước giờ hẹn
  return hoursUntilAppointment >= minHoursBefore
}

/**
 * Tính số giờ còn lại trước giờ hẹn
 * @param booking - Thông tin đặt lịch
 * @returns Số giờ còn lại (có thể âm nếu đã qua giờ hẹn)
 */
export const getHoursUntilAppointment = (booking: Booking): number => {
  const now = new Date()
  const bookingDateTime = new Date(`${booking.date} ${booking.time}`)
  const timeDifference = bookingDateTime.getTime() - now.getTime()
  return timeDifference / (1000 * 60 * 60)
}

/**
 * Kiểm tra xem đặt lịch có đang trong thời gian có thể hủy hay không
 * @param booking - Thông tin đặt lịch
 * @param minHoursBefore - Số giờ tối thiểu trước giờ hẹn để có thể hủy (mặc định 2 giờ)
 * @returns Object chứa thông tin về khả năng hủy và thời gian còn lại
 */
export const getCancellationInfo = (booking: Booking, minHoursBefore: number = 2) => {
  const hoursUntil = getHoursUntilAppointment(booking)
  const canCancel = hoursUntil >= minHoursBefore
  
  return {
    canCancel,
    hoursUntil,
    isPastAppointment: hoursUntil < 0,
    isWithinCancellationWindow: hoursUntil >= 0 && hoursUntil < minHoursBefore
  }
}
