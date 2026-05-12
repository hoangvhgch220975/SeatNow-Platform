import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component PaymentResult
 * @description Bước cuối: Hiển thị kết quả thành công hoặc thất bại.
 */
const PaymentResult = ({ status, onRetry, onClose }) => {
  const { t } = useTranslation();
  const isSuccess = status === 'SUCCESS';

  return (
    <div className="py-12 text-center space-y-8 animate-in zoom-in duration-500">
      {isSuccess ? (
        <>
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
            <span className="material-symbols-outlined text-white text-5xl font-black animate-bounce group-hover:scale-110 transition-transform">check_circle</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('payment.deposit_paid', 'Deposit Paid!')}</h3>
            <p className="text-slate-500 text-sm font-semibold px-12 leading-relaxed">
              {t('payment.success_info', 'Your table is now officially secured. Handshaking with restaurant...')}
            </p>
          </div>
          {/* Progress Indication */}
          <div className="w-48 h-1.5 bg-emerald-50 rounded-full mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500 animate-progress origin-left"></div>
          </div>
        </>
      ) : (
        <>
          <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-rose-500/30">
            <span className="material-symbols-outlined text-white text-5xl font-black">report</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('payment.payment_failed', 'Payment Failed')}</h3>
            <p className="text-slate-400 text-xs font-semibold px-12 leading-relaxed">
              {t('payment.failed_info', 'The transaction was not completed or timed out. Your order has been placed but pending deposit.')}
            </p>
          </div>
          <div className="flex flex-col gap-3 px-8">
            <button 
              onClick={onRetry}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl hover:bg-black transition-all"
            >
              {t('payment.retry_payment', 'Retry Payment')}
            </button>
            <button 
              onClick={onClose}
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors py-2"
            >
              {t('payment.back_to_booking', 'Back to Booking Details')}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentResult;
