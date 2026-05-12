import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/store.js';
import { useProfileQuery } from '@/features/profile/hooks.js';
import { ROUTES } from '@/config/routes.js';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx';
import NotificationDropdown from '@/shared/components/Notifications/NotificationDropdown.jsx';

/**
 * @file OwnerTopbar.jsx
 * @description Thanh tiêu đề trên cùng dành cho Owner Portal. Hỗ trợ đa ngôn ngữ.
 */
const OwnerTopbar = () => {
  const { t } = useTranslation();
  const { user: authUser, logout } = useAuthStore();
  const { data: profile } = useProfileQuery();
  const user = profile || authUser;
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý đóng dropdown khi click ra ngoài (Vietnamese comment)
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
    toast.success(t('auth.signed_out_success', { defaultValue: 'Signed out successfully' }));
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] px-8 py-4 flex justify-between items-center w-full">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden md:block">
          {t('common.dashboard')}
        </h1>
      </div>

      <div className="flex items-center space-x-6">


        {/* Help Button (Vietnamese comment) */}
        <Link 
          to={ROUTES.OWNER_POLICIES}
          className="hidden sm:block text-[10px] font-black text-violet-600 hover:bg-violet-50 px-5 py-2.5 rounded-xl transition-all uppercase tracking-[0.2em] border border-transparent hover:border-violet-100 flex items-center justify-center"
        >
          {t('nav.help_center', { defaultValue: 'Help Center' })}
        </Link>

        {/* Notifications (Vietnamese comment) */}
        <NotificationDropdown />

        {/* User Profile Area with Dropdown (Vietnamese comment) */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center space-x-3 pl-4 border-l border-slate-200 cursor-pointer group transition-all p-1.5 rounded-2xl hover:bg-slate-50 ${isProfileOpen ? 'bg-slate-50' : ''}`}
          >
            <div className="flex flex-col items-end mr-1 hidden sm:flex">
              <span className="text-sm font-black text-slate-900 leading-none mb-1 group-hover:text-violet-600 transition-colors">
                {user?.fullName || user?.name || t('profile.owner.hero.partner_executive', { defaultValue: 'Business Owner' })}
              </span>
              <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest">
                {t('profile.owner.hero.verified_partner', { defaultValue: 'Verified Partner' })}
              </span>
            </div>
            
            <div className="h-11 w-11 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden ring-2 ring-violet-50 group-hover:ring-violet-200 transition-all shadow-sm">
              <img 
                src={user?.avatar || user?.avatarUrl || user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email || 'partner'}`} 
                alt="Owner profile" 
                className="h-full w-full object-cover" 
              />
            </div>
            
            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-violet-600' : ''}`}>
              expand_more
            </span>
          </div>

          {/* Luxury Dropdown Menu (Vietnamese comment) */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="px-5 py-4 mb-2 border-b border-slate-50">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                    {t('auth.authenticated_account', { defaultValue: 'Authenticated Account' })}
                  </p>
                  <p className="text-xs font-bold text-slate-600 truncate">{user?.email}</p>
               </div>

               <div className="space-y-1">
                  <div className="pt-1 border-b border-slate-50 mb-2 pb-2">
                     <LanguageSwitcher variant="dropdown" />
                  </div>
                  <Link
                    to={ROUTES.OWNER_PROFILE}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-violet-100 shadow-sm">
                       <span className="material-symbols-outlined text-slate-400 group-hover:text-violet-600">person</span>
                    </div>
                    <span className="text-sm font-black tracking-tight">{t('common.profile')}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-rose-100 shadow-sm">
                       <span className="material-symbols-outlined">logout</span>
                    </div>
                    <span className="text-sm font-black tracking-tight">{t('common.logout')}</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default OwnerTopbar;
