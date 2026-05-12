import { apiClient as axios } from '../../../lib/axios.js';

/**
 * @file api.js
 * @description Admin dashboard API calls for metrics, analytics and auditing.
 */
export const dashboardApi = {
  /**
   * Get general system stats (Users, Restaurants, Bookings)
   * @param {string} period - day, week, month, quarter, year
   * @returns {Promise} - Dashboard metrics
   */
  getDashboardStats: async (period = 'month', restaurantId = null) => {
    return await axios.get('/admin/dashboard/stats', { 
      params: { 
        period,
        ...(restaurantId && { restaurantId })
      } 
    });
  },

  /**
   * Get admin revenue/commission analytics for charts
   * @param {string} period - day, week, month, quarter, year
   * @returns {Promise} - Time-series revenue data
   */
  getRevenueStats: async (period = 'month') => {
    return await axios.get('/admin/dashboard/revenue-stats', { params: { period } });
  },

  /**
   * Get recent partner requests (leads) for the dashboard
   * @param {number} limit - Number of requests to fetch
   * @returns {Promise} - List of partner requests
   */
  getRecentPartnerRequests: async (limit = 5) => {
    return await axios.get('/admin/partner-requests', { params: { limit } });
  },

  /**
   * Get pending withdrawal transactions
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise} - List of pending withdrawals
   */
  getPendingWithdrawals: async (limit = 5) => {
    return await axios.get('/admin/transactions', { 
      params: { 
        type: 'WITHDRAWAL', 
        status: 'pending',
        limit 
      } 
    });
  }
};
