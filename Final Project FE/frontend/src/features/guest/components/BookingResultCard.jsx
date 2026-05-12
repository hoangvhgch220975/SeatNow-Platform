import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { getRestaurantById, getRestaurantTables } from '../../restaurants/api';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../config/routes.js';
import { toast } from 'react-hot-toast';
import { formatTime } from '../../../shared/utils/formatDateTime.js';
import { useCancelBookingByGuest } from '../../booking/hooks.js';
import CancelBookingDialog from '../../booking/components/CancelBookingDialog.jsx';

/**
 * @file BookingResultCard.jsx
 * @description Hiển thị kết quả tra cứu đặt bàn với giao diện Bento-style cao cấp.
 */
const BookingResultCard = ({ bookingData, onReset }) => {
  const { t, i18n } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [localRestaurantName, setLocalRestaurantName] = useState('Restaurant');
  const [enrichedTable, setEnrichedTable] = useState(null);

  if (!bookingData) return null;

  const b = bookingData?.data || bookingData;
  const actualData = b.booking || b.data?.booking || b;
  const restaurantFromData = b.restaurant || b.data?.restaurant || {};

  const getV = (obj, ...keys) => {
    if (!obj) return null;
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return null;
  };

  const bookingId = getV(actualData, 'id', 'Id', '_id') || 'N/A';
  const displayBookingCode = getV(actualData, 'bookingCode', 'BookingCode', 'id') || 'N/A';
  const status = (getV(actualData, 'status', 'Status') || 'PENDING').toUpperCase();
  const numGuests = getV(actualData, 'numGuests', 'NumGuests', 'partySize', 'guests') || 1;
  const specialRequests = getV(actualData, 'specialRequests', 'SpecialRequests', 'notes') || "";
  
  const tableObj = actualData.table || actualData.Table || {};
  const restaurantId = getV(actualData, 'restaurantId', 'RestaurantId') || restaurantFromData?.id;
  const tableIdFromBooking = getV(actualData, 'tableId', 'TableId');
  const tableKeysLength = Object.keys(tableObj).length;

  useEffect(() => {
    const shouldEnrich = tableIdFromBooking && tableKeysLength <= 0;
    if (shouldEnrich && restaurantId) {
      const enrichTableData = async () => {
        try {
          const tablesResponse = await getRestaurantTables(restaurantId);
          const tablesList = tablesResponse?.data || tablesResponse || [];
          const matched = tablesList.find(t => getV(t, 'id', 'Id', '_id') === tableIdFromBooking);
          if (matched) setEnrichedTable(matched);
        } catch (err) {
          console.error('Error enriching table data:', err);
        }
      };
      enrichTableData();
    }
  }, [tableIdFromBooking, restaurantId, tableKeysLength]);

  const finalTableInfo = Object.keys(tableObj).length > 0 ? tableObj : enrichedTable;
  const tableNumber = getV(finalTableInfo, 'tableNumber', 'TableNumber');
  const tableType = getV(finalTableInfo, 'type', 'Type') || getV(actualData, 'tableType', 'TableType');
  
  const depositAmount = getV(actualData, 'depositAmount', 'DepositAmount') || 0;
  const isDepositPaid = getV(actualData, 'depositPaid', 'DepositPaid') === true || getV(actualData, 'depositPaid', 'DepositPaid') === 1;
  const isDepositRequired = getV(actualData, 'depositRequired', 'DepositRequired') === true || depositAmount > 0;

  const initialName = getV(restaurantFromData, 'name', 'restaurantName', 'Name') || getV(actualData, 'restaurantName', 'name');

  useEffect(() => {
    if (initialName) {
      setLocalRestaurantName(initialName);
    } else if (actualData?.restaurantId) {
      const fetchName = async () => {
        try {
          const res = await getRestaurantById(actualData.restaurantId);
          const r = res?.data || res;
          const fetchedName = getV(r, 'name', 'restaurantName', 'Name');
          if (fetchedName) setLocalRestaurantName(fetchedName);
        } catch (err) {}
      };
      fetchName();
    }
  }, [initialName, actualData?.restaurantId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const currentLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-GB';
      return new Intl.DateTimeFormat(currentLocale, {
        weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'
      }).format(d);
    } catch { return dateStr; }
  };

  const bookingDate = formatDate(getV(actualData, 'bookingDate', 'date', 'BookingDate'));
  const bookingTime = formatTime(getV(actualData, 'bookingTime', 'time', 'BookingTime') || 'N/A');

  const qrString = actualData.qrCode || actualData.bookingCode || bookingId;
  const qrImageSrc = `https://quickchart.io/qr?text=${encodeURIComponent(qrString)}&size=300&margin=2`;

  const isCancelled = status === 'CANCELLED';
  const isConfirmed = status === 'CONFIRMED';
  const cancellationReason = getV(actualData, 'cancellationReason', 'CancellationReason', 'reason');

  const navigate = useNavigate();
  const cancelBookingMutation = useCancelBookingByGuest();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleCancelConfirm = (reason) => {
    const phoneToVerify = getV(actualData, 'guestPhone', 'phone', 'GuestPhone');
    cancelBookingMutation.mutate(
      { id: bookingId, guestPhone: phoneToVerify, cancellationReason: reason || 'Guest requested cancellation.' },
      {
        onSuccess: () => {
          toast.success(t('booking.actions.cancel.success'));
          setIsCancelDialogOpen(false);
          if (onReset) onReset(); 
        },
        onError: (err) => {
          toast.error(err?.response?.data?.message || t('booking.actions.cancel.error'));
        }
      }
    );
  };

  const handleModify = () => {
    const resId = getV(actualData, 'restaurantId', 'RestaurantId') || restaurantFromData?.id;
    const normalizedBooking = {
      id: bookingId,
      restaurant: { id: resId, name: localRestaurantName },
      guest: {
        fullName: getV(actualData, 'guestName', 'GuestName') || "Guest",
        email: getV(actualData, 'guestEmail', 'GuestEmail') || "",
        phone: getV(actualData, 'guestPhone', 'GuestPhone', 'phone') || ""
      },
      reservation: {
        rawDate: getV(actualData, 'bookingDate', 'date', 'BookingDate'),
        rawTime: getV(actualData, 'bookingTime', 'time', 'BookingTime'),
        partySize: numGuests,
        tableId: getV(tableObj, 'id', 'Id', '_id') || getV(actualData, 'tableId', 'TableId'),
        tableInfo: tableObj
      },
      notes: specialRequests
    };
    const targetUrl = ROUTES.CREATE_BOOKING(resId || 'unknown');
    navigate(targetUrl, { state: { modifyBookingItem: normalizedBooking, originalRestaurantId: resId } });
  };

  return (
    <div className="space-y-12">
      <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Main Info */}
          <div className="lg:col-span-8 p-16 space-y-12 border-r border-outline/5">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={`px-6 py-2 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] ${
                  status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 
                  status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-600' : 
                  'bg-green-500/10 text-green-600'
                }`}>
                  {t(`booking.lookup.status.${status.toLowerCase()}`)}
                </span>
                <span className="text-on-surface-variant/20 font-bold text-[10px] uppercase tracking-[0.2em]">#{displayBookingCode}</span>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={onReset}
                className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant/40 hover:text-rose-500 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </motion.button>
            </header>

            <h2 className="text-5xl font-bold text-on-surface headline tracking-tight">{localRestaurantName}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">calendar_month</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">{t('booking.lookup.result.date_time')}</p>
                  <p className="text-on-surface font-bold text-lg">{bookingDate}</p>
                  <p className="text-on-surface-variant/60 font-medium italic">{bookingTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">group</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">{t('booking.lookup.result.guests')}</p>
                  <p className="text-on-surface font-bold text-lg">{numGuests} {t('booking.lookup.result.guests_suffix')}</p>
                  <p className="text-on-surface-variant/60 font-medium italic">{t('booking.lookup.result.guests_standard')}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-2xl">table_restaurant</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">{t('booking.lookup.result.table_details')}</p>
                  <p className="text-on-surface font-bold text-lg">
                    {tableNumber ? t('booking.lookup.result.table_no', { number: tableNumber }) : t('booking.lookup.result.table_pending')}
                  </p>
                  <p className="text-primary font-bold text-[10px] uppercase tracking-wider">
                    {tableType ? t('booking.lookup.result.table_area', { type: tableType }) : t('booking.lookup.result.table_standard_seating')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${isDepositPaid ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  <span className="material-symbols-outlined text-2xl">{isDepositPaid ? 'verified_user' : 'account_balance_wallet'}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">{t('booking.lookup.result.deposit_status')}</p>
                  <p className={`font-bold text-lg ${isDepositPaid ? 'text-green-600' : 'text-amber-600'}`}>
                    {isDepositPaid ? t('booking.lookup.result.deposit_paid') : t('booking.lookup.result.deposit_unpaid')}
                  </p>
                  <p className="text-on-surface-variant/40 font-bold text-[11px]">{Number(depositAmount).toLocaleString()} VNĐ</p>
                </div>
              </div>
            </div>

            {specialRequests && (
              <div className="p-8 bg-surface rounded-3xl border border-outline/5 italic relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <span className="material-symbols-outlined text-6xl">format_quote</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/20 mb-4">{t('booking.lookup.result.special_requests')}</p>
                <p className="text-on-surface-variant/60 font-medium leading-relaxed">"{specialRequests}"</p>
              </div>
            )}

            {isCancelled && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-rose-500/5 rounded-3xl border border-rose-500/10"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500/40 mb-2">{t('booking.lookup.result.cancellation_reason')}</p>
                <p className="text-rose-500 font-bold italic">
                  {cancellationReason || t('booking.lookup.result.cancelled_notice')}
                </p>
              </motion.div>
            )}

            <footer className="pt-8 border-t border-outline/5 flex items-center justify-between">
              <div className="flex gap-4">
                {status === 'PENDING' && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleModify}
                    className="px-10 py-4 bg-primary text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                  >
                    {t('booking.lookup.result.modify_btn')}
                  </motion.button>
                )}
                {status === 'PENDING' && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsCancelDialogOpen(true)}
                    className="px-10 py-4 text-rose-500 border border-rose-500/10 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500/5"
                  >
                    {t('booking.lookup.result.cancel_btn')}
                  </motion.button>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/20">{t('booking.lookup.result.contact_details')}</p>
                <p className="text-on-surface font-bold">{getV(actualData, 'guestName', 'GuestName')}</p>
                <p className="text-on-surface-variant/40 text-[11px] font-medium">{getV(actualData, 'guestPhone', 'phone')}</p>
              </div>
            </footer>
          </div>

          {/* QR Area */}
          <div className="lg:col-span-4 bg-surface/50 p-16 flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              {isConfirmed ? (
                <motion.div 
                  key="qr"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-10"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto animate-pulse">
                    <span className="material-symbols-outlined text-5xl">qr_code_2</span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-on-surface">{t('booking.lookup.result.qr_ready')}</h3>
                    <p className="text-on-surface-variant/40 text-[11px] font-medium leading-relaxed px-8">
                      {t('booking.lookup.result.qr_desc')}
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowQR(true)}
                    className="w-full py-6 bg-white border border-outline/5 text-on-surface font-bold text-[11px] uppercase tracking-[0.3em] rounded-full shadow-xl"
                  >
                    {t('booking.lookup.result.qr_see_btn')}
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div 
                  key="no-qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8 opacity-40 grayscale"
                >
                  <div className="w-24 h-24 bg-outline/5 rounded-full flex items-center justify-center text-on-surface-variant/20 mx-auto">
                    <span className="material-symbols-outlined text-5xl">lock_open</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                      {status === 'ARRIVED' ? t('booking.lookup.result.qr_checked_in') : t('booking.lookup.result.qr_not_available')}
                    </p>
                    <p className="text-[9px] font-medium italic px-10 leading-relaxed">
                      {status === 'PENDING' ? t('booking.detail.pending_confirmation_desc') : t('booking.detail.qr_access_expired_desc')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQR(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[4rem] shadow-2xl p-16 max-w-lg w-full relative z-10 border border-outline/5"
            >
              <div className="text-center space-y-12">
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-on-surface headline tracking-tight">{t('booking.lookup.result.qr_title')}</h3>
                  <p className="text-on-surface-variant/40 font-medium text-sm italic">{t('booking.lookup.result.qr_desc')}</p>
                </div>
                
                <div className="bg-surface p-12 rounded-[3.5rem] inline-block shadow-inner">
                  <img alt="QR" className="w-64 h-64 mix-blend-multiply" src={qrImageSrc} />
                </div>
                
                <div className="py-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                  <p className="text-primary font-bold text-2xl tracking-[0.4em] uppercase">
                    {displayBookingCode}
                  </p>
                </div>

                <button 
                  onClick={() => setShowQR(false)}
                  className="text-on-surface-variant/40 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-primary transition-colors"
                >
                  {t('common.close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <CancelBookingDialog 
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelConfirm}
        isCanceling={cancelBookingMutation.isPending}
      />
    </div>
  );
};

export default BookingResultCard;
