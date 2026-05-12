import { ROUTES } from '@/config/routes.js';

/**
 * Cấu hình danh sách Menu cho Khách (Public Navigation)
 * Sử dụng nhãn Tiếng Anh cho giao diện chính
 */
export const PUBLIC_NAV = [
  { label: 'Home', path: ROUTES.HOME, icon: 'home' },
  { label: 'Restaurants', path: ROUTES.RESTAURANT_LIST, icon: 'restaurant' },
  { label: 'Track Booking', path: ROUTES.TRACK_BOOKING, icon: 'receipt_long' },
  { label: 'Policies', path: ROUTES.POLICIES, icon: 'policy' },
  { label: 'Contact', path: ROUTES.CONTACT, icon: 'contact_page' },
];
