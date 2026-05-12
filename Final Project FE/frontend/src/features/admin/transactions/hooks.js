import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from './api.js';

/**
 * @file hooks.js
 * @description React Query hooks for Admin transactions management.
 */

/**
 * Hook to fetch paginated transactions with filters.
 * @param {Object} params - { restaurantId, type, status, page, limit }
 */
export const useAdminTransactions = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'transactions', 'list', params],
    queryFn: async () => {
      const response = await transactionsApi.getTransactions(params);
      // Return the full payload object { data: [], pagination: {} }
      return response;
    },
    placeholderData: (previousData) => previousData, // Smooth transition during pagination
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook to fetch financial stats for KPI cards.
 * @param {string} restaurantId - Optional restaurant filter
 */
export const useAdminTransactionStats = (restaurantId = null) => {
  return useQuery({
    queryKey: ['admin', 'transactions', 'stats', restaurantId],
    queryFn: async () => {
      const response = await transactionsApi.getTransactionStats(restaurantId);
      return response.data?.data || response.data || response;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};
