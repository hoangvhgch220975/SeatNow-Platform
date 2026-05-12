import React from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../../../shared/ui/LoadingSpinner';

/**
 * @component PaymentProcessing
 * @description Bước 2: Hiển thị trạng thái đang thanh toán, đếm ngược và kiểm tra kết quả.
 */
const PaymentProcessing = ({ 
  paymentData, 
  timeLeft, 
  onCheckStatus, 
  onChangeMethod,
  isChecking 
}) => {
  const { t } = useTranslation();
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="py-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Visual Indicator */}
      <div className="relative inline-block scale-110">
        <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center animate-pulse duration-[3000ms]">
           <span className="material-symbols-outlined text-6xl text-primary font-filled">sync_saved_locally</span>
        </div>
        <div className="absolute inset-0 w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin duration-[1500ms]"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t('payment.syncing_payment', 'Syncing Payment...')}</h3>
          <p className="text-slate-400 text-xs font-semibold px-12 leading-relaxed">
            {t('payment.syncing_info', "Please complete the transaction in the secure window we opened. We'll verify once finished.")}
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('payment.time_remaining', 'Time Remaining')}</span>
            <div className={`text-4xl font-black tabular-nums ${timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-slate-900'}`}>
                {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 px-6">
          <a 
            href={paymentData?.paymentUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group"
          >
            <span>{t('payment.open_checkout_portal', 'Open Checkout Portal')}</span>
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
          </a>

          <button 
            onClick={onCheckStatus}
            disabled={isChecking}
            className="w-full py-4 bg-emerald-50 border-2 border-emerald-100 text-emerald-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-emerald-100 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isChecking ? (
              <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="material-symbols-outlined text-base">sync</span>
            )}
            {t('payment.check_status_manually', 'Check Status Manually')}
          </button>

          <button 
            onClick={onChangeMethod}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors py-2 flex items-center justify-center gap-1.5 group mx-auto"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            {t('payment.change_selection', 'Change Selection')}
          </button>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="bg-slate-50 mx-6 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">
            {t('payment.popup_hint', 'Don\'t see the popup? Ensure your ad-blocker is disabled or use the "Open Checkout Portal" button above.')}
          </p>
      </div>
    </div>
  );
};

export default PaymentProcessing;
