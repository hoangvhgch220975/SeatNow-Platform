import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component BookingStatusTimeline
 * @description Hiển thị thanh tiến trình trạng thái đặt bàn (Booked -> Confirmed -> Checked-in). Hỗ trợ đa ngôn ngữ.
 * @param {string} status - Trạng thái hiện tại của booking
 */
const BookingStatusTimeline = ({ status = 'confirmed' }) => {
  const { t } = useTranslation();
  // Trạng thái chuẩn hóa để so sánh (Vietnamese comment)
  const s = status.toLowerCase();
  
  // Xác định các mốc đã hoàn thành (Vietnamese comment)
  const isBooked = true; // Luôn luôn đã được đặt
  const isConfirmed = ['confirmed', 'arrived', 'completed'].includes(s);
  const isArrived = ['arrived', 'completed'].includes(s);

  return (
    <div className="mb-16 bg-white p-12 rounded-[3.5rem] border border-outline/5 flex items-center justify-between max-w-4xl mx-auto relative overflow-hidden shadow-sm">
      {/* Background Line */}
      <div className="absolute top-1/2 left-10 right-10 h-[2px] bg-outline/5 -translate-y-1/2 z-0"></div>
      
      {/* Progress Line */}
      <div 
        className="absolute top-1/2 left-10 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-[1.5s] ease-out-expo shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
        style={{ width: isArrived ? 'calc(100% - 80px)' : isConfirmed ? '50%' : '0%' }}
      ></div>

    {/* Stage 1: Booked */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isBooked ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-surface text-on-surface-variant/40 border border-outline/10'}`}>
          <span className="material-symbols-outlined text-[18px] font-black">check</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isBooked ? 'text-primary' : 'text-on-surface-variant/40'}`}>
          {t('booking.detail.timeline.booked')}
        </span>
      </div>

      {/* Stage 2: Confirmed */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isConfirmed ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-surface text-on-surface-variant/40 border border-outline/10'} ${s === 'confirmed' ? 'ring-8 ring-primary/10 animate-pulse' : ''}`}>
          <span className="material-symbols-outlined text-[18px] font-black">
            {isConfirmed ? 'check' : 'pending'}
          </span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isConfirmed ? 'text-primary' : 'text-on-surface-variant/40'}`}>
          {t('booking.detail.timeline.confirmed')}
        </span>
      </div>

      {/* Stage 3: Checked-in */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 ${isArrived ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-surface text-on-surface-variant/40 border border-outline/10'} ${s === 'arrived' ? 'ring-8 ring-primary/10 animate-pulse' : ''}`}>
          <span className="material-symbols-outlined text-[18px] font-black">
            {isArrived ? 'check' : 'schedule'}
          </span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isArrived ? 'text-primary' : 'text-on-surface-variant/40'}`}>
          {t('booking.detail.timeline.checked_in')}
        </span>
      </div>
    </div>
  );
};

export default BookingStatusTimeline;
