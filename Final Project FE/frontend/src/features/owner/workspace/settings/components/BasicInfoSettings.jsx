import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';

const ALL_CUISINES = [
  'Vietnamese Cuisine', 'European Cuisine', 'Japanese Cuisine',
  'Chinese Cuisine', 'Korean Cuisine', 'Italian Cuisine',
  'French Cuisine', 'Spanish Cuisine', 'Mexican Cuisine',
  'Indian Cuisine', 'Thai Cuisine', 'Hotpot', 'Grill',
  'Seafood', 'Street Food', 'Fast Food', 'Cafe',
  'Bar & Pub', 'Fine Dining', 'Buffet', 'Vegetarian'
];

const BasicInfoSettings = ({ register, control, errors }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.settings.sections.basic_info')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.profile.common.section')} 01
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.settings.form.name')}
          </label>
          <input
            {...register('name', { required: true })}
            className={`w-full px-6 py-4 bg-slate-50 focus:bg-white border-2 rounded-2xl text-slate-900 font-bold outline-none transition-all ${
              errors?.name ? 'border-rose-400 focus:border-rose-500' : 'border-transparent focus:border-indigo-600'
            }`}
            placeholder="Restaurant Name"
          />
        </div>

        {/* Categories / Cuisine */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.settings.form.cuisine')}
          </label>
          <Controller
            name="cuisineTypes"
            control={control}
            render={({ field: { onChange, value } }) => {
              const currentCuisines = value || [];
              const toggleCuisine = (c) => {
                if (currentCuisines.includes(c)) {
                  onChange(currentCuisines.filter(item => item !== c));
                } else {
                  onChange([...currentCuisines, c]);
                }
              };

              return (
                <div className="flex flex-wrap gap-2 px-2">
                      {ALL_CUISINES.map((cat) => {
                        const isSelected = currentCuisines.includes(cat);
                        return (
                          <button
                            type="button"
                            key={cat}
                            onClick={() => toggleCuisine(cat)}
                            className={`px-4 py-2 text-xs font-black rounded-lg uppercase tracking-wider border transition-all ${
                              isSelected 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t(`common.cuisines.${cat}`)}
                          </button>
                        )
                      })}
                </div>
              );
            }}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.settings.form.price_range')}
          </label>
          <Controller
            name="priceRange"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((range) => (
                  <button
                    type="button"
                    key={range}
                    onClick={() => onChange(range)}
                    className={`h-12 flex-1 flex items-center justify-center rounded-2xl font-black transition-all ${
                      range === value
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {'$'.repeat(range)}
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">
            {t('workspace.settings.form.description')}
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-6 py-5 bg-slate-50 focus:bg-white border-2 border-transparent focus:border-indigo-600 rounded-[2rem] text-slate-700 font-medium leading-relaxed outline-none transition-all resize-none"
            placeholder="..."
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSettings;
