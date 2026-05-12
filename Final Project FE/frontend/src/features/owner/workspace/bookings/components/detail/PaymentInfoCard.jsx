import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Info } from 'lucide-react';
import { format } from 'date-fns';

const PaymentInfoCard = ({ booking }) => {
  const { t } = useTranslation();

  const formatMoney = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-full">
      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-300" />
          {t('workspace_booking_detail.payment.title')}
        </h3>
      </div>
      <div className="p-8 space-y-6">
        {!booking.depositRequired ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <Info className="w-8 h-8 text-slate-200" />
            <p className="text-xs font-bold text-slate-400 max-w-[150px]">
              {t('workspace_booking_detail.payment.no_deposit')}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.payment.deposit_amount')}</label>
              <p className="text-2xl font-black text-slate-800">{formatMoney(booking.depositAmount)}</p>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.payment.paid_status')}</label>
              <div className="flex items-center gap-2 mt-1">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${booking.depositPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                  {booking.depositPaid ? t('workspace_booking_detail.payment.paid') : t('workspace_booking_detail.payment.unpaid')}
                </div>
                {booking.depositRefunded && (
                  <div className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">
                    {t('workspace_booking_detail.payment.refunded')}
                  </div>
                )}
              </div>
            </div>

            {booking.depositPaidAt && (
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.payment.paid_at')}</label>
                <p className="text-sm font-bold text-slate-600">
                  {format(new Date(booking.depositPaidAt), 'HH:mm - dd/MM/yyyy')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PaymentInfoCard;
