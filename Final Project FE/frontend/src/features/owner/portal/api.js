import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description Các hàm gọi API dành riêng cho Owner Portal.
 */
export const ownerPortalApi = {
  /**
   * Lấy tóm tắt Portfolio (Số lượng nhà hàng, trạng thái) - Từ Restaurant Service
   */
  getPortfolioSummary: () => apiClient.get('/portfolio/summary'),

  /**
   * Lấy tóm tắt kinh doanh Portfolio (Doanh thu, Lượt đặt, Đánh giá) - Từ Booking Service
   */
  getBusinessPortfolio: () => apiClient.get('/owner/portfolio-summary'),

  /**
   * Lấy danh sách nhà hàng đang sở hữu - Từ Restaurant Service
   * Thay đổi từ /restaurants sang /portfolio/restaurants để chỉ lấy nhà hàng của chính chủ
   */
  getMyRestaurants: (params = {}) => apiClient.get('/portfolio/restaurants', { params }),

  /**
   * Lấy thống kê giờ cao điểm cho Portfolio (Ngày) - Từ Booking Service
   */
  getHourlyStats: (params = {}) => apiClient.get('/owner/stats/hourly', { params }),

  /**
   * Lấy chuỗi doanh thu và lượt đặt theo thời gian (Ngày/Tuần/Tháng) - Từ Booking Service
   */
  getRevenueStats: (params = {}) => apiClient.get('/owner/revenue-stats', { params }),

  /**
   * Lấy phân bổ giờ (Hourly) hoặc lượt đặt theo dòng thời gian
   */
  getBookingStats: (params = {}) => apiClient.get('/owner/revenue-stats', { params }),

  /**
   * Lấy danh sách hoạt động gần đây của chủ sở hữu từ Notification Service
   */
  getOwnerActivity: (params = {}) => apiClient.get('/owner/activity', { params }),

  /**
   * Đánh dấu một hoạt động là đã đọc theo ID
   */
  markActivityRead: (id) => apiClient.put(`/owner/activity/${id}/read`),

  /**
   * Đánh dấu toàn bộ hoạt động là đã đọc
   */
  markAllActivityRead: () => apiClient.put('/owner/activity/read-all'),

  /**
   * Đăng ký nhà hàng mới cho chủ sở hữu
   */
  createRestaurant: (data) => apiClient.post('/restaurants', data),
};
