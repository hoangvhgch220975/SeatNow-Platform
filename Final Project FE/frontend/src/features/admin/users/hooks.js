import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getUsers, deleteUser, getAdminStats } from './api';
import { toast } from 'react-hot-toast';

/**
 * @file hooks.js
 * @description Hooks quản lý dữ liệu người dùng cho Admin
 */

/**
 * Hook lấy danh sách người dùng với phân trang và tìm kiếm
 * @param {Object} query - Tham số tìm kiếm (keyword, role, page, limit)
 */
export const useUsersList = (query) => {
  return useQuery({
    queryKey: ['admin', 'users', 'list', query],
    queryFn: async () => {
      const response = await getUsers(query);
      return response;
    },
    staleTime: 2 * 60 * 1000, // Dữ liệu sạch trong 2 phút
  });
};

/**
 * Hook lấy số liệu thống kê người dùng cho Admin Dashboard
 */
export const useAdminUserStats = () => {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: getAdminStats,
    refetchInterval: 30000, // Làm mới mỗi 30 giây
  });
};

/**
 * Hook xử lý các hành động liên quan đến người dùng (Xóa)
 */
export const useUserActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const removeUser = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: (_, id) => {
      toast.success(t('admin.users.toasts.delete_success') || 'User deleted successfully');
      // Invalidate both general list and specific page lists
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || t('admin.users.toasts.error_delete');
      toast.error(message || 'Failed to delete user');
    },
  });

  return {
    deleteUser: removeUser.mutateAsync,
    isDeleting: removeUser.isPending,
  };
};
