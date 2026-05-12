import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

/**
 * @file AvatarUploader.jsx
 * @description Thành phần hiển thị và chọn ảnh đại diện (Avatar). Hỗ trợ đa ngôn ngữ.
 * @param {Object} props
 * @param {string} props.previewUrl - URL hiển thị ảnh (hiện tại hoặc preview)
 * @param {boolean} props.isUploading - Trạng thái đang upload ảnh lên Cloudinary
 * @param {boolean} props.isPending - Trạng thái đang xử lý lưu thông tin hồ sơ
 * @param {File} props.selectedFile - File mới đã chọn nhưng chưa lưu
 * @param {Function} props.onFileChange - Hàm xử lý khi người dùng chọn file mới
 */
const AvatarUploader = ({ 
  previewUrl, 
  isUploading, 
  isPending, 
  selectedFile, 
  onFileChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
      {/* Container hiển thị ảnh đại diện (Vietnamese comment) */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center relative">
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-5xl text-slate-200">person</span>
          )}
          
          {/* Overlay loading khi đang upload (Vietnamese comment) */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
            </div>
          )}
        </div>
        
        {/* Nút bấm chọn ảnh (Camera Icon) (Vietnamese comment) */}
        <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-xl">photo_camera</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={onFileChange} 
            disabled={isPending || isUploading} 
          />
        </label>
      </div>

      {/* Thông tin hướng dẫn upload (Vietnamese comment) */}
      <div className="text-center md:text-left space-y-2">
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
          {t('profile.uploader.title')}
        </h4>
        <div className="text-[11px] text-slate-400 font-bold leading-relaxed max-w-xs italic">
          <Trans i18nKey="profile.uploader.hint">
            Click the camera icon to select a new image. 
            <br />
            Recommended: JPG, PNG under 2MB.
          </Trans>
        </div>
        
        {/* Hiển thị badge nếu đã chọn file mới chưa lưu (Vietnamese comment) */}
        {selectedFile && (
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100 animate-pulse">
            {t('profile.uploader.new_selected')}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;
