import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingOwnerApi } from './api';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Hook lấy chi tiết booking
 * @param {string} bookingId 
 */
export const useBookingDetail = (bookingId) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const res = await bookingOwnerApi.getBookingDetail(bookingId);
      return res.booking; // BE returns { booking, restaurant }
    },
    enabled: !!bookingId,
  });
};

/**
 * Hook quản lý các hành động cập nhật trạng thái booking
 */
export const useBookingActions = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const confirmMutation = useMutation({
    mutationFn: (id) => bookingOwnerApi.confirmBooking(id),
    onSuccess: () => {
      toast.success(t('owner_bookings.toast.confirm_success'));
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error(t('owner_bookings.toast.action_error')),
  });

  const arriveMutation = useMutation({
    mutationFn: (id) => bookingOwnerApi.arriveBooking(id),
    onSuccess: () => {
      toast.success(t('owner_bookings.toast.arrive_success'));
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error(t('owner_bookings.toast.action_error')),
  });

  const completeMutation = useMutation({
    mutationFn: (id) => bookingOwnerApi.completeBooking(id),
    onSuccess: () => {
      toast.success(t('owner_bookings.toast.complete_success'));
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error(t('owner_bookings.toast.action_error')),
  });

  const noShowMutation = useMutation({
    mutationFn: (id) => bookingOwnerApi.noShowBooking(id),
    onSuccess: () => {
      toast.success(t('owner_bookings.toast.no_show_success'));
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error(t('owner_bookings.toast.action_error')),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }) => bookingOwnerApi.cancelBooking(id, reason),
    onSuccess: () => {
      toast.success(t('owner_bookings.toast.cancel_success'));
      queryClient.invalidateQueries({ queryKey: ['booking'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: () => toast.error(t('owner_bookings.toast.action_error')),
  });

  return {
    confirmBooking: confirmMutation.mutateAsync,
    arriveBooking: arriveMutation.mutateAsync,
    completeBooking: completeMutation.mutateAsync,
    noShowBooking: noShowMutation.mutateAsync,
    cancelBooking: cancelMutation.mutateAsync,
    isLoading: 
      confirmMutation.isPending || 
      arriveMutation.isPending || 
      completeMutation.isPending || 
      noShowMutation.isPending || 
      cancelMutation.isPending,
  };
};
