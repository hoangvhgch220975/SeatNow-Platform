import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file RestaurantProfileForm.jsx
 * @description Hiển thị thông tin thương hiệu: Tên, Mô tả, Cuisine và Phân khúc giá (View-only).
 */
const RestaurantProfileForm = ({ restaurant, isLoading }) => {
  const { t } = useTranslation();

  const priceRange = restaurant?.priceRange || 0;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.profile.basic_info')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 01
          </p>
        </div>
      </div>

      <div className="space-y-8 flex-1">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.profile.form.name')}
          </label>
          <div className="px-6 py-4 bg-slate-50 rounded-2xl text-slate-900 font-bold">
            {restaurant?.name || t('workspace.profile.common.no_data')}
          </div>
        </div>

        {/* Categories / Cuisine */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.profile.form.cuisine')}
          </label>
          <div className="flex flex-wrap gap-2 px-2">
            {restaurant?.cuisineTypes?.length > 0 ? (
              restaurant.cuisineTypes.map((cat) => (
                <span key={cat} className="px-4 py-2 bg-violet-50 text-violet-600 text-xs font-black rounded-lg uppercase tracking-wider border border-violet-100">
                  {t(`common.cuisines.${cat}`)}
                </span>
              ))
            ) : (
              <span className="text-slate-400 font-bold text-sm italic px-2">
                {t('workspace.profile.common.no_data')}
              </span>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.profile.form.price_range')}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((range) => (
              <div 
                key={range} 
                className={`h-12 flex-1 flex items-center justify-center rounded-2xl font-black transition-all ${
                  range === priceRange 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                  : 'bg-slate-50 text-slate-300'
                }`}
              >
                {'$'.repeat(range)}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.profile.form.description')}
          </label>
          <div className="px-6 py-5 bg-slate-50 rounded-[2rem] text-slate-700 font-medium leading-relaxed min-h-32">
            {restaurant?.description || t('workspace.profile.form.no_description')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfileForm;
