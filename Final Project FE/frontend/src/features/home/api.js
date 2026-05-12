import { apiClient } from '../../lib/axios.js';

/**
 * Lấy danh sách nhà hàng có phân trang và bộ lọc
 * @param {Object} params - Các filter: keyword, cuisineType, priceRange, lat, lng, radiusKm, page, limit
 * @returns {Promise<Object>} - Danh sách nhà hàng { restaurants, totalCount, totalPages, currentPage }
 */
export const getRestaurants = async (params = {}) => {
  // Mặc định limit 6 cho trang chủ nếu không truyền
  const searchParams = {
    limit: 6,
    ...params
  };

  const response = await apiClient.get('/restaurants', {
    params: searchParams
  });

  // Giả định backend trả về { success, data, message } hoặc chỉ { data } tùy vào apiClient interceptor
  return response?.data || response;
};
