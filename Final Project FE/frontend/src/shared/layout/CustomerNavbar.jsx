import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store.js';
import { useProfileQuery } from '@/features/profile/hooks.js';
import { CUSTOMER_NAV, CUSTOMER_PROFILE_MENU } from '@/config/nav.customer.js';
import { ROUTES } from '@/config/routes.js';
import logo from '@/assets/logos/logo.png';
import { toast } from 'react-hot-toast';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx';

/**
 * @file CustomerNavbar.jsx
 * @description Thanh điều hướng dành riêng cho khách hàng đã đăng nhập. Hỗ trợ đa ngôn ngữ.
 */
const CustomerNavbar = () => {
  const { t } = useTranslation();
  const { user: authUser, logout } = useAuthStore();
  const { data: profile } = useProfileQuery();
  const user = profile || authUser;
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Avatar fallback logic (Vietnamese comment)
  const avatarUrl = user?.avatar || user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email || 'default'}`;

  // Close dropdown on outside click (Vietnamese comment)
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

  // Helper dịch nhãn Navigation (Vietnamese comment)
  const getNavLabel = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, '_');
    return t(`nav.${key}`, { defaultValue: label });
  };

  // Helper dịch nhãn Profile Menu (Vietnamese comment)
  const getProfileLabel = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, '_');
    return t(`customer.${key}`, { defaultValue: label });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-outline/5 shadow-premium">
      <div className="flex justify-between items-center w-full px-12 py-5">
        
        {/* Brand Logo - Far Left */}
        <div className="flex-shrink-0">
          <Link 
            to={ROUTES.HOME} 
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="bg-primary p-2.5 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 ease-out-expo shadow-xl shadow-primary/20">
               <img src={logo} alt="SeatNow" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-on-surface headline select-none group-hover:text-primary transition-colors duration-500 ease-out-expo">
              SeatNow
            </span>
          </Link>
        </div>

        {/* Center Navigation - Links centered */}
        <div className="hidden md:flex items-center gap-12 text-[12px] font-bold uppercase tracking-[0.15em]">
          {CUSTOMER_NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => 
                `relative transition-all duration-500 ease-out-expo flex items-center gap-2 group/nav ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-on-surface-variant/40 hover:text-primary'
                } ${item.isSpecial ? `px-6 py-3 rounded-full shadow-lg ${isActive ? 'bg-primary text-white shadow-primary/30' : 'bg-primary/5 text-primary hover:bg-primary/10 shadow-primary/5'}` : ''}`
              }
            >
              {!item.isSpecial && (
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-500 ease-out-expo ${location.pathname === item.path ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
              )}
              {item.isSpecial && (
                <span className="material-symbols-outlined text-[18px] animate-pulse">
                  {item.icon}
                </span>
              )}
              {getNavLabel(item.label)}
            </NavLink>
          ))}
        </div>

        {/* Right Actions - Far Right */}
        <div className="flex items-center gap-6 flex-shrink-0">
          
          {/* Thông báo (Coming Soon) */}
          <button 
            onClick={() => toast(t('common.notifications') + ": Coming Soon!", { icon: "🔔" })}
            className="p-3 rounded-2xl bg-surface hover:bg-primary/5 text-on-surface-variant/40 hover:text-primary transition-all duration-500 ease-out-expo relative group border border-outline/5"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="px-2 py-2 rounded-full bg-white border border-outline/10 hover:border-primary/20 transition-all duration-500 ease-out-expo group flex items-center gap-3 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface shadow-sm transition-transform duration-500 ease-out-expo group-hover:scale-110">
                <img alt="avatar" className="w-full h-full object-cover" src={avatarUrl} />
              </div>
              <div className="hidden lg:flex flex-col items-start pr-3">
                <p className="text-[10px] font-bold text-on-surface leading-none mb-1.5 uppercase tracking-[0.1em]">
                  {(user?.name || user?.fullName) || t('customer.member')}
                </p>
                <div className="flex items-center gap-1.5">
                   <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
                   <span className="text-[9px] font-bold text-on-surface-variant/30 tracking-widest uppercase">
                     {user?.loyaltyPoints || 0}
                   </span>
                </div>
              </div>
            </div>

            {/* Dropdown Content */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-5 w-80 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-outline/5 p-5 z-[60] animate-in fade-in slide-in-from-top-4 duration-500 ease-out-expo">
                <div className="px-6 py-6 mb-4 bg-surface rounded-[2rem] border border-outline/5">
                   <p className="text-[10px] text-on-surface-variant/30 font-bold uppercase tracking-[0.2em] mb-2">{t('customer.authenticated_account')}</p>
                   <p className="text-[13px] font-bold text-on-surface truncate tracking-tight">{user?.email}</p>
                </div>

                <div className="space-y-1">
                  {CUSTOMER_PROFILE_MENU.map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-all duration-500 ease-out-expo group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center group-hover:bg-white transition-colors border border-outline/5 group-hover:border-primary/20 shadow-sm relative overflow-hidden">
                        <span className="material-symbols-outlined text-[20px] text-on-surface-variant/40 group-hover:text-primary transition-colors duration-300 relative z-10">{item.icon}</span>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-[13px] font-bold tracking-tight">{getProfileLabel(item.label)}</span>
                    </Link>
                  ))}
                  
                  <div className="pt-2">
                    <LanguageSwitcher variant="dropdown" />
                  </div>
                </div>

                <div className="my-5 px-4">
                   <div className="border-t border-outline/5"></div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-5 px-5 py-4 rounded-2xl hover:bg-red-50 text-on-surface-variant/40 hover:text-red-500 transition-all duration-500 ease-out-expo group"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center group-hover:bg-white transition-colors border border-outline/5 group-hover:border-red-100 shadow-sm">
                    <span className="material-symbols-outlined text-[20px] transition-colors duration-300">logout</span>
                  </div>
                  <span className="text-[13px] font-bold tracking-tight">{t('common.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
