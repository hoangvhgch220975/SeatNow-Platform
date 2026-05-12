import { profileApi } from '@/features/profile/api.js';

/**
 * @file api.js
 * @description API service for Admin Profile management.
 * Proxies to the main profile API for consistency.
 */
export const adminProfileApi = {
  // Get admin profile (Vietnamese: Lấy thông tin cá nhân admin)
  getMe: () => profileApi.getMe(),
  
  // Update admin profile (Vietnamese: Cập nhật thông tin admin)
  updateMe: (data) => profileApi.updateMe(data),
};
