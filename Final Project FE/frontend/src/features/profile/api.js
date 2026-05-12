import { apiClient as axios } from '../../lib/axios.js';

/**
 * @file api.js
 * @description Các API liên quan đến hồ sơ người dùng.
 */
export const profileApi = {
  /**
   * Lấy thông tin cá nhân hiện tại
   * @returns {Promise} - Thông tin User chi tiết từ User Service (:3002)
   */
  getMe: async () => {
    return await axios.get('/users/me');
  },

  /**
   * Cập nhật thông tin cá nhân hiện tại
   * @param {Object} data - Dữ liệu cần cập nhật (name, phone, avatar...)
   * @returns {Promise}
   */
  updateMe: async (data) => {
    return await axios.put('/users/me', data);
  }
};

