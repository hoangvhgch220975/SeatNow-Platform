import { apiClient as axios } from '../../../lib/axios.js';
import { dashboardApi } from '../dashboard/api.js';

/**
 * @file api.js
 * @description API tra cứu và quản lý giao dịch hệ thống dành cho Admin.
 */
export const transactionsApi = {
  /**
   * Lấy danh sách giao dịch toàn hệ thống kèm bộ lọc
   * @param {Object} params - { restaurantId, type, status, page, limit, dateFrom, dateTo }
   */
  getTransactions: async (params = {}) => {
    // Filter out empty or null values to ensure backend returns "All" when no filter is applied
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );

    return await axios.get('/admin/transactions', { 
        params: {
            limit: 5, // Default limit per requirements
            ...cleanParams
        } 
    });
  }
};
