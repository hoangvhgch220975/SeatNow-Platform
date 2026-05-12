import { ROUTES } from './routes.js';

export const ADMIN_NAV_MAIN = [
  { label: 'admin.nav.dashboard', path: ROUTES.ADMIN_DASHBOARD, icon: 'dashboard' },
  { label: 'admin.nav.partner_accounts', path: ROUTES.ADMIN_PARTNERS, icon: 'group' },
  { label: 'admin.nav.partner_requests', path: ROUTES.ADMIN_PARTNER_REQUESTS, icon: 'group_add' },
  { label: 'admin.nav.active_venues', path: ROUTES.ADMIN_RESTAURANTS, icon: 'restaurant' },
  { label: 'admin.nav.users', path: ROUTES.ADMIN_USERS, icon: 'group' },
  { label: 'admin.nav.bookings', path: ROUTES.ADMIN_BOOKINGS, icon: 'event_available' },
  { label: 'admin.nav.finances', path: ROUTES.ADMIN_TRANSACTIONS, icon: 'payments' },
  { label: 'admin.nav.withdrawals', path: ROUTES.ADMIN_WITHDRAWALS, icon: 'receipt_long' },
  { label: 'admin.nav.settings', path: ROUTES.ADMIN_SETTINGS, icon: 'settings' },
];

export const ADMIN_NAV_AI = [
  { label: 'admin.nav.ai_chat', path: ROUTES.ADMIN_AI_CHAT, icon: 'auto_awesome' },
  { label: 'admin.nav.ai_analytics', path: ROUTES.ADMIN_AI_ANALYTICS, icon: 'insights' },
];


