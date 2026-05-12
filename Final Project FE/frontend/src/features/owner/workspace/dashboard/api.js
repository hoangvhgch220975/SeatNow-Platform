import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description Các hàm gọi API cho Workspace Dashboard của từng nhà hàng.
 */
export const workspaceDashboardApi = {
  /**
   * Lấy thông tin chi tiết cơ bản của nhà hàng
   * @param {string} id - ID hoặc Slug của nhà hàng
   */
  getRestaurantDetail: (id) => apiClient.get(`/restaurants/${id}`),

  /**
   * Lấy tóm tắt chỉ số KPI (Thống kê tổng quát)
   * @param {string} id - ID nhà hàng (UUID)
   * @param {Object} params - { period, from, to }
   */
  getStatsSummary: (id, params = {}) => apiClient.get(`/booking-restaurants/${id}/stats-summary`, { params }),

  /**
   * Lấy thống kê doanh thu theo thời gian
   * @param {string} id - ID nhà hàng (UUID)
   * @param {Object} params - { period: 'day'|'week'|'month', from, to }
   */
  getRevenueStats: (id, params = {}) => apiClient.get(`/booking-restaurants/${id}/revenue-stats`, { params }),

  /**
   * Lấy thống kê mật độ khách theo giờ (Giờ vàng)
   * @param {string} id - ID nhà hàng (UUID)
   * @param {Object} params - { period, from, to }
   */
  getHourlyStats: (id, params = {}) => apiClient.get(`/booking-restaurants/${id}/stats/hourly`, { params }),

  /**
   * Lấy danh sách lượt đặt bàn của nhà hàng
   * @param {string} id - ID nhà hàng (UUID)
   * @param {Object} params - Các tham số lọc booking
   */
  getBookings: (id, params = {}) => apiClient.get(`/booking-restaurants/${id}/bookings`, { params }),

  /**
   * Lấy danh sách bàn (Sơ đồ bàn)
   * @param {string} id - ID nhà hàng
   */
  getTables: (id) => apiClient.get(`/restaurants/${id}/tables`),

  /**
   * Lấy thực đơn của nhà hàng
   * @param {string} id - ID nhà hàng
   */
  getMenu: (id) => apiClient.get(`/restaurants/${id}/menu`),
};
