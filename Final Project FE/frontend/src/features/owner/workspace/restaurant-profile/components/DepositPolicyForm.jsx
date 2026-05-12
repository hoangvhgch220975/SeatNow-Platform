import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file DepositPolicyForm.jsx
 * @description Hiển thị chính sách đặt cọc của nhà hàng (View-only).
 */
const DepositPolicyForm = ({ restaurant, isLoading }) => {
  const { t } = useTranslation();
  
  const isEnabled = restaurant?.depositEnabled ?? restaurant?.depositPolicy?.required ?? false;
  const policy = restaurant?.depositPolicy || {};
  
  // New standardized keys (Vietnamese comment)
  const depositAmount = policy.minAmount || 0;
  const minGuest = policy.minGuest || 1;
  const policyNote = policy.note || "Please complete your deposit within 15 minutes to secure your reservation.";

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(244,63,94,0.1)] border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {t('workspace.profile.deposit_policy')}
            </h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
              {t('workspace.profile.common.section')} 04
            </p>
          </div>
        </div>

        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
          isEnabled 
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
          : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}>
          {isEnabled ? t('workspace.profile.common.enabled') : t('workspace.profile.common.disabled')}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {isEnabled ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-rose-100 transition-all group text-center md:text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {t('workspace.profile.deposit.apply_from')}
                </span>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-xl font-black text-slate-900 group-hover:text-rose-600 transition-colors">{minGuest}</span>
                  <span className="text-xs font-bold text-slate-400">{t('workspace.profile.common.guests')}</span>
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-rose-100 transition-all group text-center md:text-left">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {t('workspace.profile.deposit.pricing_model')}
                </span>
                <span className="text-sm font-black text-slate-700 uppercase tracking-tight group-hover:text-rose-600 transition-colors">
                  {policy.type === 'PERSON' ? t('workspace.profile.deposit.per_person') : t('workspace.profile.deposit.fixed_amount')}
                </span>
              </div>
            </div>

            {/* Deposit Amount Card */}
            <div className="p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100 relative overflow-hidden group">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-rose-900/60 uppercase tracking-widest block mb-2">
                  {t('workspace.profile.deposit.deposit_amount')}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-600 tracking-tighter">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositAmount)}
                  </span>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">
                    {t('workspace.profile.common.per_reservation')}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-rose-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700">monetization_on</span>
            </div>

            {/* Policy Note (Vietnamese comment) */}
            <div className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <span className="material-symbols-outlined text-rose-500 text-[18px] mt-0.5">info</span>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('workspace.profile.deposit.important_note')}</p>
                <p className="text-[11px] text-slate-600 font-bold leading-relaxed italic">
                  "{policyNote}"
                </p>
              </div>
            </div>
          </>


        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-[2rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-slate-300 text-[32px]">block</span>
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {t('workspace.profile.deposit.no_deposit')}
            </p>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {t('workspace.profile.deposit.no_deposit_desc')}
            </p>
          </div>
        )}
      </div>


    </div>
  );
};


export default DepositPolicyForm;
