import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * @file ProfileSidebar.jsx
 * @description Sidebar điều hướng phía bên trái của trang Profile cao cấp.
 */
const ProfileSidebar = ({ user, activeTab = 'Overview', onTabChange }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const menuItems = [
    { label: t('profile.sidebar.menu.overview'), icon: 'dashboard', id: 'Overview' },
    { label: t('profile.sidebar.menu.password'), icon: 'lock_open', id: 'Password' },
    { label: t('profile.sidebar.menu.settings'), icon: 'tune', id: 'Settings' },
  ];

  return (
    <div className="bg-white p-12 rounded-[3.5rem] border border-outline/5 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.1)] transition-all duration-700 flex flex-col items-center xl:items-start h-fit">
      <div className="mb-14 px-2 space-y-4 text-center xl:text-left w-full">
        <h3 className="text-3xl font-black text-on-surface headline tracking-tight truncate hover:text-primary transition-colors cursor-default">
          {user?.name || user?.fullName || t('profile.sidebar.default_member')}
        </h3>
        
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
          {t('profile.sidebar.customer_badge')}
        </div>
      </div>

      <nav className="flex flex-col gap-4 w-full">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 5, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`flex items-center gap-5 p-5 transition-all rounded-[2rem] group w-full ${
                isActive 
                  ? 'bg-primary text-white shadow-[0_15px_30px_-5px_rgba(var(--primary-rgb),0.3)]' 
                  : 'text-on-surface-variant/40 hover:bg-surface hover:text-primary border border-transparent hover:border-outline/5 hover:shadow-sm'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? '' : 'group-hover:rotate-12 group-hover:scale-110'} transition-transform duration-500`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-black tracking-[0.2em] uppercase">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      <div className="mt-16 w-full pt-10 border-t border-outline/5 flex flex-col gap-8">
        <h4 className="text-[10px] font-black text-on-surface-variant/20 uppercase tracking-[0.4em] px-4">
          {t('profile.sidebar.actions_title')}
        </h4>
        
        <motion.button 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="w-full h-16 bg-primary text-white rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] hover:brightness-110 transition-all duration-500 flex items-center justify-center gap-4 px-6 group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform duration-500">restaurant_menu</span>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            {t('profile.sidebar.book_button')}
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
