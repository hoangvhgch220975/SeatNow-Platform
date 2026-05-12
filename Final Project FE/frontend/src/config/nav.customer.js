import { ROUTES } from './routes.js';

/**
 * Cấu hình danh sách Menu cho Customer (Người dùng đã đăng nhập)
 * Sử dụng nhãn Tiếng Anh cho giao diện chính
 */
export const CUSTOMER_NAV = [
  { label: 'Home', path: ROUTES.HOME, icon: 'home' },
  { label: 'Restaurants', path: ROUTES.RESTAURANT_LIST, icon: 'restaurant' },
  { label: 'My Bookings', path: ROUTES.BOOKING_HISTORY, icon: 'book_online' },
  { 
    label: 'AI Assistant', 
    path: ROUTES.AI_CHAT, 
    icon: 'auto_awesome',
    isSpecial: true // Đánh dấu mục AI để hiển thị nổi bật hơn
  },
];

/**
 * Cấu hình danh mục thả xuống (Dropdown) cho Profile
 */
export const CUSTOMER_PROFILE_MENU = [
  { label: 'Profile Settings', path: ROUTES.PROFILE, icon: 'person' },
  { label: 'Booking History', path: ROUTES.BOOKING_HISTORY, icon: 'history' },
];
