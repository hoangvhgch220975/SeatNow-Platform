/**
 * Export tất cả biến môi trường một cách an toàn và có typing
 */

export const ENV = {
  // Khôi phục về v1 chuẩn của Gateway
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000/api/v1/',
  
  CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_API_KEY: import.meta.env.VITE_CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: import.meta.env.VITE_CLOUDINARY_API_SECRET,
};
