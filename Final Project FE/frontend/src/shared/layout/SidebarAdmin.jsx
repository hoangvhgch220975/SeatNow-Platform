import { NavLink, Link, useLocation } from 'react-router';
import { ADMIN_NAV_MAIN, ADMIN_NAV_AI } from '@/config/nav.admin.js';
import { ROUTES } from '@/config/routes.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * @file SidebarAdmin.jsx
 * @description Thanh bên điều hướng sắc nét dành cho Quản trị viên (Admin).
 * Phong cách tối giản, sáng sủa, không bo góc lớn.
 */
const SidebarAdmin = () => {
  const { t } = useTranslation();

  const handleComingSoon = (e, label) => {
    e.preventDefault();
    toast.dismiss();
    toast(t('admin.panel.coming_soon_toast', { label: t(label) }), {
      icon: '🚧',
      style: {
        borderRadius: '0.5rem',
        background: '#191c1d',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 'bold',
      },
    });
  };

  const isImplemented = (path) => {
    const implementedRoutes = [
      ROUTES.ADMIN_DASHBOARD,
      ROUTES.ADMIN_RESTAURANTS,
      ROUTES.ADMIN_RESTAURANTS_PENDING,
      ROUTES.ADMIN_PARTNER_REQUESTS,
      ROUTES.ADMIN_PARTNERS,
      ROUTES.ADMIN_USERS,
      ROUTES.ADMIN_BOOKINGS,
      ROUTES.ADMIN_TRANSACTIONS,
      ROUTES.ADMIN_WITHDRAWALS,
      ROUTES.ADMIN_SETTINGS,
      ROUTES.ADMIN_AI_CHAT,
      ROUTES.ADMIN_AI_ANALYTICS
    ];
    return implementedRoutes.includes(path);
  };

  const renderNavItem = (item) => {
    const implemented = isImplemented(item.path);
    
    return (
      <NavLink
        key={item.label}
        to={implemented ? item.path : '#'}
        end
        onClick={!implemented ? (e) => handleComingSoon(e, item.label) : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-bold text-sm tracking-tight ${
            isActive && implemented
              ? 'bg-violet-600 text-white shadow-md shadow-violet-100'
              : 'text-slate-500 hover:bg-slate-50 hover:text-violet-600'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span 
              className={`material-symbols-outlined text-[22px] flex-shrink-0 transition-all ${
                isActive && implemented ? 'scale-110' : 'text-slate-400'
              }`}
              style={isActive && implemented ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="truncate">{t(item.label)}</span>
            
            {!implemented && (
              <span className="ml-auto text-[8px] font-black bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">
                 {t('admin.nav.soon')}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 flex flex-col bg-white border-r border-slate-200 z-50">
      {/* Brand Section */}
      <div className="p-8 pb-4">
        <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-violet-100 transition-transform group-hover:rotate-6">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-none tracking-tighter">SeatNow</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-violet-600 font-black mt-1">
              {t('admin.console')}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Main Menu */}
        <div className="space-y-1">
          <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('admin.navigation')}
          </p>
          {ADMIN_NAV_MAIN.map(renderNavItem)}
        </div>

        {/* AI Co-Pilot Section */}
        <div className="pt-6 border-t border-slate-100 space-y-1">
          <p className="px-4 py-2 text-[10px] font-black text-violet-600 uppercase tracking-[0.2em]">
            SEATNOW INTELLIGENCE
          </p>
          {ADMIN_NAV_AI.map(renderNavItem)}
        </div>

      </nav>

      {/* Footer Identity */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
         <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Operational</span>
         </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
