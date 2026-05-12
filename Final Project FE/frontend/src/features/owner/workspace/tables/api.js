import { apiClient } from '@/lib/axios';

/**
 * Table API Service
 * Xử lý tất cả các hoạt động liên quan đến bàn cho một nhà hàng cụ thể.
 * Hỗ trợ Resolve ID (UUID/Slug) cho restaurantId.
 */
export const tableApi = {
  /**
   * Lấy danh sách bàn của nhà hàng
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   * @param {object} params - Bộ lọc (location, status, type)
   */
  getTables: (restaurantId, params = {}) => 
    apiClient.get(`restaurants/${restaurantId}/tables`, { params }),

  /**
   * Lấy thống kê số lượng bàn theo tầng
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   */
  getTableStats: (restaurantId) => 
    apiClient.get(`restaurants/${restaurantId}/tables/stats`),

  /**
   * Thêm bàn mới vào nhà hàng
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   * @param {object} data - Thông tin bàn mới
   */
  createTable: (restaurantId, data) => 
    apiClient.post(`restaurants/${restaurantId}/tables`, data),

  /**
   * Cập nhật thông tin bàn hiện có
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   * @param {string} tableId - ID của bàn cần sửa
   * @param {object} data - Thông tin cập nhật
   */
  updateTable: (restaurantId, tableId, data) => 
    apiClient.put(`restaurants/${restaurantId}/tables/${tableId}`, data),

  /**
   * Xóa bàn khỏi hệ thống
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   * @param {string} tableId - ID của bàn cần xóa
   */
  deleteTable: (restaurantId, tableId) => 
    apiClient.delete(`restaurants/${restaurantId}/tables/${tableId}`),
};
