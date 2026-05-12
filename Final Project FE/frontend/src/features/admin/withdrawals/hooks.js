import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { withdrawalsApi } from './api';

/**
 * @file hooks.js
 * @description React Query hooks cho việc quản lý các lệnh rút tiền (Withdrawals) của Admin.
 */

/**
 * Hook lấy danh sách các yêu cầu rút tiền đang chờ xử lý
 * @param {Object} params - { restaurantId, page, limit, status }
 */
export const useAdminWithdrawals = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'withdrawals', 'list', params],
    queryFn: async () => {
      const response = await withdrawalsApi.getWithdrawals(params);
      // Trả về toàn bộ response để component có thể truy cập summary và pagination
      return response;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000, // 30 giây
  });
};

/**
 * Hook xử lý các hành động phê duyệt hoặc từ chối rút tiền
 */
export const useWithdrawalActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Mutation phê duyệt
  const approve = useMutation({
    mutationFn: (id) => withdrawalsApi.approveWithdrawal(id),
    onSuccess: () => {
      toast.success(t('admin.withdrawals.actions.approve') || 'Withdrawal approved successfully');
      // Làm mới danh sách và thống kê liên quan
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to approve withdrawal';
      toast.error(msg);
    }
  });

  // Mutation từ chối
  const reject = useMutation({
    mutationFn: (id) => withdrawalsApi.rejectWithdrawal(id),
    onSuccess: () => {
      toast.success(t('admin.withdrawals.actions.reject') || 'Withdrawal rejected successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'transactions'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to reject withdrawal';
      toast.error(msg);
    }
  });

  return {
    approveWithdrawal: approve.mutateAsync,
    isApproving: approve.isPending,
    rejectWithdrawal: reject.mutateAsync,
    isRejecting: reject.isPending
  };
};
