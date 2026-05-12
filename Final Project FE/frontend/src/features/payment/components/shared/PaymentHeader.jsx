import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component PaymentHeader
 * @description Phần đầu của Modal thanh toán với phong cách tím hiện đại.
 */
const PaymentHeader = ({ bookingId, onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-[#7C4DFF] to-[#6200EA] px-6 py-4 text-white relative">
      <button 
        onClick={onClose} 
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-20"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-black tracking-tight mb-2">{t('payment.secure_deposit', 'Secure Deposit')}</h2>
        <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
                {t('payment.order_id', 'ORDER ID')}: {bookingId?.slice(-8).toUpperCase() || 'REF-N/A'}
            </p>
        </div>
      </div>
      
      {/* Decorative pulse element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default PaymentHeader;
