import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/store.js';
import { useProfileQuery } from '@/features/profile/hooks.js';
import { ROUTES } from '@/config/routes.js';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx';
import AdminNotificationDropdown from '@/shared/components/Notifications/AdminNotificationDropdown.jsx';

/**
 * @file AdminHeader.jsx
 * @description Header bar dành cho Admin Console. Hỗ trợ đa ngôn ngữ và các tính năng quản trị.
 */
const AdminHeader = () => {
  const { t } = useTranslation();
  const { user: authUser, logout } = useAuthStore();
  const { data: profile } = useProfileQuery();
  const user = profile || authUser;
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success(t('auth.signed_out_success'));
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md z-40 border-b border-slate-200">
      {/* Left Section: Title */}
      <div className="flex-1">
        <h2 className="text-xl font-black tracking-tight text-slate-900 truncate">
          {t('admin.panel.restaurant_management')}
        </h2>
      </div>

      {/* Right Section: Actions */}
      <div className="flex-1 flex justify-end items-center gap-8">

        {/* Language Switcher */}
        <LanguageSwitcher variant="minimal" />

        {/* Notifications (Vietnamese: Thông báo dành riêng cho Admin) */}
        <AdminNotificationDropdown />

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-4 pl-6 border-l border-slate-200 cursor-pointer group transition-all rounded-2xl p-1 hover:bg-slate-100/50 ${isProfileOpen ? 'bg-slate-100/50' : ''}`}
          >
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-xs font-black text-slate-900 leading-none mb-1 truncate max-w-[150px]">
                {user?.fullName || user?.name || 'SeatNow Admin'}
              </p>
              <p className="text-[9px] text-violet-600 font-bold uppercase tracking-widest leading-none whitespace-nowrap">
                {t('admin.role_super_admin')}
              </p>

            </div>


            
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden ring-2 ring-violet-50 shadow-sm">
              <img 
                alt="Admin Avatar" 
                className="w-full h-full object-cover scale-110" 
                src={user?.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.email || 'admin'}`}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.email || 'admin'}`;
                }}
              />
            </div>



            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-violet-600' : ''}`}>
              expand_more
            </span>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-56 bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-violet-500/10 border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 mb-1 border-b border-slate-50">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('admin.logged_in_as')}</p>
                <p className="text-xs font-bold text-slate-600 truncate">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <Link
                  to={ROUTES.ADMIN_PROFILE}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-all font-bold text-xs"
                >
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  {t('common.profile')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all font-bold text-xs"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  {t('common.logout')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
