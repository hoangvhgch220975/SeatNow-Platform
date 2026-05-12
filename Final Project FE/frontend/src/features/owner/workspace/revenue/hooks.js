import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format } from 'date-fns';
import { workspaceRevenueApi } from './api';
import { workspaceDashboardApi } from '../dashboard/api';

/**
 * Hook quản lý trạng thái và dữ liệu Dashboard Doanh thu
 */
export const useRevenueDashboard = () => {
  const { idOrSlug } = useParams();

  // Rút trích dữ liệu (Helper)
  const extractData = (query) => {
    if (query.isError || !query.data) return null;
    const raw = query.data;
    if (raw && typeof raw === 'object' && 'data' in raw && !Array.isArray(raw)) {
      return raw.data;
    }
    return raw;
  };

  const restaurantDetail = useQuery({
    queryKey: ['workspace', 'restaurant', idOrSlug],
    queryFn: () => workspaceDashboardApi.getRestaurantDetail(idOrSlug),
    enabled: !!idOrSlug,
  });

  const restaurantData = extractData(restaurantDetail);
  const actualId = restaurantData?.id || restaurantData?._id || idOrSlug;

  // Chu kỳ thống kê: day | week | month | quarter | year
  const [period, setPeriod] = useState('month');

  // Tính toán From/To dựa trên Period
  const dateParams = useMemo(() => {
    const now = new Date();
    let from, to;

    switch (period) {
      case 'day':
        // Ngày hôm nay
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case 'week':
        // 7 ngày trước tính từ hôm nay
        from = startOfDay(subDays(now, 6));
        to = endOfDay(now);
        break;
      case 'month':
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case 'quarter':
        from = startOfQuarter(now);
        to = endOfQuarter(now);
        break;
      case 'year':
        from = startOfYear(now);
        to = endOfYear(now);
        break;
      default:
        from = startOfMonth(now);
        to = endOfMonth(now);
    }

    return {
      period,
      from: format(from, 'yyyy-MM-dd'),
      to: format(to, 'yyyy-MM-dd'),
    };
  }, [period]);

  // 1. Query KPI Summary
  const summaryQuery = useQuery({
    queryKey: ['workspace', 'revenue', 'summary', actualId, dateParams],
    queryFn: () => workspaceRevenueApi.getRevenueSummary(actualId, dateParams),
    select: (res) => (res.data || res),
    enabled: !!(actualId && actualId !== idOrSlug && restaurantData),
  });

  // 2. Query Revenue Trend (Chart)
  const trendQuery = useQuery({
    queryKey: ['workspace', 'revenue', 'trend', actualId, dateParams],
    queryFn: () => workspaceRevenueApi.getRevenueTrend(actualId, dateParams),
    select: (res) => (res.data || res),
    enabled: !!(actualId && actualId !== idOrSlug && restaurantData),
  });

  // 3. Query Peak Hours
  const peakHoursQuery = useQuery({
    queryKey: ['workspace', 'revenue', 'peak-hours', actualId, dateParams],
    queryFn: () => workspaceRevenueApi.getPeakHours(actualId, dateParams),
    select: (res) => (res.data || res),
    enabled: !!(actualId && actualId !== idOrSlug && restaurantData),
  });

  // 4. Query Recent Transactions
  const transactionsQuery = useQuery({
    queryKey: ['workspace', 'revenue', 'transactions', actualId, dateParams],
    queryFn: () => workspaceRevenueApi.getRecentTransactions(actualId, { ...dateParams, limit: 10 }),
    select: (res) => (res.data || []),
    enabled: !!(actualId && actualId !== idOrSlug && restaurantData),
  });

  const isLoading = summaryQuery.isLoading || trendQuery.isLoading || peakHoursQuery.isLoading;
  const isError = summaryQuery.isError || trendQuery.isError || peakHoursQuery.isError;

  return {
    period,
    setPeriod,
    dateParams,
    summary: summaryQuery.data,
    trend: trendQuery.data,
    peakHours: peakHoursQuery.data,
    transactions: transactionsQuery.data,
    restaurant: restaurantData,
    isLoading,
    isError,
    refresh: () => {
      summaryQuery.refetch();
      trendQuery.refetch();
      peakHoursQuery.refetch();
      transactionsQuery.refetch();
    }
  };
};
