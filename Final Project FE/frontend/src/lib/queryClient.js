import { QueryClient } from '@tanstack/react-query';

/**
 * Khởi tạo TanStack Query cho việc caching, fetching, state management từ xa
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tránh fetch lại dữ liệu khi người dùng vừa chuyển tab về
      retry: 1,                    // Nếu lỗi API, thử lại 1 lần duy nhất
      staleTime: 5 * 60 * 1000,    // Giữ cache trong 5 phút trước khi gọi lại API (Tối ưu cho tốc độ UI)
    },
  },
});
