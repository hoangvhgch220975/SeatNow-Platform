import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as settingsApi from './api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const SETTINGS_KEYS = {
  COMMISSION: ['admin', 'settings', 'commission'],
  HEALTH: (service) => ['admin', 'settings', 'health', service],
  ALL_HEALTH: ['admin', 'settings', 'health', 'all']
};

/**
 * Hook lấy cấu hình hoa hồng
 */
export const useCommissionConfig = () => {
  return useQuery({
    queryKey: SETTINGS_KEYS.COMMISSION,
    queryFn: () => settingsApi.getCommissionConfig(),
    // Data transform nếu cần
    select: (res) => res.data || res,
  });
};

/**
 * Hook cập nhật cấu hình hoa hồng
 */
export const useUpdateCommissionConfig = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data) => settingsApi.updateCommissionConfig(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.COMMISSION });
      toast.success(t('admin.settings.commission.update_success'));
    },
    onError: () => {
      toast.error(t('admin.settings.commission.update_error'));
    }
  });
};

/**
 * Hook kiểm tra sức khỏe của một service
 */
export const useServiceHealth = (serviceId) => {
  return useQuery({
    queryKey: SETTINGS_KEYS.HEALTH(serviceId),
    queryFn: () => settingsApi.getServiceHealth(serviceId),
    refetchInterval: 30000, // Tự động làm mới mỗi 30 giây
    retry: 1,
    // Trả về mặc định DOWN nếu lỗi
    onError: (err) => {
      console.error(`Health Check failed for ${serviceId}:`, err);
    }
  });
};

/**
 * Hook kiểm tra sức khỏe toàn bộ 9 services
 */
export const servicesList = [
  { id: 'auth', nameKey: 'admin.settings.services.auth', port: 3001, roleKey: 'admin.settings.services.roles.auth' },
  { id: 'users', nameKey: 'admin.settings.services.users', port: 3002, roleKey: 'admin.settings.services.roles.users' },
  { id: 'restaurants', nameKey: 'admin.settings.services.restaurants', port: 3003, roleKey: 'admin.settings.services.roles.restaurants' },
  { id: 'bookings', nameKey: 'admin.settings.services.bookings', port: 3004, roleKey: 'admin.settings.services.roles.bookings' },
  { id: 'payment', nameKey: 'admin.settings.services.payment', port: 3005, roleKey: 'admin.settings.services.roles.payment' },
  { id: 'admin', nameKey: 'admin.settings.services.admin', port: 3006, roleKey: 'admin.settings.services.roles.admin' },
  { id: 'ai', nameKey: 'admin.settings.services.ai', port: 3007, roleKey: 'admin.settings.services.roles.ai' },
  { id: 'notifications', nameKey: 'admin.settings.services.notifications', port: 3008, roleKey: 'admin.settings.services.roles.notifications' }
];
