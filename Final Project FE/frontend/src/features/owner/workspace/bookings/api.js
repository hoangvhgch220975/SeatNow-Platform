import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description Các API quản lý đặt bàn dành riêng cho Chủ nhà hàng (Owner)
 * Kết nối qua API Gateway (Thường là port 7000)
 */

export const bookingOwnerApi = {
  /**
   * Lấy danh sách đặt bàn của nhà hàng.
   * BE trả về cả 'items', 'total' và 'summary' (thống kê nhanh).
   * 
   * @param {string} id - UUID của nhà hàng
   * @param {Object} params - Các tham số lọc: { from, to, status, limit, offset }
   */
  getBookings: (id, params = {}) => {
    // Luôn đảm bảo có limit mặc định nếu không truyền
    const queryParams = {
      limit: 10,
      offset: 0,
      ...params
    };
    return apiClient.get(`/booking-restaurants/${id}/bookings`, { params: queryParams });
  },

  /**
   * Xác nhận đơn đặt bàn (Chuyển từ PENDING sang CONFIRMED)
   * @param {string} bookingId - UUID của đơn đặt bàn
   */
  confirmBooking: (bookingId) => 
    apiClient.put(`/bookings/${bookingId}/confirm`),

  /**
   * Đánh dấu khách đã đến nhà hàng (CONFIRMED -> ARRIVED)
   * @param {string} bookingId 
   */
  arriveBooking: (bookingId) => 
    apiClient.put(`/bookings/${bookingId}/arrived`),

  /**
   * Hoàn thành đơn đặt bàn (ARRIVED -> COMPLETED)
   * @param {string} bookingId 
   */
  completeBooking: (bookingId) => 
    apiClient.put(`/bookings/${bookingId}/complete`),

  /**
   * Đánh dấu khách không đến (ARRIVED/CONFIRMED -> NO_SHOW)
   * @param {string} bookingId 
   */
  noShowBooking: (bookingId) => 
    apiClient.put(`/bookings/${bookingId}/no-show`),

  /**
   * Lấy chi tiết một đơn đặt bàn
   * @param {string} bookingId 
   */
  getBookingDetail: (bookingId) => 
    apiClient.get(`/bookings/${bookingId}`),

  /**
   * Hủy đơn đặt bàn kèm theo lý do cụ thể
   * @param {string} bookingId 
   * @param {string} reason - Lý do hủy từ phía nhà hàng
   */
  cancelBooking: (bookingId, reason = 'Cancelled by restaurant') => 
    apiClient.put(`/bookings/${bookingId}/cancel`, { cancellationReason: reason }),
};
