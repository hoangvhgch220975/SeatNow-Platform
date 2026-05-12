import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { workspaceDashboardApi } from './api';
import { bookingSocket } from '@/lib/socket';

/**
 * @hook useWorkspaceDashboard
 * @description Hook quản lý dữ liệu cho trang Overview của từng nhà hàng.
 * @param {string} id - ID nhà hàng
 * @param {Object} revenueParams - Các tham số cho thống kê doanh thu
 * @param {Object} hourlyParams - Các tham số cho thống kê giờ vàng
 */
export const useWorkspaceDashboard = (
  id, 
  revenueParams = { period: 'month' }, 
  hourlyParams = { period: 'day' }
) => {
  const queryClient = useQueryClient();

  // Rút trích dữ liệu (Helper)
  const extractData = (query) => {
    if (query.isError || !query.data) return null;
    const raw = query.data;
    if (raw && typeof raw === 'object' && 'data' in raw && !Array.isArray(raw)) {
      return raw.data;
    }
    return raw;
  };

  // 1. Thông tin cơ bản nhà hàng
  const restaurantDetail = useQuery({
    queryKey: ['workspace', 'restaurant', id],
    queryFn: () => workspaceDashboardApi.getRestaurantDetail(id),
    enabled: !!id,
  });

  const restaurantData = extractData(restaurantDetail);
  const actualId = restaurantData?.id || restaurantData?._id || id;

  // 2. Thống kê KPI
  const statsSummary = useQuery({
    queryKey: ['workspace', 'stats', 'summary', actualId, revenueParams],
    queryFn: () => workspaceDashboardApi.getStatsSummary(actualId, revenueParams),
    enabled: !!(actualId && restaurantData),
  });

  // 2.1 Thống kê cho ngày cụ thể
  const dailyStatsSummary = useQuery({
    queryKey: ['workspace', 'stats', 'summary', 'daily', actualId, hourlyParams],
    queryFn: () => workspaceDashboardApi.getStatsSummary(actualId, hourlyParams),
    enabled: !!(actualId && restaurantData),
  });

  // 3. Thống kê doanh thu
  const revenueStats = useQuery({
    queryKey: ['workspace', 'stats', 'revenue', actualId, revenueParams],
    queryFn: () => workspaceDashboardApi.getRevenueStats(actualId, revenueParams),
    enabled: !!(actualId && restaurantData),
  });

  // 4. Thống kê giờ vàng
  const hourlyStats = useQuery({
    queryKey: ['workspace', 'stats', 'hourly', actualId, hourlyParams],
    queryFn: () => workspaceDashboardApi.getHourlyStats(actualId, hourlyParams),
    enabled: !!(actualId && restaurantData),
  });

  // 5. Danh sách lượt đặt gần đây
  const recentBookings = useQuery({
    queryKey: ['workspace', 'bookings', 'recent', actualId],
    queryFn: () => workspaceDashboardApi.getBookings(actualId, { 
      limit: 9,
      sort: 'DESC'
    }),
    enabled: !!(actualId && restaurantData),
  });

  // 6. Toàn bộ danh sách đặt bàn trong ngày
  const dayBookings = useQuery({
    queryKey: ['workspace', 'bookings', 'day', actualId, hourlyParams.from],
    queryFn: () => workspaceDashboardApi.getBookings(actualId, {
      from: hourlyParams.from,
      to: hourlyParams.to
    }),
    enabled: !!(actualId && restaurantData),
  });

  // 7. Sơ đồ bàn (Tables)
  const floorPlan = useQuery({
    queryKey: ['workspace', 'tables', actualId],
    queryFn: () => workspaceDashboardApi.getTables(actualId),
    enabled: !!(actualId && restaurantData),
  });

  // 8. TÍCH HỢP SOCKET: Làm mới dữ liệu thay vì polling
  useEffect(() => {
    if (!actualId) return;

    const handleDataChange = (data) => {
      if (data.restaurantId === actualId) {
        console.log('📡 [Dashboard Socket] Data changed, refreshing workspace...');
        // Invalidate các query quan trọng để React Query fetch lại (304 nếu không đổi)
        queryClient.invalidateQueries({ queryKey: ['workspace', 'bookings', 'day', actualId] });
        queryClient.invalidateQueries({ queryKey: ['workspace', 'bookings', 'recent', actualId] });
        queryClient.invalidateQueries({ queryKey: ['workspace', 'tables', actualId] });
        queryClient.invalidateQueries({ queryKey: ['workspace', 'stats', 'summary', 'daily', actualId] });
      }
    };

    bookingSocket.on('bookingChanged', handleDataChange);

    return () => {
      bookingSocket.off('bookingChanged', handleDataChange);
    };
  }, [actualId, queryClient]);

  return {
    restaurant: restaurantData,
    stats: extractData(statsSummary),
    dailyStats: extractData(dailyStatsSummary),
    revenue: extractData(revenueStats),
    hourly: extractData(hourlyStats),
    recentBookings: extractData(recentBookings),
    dayBookings: extractData(dayBookings),
    tables: extractData(floorPlan),
    isLoading: 
      restaurantDetail.isLoading || 
      statsSummary.isLoading || 
      dailyStatsSummary.isLoading ||
      recentBookings.isLoading ||
      dayBookings.isLoading ||
      floorPlan.isLoading,
    isStatsLoading: revenueStats.isLoading || hourlyStats.isLoading,
    isError: restaurantDetail.isError || statsSummary.isError || dailyStatsSummary.isError,
    refetch: () => {
      restaurantDetail.refetch();
      statsSummary.refetch();
      dailyStatsSummary.refetch();
      revenueStats.refetch();
      hourlyStats.refetch();
      recentBookings.refetch();
      dayBookings.refetch();
      floorPlan.refetch();
    }
  };
};
