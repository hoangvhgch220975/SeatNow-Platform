import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from './api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for managing menu items
 * Provides data fetching and mutation methods for CRUD operations
 * 
 * @param {string} restaurantId - Current restaurant ID
 * @param {object} filters - Search, category, and status filters
 */
export const useMenu = (restaurantId, filters = {}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Fetch menu items with React Query
  // Biến menuQuery sẽ tự động refetch khi restaurantId hoặc filters thay đổi
  const menuQuery = useQuery({
    queryKey: ['menu', restaurantId, filters],
    queryFn: () => menuApi.getMenuItems(restaurantId, filters),
    enabled: !!restaurantId,
  });

  // Tạo món ăn mới
  const createMutation = useMutation({
    mutationFn: (data) => menuApi.createMenuItem(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      toast.success(t('menu_mgmt.save_success'));
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      toast.error(message || 'Failed to create menu item');
    },
  });

  // Cập nhật món ăn hiện có
  const updateMutation = useMutation({
    mutationFn: ({ itemId, data }) => menuApi.updateMenuItem(restaurantId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      toast.success(t('menu_mgmt.update_success'));
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      toast.error(message || 'Failed to update menu item');
    },
  });

  // Xóa món ăn
  const deleteMutation = useMutation({
    mutationFn: (itemId) => menuApi.deleteMenuItem(restaurantId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
      toast.success(t('menu_mgmt.delete_success'));
    },
    onError: (error) => {
      const message = error.response?.data?.message || error.message;
      toast.error(message || 'Failed to delete menu item');
    },
  });

  return {
    menuItems: menuQuery.data?.data || [],
    total: menuQuery.data?.total || 0,
    isLoading: menuQuery.isLoading,
    isRefetching: menuQuery.isRefetching,
    isError: menuQuery.isError,
    error: menuQuery.error,
    
    // Actions
    createItem: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    
    updateItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    
    deleteItem: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
