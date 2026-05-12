import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { ROUTES } from '@/config/routes.js';
import { PUBLIC_NAV } from '@/config/nav.public.js';
import logo from '@/assets/logos/logo.png';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher.jsx';

/**
 * @file Navbar.jsx
 * @description Thanh điều hướng dành riêng cho khách vãng lai (Public/Guest)
 * Thiết kế cao cấp với hiệu ứng Glassmorphism. Hỗ trợ đa ngôn ngữ.
 */
const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to check if a route is active (Vietnamese comment)
  const isActive = (path) => location.pathname === path;

  // Ánh xạ label sang key dịch thuật (Vietnamese comment)
  const getNavLabel = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, '_');
    return t(`nav.${key}`, { defaultValue: label });
  };

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-outline/5 shadow-premium">
      <div className="flex justify-between items-center w-full px-12 py-5">
        
        {/* Logo - Far Left */}
        <div className="flex-shrink-0">
          <Link to={ROUTES.HOME} className="flex items-center gap-4 group cursor-pointer">
            <div className="bg-primary p-2.5 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 ease-out-expo shadow-xl shadow-primary/20">
               <img src={logo} alt="SeatNow" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-on-surface headline group-hover:text-primary transition-colors duration-500 ease-out-expo">
              SeatNow
            </span>
          </Link>
        </div>

        {/* Desktop Menu - Centered */}
        <nav className="hidden md:flex items-center gap-12 text-[12px] font-bold uppercase tracking-[0.15em]">
          {PUBLIC_NAV.map((item) => (
            <Link 
              key={item.label}
              className={`relative transition-all duration-500 ease-out-expo group/nav ${isActive(item.path) 
                ? "text-primary" 
                : "text-on-surface-variant/40 hover:text-primary"}`}
              to={item.path}
            >
              {getNavLabel(item.label)}
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-500 ease-out-expo ${isActive(item.path) ? 'w-full' : 'w-0 group-hover/nav:w-full'}`} />
            </Link>
          ))}
        </nav>

        {/* Action Buttons - Far Right */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link to={ROUTES.OWNER_JOIN} className="hidden lg:flex items-center gap-2 px-2 py-2 text-[12px] font-bold text-on-surface-variant/40 hover:text-primary transition-all duration-500 ease-out-expo uppercase tracking-[0.1em]">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            {t('nav.join_us')}
          </Link>
          <Link to={ROUTES.LOGIN} className="hidden lg:flex px-2 py-2 text-[12px] font-bold text-primary hover:text-primary/80 transition-all duration-500 ease-out-expo uppercase tracking-[0.1em]">
            {t('common.login')}
          </Link>
          <Link to={ROUTES.REGISTER} className="bg-primary text-white px-10 py-4 rounded-full text-[12px] font-bold shadow-xl shadow-primary/30 hover:brightness-110 hover:-translate-y-0.5 transition-all duration-500 ease-out-expo uppercase tracking-[0.15em]">
            {t('common.signup')}
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-3 rounded-2xl bg-primary/5 text-primary transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Menu Di động (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-outline/5 p-8 space-y-6 animate-in slide-in-from-top duration-500 ease-out-expo shadow-2xl">
          {PUBLIC_NAV.map((item) => (
            <Link 
              key={item.label}
              className="block text-on-surface-variant font-bold px-4 py-4 rounded-2xl hover:bg-primary/5 uppercase text-xs tracking-[0.2em]" 
              to={item.path} 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {getNavLabel(item.label)}
            </Link>
          ))}
          <div className="pt-8 border-t border-outline/10 flex flex-col gap-6">
             <Link className="flex items-center justify-center gap-3 py-4 text-on-surface-variant font-bold uppercase text-xs tracking-[0.2em]" to={ROUTES.OWNER_JOIN} onClick={() => setIsMobileMenuOpen(false)}>
               <span className="material-symbols-outlined text-[24px]">storefront</span>
               {t('nav.join_us')}
             </Link>
             <div className="grid grid-cols-2 gap-4">
               <Link className="text-center py-4 text-primary font-bold border border-primary/20 rounded-full uppercase text-[10px] tracking-widest" to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>{t('common.login')}</Link>
               <Link className="text-center py-4 bg-primary text-white rounded-full font-bold shadow-xl shadow-primary/20 uppercase text-[10px] tracking-widest" to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>{t('common.signup')}</Link>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
