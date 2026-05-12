import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tableApi } from './api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Hook quản lý danh sách bàn
 * @param {string} restaurantId 
 * @param {object} params - Bộ lọc location, status, type
 */
export const useTables = (restaurantId, params = {}) => {
  return useQuery({
    queryKey: ['tables', restaurantId, params],
    queryFn: async () => {
      const response = await tableApi.getTables(restaurantId, params);
      return response.data;
    },
    enabled: !!restaurantId,
  });
};

/**
 * Hook quản lý thống kê bàn theo tầng
 * @param {string} restaurantId 
 */
export const useTableStats = (restaurantId) => {
  return useQuery({
    queryKey: ['table-stats', restaurantId],
    queryFn: async () => {
      const response = await tableApi.getTableStats(restaurantId);
      return response.data;
    },
    enabled: !!restaurantId,
  });
};

/**
 * Hook thêm bàn mới
 */
export const useCreateTable = (restaurantId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data) => tableApi.createTable(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables', restaurantId]);
      queryClient.invalidateQueries(['table-stats', restaurantId]);
      toast.success(t('tables.form.create_success'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create table');
    },
  });
};

/**
 * Hook cập nhật thông tin bàn
 */
export const useUpdateTable = (restaurantId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ tableId, data }) => tableApi.updateTable(restaurantId, tableId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables', restaurantId]);
      queryClient.invalidateQueries(['table-stats', restaurantId]);
      toast.success(t('tables.form.update_success'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update table');
    },
  });
};

/**
 * Hook xóa bàn
 */
export const useDeleteTable = (restaurantId) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (tableId) => tableApi.deleteTable(restaurantId, tableId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tables', restaurantId]);
      queryClient.invalidateQueries(['table-stats', restaurantId]);
      toast.success(t('tables.form.delete_success'));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete table');
    },
  });
};
