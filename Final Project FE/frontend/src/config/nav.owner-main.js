import { ROUTES } from './routes.js';

export const OWNER_MAIN_NAV = [
  { 
    label: 'owner_portal.sidebar.nav_portfolio_overview', 
    path: ROUTES.OWNER_HOME, 
    icon: 'dashboard' 
  },
  { 
    label: 'owner_portal.sidebar.nav_all_venues', 
    path: ROUTES.OWNER_RESTAURANTS, 
    icon: 'storefront' 
  },
  { 
    label: 'owner_portal.sidebar.nav_global_analytics', 
    path: ROUTES.OWNER_ANALYTICS, 
    icon: 'analytics',
  },
  { 
    label: 'owner_portal.sidebar.nav_ai_assistant', 
    path: ROUTES.OWNER_AI_CHAT, 
    icon: 'smart_toy' 
  },
  { 
    label: 'owner_portal.sidebar.nav_ai_insights', 
    path: ROUTES.OWNER_AI_REVENUE, 
    icon: 'query_stats' 
  },
];
