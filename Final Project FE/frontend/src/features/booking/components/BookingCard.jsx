import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRestaurant } from '../../restaurants/hooks.js';
import { useCancelBooking } from '../hooks.js';
import { formatDate, formatTime } from '../../../shared/utils/formatDateTime.js';
import { ROUTES } from '../../../config/routes.js';
import BookingStatusBadge from './BookingStatusBadge.jsx';
import CancelBookingDialog from './CancelBookingDialog.jsx';

/**
 * @file BookingCard.jsx
 * @description Card hiển thị thông tin chi tiết một đơn đặt bàn cao cấp.
 */
const BookingCard = ({ booking }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const b = booking;
  
  const initialName = b.restaurant?.name || b.restaurantName || b.RestaurantName;
  const restaurantId = b.restaurantId || b.idRestaurant;
  const { data: restaurant, isLoading: isResLoading } = useRestaurant(!initialName ? restaurantId : null);

  const displayName = initialName || restaurant?.name || (isResLoading ? '...' : `#${b.bookingCode || b.id.slice(0, 8)}`);
  const restaurantImages = b.restaurant?.images || restaurant?.images || [];
  const displayImg = restaurantImages[0] || b.restaurant?.image || restaurant?.image || `https://api.dicebear.com/9.x/shapes/svg?seed=${b.id || b.restaurantId}`;

  const formattedDate = formatDate(b.bookingDate || b.date);
  const formattedTime = formatTime(b.bookingTime || b.time);

  const cancelBookingMutation = useCancelBooking();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleViewDetails = () => {
    if (b.id) {
      navigate(ROUTES.BOOKING_DETAIL(b.id));
    }
  };
  
  const handleCancelConfirm = (reason) => {
    cancelBookingMutation.mutate(
      { id: b.id, cancellationReason: reason || t('booking.notifications.cancel_reason_default') },
      {
        onSuccess: () => {
          toast.success(t('booking.notifications.cancel_success'));
          setIsCancelDialogOpen(false);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || t('booking.notifications.cancel_error'));
        }
      }
    );
  };

  const handleModify = () => {
    const normalizedBooking = {
      id: b.id,
      bookingCode: b.bookingCode || b.id.slice(0, 8),
      restaurant: { name: displayName, image: displayImg },
      guest: {
        fullName: b.guestName || t('booking.detail.fallbacks.verified_member'),
        email: b.guestEmail || t('booking.detail.fallbacks.email_in_profile'),
        phone: b.guestPhone || t('booking.detail.fallbacks.phone_in_profile')
      },
      reservation: {
        rawDate: b.bookingDate || b.date,
        rawTime: b.bookingTime || b.time,
        partySize: b.numGuests || b.guests || 2,
        tableId: b.tableId || b.table?._id || b.table?.id,
        tableInfo: b.table || { name: b.tableName }
      },
      notes: b.specialRequests || ''
    };

    const targetUrl = ROUTES.CREATE_BOOKING(restaurant?.slug || restaurantId || 'unknown');
    navigate(targetUrl, { state: { modifyBookingItem: normalizedBooking, originalRestaurantId: restaurantId } });
  };

  const isPendingOrConfirmed = ['pending', 'confirmed', 'upcoming'].includes(b.status?.toLowerCase());

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={handleViewDetails}
      className="group relative bg-white rounded-[2.5rem] p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10 border border-outline/10 hover:border-primary/20 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.15)] transition-all duration-700 ease-out-expo overflow-hidden cursor-pointer"
    >
      {/* Cinematic Highlight effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

      <div className="relative w-full lg:w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-700">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
        <img 
          alt={displayName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out-expo" 
          src={displayImg} 
        />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 w-full items-center relative z-20">
        <div className="space-y-3 text-center md:text-left">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em] bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
            #{b.bookingCode || b.id.slice(0, 8)}
          </span>
          <h3 className="text-2xl font-black text-on-surface tracking-tight line-clamp-1 headline group-hover:text-primary transition-colors duration-500">
            {displayName}
          </h3>
          <div className="flex items-center justify-center md:justify-start">
            <span className="text-on-surface-variant font-bold text-[13px] tracking-widest uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
              {Number(b.depositAmount || 0).toLocaleString('vi-VN')} VNĐ
            </span>
          </div>
        </div>

        <div className="space-y-5 text-center md:text-left border-t border-outline/5 pt-6 md:border-none md:pt-0">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
            <span className="text-on-surface-variant/80 text-[13px] font-black uppercase tracking-widest">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
            <span className="text-on-surface font-black text-lg">
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 text-on-surface-variant/60 text-[11px] font-black uppercase tracking-[0.2em]">
            <span className="material-symbols-outlined text-[20px] text-primary">group</span>
            <span>{t('booking.card.guests_count', { count: b.numGuests || b.guests })}</span>
          </div>
          <div className="flex justify-center md:justify-start">
            <BookingStatusBadge status={b.status} />
          </div>
        </div>

        {isPendingOrConfirmed && (
          <div className="flex flex-col sm:flex-row xl:flex-col items-stretch justify-center gap-3 w-full xl:pl-8 xl:border-l xl:border-outline/5">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); handleModify(); }}
              className="flex-1 px-4 py-4 text-[10px] font-black text-on-surface-variant/70 bg-surface rounded-[1rem] border border-outline/10 hover:border-primary/30 hover:text-primary hover:bg-white transition-all duration-300 uppercase tracking-[0.2em] text-center"
            >
              {t('booking.card.modify')}
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); setIsCancelDialogOpen(true); }}
              className="flex-1 px-4 py-4 text-[10px] font-black text-rose-600 bg-rose-50 rounded-[1rem] border border-rose-100 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 uppercase tracking-[0.2em] text-center"
            >
              {t('booking.card.cancel')}
            </motion.button>
          </div>
        )}
      </div>

      <CancelBookingDialog 
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        isCanceling={cancelBookingMutation.isPending}
      />
    </motion.div>
  );
};

export default BookingCard;
