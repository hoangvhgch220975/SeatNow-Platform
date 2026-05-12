import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerPortalApi } from './api.js';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import toast from 'react-hot-toast';

/**
 * @file hooks.js
 * @description Hook quản lý việc tải và đồng bộ hóa dữ liệu cho Owner Dashboard.
 */

/**
 * @hook usePortfolioDashboard
 * @description Tải đồng thời tất cả các dữ liệu cần thiết cho Portfolio Dashboard.
 * Hỗ trợ tham số lọc riêng cho Revenue và Booking.
 */
export const usePortfolioDashboard = (params = {}, revenueParams = { period: 'month' }, bookingParams = { period: 'day' }, statsParams = {}) => {
  // 1. Tải tóm tắt nhà hàng (Restaurant Service)
  const venueSummary = useQuery({
    queryKey: ['owner', 'portfolio', 'summary'],
    queryFn: () => ownerPortalApi.getPortfolioSummary(),
  });

  // 2. Tải tóm tắt kết quả kinh doanh (Booking Service)
  const businessSummary = useQuery({
    queryKey: ['owner', 'business', 'summary'],
    queryFn: () => ownerPortalApi.getBusinessPortfolio(),
  });

  // 3. Tải danh sách nhà hàng đang quản lý
  const myRestaurants = useQuery({
    queryKey: ['owner', 'restaurants', params],
    queryFn: () => ownerPortalApi.getMyRestaurants(params),
  });

  // 4. Tải thống kê giờ cao điểm cho biểu đồ (Dùng chung cho tab Booking/Day)
  const hourlyStats = useQuery({
    queryKey: ['owner', 'stats', 'hourly', statsParams],
    queryFn: () => ownerPortalApi.getHourlyStats(statsParams),
  });

  // 5. Tải thống kê chuỗi doanh thu
  const revenueStats = useQuery({
    queryKey: ['owner', 'stats', 'revenue', revenueParams],
    queryFn: () => ownerPortalApi.getRevenueStats(revenueParams),
    enabled: !!revenueParams.period,
  });

  // 6. Tải thống kê chuỗi lượt đặt
  const bookingStats = useQuery({
    queryKey: ['owner', 'stats', 'bookings', bookingParams],
    queryFn: () => ownerPortalApi.getBookingStats(bookingParams),
    enabled: !!bookingParams.period,
  });

  // Trạng thái tổng hợp
  const isLoading = 
    venueSummary.isLoading || 
    businessSummary.isLoading || 
    myRestaurants.isLoading;

  const isStatsLoading = hourlyStats.isLoading || revenueStats.isLoading || bookingStats.isLoading;

  // Trình bóc tách dữ liệu
  const extractData = (query) => {
    if (query.isError) return null;
    const raw = query.data;
    if (!raw) return null;
    return raw.data !== undefined ? raw.data : (raw.result !== undefined ? raw.result : raw);
  };

  const vS = extractData(venueSummary);
  const bS = extractData(businessSummary);
  const mR = extractData(myRestaurants);
  const hS = extractData(hourlyStats);
  const rS = extractData(revenueStats);
  const bkS = extractData(bookingStats);

  return {
    venueSummary: vS || {},
    businessSummary: bS || {},
    myRestaurants: mR || [],
    hourlyStats: hS || [],
    revenueStats: rS || [],
    bookingStats: bkS || [],
    isLoading,
    isStatsLoading,
    isError: venueSummary.isError || businessSummary.isError || myRestaurants.isError,
    refetch: () => {
      venueSummary.refetch();
      businessSummary.refetch();
      myRestaurants.refetch();
      hourlyStats.refetch();
      revenueStats.refetch();
      bookingStats.refetch();
    },
  };
};

/**
 * @hook useOwnerActivity
 * @description Tải danh sách hoạt động gần đây từ Notification Service.
 * Hỗ trợ phân trang và lọc theo loại hoạt động.
 */
export const useOwnerActivity = (params = { limit: 10, offset: 0 }) => {
  const query = useQuery({
    queryKey: ['owner', 'activity', params],
    queryFn: () => ownerPortalApi.getOwnerActivity(params),
    // Tự động refetch sau mỗi 30 giây để cập nhật hoạt động mới không cần reload (Vietnamese comment)
    refetchInterval: 30000,
    staleTime: 15000,
  });

  // Trích xuất dữ liệu từ cấu trúc response của Notification Service (Vietnamese comment)
  const raw = query.data;
  const activityData = raw?.data || {};

  return {
    activities: activityData.items || [],
    total: activityData.total || 0,
    unreadCount: activityData.unreadCount || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};

/**
 * @hook useCreateRestaurant
 * @description Mutation hook để tạo nhà hàng mới.
 * Tự động vô hiệu hóa cache và thông báo kết quả.
 */
export const useCreateRestaurant = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => ownerPortalApi.createRestaurant(data),
    onSuccess: () => {
      // Vô hiệu hóa cache để cập nhật danh sách nhà hàng và tóm tắt (Vietnamese comment)
      queryClient.invalidateQueries({ queryKey: ['owner', 'portfolio', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'restaurants'] });
      
      // Chuyển hướng về trang danh sách (Vietnamese comment)
      navigate(ROUTES.OWNER_RESTAURANTS);
    },
    onError: (error) => {
      console.error('Create restaurant error:', error);
      // Lỗi sẽ được xử lý tại component để hiển thị thông báo cụ thể (Vietnamese comment)
    }
  });
};
