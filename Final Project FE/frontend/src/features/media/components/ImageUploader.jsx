import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ImageUploader = ({ value = [], onChange, maxImages = 1 }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(''); // '', 'compressing', 'uploading'

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (value.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setIsUploading(true);
    setUploadStatus('compressing');
    
    try {
      // 1. Nén ảnh phía client
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          try {
            return await imageCompression(file, compressionOptions);
          } catch (err) {
            console.error('Compression error:', err);
            return file; // Fallback to original if compression fails
          }
        })
      );

      setUploadStatus('uploading');

      // 2. Upload song song lên Cloudinary
      const uploadPromises = compressedFiles.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      const urls = results.map(res => res.secure_url);
      
      if (maxImages === 1) {
        onChange([urls[0]]);
      } else {
        onChange([...value, ...urls]);
      }
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please check your connection.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
    }
  };

  /**
   * Removes an image from the list
   */
  const removeImage = (e, index) => {
    e.preventDefault();
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Render Previews */}
        {value.map((url, index) => (
          <div key={index} className="relative w-full h-64 rounded-[1.5rem] overflow-hidden group shadow-inner bg-zinc-100">
            <img 
              src={url} 
              alt={`Upload ${index}`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
            {/* Delete Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => removeImage(e, index)}
                className="bg-white/90 text-rose-500 p-4 rounded-2xl shadow-xl hover:bg-rose-500 hover:text-white transition-all transform active:scale-90"
              >
                <span className="material-symbols-outlined text-2xl">delete</span>
              </button>
            </div>
          </div>
        ))}
        
        {/* Upload Button/Zone */}
        {value.length < maxImages && (
          <label className={`
            w-full h-64 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            ${isUploading 
              ? 'bg-zinc-50 border-zinc-200 pointer-events-none' 
              : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-200/20'}
          `}>
            {isUploading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {uploadStatus === 'compressing' ? t('common.compressing') : t('common.uploading')}
                  </span>
                  <span className="text-[8px] font-bold text-on-surface-variant/40 uppercase tracking-tighter mt-1 animate-pulse">
                    Please wait
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-zinc-300">add_a_photo</span>
                </div>
                <span className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">{t('auth.partner.uploadHint')}</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple={maxImages > 1}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
