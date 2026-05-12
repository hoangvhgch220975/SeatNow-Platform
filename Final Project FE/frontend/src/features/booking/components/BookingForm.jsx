import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Helper hỗ trợ Validation
 */
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
export const isValidPhone = (phone) => /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone || '');

/**
 * @component BookingForm
 * @description Biểu mẫu thông tin khách hàng cho người dùng chưa đăng nhập.
 * @param {Object} props
 * @param {Object} props.guestInfo - Thông tin khách (tên, email, phone).
 * @param {Function} props.onGuestInfoChange - Callback khi thay đổi input.
 */
const BookingForm = ({ guestInfo, onGuestInfoChange }) => {
  const { t } = useTranslation();

  return (
    <div className="pt-4 mt-2 border-t border-outline/5 space-y-4">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-sm">person_edit</span>
        </div>
        <span className="text-primary font-black text-[11px] uppercase tracking-[0.2em]">{t('booking.form.guest_details')}</span>
      </div>
      
      <div className="space-y-3">
        {/* Full Name */}
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors text-lg">person</span>
          <input 
            type="text" 
            placeholder={t('booking.form.name_placeholder')}
            value={guestInfo?.guestName || ''}
            onChange={(e) => onGuestInfoChange('guestName', e.target.value)}
            className={`w-full bg-white border ${guestInfo?.guestName && guestInfo.guestName.length < 2 ? 'border-rose-400 focus:border-rose-500 bg-rose-50/50' : 'border-outline/10 hover:border-primary/30 focus:border-primary'} rounded-[1.5rem] pl-14 pr-5 py-3 text-[13px] font-bold text-on-surface focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-on-surface-variant/40 placeholder:font-medium`}
          />
          {guestInfo?.guestName && guestInfo.guestName.length < 2 && (
            <p className="absolute -bottom-5 left-5 text-[10px] text-rose-500 font-bold uppercase tracking-widest">{t('booking.form.name_error')}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="relative group mt-5">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors text-lg">mail</span>
          <input 
            type="email" 
            placeholder={t('booking.form.email_placeholder')}
            value={guestInfo?.guestEmail || ''}
            onChange={(e) => onGuestInfoChange('guestEmail', e.target.value)}
            className={`w-full bg-white border ${guestInfo?.guestEmail && !isValidEmail(guestInfo.guestEmail) ? 'border-rose-400 focus:border-rose-500 bg-rose-50/50' : 'border-outline/10 hover:border-primary/30 focus:border-primary'} rounded-[1.5rem] pl-14 pr-5 py-3 text-[13px] font-bold text-on-surface focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-on-surface-variant/40 placeholder:font-medium`}
          />
          {guestInfo?.guestEmail && !isValidEmail(guestInfo.guestEmail) && (
            <p className="absolute -bottom-5 left-5 text-[10px] text-rose-500 font-bold uppercase tracking-widest">{t('booking.form.email_error')}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="relative group mt-5">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/30 group-focus-within:text-primary transition-colors text-lg">call</span>
          <input 
            type="tel" 
            placeholder={t('booking.form.phone_placeholder')}
            value={guestInfo?.guestPhone || ''}
            onChange={(e) => onGuestInfoChange('guestPhone', e.target.value)}
            className={`w-full bg-white border ${guestInfo?.guestPhone && !isValidPhone(guestInfo.guestPhone) ? 'border-rose-400 focus:border-rose-500 bg-rose-50/50' : 'border-outline/10 hover:border-primary/30 focus:border-primary'} rounded-[1.5rem] pl-14 pr-5 py-3 text-[13px] font-bold text-on-surface focus:ring-4 focus:ring-primary/5 outline-none transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-on-surface-variant/40 placeholder:font-medium`}
          />
          {guestInfo?.guestPhone && !isValidPhone(guestInfo.guestPhone) && (
            <p className="absolute -bottom-5 left-5 text-[10px] text-rose-500 font-bold uppercase tracking-widest">{t('booking.form.phone_error')}</p>
          )}
        </div>
      </div>
      <div className="h-1"></div>
    </div>
  );
};

export default BookingForm;
