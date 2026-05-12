import React from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import ImageUploader from '@/features/media/components/ImageUploader';

const ImageSettings = ({ control }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(99,14,212,0.1)] border border-slate-100 flex flex-col space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>imagesmode</span>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
            {t('workspace.settings.form.brand_images')}
          </h3>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
            {t('workspace.settings.sections.images')}
          </p>
        </div>
      </div>

      <div className="flex-1">
        <Controller
          name="images"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ImageUploader 
              value={value || []} 
              onChange={onChange} 
              maxImages={5} 
            />
          )}
        />
        <p className="text-xs text-slate-500 font-semibold mt-4 text-center">
          {t('workspace.settings.form.upload_hint')}
        </p>
      </div>
    </div>
  );
};

export default ImageSettings;
