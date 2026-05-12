import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRestaurantInfo, updateDepositPolicy } from './api';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * @file hooks.js
 * @description Các hook React Query để quản lý cập nhật hồ sơ nhà hàng.
 */

/**
 * Hook cập nhật thông tin chung của nhà hàng (Basic, Contact, Hours).
 */
export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }) => updateRestaurantInfo(id, data),
    onSuccess: (_, { id }) => {
      // Refresh dữ liệu nhà hàng trong cache sau khi cập nhật thành công (Vietnamese comment)
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
      toast.success(t('workspace.profile.success_update'));
    },
    onError: (error) => {
      console.error('Update Error:', error);
      toast.error(t('workspace.profile.error_update'));
    }
  });
};

/**
 * Hook cập nhật chính sách đặt cọc.
 */
export const useUpdateDepositPolicy = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, data }) => updateDepositPolicy(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant', id] });
      toast.success(t('workspace.profile.success_update'));
    },
    onError: (error) => {
      console.error('Deposit Policy Update Error:', error);
      toast.error(t('workspace.profile.error_update'));
    }
  });
};
