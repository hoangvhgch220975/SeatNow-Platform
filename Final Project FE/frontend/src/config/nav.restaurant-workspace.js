import { ROUTES } from './routes.js';

/**
 * Menu bar dành riêng cho phân hệ Workspace của một nhà hàng cụ thể.
 * Chứa Parameter [restaurantId] để linh động render menu tương ứng cho nhà hàng mình click vô
 */
export const getWorkspaceNav = (restaurantId) => [
  { label: 'Dashboard', path: ROUTES.WORKSPACE_DASHBOARD(restaurantId) },
  { label: 'Profile', path: ROUTES.WORKSPACE_PROFILE(restaurantId) },
  { label: 'Menu', path: ROUTES.WORKSPACE_MENU(restaurantId) },
  { label: 'Tables', path: ROUTES.WORKSPACE_TABLES(restaurantId) },
  { label: 'Bookings', path: ROUTES.WORKSPACE_BOOKINGS(restaurantId) },
  { label: 'Revenue', path: ROUTES.WORKSPACE_REVENUE(restaurantId) },
  { label: 'Wallet', path: ROUTES.WORKSPACE_WALLET(restaurantId) },
  { label: 'Settings', path: ROUTES.WORKSPACE_SETTINGS(restaurantId) },
  { label: 'AI Chat', path: ROUTES.WORKSPACE_AI_CHAT(restaurantId) },
  { label: 'AI Revenue', path: ROUTES.WORKSPACE_AI_REVENUE(restaurantId) },
];
