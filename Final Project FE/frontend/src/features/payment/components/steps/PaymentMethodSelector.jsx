import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

/**
 * @component PaymentMethodSelector
 * @description Bước 1: Lựa chọn phương thức thanh toán.
 */
const PaymentMethodSelector = ({ amount, onSelect, isStarting }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
          {t('payment.final_deposit_amount', 'Final Deposit Amount')}
        </span>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
          {formatCurrency(amount)}
        </h3>
      </div>

      <div className="space-y-4">
        {/* Momo Wallet */}
        <button 
          onClick={() => !isStarting && onSelect('MOMO')} 
          disabled={isStarting}
          className="w-full flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] hover:border-[#A50064]/20 hover:bg-[#A50064]/5 transition-all group disabled:opacity-50"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#A50064] rounded-2xl flex items-center justify-center shadow-xl shadow-[#A50064]/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-800">{t('payment.momo_wallet', 'Momo Wallet')}</p>
              <p className="text-[10px] text-[#A50064] font-black uppercase tracking-wider">{t('payment.fast_verified', 'Fast & Verified')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-[#A50064] group-hover:translate-x-1 transition-all">arrow_forward</span>
        </button>

        {/* VNPay Gateway */}
        <button 
          onClick={() => !isStarting && onSelect('VNPAY')} 
          disabled={isStarting}
          className="w-full flex items-center justify-between p-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] hover:border-sky-200 hover:bg-sky-50 transition-all group disabled:opacity-50"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-sky-600 shadow-xl shadow-sky-500/10 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-3xl font-filled">credit_card</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-black text-slate-800">{t('payment.vnpay_gateway', 'VNPay Gateway')}</p>
              <p className="text-[10px] text-sky-500 font-black uppercase tracking-wider">{t('payment.cards_banking', 'Cards & Banking')}</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all">arrow_forward</span>
        </button>
      </div>

      <div className="bg-amber-50/50 rounded-2xl p-4 flex gap-3 border border-amber-100/50">
          <span className="material-symbols-outlined text-amber-500 text-xl font-filled">info</span>
          <p className="text-[10px] text-amber-800 font-bold leading-relaxed italic">
            {t('payment.redirect_info', 'You will be redirected to a secure payment page. Please do not close the browser during the process.')}
          </p>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
