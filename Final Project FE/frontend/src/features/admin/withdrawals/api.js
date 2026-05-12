import { apiClient as axios } from '../../../lib/axios.js';

/**
 * @file api.js
 * @description API xử lý các yêu cầu rút tiền (Withdrawal) dành cho Admin.
 * Sử dụng endpoint chuyên biệt mới được Backend triển khai để quản trị giải ngân.
 */
export const withdrawalsApi = {
  /**
   * Lấy danh sách yêu cầu rút tiền chuyên biệt cho Admin
   * @param {Object} params - { status, restaurantId, keyword, page, limit }
   */
  getWithdrawals: async (params = {}) => {
    // Lọc bỏ các tham số rỗng
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );

    return await axios.get('/admin/withdrawals', {
      params: {
        limit: 10,
        ...cleanParams
      }
    });
  },

  /**
   * Phê duyệt yêu cầu rút tiền
   * @param {string} id - ID của giao dịch/yêu cầu rút tiền
   */
  approveWithdrawal: async (id) => {
    return await axios.post(`/admin/withdrawals/${id}/approve`);
  },

  /**
   * Từ chối yêu cầu rút tiền
   * @param {string} id - ID của giao dịch/yêu cầu rút tiền
   */
  rejectWithdrawal: async (id) => {
    return await axios.post(`/admin/withdrawals/${id}/reject`);
  }
};
