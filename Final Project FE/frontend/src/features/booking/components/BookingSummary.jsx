import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import BookingForm, { isValidEmail, isValidPhone } from './BookingForm';
import CapacityChecker from './CapacityChecker';
import DepositSummary, { calculateDepositAmount } from './DepositSummary';

/**
 * @component BookingSummary
 * @description Hiển thị sidebar tóm tắt đặt bàn, bao gồm giá cả và thông tin khách.
 */
const BookingSummary = ({ 
  restaurant, 
  selectedDate, 
  selectedTimeSlot, 
  partySize, 
  onUpdatePartySize,
  selectedTable,
  onConfirm,
  onCancel,
  isAuthenticated,
  guestInfo,
  onGuestInfoChange,
  isProcessing = false,
  isModifying = false
}) => {
  const { t } = useTranslation();
  // Tính toán số tiền cọc (Dùng cho logic nút bấm)
  const totalDeposit = calculateDepositAmount(restaurant, partySize);

  // Helper: Kiểm tra tính hợp lệ của thông tin khách vãng lai
  // Khi Modify: Cho phép bấm nút dù chưa nhập đầy đủ (Backend sẽ dùng data cũ)
  const isFormValid = isAuthenticated || isModifying || (
    guestInfo?.guestName?.length >= 2 &&
    isValidPhone(guestInfo?.guestPhone) &&
    isValidEmail(guestInfo?.guestEmail)
  );


  return (
    <div className="sticky top-32 bg-surface-container-lowest rounded-[1.5rem] p-7 shadow-2xl border border-outline-variant/10">
      <div className="space-y-6">
        {/* Tiêu đề */}
        <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-xl font-filled">restaurant</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-on-surface tracking-tight">{t('booking.summary.title')}</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">{t('booking.summary.secure_process')}</p>
          </div>
        </div>

        {/* Các dòng thông tin */}
        <div className="space-y-6">
          <div className="flex justify-between items-center group">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-sm">calendar_month</span>
              <span className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('booking.summary.date_time')}</span>
            </div>
            <span className="font-black text-sm text-on-surface">
              {selectedDate} • {selectedTimeSlot || t('booking.summary.not_selected')}
            </span>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-sm">group</span>
                <span className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('booking.summary.party_size')}</span>
            </div>
            <div className="flex items-center gap-4 bg-surface-container-low p-1.5 rounded-full">
              <button 
                onClick={() => onUpdatePartySize(Math.max(1, partySize - 1))}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="font-black text-lg w-4 text-center">{partySize}</span>
              <button 
                onClick={() => onUpdatePartySize(partySize + 1)}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center group">
            <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-sm">table_bar</span>
                <span className="text-on-surface-variant font-bold text-xs uppercase tracking-widest">{t('booking.summary.table_type')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedTable ? 'bg-primary animate-pulse' : 'bg-slate-200'}`}></div>
              <span className="font-black text-xs text-on-surface">
                {selectedTable ? `${t(`booking.table_status.${selectedTable.type?.toLowerCase() || 'standard'}`)} - No. ${selectedTable.tableNumber || selectedTable.number}` : t('booking.summary.no_selection')}
              </span>
            </div>
          </div>

          {/* Kiểm tra sức chứa bàn */}
          {selectedTable && (
            <CapacityChecker partySize={partySize} table={selectedTable} />
          )}

          {/* Tích hợp Form thông tin khách */}
          {!isAuthenticated && (
            <BookingForm guestInfo={guestInfo} onGuestInfoChange={onGuestInfoChange} />
          )}

          {/* Tóm tắt tiền cọc và tài chính */}
          <DepositSummary restaurant={restaurant} partySize={partySize} />
        </div>

        {/* Nút hành động */}
        <div className="space-y-3 pt-2">
          {totalDeposit > 0 && !isModifying ? (
            <button 
              onClick={onConfirm}
              disabled={!selectedTable || !selectedTimeSlot || !isFormValid || partySize > selectedTable.capacity || isProcessing}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm hover:brightness-110 hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 active:scale-95 disabled:grayscale disabled:opacity-70 group flex items-center justify-center gap-2 overflow-hidden relative"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="animate-pulse">{t('booking.summary.processing_payment')}</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">payments</span>
                  {t('booking.summary.proceed_to_deposit')}
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={onConfirm}
              disabled={!selectedTable || !selectedTimeSlot || !isFormValid || partySize > selectedTable.capacity || isProcessing}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm hover:brightness-110 hover:shadow-xl hover:shadow-primary/20 transition-all scale-100 active:scale-95 disabled:grayscale disabled:opacity-70 group flex items-center justify-center gap-2 overflow-hidden relative"
            >
               {isProcessing ? (
                <>
                   <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                   <span className="animate-pulse">{t('booking.summary.finalizing_reservation')}</span>
                </>
              ) : (
                <>
                  {isModifying ? t('booking.summary.confirm_modification') : t('booking.summary.confirm_reservation')}
                  <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          )}
          
          <button 
            onClick={onCancel}
            className="w-full py-3.5 rounded-xl font-black text-rose-500 hover:bg-rose-50 transition-all text-[10px] uppercase tracking-widest border border-transparent hover:border-rose-100"
          >
            {t('booking.summary.cancel_change_table')}
          </button>
        </div>

        {/* Chú thích bảo mật */}
        <div className="mt-8 pt-4 border-t border-outline-variant/5 flex items-center gap-2 text-[10px] font-bold text-on-surface-variant/40 justify-center uppercase tracking-tighter">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          {t('booking.summary.ssl_encrypted')}
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
