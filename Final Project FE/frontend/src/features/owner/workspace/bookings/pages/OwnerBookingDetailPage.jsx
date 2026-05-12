import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Info } from 'lucide-react';
import { useBookingDetail, useBookingActions } from '../hooks';
import { ROUTES } from '@/config/routes';
import CancelReasonModal from '../components/CancelReasonModal';

// Import sub-components
import DetailHeader from '../components/detail/DetailHeader';
import CustomerCard from '../components/detail/CustomerCard';
import BookingInfoCard from '../components/detail/BookingInfoCard';
import PaymentInfoCard from '../components/detail/PaymentInfoCard';
import SpecialRequestsCard from '../components/detail/SpecialRequestsCard';
import CheckInQRCard from '../components/detail/CheckInQRCard';
import ActionCommandCenter from '../components/detail/ActionCommandCenter';

/**
 * @file OwnerBookingDetailPage.jsx
 * @description Trang chi tiết đặt bàn dành cho Chủ nhà hàng (Refactored).
 */

const OwnerBookingDetailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idOrSlug, bookingId } = useParams();
  
  const { data: booking, isLoading, isError, refetch } = useBookingDetail(bookingId);
  const actions = useBookingActions();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        <div className="h-10 w-48 bg-slate-200 rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-100 rounded-3xl" />
            <div className="h-96 bg-slate-100 rounded-3xl" />
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-slate-100 rounded-3xl" />
            <div className="h-64 bg-slate-100 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-5">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900">{t('owner_bookings.toast.load_error')}</h3>
          <button 
            onClick={() => navigate(ROUTES.WORKSPACE_BOOKINGS(idOrSlug))}
            className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            {t('workspace_booking_detail.back_to_list')}
          </button>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      PENDING:   { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: t('owner_bookings.filters.status_pending') },
      CONFIRMED: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: t('owner_bookings.filters.status_confirmed') },
      ARRIVED:   { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', icon: MapPin, label: t('owner_bookings.filters.status_arrived') },
      COMPLETED: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CheckCircle2, label: t('owner_bookings.filters.status_completed') },
      CANCELLED: { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle, label: t('owner_bookings.filters.status_cancelled') },
      NO_SHOW:   { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: Info, label: t('owner_bookings.filters.status_no_show') },
    };
    return configs[status?.toUpperCase()] || configs.PENDING;
  };

  const statusCfg = getStatusConfig(booking.status);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[1400px] mx-auto pb-20">
      
      <DetailHeader 
        booking={booking} 
        statusCfg={statusCfg} 
        idOrSlug={idOrSlug} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CustomerCard booking={booking} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BookingInfoCard booking={booking} />
            <PaymentInfoCard booking={booking} />
          </div>

          <SpecialRequestsCard requests={booking.specialRequests} />
        </div>

        <div className="flex flex-col gap-8 h-full">
          <CheckInQRCard booking={booking} />
          
          <div className="flex-1">
            <ActionCommandCenter 
              booking={booking}
              actions={actions}
              refetch={refetch}
              onOpenCancelModal={() => setCancelModalOpen(true)}
            />
          </div>
        </div>
      </div>

      <CancelReasonModal 
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={(reason) => actions.cancelBooking({ id: booking.id, reason }).then(() => {
          setCancelModalOpen(false);
          refetch();
        })}
        isLoading={actions.isLoading}
      />
    </div>
  );
};

export default OwnerBookingDetailPage;
