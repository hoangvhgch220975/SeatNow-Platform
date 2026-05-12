import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import OpeningHoursForm from '@/features/owner/portal/components/create-wizard/OpeningHoursForm';

const OpeningHoursSettings = ({ control }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.settings.sections.opening_hours')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 03
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Controller
          name="openingHours"
          control={control}
          render={({ field: { value, onChange } }) => (
            <OpeningHoursForm value={value} onChange={onChange} />
          )}
        />
      </div>
    </div>
  );
};

export default OpeningHoursSettings;
