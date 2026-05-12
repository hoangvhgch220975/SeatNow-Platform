import React from 'react';
import { NavLink, Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes';
import toast from 'react-hot-toast';

/**
 * @file SidebarRestaurantWorkspace.jsx
 * @description Thanh điều hướng bên (Sidebar) dành riêng cho không gian làm việc của từng nhà hàng.
 * Tích hợp đa ngôn ngữ và thông báo cho các tính năng chưa hoàn thiện.
 */
const SidebarRestaurantWorkspace = ({ restaurantName }) => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();

  const handleComingSoon = (e, label) => {
    e.preventDefault();
    toast.dismiss();
    toast(t('owner_portal.sidebar.coming_soon_toast', { label: t(`workspace.sidebar.${label}`) }), {
      icon: '🚀',
      style: {
        borderRadius: '1rem',
        background: '#1e293b',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });
  };

  const navItems = [
    {
      label: 'overview',
      icon: 'dashboard',
      path: ROUTES.WORKSPACE_DASHBOARD(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'restaurant_profile',
      icon: 'storefront',
      path: ROUTES.WORKSPACE_PROFILE(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'menu_management',
      icon: 'restaurant_menu',
      path: ROUTES.WORKSPACE_MENU(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'table_management',
      icon: 'table_restaurant',
      path: ROUTES.WORKSPACE_TABLES(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'booking_management',
      icon: 'event_available',
      path: ROUTES.WORKSPACE_BOOKINGS(idOrSlug),
      comingSoon: false,
    },

    {
      label: 'revenue_stats',
      icon: 'analytics',
      path: ROUTES.WORKSPACE_REVENUE(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'wallet',
      icon: 'account_balance_wallet',
      path: ROUTES.WORKSPACE_WALLET(idOrSlug),
      comingSoon: false,
    },
    {
      label: 'settings',
      icon: 'settings',
      path: ROUTES.WORKSPACE_SETTINGS(idOrSlug),
      comingSoon: false,
    },
  ];

  const aiTools = [
    {
      label: 'ask_seatnow',
      icon: 'auto_awesome',
      path: ROUTES.WORKSPACE_AI_CHAT(idOrSlug),
      isAI: true,
    },
    {
      label: 'revenue_insights',
      icon: 'insights',
      path: ROUTES.WORKSPACE_AI_REVENUE(idOrSlug),
    },
  ];

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 overflow-y-auto bg-slate-50 flex flex-col p-6 gap-4 z-50 border-r border-slate-100">
      {/* Brand & Active Restaurant Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-lg bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
        </div>
        <div className="overflow-hidden">
          <h2 className="text-lg font-black text-violet-700 leading-tight truncate">
            {restaurantName || 'Loading...'}
          </h2>
          <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
            {t('common.premium')}
          </p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {/* Back to Portfolio */}
        <Link 
          to={ROUTES.OWNER_RESTAURANTS}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl transition-all duration-200 hover:translate-x-1 font-bold text-sm mb-4"
        >
          <span className="material-symbols-outlined text-violet-600">arrow_back</span>
          {t('workspace.sidebar.back_to_portfolio')}
        </Link>

        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={item.comingSoon ? (e) => handleComingSoon(e, item.label) : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:translate-x-1 text-sm font-bold tracking-tight ${
                  isActive && !item.comingSoon
                    ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/50'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-violet-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined ${item.icon === 'dashboard' ? '' : 'text-[20px]'} ${isActive && !item.comingSoon ? 'text-violet-700' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{t(`workspace.sidebar.${item.label}`)}</span>
                  {item.comingSoon && (
                    <span className="ml-auto text-[8px] font-black bg-slate-200 text-slate-400 px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">
                      {t('common.soon')}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* AI Tools Section — Đã kích hoạt links */}
        <div className="pt-6 mt-6 border-t border-slate-200 space-y-1">
          <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('workspace.sidebar.ai_tools')}
          </p>
          {aiTools.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 hover:translate-x-1 text-sm font-bold ${
                  isActive
                    ? 'bg-violet-50 text-violet-700 shadow-sm ring-1 ring-violet-100'
                    : item.isAI ? 'text-violet-600 hover:bg-violet-50' : 'text-slate-600 hover:bg-violet-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={item.isAI || isActive ? { fontVariationSettings: "'FILL' 1", color: '#7c3aed' } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{t(`workspace.sidebar.${item.label}`)}</span>
                  {item.isAI && (
                    <span className="ml-auto text-[8px] font-black bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full uppercase tracking-tighter shrink-0">AI</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default SidebarRestaurantWorkspace;
