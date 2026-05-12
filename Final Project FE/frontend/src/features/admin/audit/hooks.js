import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { auditAdminApi } from './api.js';
import { toast } from 'react-hot-toast';

/**
 * @file hooks.js
 * @description Hooks quản lý các yêu cầu kiểm duyệt Admin.
 */

// Lấy danh sách Leads chờ duyệt
export const useAuditLeads = () => {
  return useQuery({
    queryKey: ['admin', 'audit', 'leads'],
    queryFn: async () => {
      const response = await auditAdminApi.getLeads();
      return response;
    },
    staleTime: 1 * 60 * 1000,
  });
};

// Lấy danh sách Nhà hàng chờ duyệt hồ sơ
export const useAuditVenues = () => {
  return useQuery({
    queryKey: ['admin', 'audit', 'venues'],
    queryFn: async () => {
      const response = await auditAdminApi.getPendingVenues();
      return response;
    },
    staleTime: 1 * 60 * 1000,
  });
};

// Các hành động Kiểm duyệt
export const useAuditActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Duyệt Lead (Owner account)
  const approveLead = useMutation({
    mutationFn: ({ id, lead }) => {
      // Chuyển về data phẳng vì admin-service sẽ bọc nó vào property 'payload' khi gọi Auth-Service 
      // HOẶC Auth-Service nhận req.body trực tiếp là object user.
      const body = {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      };
      return auditAdminApi.approveLead(id, body);
    },
    onSuccess: () => {
      toast.success(t('admin.toasts.approve_success') || 'Partner approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit', 'leads'] });
    },
    onError: (error) => {
      toast.error(error?.message || t('admin.toasts.approve_error') || 'Failed to approve partner');
    },
  });

  // Từ chối Lead
  const rejectLead = useMutation({
    mutationFn: (id) => auditAdminApi.rejectLead(id),
    onSuccess: () => {
      toast.success(t('admin.toasts.reject_success') || 'Request rejected');
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit', 'leads'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('admin.toasts.error_generic'));
    }
  });

  // Duyệt Hồ sơ nhà hàng (Venue)
  const approveVenue = useMutation({
    mutationFn: (id) => auditAdminApi.approveVenue(id),
    onSuccess: () => {
      toast.success(t('admin.toasts.approve_venue_success') || 'Venue approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('admin.toasts.error_generic'));
    }
  });

  // Từ chối Hồ sơ nhà hàng (Venue)
  const rejectVenue = useMutation({
    mutationFn: (id) => auditAdminApi.rejectVenue(id),
    onSuccess: () => {
      toast.success(t('admin.toasts.reject_success') || 'Venue rejected and removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'audit'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || t('admin.toasts.error_generic'));
    }
  });

  return {
    approveLead: approveLead.mutateAsync, // Sử dụng mutateAsync để await được trong component
    isApprovingLead: approveLead.isPending,
    rejectLead: rejectLead.mutateAsync,
    isRejectingLead: rejectLead.isPending,
    approveVenue: approveVenue.mutateAsync,
    isApprovingVenue: approveVenue.isPending,
    rejectVenue: rejectVenue.mutateAsync,
    isRejectingVenue: rejectVenue.isPending,
  };
};
