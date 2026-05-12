import { useQuery } from '@tanstack/react-query';
import { getRestaurants, getRestaurantById, getRestaurantMenu, getRestaurantTables } from './api.js';

/**
 * @file hooks.js (Restaurant Feature)
 * @description Hook React Query đồng bộ cache theo filters, page và limit.
 */

/**
 * Hook fetch danh sách nhà hàng (Restaurant Service dùng limit/offset)
 */
export const useRestaurants = (filters = {}) => {
  const { page = 1, limit = 10 } = filters;

  return useQuery({
    // queryKey chứa cả page & limit giúp quản lý cache phân trang chuẩn
    queryKey: ['restaurants', 'list', filters],
    queryFn: () => getRestaurants(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 3, // 3 phút cache
  });
};

/**
 * Hook fetch chi tiết một nhà hàng
 */
export const useRestaurant = (id) => {
  return useQuery({
    queryKey: ['restaurants', 'detail', id],
    queryFn: () => getRestaurantById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

/**
 * Hook fetch thực đơn (Menu) của nhà hàng
 */
export const useRestaurantMenu = (id) => {
  return useQuery({
    queryKey: ['restaurants', 'menu', id],
    queryFn: () => getRestaurantMenu(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // Menu ít thay đổi hơn
  });
};
/**
 * Hook fetch danh sách bàn (Sơ đồ tầng) dùng React Query
 */
export const useRestaurantTables = (id, location) => {
  return useQuery({
    queryKey: ['restaurants', 'tables', id, location],
    queryFn: () => getRestaurantTables(id, location),
    enabled: !!id,
    staleTime: 1000 * 60 * 30, // Sơ đồ bàn ít khi thay đổi (Static)
  });
};
