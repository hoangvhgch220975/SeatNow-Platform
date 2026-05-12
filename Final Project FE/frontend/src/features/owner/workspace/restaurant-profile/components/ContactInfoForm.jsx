import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file ContactInfoForm.jsx
 * @description Hiển thị thông tin địa chỉ, email và số điện thoại liên hệ (View-only).
 */
const ContactInfoForm = ({ restaurant, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.profile.contact_info')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 02
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Address Field */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.profile.form.address')}
          </label>
          <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent hover:border-sky-100 transition-all group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-sky-600 transition-colors">map</span>
            <span className="text-slate-900 font-bold">{restaurant?.address || t('workspace.profile.common.no_data')}</span>
          </div>
        </div>

        {/* Global Group: Phone & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
              {t('workspace.profile.form.phone')}
            </label>
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent hover:border-sky-100 transition-all group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-sky-600 transition-colors">call</span>
              <span className="text-slate-900 font-bold">{restaurant?.phone || t('workspace.profile.common.no_data')}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
              {t('workspace.profile.form.email')}
            </label>
            <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 rounded-2xl border border-transparent hover:border-sky-100 transition-all group">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-sky-600 transition-colors">mail</span>
              <span className="text-slate-900 font-bold">{restaurant?.email || t('workspace.profile.common.no_data')}</span>
            </div>
          </div>
        </div>

        {/* Global Verification Badge */}
        <div className="mt-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <span className="material-symbols-outlined text-[20px]">verified</span>
          </div>
          <div>
            <p className="text-xs font-black text-emerald-900 uppercase tracking-widest">
              {t('workspace.profile.hero.verified')}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold">
              {t('workspace.profile.hero.verified_note')}
            </p>
          </div>
        </div>

        {/* Dynamic Google Maps Integration (Vietnamese comment) */}
        {restaurant?.latitude && restaurant?.longitude && (
          <div className="mt-6 w-full h-48 rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-inner relative group bg-slate-50">
            <iframe
              src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=16&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Restaurant Location"
              className="grayscale-[0.1] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
            ></iframe>
            <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-slate-100 shadow-sm pointer-events-none">
              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('workspace.profile.common.live_map')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default ContactInfoForm;
