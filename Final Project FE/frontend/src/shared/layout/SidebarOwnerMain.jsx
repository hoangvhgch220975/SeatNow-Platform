import { Link, useLocation } from 'react-router';
import { OWNER_MAIN_NAV } from '@/config/nav.owner-main.js';
import { ROUTES } from '@/config/routes.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import logo from '@/assets/logos/logo.png';

/**
 * @file SidebarOwnerMain.jsx
 * @description Thanh bên điều hướng cho trang quản lý tổng thể của Owner.
 */
const SidebarOwnerMain = () => {
  const location = useLocation();
  const { t } = useTranslation(); // Khởi tạo i18n (Vietnamese comment)

  const handleLinkClick = (item) => {
    if (item.isComingSoon) {
      toast.dismiss();
      toast(t('owner_portal.sidebar.coming_soon_toast', { label: t(item.label) }), {
        icon: '🚀',
        style: {
          borderRadius: '1rem',
          background: '#1e293b',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });
    }
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-72 bg-slate-50 sticky top-0 p-6 space-y-8 rounded-r-[3rem] z-20 border-r border-slate-200/50">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-violet-600 shadow-lg shadow-violet-200 p-1 flex items-center justify-center overflow-hidden border border-violet-500/20">
          <img src={logo} alt="SeatNow Logo" className="w-full h-full object-contain" />
        </div>
        <div className="overflow-hidden">
          <Link to={ROUTES.OWNER_HOME} className="text-xl font-black text-slate-900 tracking-tight block truncate">
            SeatNow
          </Link>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
            {t('owner_portal.sidebar.portfolio_manager')}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {OWNER_MAIN_NAV.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.label}
              to={item.isComingSoon ? '#' : item.path}
              onClick={() => handleLinkClick(item)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 group ${
                isActive
                  ? 'bg-white text-violet-700 shadow-sm ring-1 ring-slate-200/50'
                  : 'text-slate-500 hover:text-violet-600 hover:translate-x-1'
              }`}
            >
              <span className={`material-symbols-outlined transition-colors ${
                isActive ? 'text-violet-700' : 'text-slate-400 group-hover:text-violet-500'
              }`}>
                {item.icon}
              </span>
              <span>{t(item.label)}</span>
              {item.isComingSoon && (
                <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-md font-bold ml-auto">
                  {t('owner_portal.sidebar.soon')}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Action: Create New Restaurant (Vietnamese comment) */}
      <div className="mt-auto pt-6 border-t border-slate-200">
        <Link
          to={ROUTES.CREATE_RESTAURANT}
          className="w-full bg-violet-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">add</span>
          <span>{t('owner_portal.sidebar.add_new_venue')}</span>
        </Link>
      </div>
    </aside>
  );
};

export default SidebarOwnerMain;
