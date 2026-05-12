import { useQuery } from '@tanstack/react-query';
import { getRestaurants } from './api.js';

/**
 * Hook custom để fetch danh sách nhà hàng (đặc biệt cho trang Home)
 * @param {Object} params - Các filter và config
 */
export const useRestaurants = (params = {}) => {
  return useQuery({
    queryKey: ['restaurants', 'home', params],
    queryFn: () => getRestaurants(params),
    staleTime: 1000 * 60 * 5, // 5 phút cache
    retry: 1, // thử lại 1 lần nếu error
  });
};
