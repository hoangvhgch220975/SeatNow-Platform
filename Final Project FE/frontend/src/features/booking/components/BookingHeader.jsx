import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

/**
 * @component BookingHeader
 * @description Phần tiêu đề của quy trình đặt bàn tại nhà hàng.
 * @param {Object} props
 * @param {Object} props.restaurant - Dữ liệu nhà hàng bao gồm tên và các thông tin khác.
 */
const BookingHeader = ({ restaurant, isModifying = false }) => {
  const { t } = useTranslation();
  if (!restaurant) return null;

  return (
    <header className="bg-white/50 backdrop-blur-xl border-b border-outline-variant/10 py-10 px-8 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 ${isModifying ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'} rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm`}>
          <span className="material-symbols-outlined text-[12px] font-filled">{isModifying ? 'edit_calendar' : 'verified_user'}</span>
          {isModifying ? t('booking.create.modify_reservation') : t('booking.create.premium_service')}
        </div>
        <h1 className="text-5xl font-black text-on-surface tracking-tighter leading-none">
          {isModifying ? (
            <Trans i18nKey="booking.create.dining_slot">
              Update Your <span className="text-blue-600 italic">Dining</span> Slot
            </Trans>
          ) : (
            <Trans i18nKey="booking.create.perfect_table">
              Secure Your <span className="text-primary italic">Perfect</span> Table
            </Trans>
          )}
        </h1>
        <p className="text-on-surface-variant font-medium text-base max-w-2xl leading-relaxed">
          <Trans i18nKey="booking.create.subtitle" values={{ name: restaurant.name }}>
            Choose your preferred spot and experience the botanical excellence of <span className="text-primary font-black underline decoration-primary/20 decoration-2 underline-offset-4">{{name: restaurant.name}}</span>. 
            Every table is handled with the utmost care for your satisfaction.
          </Trans>
        </p>
      </div>
    </header>
  );
};

export default BookingHeader;
