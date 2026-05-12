import { useQuery } from '@tanstack/react-query';
import { getAdminBookings, getAdminBookingStats, getAdminRestaurants } from './api';

/**
 * Hook for fetching and managing admin bookings list
 * @param {Object} params - Query parameters
 */
export const useAdminBookings = (params) => {
  return useQuery({
    queryKey: ['adminBookings', params],
    queryFn: () => getAdminBookings(params),
    keepPreviousData: true,
    staleTime: 5000,
  });
};

/**
 * Hook for fetching admin booking statistics
 * @param {Object} params - Filter parameters
 */
export const useAdminBookingStats = (params) => {
  return useQuery({
    queryKey: ['adminBookingStats', params?.restaurantId],
    queryFn: () => getAdminBookingStats(params),
    refetchInterval: 30000, 
  });
};

/**
 * Hook for fetching all restaurants for selection
 */
export const useAdminRestaurantsList = () => {
  return useQuery({
    queryKey: ['adminRestaurantsList'],
    queryFn: getAdminRestaurants,
    staleTime: 600000, // 10 minutes
  });
};
