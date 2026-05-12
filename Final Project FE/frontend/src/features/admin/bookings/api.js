import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description API management for Admin Bookings module
 */

/**
 * Fetch booking list with filters and pagination
 * @param {Object} params - Query parameters (status, restaurantId, dateFrom, dateTo, page, limit)
 */
export const getAdminBookings = async (params) => {
  // Filter out empty string/null params to ensure BE returns "All"
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );
  const response = await apiClient.get('/admin/bookings', { params: cleanParams });
  return response;
};

/**
 * Fetch global booking statistics for admin dashboard
 * @param {Object} params - Filter parameters like restaurantId
 */
export const getAdminBookingStats = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
  );
  const response = await apiClient.get('/admin/dashboard/stats', { params: cleanParams });
  return response;
};

/**
 * Fetch list of all restaurants for dropdown selection
 */
export const getAdminRestaurants = async () => {
  const response = await apiClient.get('/admin/restaurants', { 
    params: { limit: 1000, sort: 'name' } 
  });
  return response;
};
