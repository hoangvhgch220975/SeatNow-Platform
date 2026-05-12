import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

// components
import MapLocationPicker from '@/shared/components/MapLocationPicker';

const ContactSettings = ({ register, errors, setValue, watch }) => {
  const { t } = useTranslation();
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Watch tọa độ hiện tại để truyền vào map picker nếu đã có
  const currentLat = watch('latitude');
  const currentLng = watch('longitude');

  const handleMapConfirm = (pos, addr) => {
    // Cập nhật các trường latitude, longitude và address
    setValue('latitude', pos.lat);
    setValue('longitude', pos.lng);
    if (addr) setValue('address', addr);
    
    setIsMapOpen(false);
    toast.success(t('owner_portal.create_restaurant.form.location_selected'));
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.settings.sections.contact_info')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 02
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Contact Info Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
              {t('workspace.settings.form.phone')}
            </label>
            <input
              {...register('phone', { required: true })}
              className={`w-full px-6 py-4 bg-slate-50 focus:bg-white border-2 rounded-2xl text-slate-900 font-bold outline-none transition-all ${
                errors?.phone ? 'border-rose-400 focus:border-rose-500' : 'border-transparent focus:border-indigo-600'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
              {t('workspace.settings.form.email')}
            </label>
            <input
              type="email"
              {...register('email', { required: true })}
              className={`w-full px-6 py-4 bg-slate-50 focus:bg-white border-2 rounded-2xl text-slate-900 font-bold outline-none transition-all ${
                errors?.email ? 'border-rose-400 focus:border-rose-500' : 'border-transparent focus:border-indigo-600'
              }`}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.settings.form.address')}
          </label>
          <div className="relative group">
            <input
              {...register('address', { required: true })}
              className={`w-full px-6 py-4 bg-slate-50 focus:bg-white border-2 rounded-2xl text-slate-900 font-bold outline-none transition-all pr-14 ${
                errors?.address ? 'border-rose-400 focus:border-rose-500' : 'border-transparent focus:border-indigo-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setIsMapOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all shadow-sm active:scale-95 group-hover:bg-indigo-100"
              title={t('owner_portal.create_restaurant.map.title')}
            >
              <span className="material-symbols-outlined leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
            </button>
          </div>
        </div>

        {/* Map Visualization */}
        {currentLat && currentLng && (
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex items-center justify-between px-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {t('workspace.profile.common.live_map')}
              </label>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">
                   {t('workspace.settings.form.location_pinned')}
                 </span>
              </div>
            </div>
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
              <iframe
                title="Restaurant Location"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${currentLat},${currentLng}&z=16&output=embed`}
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Map Selection Modal */}
      <MapLocationPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialLocation={{
          lat: parseFloat(currentLat) || 21.0285,
          lng: parseFloat(currentLng) || 105.8542
        }}
      />
    </div>
  );
};

export default ContactSettings;
