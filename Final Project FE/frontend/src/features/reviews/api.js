import { apiClient } from '../../lib/axios.js';

/**
 * @file api.js (Reviews Feature)
 * @description Logic gọi API cho Review Service (MongoDB).
 */

/**
 * Lấy tòm tắt đánh giá (Số lượng sao, trung bình cộng)
 * @param {string} restaurantId - ID hoặc Slug của nhà hàng
 */
export const getRestaurantReviewSummary = async (restaurantId) => {
  const response = await apiClient.get(`/restaurants/${restaurantId}/reviews/summary`);
  return response;
};

/**
 * Lấy danh sách đánh giá với phân trang (limit & offset)
 * @param {string} restaurantId - ID hoặc Slug của nhà hàng
 * @param {Object} params - { limit, offset }
 */
export const getRestaurantReviews = async (restaurantId, params = {}) => {
  const { page = 1, limit = 3 } = params;
  const offset = (page - 1) * limit;

  const response = await apiClient.get(`/restaurants/${restaurantId}/reviews`, {
    params: { limit, offset }
  });

  return response;
};

/**
 * Gửi đánh giá mới
 * @param {string} restaurantId - ID hoặc Slug của nhà hàng
 * @param {Object} reviewData - Dữ liệu đánh giá { bookingId, rating, comment, ... }
 */
export const createReview = async (restaurantId, reviewData) => {
  const response = await apiClient.post(`/restaurants/${restaurantId}/reviews`, reviewData);
  return response?.data || response;
};
