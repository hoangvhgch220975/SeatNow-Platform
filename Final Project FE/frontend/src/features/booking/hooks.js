import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBookings, getBookingById, getRestaurantAvailability, createBooking, cancelBooking, cancelBookingGuest, modifyBooking } from './api.js';

/**
 * @file hooks.js (Booking Feature)
 * @description Các hook React Query quản lý dữ liệu đặt bàn.
 */

/**
 * Custom Hook: Lấy lịch sử đặt bàn của người dùng.
 * Sắp xếp theo ngày giờ mới nhất và giữ Cache trong 1 phút.
 * @returns {Object} query status, data, error
 */
export const useMyBookingsQuery = () => {
  return useQuery({
    queryKey: ['my-bookings'],
    queryFn: getMyBookings,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    select: (data) => {
      // Backend Booking Service trả về { success, data: { items: [...], limit, offset } }
      // Axios interceptor đã bóc 1 tầng: trả về { items: [...], limit, offset }
      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data?.items)) {
        list = data.items;
      } else if (Array.isArray(data?.data?.items)) {
        list = data.data.items;
      } else if (Array.isArray(data?.data)) {
        list = data.data;
      }

      // 3. Lọc bỏ các đơn hàng đã bị hủy do thực hiện chỉnh sửa (Modify)
      // Để tránh làm loãng danh sách lịch sử khi dùng cơ chế "Hủy cũ - Tạo mới"
      list = list.filter(item => {
        const status = (item.status || item.Status || '').toLowerCase();
        const reason = (item.cancellationReason || item.CancellationReason || '').toLowerCase();
        
        // Nếu đã bị hủy và lý do có chứa "modify" hoặc "rescheduled" (do Backend đặt) -> Ẩn đi
        if (status === 'cancelled' && (reason.includes('modify') || reason.includes('rescheduled'))) {
          return false;
        }
        return true;
      });

      // 4. Sắp xếp theo ngày giờ đặt bàn giảm dần (mới nhất lên đầu)
      return [...list].sort((a, b) => {
        const dateA = new Date(`${a.bookingDate}T${a.bookingTime}`);
        const dateB = new Date(`${b.bookingDate}T${b.bookingTime}`);
        return dateB - dateA;
      });
    },
  });
};

/**
 * Custom Hook: Lấy chi tiết một bản ghi đặt bàn theo ID.
 * @param {string} id - UUID của booking
 */
export const useBookingDetailQuery = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
  });
};
/**
 * Hook fetch danh sách bàn trống (Real-time Availability) dùng React Query
 */
export const useRestaurantAvailability = (id, params) => {
  return useQuery({
    queryKey: ['booking-restaurants', 'availability', id, params],
    queryFn: () => getRestaurantAvailability(id, { ...params, refresh: true }),
    enabled: !!id && !!params?.date && !!params?.time,
    // Cấu hình cập nhật liên tục (Near Real-time)
    staleTime: 0, // Luôn coi dữ liệu là cũ để sẵn sàng tải lại
    refetchInterval: 1000 * 10, // Tự động lấy lại dữ liệu mỗi 10 giây (Polling)
    refetchOnWindowFocus: true, // Khi bạn từ DB quay lại trình duyệt, nó sẽ tự Refresh
    retry: 1,
  });
};

/**
 * Mutation tạo mới một bản ghi đặt bàn
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => createBooking(data),
    onSuccess: () => {
      // Làm mới danh sách booking sau khi tạo thành công
      queryClient.invalidateQueries(['my-bookings']);
    },
  });
};

/**
 * Mutation hủy một bản ghi đặt bàn
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => cancelBooking(data),
    onSuccess: (_, variables) => {
      // Làm mới danh sách booking và chi tiết booking bị hủy
      queryClient.invalidateQueries(['my-bookings']);
      if (variables?.id) {
        queryClient.invalidateQueries(['booking', variables.id]);
      }
    },
  });
};

/**
 * Mutation hủy một bản ghi đặt bàn cho khách (Guest)
 */
export const useCancelBookingByGuest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => cancelBookingGuest(data),
    onSuccess: (_, variables) => {
      // Invalidate các query liên quan nếu cần
      if (variables?.id) {
        queryClient.invalidateQueries(['booking', variables.id]);
      }
    },
  });
};
/**
 * Mutation chỉnh sửa một bản ghi đặt bàn (Modify)
 */
export const useModifyBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => modifyBooking(data),
    onSuccess: (_, variables) => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries(['my-bookings']);
      if (variables?.id) {
        queryClient.invalidateQueries(['booking', variables.id]);
      }
    },
  });
};
