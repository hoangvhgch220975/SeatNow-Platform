import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { restaurantAdminApi } from './api.js';
import { toast } from 'react-hot-toast';

/**
 * @file hooks.js
 * @description React Query hooks cho quản lý vận hành nhà hàng Admin.
 */

// Hook lấy danh sách nhà hàng đang hoạt động (kèm bộ lọc)
export const useAdminRestaurants = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'restaurants', 'list', params],
    queryFn: async () => {
      const response = await restaurantAdminApi.getAll(params);
      return response;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Hook lấy danh sách nhà hàng đang chờ duyệt
export const useAdminPendingRestaurants = () => {
  return useQuery({
    queryKey: ['admin', 'restaurants', 'pending'],
    queryFn: async () => {
      const response = await restaurantAdminApi.getPending();
      return response;
    },
    staleTime: 1 * 60 * 1000,
  });
};

// Hook xử lý các hành động Vận hành (Suspend/Activate/Approve)
export const useRestaurantActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const handleSuccess = (key, variables) => {
    toast.success(t(`admin.toasts.${key}`, { name: variables.name }));
    queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
  };

  const handleError = (error) => {
    const msg = error.response?.data?.message;
    const translated = t(`admin.toasts.${msg}`);
    toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
  };

  // Tạm ngừng nhà hàng
  const suspendMutation = useMutation({
    mutationFn: ({ id }) => restaurantAdminApi.suspend(id),
    onSuccess: (_, variables) => handleSuccess('suspend_success', variables),
    onError: handleError
  });

  // Mở khóa nhà hàng
  const activateMutation = useMutation({
    mutationFn: ({ id }) => restaurantAdminApi.activate(id),
    onSuccess: (_, variables) => handleSuccess('activate_success', variables),
    onError: handleError
  });

  // Phê duyệt nhà hàng mới
  const approveMutation = useMutation({
    mutationFn: ({ id }) => restaurantAdminApi.approve(id),
    onSuccess: (_, variables) => handleSuccess('approve_success', variables),
    onError: handleError
  });

  // Cập nhật thông tin nhà hàng
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => restaurantAdminApi.update(id, data),
    onSuccess: (_, variables) => handleSuccess('update_success', variables),
    onError: handleError
  });

  // Tạo mới nhà hàng (Tạo hộ)
  const createMutation = useMutation({
    mutationFn: (data) => restaurantAdminApi.create(data),
    onSuccess: (_, variables) => handleSuccess('create_success', variables),
    onError: handleError
  });

  return {
    suspend: suspendMutation.mutateAsync,
    isSuspending: suspendMutation.isPending,
    activate: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    update: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    create: createMutation.mutateAsync,
    isCreating: createMutation.isPending
  };
};
