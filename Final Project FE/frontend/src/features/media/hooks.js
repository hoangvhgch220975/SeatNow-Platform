import { useState } from 'react';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * @hook useImageUpload
 * @description Quản lý trạng thái tải ảnh lên Cloudinary.
 */
export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file) => {
    setIsUploading(true);
    try {
      const data = await uploadToCloudinary(file);
      return data.secure_url;
    } catch (err) {
      console.error('Image upload hook error:', err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
};
