import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api.js';

/**
 * @file hooks.js
 * @description React Query hooks for the Admin Dashboard.
 */

/**
 * Hook to fetch general dashboard statistics based on period.
 * @param {string} period - day, week, month, quarter, year
 */
export const useDashboardStats = (period = 'month') => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats', period],
    queryFn: async () => {
      const response = await dashboardApi.getDashboardStats(period);
      // Backend returns data in .data or .data.data (Vietnamese: Backend trả về dữ liệu trong .data hoặc .data.data)
      return response.data?.data || response.data || response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch revenue analysis data for Recharts.
 * @param {string} period - day, week, month, quarter, year
 */
export const useRevenueStats = (period = 'month') => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'revenue', period],
    queryFn: async () => {
      const response = await dashboardApi.getRevenueStats(period);
      return response.data?.data || response.data || response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch recent partner requests (leads).
 */
export const usePartnerRequests = (limit = 5) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'partners', limit],
    queryFn: async () => {
      const response = await dashboardApi.getRecentPartnerRequests(limit);
      return response.data?.data || response.data || response;
    },
    staleTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to fetch pending withdrawals.
 */
export const usePendingWithdrawals = (limit = 5) => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'pending-withdrawals', limit],
    queryFn: async () => {
      const response = await dashboardApi.getPendingWithdrawals(limit);
      return response.data?.data || response.data || response;
    },
    staleTime: 2 * 60 * 1000,
  });
};
