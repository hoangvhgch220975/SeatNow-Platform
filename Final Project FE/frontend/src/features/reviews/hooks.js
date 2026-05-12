import { useQuery } from '@tanstack/react-query';
import { getRestaurantReviews, getRestaurantReviewSummary } from './api.js';

/**
 * @file hooks.js (Reviews Feature)
 * @description Hooks React Query để fetch và quản lý dữ liệu đánh giá.
 */

/**
 * Hook lấy tóm tắt đánh giá của nhà hàng (Star breakdown)
 * @param {string} restaurantId - ID hoặc Slug của nhà hàng
 */
export const useRestaurantReviewSummary = (restaurantId) => {
  return useQuery({
    queryKey: ['reviews', 'summary', restaurantId],
    queryFn: () => getRestaurantReviewSummary(restaurantId),
    enabled: !!restaurantId,
    staleTime: 1000 * 60 * 10, // Cache 10 phút
  });
};

/**
 * Hook lấy danh sách đánh giá có phân trang (3 reviews mỗi trang)
 * @param {string} restaurantId - ID hoặc Slug của nhà hàng
 * @param {number} page - Trang hiện tại
 * @param {number} limit - Số lượng mỗi trang
 */
export const useRestaurantReviews = (restaurantId, page = 1, limit = 3) => {
  return useQuery({
    queryKey: ['reviews', 'list', restaurantId, page, limit],
    queryFn: () => getRestaurantReviews(restaurantId, { page, limit }),
    enabled: !!restaurantId,
    placeholderData: (previousData) => previousData, // Giữ dữ liệu cũ khi chuyển trang
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });
};
