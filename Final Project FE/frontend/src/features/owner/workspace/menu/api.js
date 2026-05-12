import { apiClient } from '@/lib/axios';

/**
 * Menu API Service
 * Handles all menu-related operations for a specific restaurant
 */
export const menuApi = {
  /**
   * Get all menu items for a restaurant
   * @param {string} restaurantId 
   * @param {object} params - pagination, search, category, status
   */
  getMenuItems: (restaurantId, params = {}) => 
    apiClient.get(`restaurants/${restaurantId}/menu`, { params }),

  /**
   * Create a new menu item
   * @param {string} restaurantId 
   * @param {object} data - menu item details
   */
  createMenuItem: (restaurantId, data) => 
    apiClient.post(`restaurants/${restaurantId}/menu`, data),

  /**
   * Update an existing menu item
   * @param {string} restaurantId 
   * @param {string} itemId 
   * @param {object} data - updated menu item details
   */
  updateMenuItem: (restaurantId, itemId, data) => 
    apiClient.put(`restaurants/${restaurantId}/menu/${itemId}`, data),

  /**
   * Delete a menu item
   * @param {string} restaurantId 
   * @param {string} itemId 
   */
  deleteMenuItem: (restaurantId, itemId) => 
    apiClient.delete(`restaurants/${restaurantId}/menu/${itemId}`),
};
