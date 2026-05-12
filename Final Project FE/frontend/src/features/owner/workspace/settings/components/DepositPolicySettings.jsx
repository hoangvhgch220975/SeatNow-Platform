import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

const DepositPolicySettings = ({ control, register, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.settings.sections.deposit_policy')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 04
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Toggle Enabled */}
        <div className="flex items-center justify-between px-4">
          <label className="text-sm font-black text-slate-700 uppercase tracking-widest">
            {t('workspace.settings.deposit.enabled')}
          </label>
          <Controller
            name="depositEnabled"
            control={control}
            render={({ field: { onChange, value } }) => (
              <button
                type="button"
                onClick={() => onChange(!value)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  value ? 'bg-indigo-500' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                    value ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            )}
          />
        </div>

        {/* Dependent fields if enabled */}
        <Controller
          name="depositEnabled"
          control={control}
          render={({ field: { value: isEnabled } }) => (
            isEnabled && (
              <div className="bg-slate-50 rounded-[1.5rem] p-6 space-y-6 animate-in fade-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 block min-h-[40px]">
                      {t('workspace.settings.deposit.min_guests')}
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register('depositPolicy.minGuest', { valueAsNumber: true, required: isEnabled })}
                      className="w-full px-6 py-4 bg-white focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-2xl text-slate-900 font-bold outline-none transition-all shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 block min-h-[40px]">
                      {t('workspace.settings.deposit.min_amount')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₫</span>
                      <input
                        type="number"
                        min={0}
                        {...register('depositPolicy.minAmount', { valueAsNumber: true, required: isEnabled })}
                        className="w-full pl-12 pr-6 py-4 bg-white focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-2xl text-slate-900 font-bold outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
                    {t('workspace.settings.deposit.note')}
                  </label>
                  <textarea
                    {...register('depositPolicy.note', { required: isEnabled })}
                    rows={3}
                    className="w-full px-6 py-5 bg-white focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-[1.5rem] text-slate-700 font-medium leading-relaxed outline-none transition-all resize-none shadow-sm"
                  />
                </div>
              </div>
            )
          )}
        />
      </div>
    </div>
  );
};

export default DepositPolicySettings;
