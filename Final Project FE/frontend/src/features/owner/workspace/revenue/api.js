import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description API service cho tính năng Quản lý Doanh thu của nhà hàng.
 */
export const workspaceRevenueApi = {
  /**
   * Lấy tóm tắt thống kê KPI (Net Revenue, Gross, Cancel Rate, Guest Sizes)
   */
  getRevenueSummary: (id, params = {}) => 
    apiClient.get(`/booking-restaurants/${id}/stats-summary`, { params }),

  /**
   * Lấy dữ liệu biểu đồ xu hướng doanh thu
   */
  getRevenueTrend: (id, params = {}) => 
    apiClient.get(`/booking-restaurants/${id}/revenue-stats`, { params }),

  /**
   * Lấy dữ liệu phân bổ giờ đặt bàn (Peak Hours)
   */
  getPeakHours: (id, params = {}) => 
    apiClient.get(`/booking-restaurants/${id}/stats/hourly`, { params }),

  /**
   * Lấy danh sách giao dịch gần đây (Bookings có trạng thái thành công/đã đặt cọc)
   */
  getRecentTransactions: (restaurantId, params = {}) => 
    apiClient.get(`/payment/wallet/recent-transactions`, { 
      params: { 
        ...params, 
        restaurantId,
        limit: params.limit || 5
      } 
    }),
};
