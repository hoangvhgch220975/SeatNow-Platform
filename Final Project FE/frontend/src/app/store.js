import { useAuthStore } from '../features/auth/store.js';

/**
 * Root Store Re-export (Zustand): 
 * Gom toàn bộ các features slice store rải rác lại thành 1 entry.
 * Để developer dễ import tập trung từ '@app/store'
 */
export const store = {
  useAuth: useAuthStore,
  // Thêm bookingStore, cartStore.. tại Phase sau
};
