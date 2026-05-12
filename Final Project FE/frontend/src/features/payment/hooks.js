import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateDepositPayment, getTransactionStatus } from './api';

/**
 * @file hooks.js (Payment Feature)
 * @description Các hook React Query quản lý luồng thanh toán và kiểm tra trạng thái.
 */

/**
 * Hook: Khởi tạo thanh toán (Momo/VNPay)
 * Trả về link redirect và transactionId.
 */
export const useStartPayment = () => {
  return useMutation({
    mutationFn: ({ bookingId, provider }) => generateDepositPayment(bookingId, provider),
  });
};

/**
 * Hook: Kiểm tra trạng thái giao dịch (Polling)
 * @param {string} transactionId - ID giao dịch để kiểm tra
 * @param {boolean} enabled - Chế độ bật/tắt polling
 */
export const usePaymentStatus = (transactionId, enabled = false) => {
  return useQuery({
    queryKey: ['payment-status', transactionId],
    queryFn: () => getTransactionStatus(transactionId),
    enabled: !!transactionId && enabled,
    refetchInterval: (data) => {
      // Dừng polling nếu đã thành công hoặc thất bại
      const status = data?.data?.status || data?.status;
      if (status === 'PAID' || status === 'SUCCESS' || status === 'FAILED') {
        return false;
      }
      return 3000; // Tiếp tục mỗi 3 giây
    },
    // Tránh lưu cache quá lâu cho dữ liệu polling nhạy cảm
    staleTime: 0,
    cacheTime: 0,
  });
};
