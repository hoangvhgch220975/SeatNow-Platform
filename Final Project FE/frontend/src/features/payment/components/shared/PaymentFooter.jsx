import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component PaymentFooter
 * @description Phần chân Modal hiển thị thông tin bảo mật.
 */
const PaymentFooter = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 p-4 text-center border-t border-slate-100 flex items-center justify-center gap-4">
      <div className="flex items-center gap-1.5 grayscale opacity-60">
        <span className="material-symbols-outlined text-slate-400 text-xs font-filled">verified_user</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('payment.pci_compliant', 'PCI Compliant')}</span>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
      <div className="flex items-center gap-1.5 grayscale opacity-60">
        <span className="material-symbols-outlined text-slate-400 text-xs">lock</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{t('payment.ssl_secure', '256-Bit SSL')}</span>
      </div>
    </div>
  );
};

export default PaymentFooter;
