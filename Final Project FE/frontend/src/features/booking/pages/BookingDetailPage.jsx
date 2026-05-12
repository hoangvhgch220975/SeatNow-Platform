import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingDetailQuery, useCancelBooking } from '../hooks.js';
import { useRestaurant } from '../../restaurants/hooks.js';
import { getRestaurantTables } from '../../restaurants/api';
import { useProfileQuery } from '../../profile/hooks.js';
import BookingStatusTimeline from '../components/BookingStatusTimeline.jsx';
import BookingStatusBadge from '../components/BookingStatusBadge.jsx';

import BookingQRCode from '../components/BookingQRCode.jsx';
import BookingInfoSection from '../components/BookingInfoSection.jsx';
import BookingFinancialSummary from '../components/BookingFinancialSummary.jsx';
import CancelBookingDialog from '../components/CancelBookingDialog.jsx';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner.jsx';
import ErrorState from '../../../shared/feedback/ErrorState.jsx';
import { formatDate, formatTime } from '../../../shared/utils/formatDateTime.js';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file BookingDetailPage.jsx
 * @description Trang chi tiết một đơn đặt bàn cao cấp.
 */
const BookingDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: rawBooking, isLoading: isBookingLoading, isError: isBookingError, error: bookingError } = useBookingDetailQuery(id);
  const cancelBookingMutation = useCancelBooking();
  
  const [enrichedTable, setEnrichedTable] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const bData = rawBooking?.data || rawBooking || {};
  const bookingInfo = bData?.booking || bData;
  const restaurantId = bookingInfo?.restaurant?.id || bookingInfo?.restaurantId || bookingInfo?.restaurant?._id;
  const tableIdFromBooking = bookingInfo?.tableId || (bookingInfo?.table?.id || bookingInfo?.table?._id);
  const initialTableObj = bookingInfo?.table || {};
  const hasTableNumber = !!initialTableObj?.tableNumber;

  useEffect(() => {
    const needsEnrichment = tableIdFromBooking && !hasTableNumber;

    if (needsEnrichment && restaurantId) {
      const fetchEnrichedTable = async () => {
        try {
          const res = await getRestaurantTables(restaurantId);
          const tablesList = res?.data || res || [];
          const matchedTable = tablesList.find(t => (t.id || t._id || t.Id) === tableIdFromBooking);
          if (matchedTable) {
            setEnrichedTable(matchedTable);
          }
        } catch (err) {
          console.error("Failed to enrich table data:", err);
        }
      };
      fetchEnrichedTable();
    }
  }, [tableIdFromBooking, restaurantId, hasTableNumber]);

  const { data: fullRestaurantData } = useRestaurant(id && !bookingInfo?.restaurant?.images ? restaurantId : null);
  const fullRes = fullRestaurantData?.data || fullRestaurantData;

  const { data: profile } = useProfileQuery();

  const normalizedBooking = useMemo(() => {
    if (!rawBooking) return null;

    const bookingData = bData.booking || bData; 
    const restaurantData = bData.restaurant || bData.Restaurant || {};

    const getV = (obj, ...keys) => {
      for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
      }
      return null;
    };

    const restaurantName = getV(restaurantData, 'restaurantName', 'name', 'Name') || fullRes?.name || t('booking.detail.fallbacks.restaurant_name');
    const restaurantAddress = getV(restaurantData, 'restaurantAddress', 'address', 'Address') || fullRes?.address || t('booking.detail.fallbacks.restaurant_address');
    
    const imagesFromFull = fullRes?.images || fullRes?.imagesJson || [];
    const rawImagesArr = imagesFromFull.length > 0 ? imagesFromFull : (getV(restaurantData, 'images', 'imagesJson', 'restaurantImages', 'restaurantImagesJson') || []);
    
    let restaurantImages = [];
    try {
      if (typeof rawImagesArr === 'string' && rawImagesArr.trim().startsWith('[')) {
        restaurantImages = JSON.parse(rawImagesArr);
      } else if (Array.isArray(rawImagesArr)) {
        restaurantImages = rawImagesArr;
      } else if (rawImagesArr) {
        restaurantImages = [rawImagesArr];
      }
    } catch (e) {
      restaurantImages = [];
    }

    const restaurantImage = restaurantImages[0] || getV(restaurantData, 'image', 'Image', 'coverImage') || fullRes?.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";

    const bid = getV(bookingData, 'id', 'Id', '_id');
    const bCode = getV(bookingData, 'bookingCode', 'BookingCode', 'code', 'Code');
    const bStatus = (getV(bookingData, 'status', 'Status') || 'pending').toLowerCase();

    const userData = bookingData.user || bookingData.User || bookingData.customer || bookingData.Customer || {};
    const finalTable = (enrichedTable && Object.keys(enrichedTable).length > 0) ? enrichedTable : (bookingData.table || {});

    return {
      id: bid,
      bookingCode: bCode || (bid ? String(bid).slice(0, 8).toUpperCase() : 'N/A'),
      status: bStatus,
      cancellationReason: getV(bookingData, 'cancellationReason', 'CancellationReason', 'reason') || (bStatus === 'cancelled' ? t('booking.detail.fallbacks.no_reason') : null),
      restaurant: {
        name: restaurantName,
        address: restaurantAddress,
        image: restaurantImage
      },
      guest: {
        fullName: getV(bookingData, 'guestName', 'GuestName') || getV(userData, 'fullName', 'FullName', 'name', 'Name') || profile?.fullName || profile?.name || t('booking.detail.fallbacks.verified_member'),
        email: getV(bookingData, 'guestEmail', 'GuestEmail') || getV(userData, 'email', 'Email') || profile?.email || t('booking.detail.fallbacks.email_in_profile'),
        phone: getV(bookingData, 'guestPhone', 'GuestPhone') || getV(userData, 'phone', 'Phone') || profile?.phone || t('booking.detail.fallbacks.phone_in_profile')
      },
      reservation: {
        date: formatDate(getV(bookingData, 'bookingDate', 'BookingDate', 'date', 'Date')) || getV(bookingData, 'bookingDate', 'date'),
        time: formatTime(getV(bookingData, 'bookingTime', 'BookingTime', 'time', 'Time')) || getV(bookingData, 'bookingTime', 'time'),
        rawDate: getV(bookingData, 'bookingDate', 'BookingDate', 'date', 'Date'),
        rawTime: getV(bookingData, 'bookingTime', 'BookingTime', 'time', 'Time'),
        partySize: getV(bookingData, 'numGuests', 'NumGuests', 'guests', 'Guests', 'partySize') || 1,
        tableNumber: getV(finalTable, 'tableNumber', 'TableNumber'),
        tableType: getV(finalTable, 'type', 'Type') || getV(bookingData, 'tableType', 'TableType') || t('booking.detail.fallbacks.standard_seating'),
        tableId: getV(bookingData, 'tableId', 'TableId') || getV(finalTable, 'id', '_id', 'Id'),
        tableInfo: finalTable || { name: getV(bookingData, 'tableType', 'tableName') }
      },
      notes: getV(bookingData, 'specialRequests', 'notes', 'SpecialRequest') || t('booking.detail.fallbacks.no_special_requests'),
      financial: {
        deposit: (getV(bookingData, 'depositAmount', 'DepositAmount') !== null) ? `${Number(getV(bookingData, 'depositAmount', 'DepositAmount')).toLocaleString('vi-VN')} VNĐ` : `0 VNĐ`,
        total: (getV(bookingData, 'totalPrice', 'TotalPrice') !== null) ? `${Number(getV(bookingData, 'totalPrice', 'TotalPrice')).toLocaleString('vi-VN')} VNĐ` : (getV(bookingData, 'depositAmount', 'DepositAmount') ? `${Number(getV(bookingData, 'depositAmount', 'DepositAmount')).toLocaleString('vi-VN')} VNĐ` : `0 VNĐ`)
      }
    };
  }, [rawBooking, fullRes, profile, enrichedTable, bData, t]); 

  if (isBookingLoading) return <LoadingSpinner fullPage title={t('booking.detail.loading')} />;

  if (isBookingError) return (
    <div className="pt-32 px-8">
      <ErrorState 
        message={bookingError?.message || t('booking.detail.error_retrieve')} 
        onRetry={() => window.location.reload()}
      />
    </div>
  );

  if (!normalizedBooking) return null;

  const isConfirmed = normalizedBooking.status.toLowerCase() === 'confirmed';
  const isPending = normalizedBooking.status.toLowerCase() === 'pending';
  const canModifyOrCancel = isConfirmed || isPending;

  const handleCancelConfirm = (reason) => {
    cancelBookingMutation.mutate(
      { id, cancellationReason: reason || t('booking.notifications.cancel_reason_default') },
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

  const handleModifyClick = () => {
    const finalResId = fullRes?.slug || restaurantId || 'unknown';
    const targetUrl = ROUTES.CREATE_BOOKING(finalResId);
    navigate(targetUrl, { state: { modifyBookingItem: normalizedBooking, originalRestaurantId: restaurantId } });
  };

  return (
    <div className="min-h-screen bg-surface pt-20 pb-40 px-12 relative overflow-hidden -mt-16">
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <main className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <motion.button 
              whileHover={{ x: -10 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-4 text-on-surface-variant/40 hover:text-primary transition-all text-[11px] font-bold uppercase tracking-[0.4em] group"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </div>
              {t('booking.detail.back_to_history')}
            </motion.button>
            
            <div className="flex items-center gap-6">
              <BookingStatusBadge status={normalizedBooking.status} />
              <div className="h-4 w-px bg-outline/10"></div>
              <span className="text-on-surface-variant/30 font-black text-[10px] tracking-[0.3em] uppercase">BOOKING ID: {normalizedBooking.bookingCode}</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-8xl font-bold text-on-surface leading-[0.85] headline tracking-tighter"
            >
              {t('booking.detail.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-2xl text-on-surface-variant/50 font-medium max-w-2xl leading-relaxed italic"
            >
              {t('booking.detail.subtitle')}
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 w-full md:w-auto"
          >
            <motion.button 
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-14 py-7 rounded-full bg-white text-on-surface text-[12px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-2xl transition-all flex items-center justify-center gap-4 border border-outline/5"
            >
              <span className="material-symbols-outlined text-2xl text-primary">chat_bubble</span>
              {t('booking.detail.contact_restaurant')}
            </motion.button>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24"
        >
          <BookingStatusTimeline status={normalizedBooking.status} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 space-y-12"
          >
            <BookingInfoSection booking={normalizedBooking} />
            <BookingFinancialSummary booking={normalizedBooking} />
          </motion.div>

          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4 space-y-12"
          >
            <AnimatePresence mode="wait">
              {isConfirmed ? (
                <BookingQRCode key="qrcode" value={normalizedBooking.bookingCode} />
              ) : normalizedBooking.status === 'completed' ? (
                <motion.div 
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/5 p-12 rounded-[3.5rem] border border-green-500/10 text-center"
                >
                  <span className="material-symbols-outlined text-5xl text-green-500 mb-6">celebration</span>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-700 mb-6">{t('booking.detail.completed_title') || 'EXPERIENCE COMPLETED'}</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium leading-relaxed italic mb-10">
                    {t('booking.detail.completed_desc') || 'We hope you had a wonderful meal! Your opinion matters to us and the community.'}
                  </p>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/restaurants/${fullRes?.slug || restaurantId}/reviews/new?bookingId=${id}`)}
                    className="w-full py-6 bg-green-500 text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-green-500/20"
                  >
                    {t('restaurants.reviews.write_review') || 'Write a Review'}
                  </motion.button>
                </motion.div>
              ) : normalizedBooking.status === 'pending' ? (
                <motion.div 
                  key="pending"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-500/5 p-12 rounded-[3.5rem] border border-amber-500/10 text-center"
                >
                  <span className="material-symbols-outlined text-5xl text-amber-500 mb-6 animate-pulse">pending_actions</span>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-700 mb-6">{t('booking.detail.pending_confirmation_title')}</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium leading-relaxed italic">
                    {t('booking.detail.pending_confirmation_desc')}
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="expired"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-surface p-12 rounded-[3.5rem] border border-outline/5 text-center opacity-40"
                >
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-6">qr_code_2</span>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant mb-6">{t('booking.detail.qr_access_expired_title')}</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium leading-relaxed italic">
                    {t('booking.detail.qr_access_expired_desc')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {canModifyOrCancel && (
              <div className="px-6 space-y-4">
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={handleModifyClick}
                  className="w-full py-5 text-primary text-[11px] font-bold uppercase tracking-[0.25em] bg-primary/5 hover:bg-primary/10 rounded-full transition-all border border-primary/10"
                >
                  {t('booking.detail.modify_button')}
                </motion.button>
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="w-full py-5 text-rose-500 text-[11px] font-bold uppercase tracking-[0.25em] border border-rose-500/10 hover:bg-rose-500/5 rounded-full transition-all"
                >
                  {t('booking.detail.cancel_button')}
                </motion.button>
                <p className="text-[9px] text-on-surface-variant/20 font-bold uppercase text-center mt-8 tracking-[0.4em]">
                  {t('booking.detail.managed_by')}
                </p>
              </div>
            )}
          </motion.aside>
        </div>
      </main>

      <CancelBookingDialog 
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        isCanceling={cancelBookingMutation.isPending}
      />
    </div>
  );
};

export default BookingDetailPage;
