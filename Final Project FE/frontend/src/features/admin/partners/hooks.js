import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { partnerAdminApi } from './api.js';
import { toast } from 'react-hot-toast';

/**
 * @file hooks.js
 * @description Hooks quản lý đối tác Admin.
 */

// Lấy danh sách Leads (Pending Requests)
export const usePartnerLeads = () => {
  return useQuery({
    queryKey: ['admin', 'partners', 'leads'],
    queryFn: async () => {
      const response = await partnerAdminApi.getLeads();
      return response.data || {};
    },
    staleTime: 1 * 60 * 1000,
  });
};

// Lấy danh sách Chủ nhà hàng hiện có (Partners)
export const useActiveOwners = (params = {}) => {
  return useQuery({
    queryKey: ['admin', 'partners', 'owners', params],
    queryFn: async () => {
      const response = await partnerAdminApi.getOwners(params);
      // Trả về toàn bộ object { data: [], pagination: {} } để UI có thể dùng cả 2
      if (response && response.data) {
        return response; 
      }
      return { data: [], pagination: { total: 0 } };
    },
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true, // Useful for pagination
  });
};

// Các hành động với Đối tác
export const usePartnerActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Duyệt Lead
  const approveLead = useMutation({
    mutationFn: (id) => partnerAdminApi.approveLead(id),
    onSuccess: () => {
      toast.success(t('admin.toasts.approve_success'));
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message;
      const translated = t(`admin.toasts.${msg}`);
      toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
    }
  });

  // Tạo mới Owner
  const createOwnerMutation = useMutation({
    mutationFn: (data) => partnerAdminApi.createOwner(data),
    onSuccess: (_, variables) => {
      toast.success(t('admin.toasts.create_success', { name: variables.name }));
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'owners'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message;
      const translated = t(`admin.toasts.${msg}`);
      toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
    }
  });

  const updateOwnerMutation = useMutation({
    mutationFn: ({ id, data }) => partnerAdminApi.updateOwner(id, data),
    onSuccess: (_, variables) => {
      toast.success(t('admin.toasts.update_success', { name: variables.data.name || variables.data.fullName }));
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'owners'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message;
      const translated = t(`admin.toasts.${msg}`);
      toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
    }
  });

  const deleteOwnerMutation = useMutation({
    mutationFn: ({ id }) => partnerAdminApi.deleteOwner(id),
    onSuccess: (_, variables) => {
      toast.success(t('admin.toasts.delete_success', { name: variables.name }));
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'owners'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message;
      const translated = t(`admin.toasts.${msg}`);
      toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, data }) => partnerAdminApi.resetPassword(id, data),
    onSuccess: (_, variables) => {
      toast.success(t('admin.toasts.reset_success', { name: variables.name }));
      queryClient.invalidateQueries({ queryKey: ['admin', 'partners', 'owners'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message;
      const translated = t(`admin.toasts.${msg}`);
      toast.error(translated !== `admin.toasts.${msg}` ? translated : (msg || t('admin.toasts.error_generic')));
    }
  });

  return {
    approveLead: approveLead.mutate,
    createOwner: createOwnerMutation.mutateAsync,
    isCreating: createOwnerMutation.isPending,
    updateOwner: updateOwnerMutation.mutateAsync,
    isUpdating: updateOwnerMutation.isPending,
    deleteOwner: deleteOwnerMutation.mutateAsync,
    isDeleting: deleteOwnerMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResettingPassword: resetPasswordMutation.isPending,
  };
};
