/**
 * Tập trung tất cả đường dẫn navigate path vào một chỗ.
 * Tránh việc hard-code URL string rải rác.
 */
export const ROUTES = {
  // --- PUBLIC & CUSTOMER ---
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  OWNER_JOIN: '/be-my-member',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  
  PROFILE: '/profile',
  RESTAURANT_LIST: '/restaurants',

  RESTAURANT_DETAIL: (idOrSlug) => `/restaurants/${idOrSlug}`,
  RESTAURANT_GALLERY: (idOrSlug) => `/restaurants/${idOrSlug}/gallery`,
  RESTAURANT_MENU: (idOrSlug) => `/restaurants/${idOrSlug}/menu`,
  TRACK_BOOKING: '/track-booking',
  POLICIES: '/policies',
  CONTACT: '/contact',
  
  CREATE_BOOKING: (id) => `/restaurants/${id}/booking`,
  BOOKING_HISTORY: '/my-bookings',
  BOOKING_DETAIL: (id) => `/my-bookings/${id}`,
  
  // --- OWNER PORTAL ---
  OWNER_HOME: '/owner',
  OWNER_PROFILE: '/owner/profile',
  OWNER_RESTAURANTS: '/owner/restaurants',
  OWNER_ANALYTICS: '/owner/analytics',
  OWNER_POLICIES: '/owner/policies',
  OWNER_AI_CHAT: '/owner/ai-assistant',
  OWNER_AI_REVENUE: '/owner/ai-revenue',
  CREATE_RESTAURANT: '/owner/restaurants/new',
  
  // --- OWNER WORKSPACE (Dynamic param :slug or :id) ---
  WORKSPACE_DASHBOARD: (idOrSlug) => `/owner/restaurants/${idOrSlug}/dashboard`,
  WORKSPACE_PROFILE: (idOrSlug) => `/owner/restaurants/${idOrSlug}/profile`,
  WORKSPACE_MENU: (idOrSlug) => `/owner/restaurants/${idOrSlug}/menu`,
  WORKSPACE_TABLES: (idOrSlug) => `/owner/restaurants/${idOrSlug}/tables`,
  WORKSPACE_BOOKINGS: (idOrSlug) => `/owner/restaurants/${idOrSlug}/bookings`,
  WORKSPACE_BOOKING_DETAIL: (idOrSlug, bookingId) => `/owner/restaurants/${idOrSlug}/bookings/${bookingId}`,
  WORKSPACE_SCAN_QR: (idOrSlug) => `/owner/restaurants/${idOrSlug}/scan-qr`,
  WORKSPACE_REVENUE: (idOrSlug) => `/owner/restaurants/${idOrSlug}/revenue`,
  WORKSPACE_WALLET: (idOrSlug) => `/owner/restaurants/${idOrSlug}/wallet`,
  WORKSPACE_TRANSACTIONS: (idOrSlug) => `/owner/restaurants/${idOrSlug}/wallet/transactions`,
  WORKSPACE_TRANSACTION_DETAIL: (idOrSlug, transactionId) => `/owner/restaurants/${idOrSlug}/wallet/transactions/${transactionId}`,
  WORKSPACE_SETTINGS: (idOrSlug) => `/owner/restaurants/${idOrSlug}/settings`,
  WORKSPACE_AI_CHAT: (idOrSlug) => `/owner/restaurants/${idOrSlug}/ai-chat`,
  WORKSPACE_AI_REVENUE: (idOrSlug) => `/owner/restaurants/${idOrSlug}/ai-revenue`,

  // --- ADMIN ---
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_RESTAURANTS: '/admin/restaurants',
  ADMIN_PARTNER_REQUESTS: '/admin/partner-requests',
  ADMIN_PARTNERS: '/admin/partners',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_TRANSACTIONS: '/admin/transactions',
  ADMIN_WITHDRAWALS: '/admin/withdrawals',
  ADMIN_COMMISSIONS: '/admin/commissions',
  ADMIN_AI_CHAT: '/admin/ai-chat',
  ADMIN_AI_ANALYTICS: '/admin/ai-analytics',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_SETTINGS: '/admin/settings',
  
  // --- AI ASSISTANT ---
  AI_CHAT: '/ai-assistant',


  // --- MAP ROUTING ---
  MAP_EXPLORE: '/map/explore',
  MAP_ROUTE: (id) => `/map/route/${id}`
};
