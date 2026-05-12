import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file LanguageSwitcher.jsx
 * @description Bộ chuyển đổi ngôn ngữ (English / Vietnamese) dùng chung cho toàn hệ thống.
 * Tích hợp mượt mà vào Navbar/Topbar của các phân hệ.
 */
/**
 * @file LanguageSwitcher.jsx
 * @description Bộ chuyển đổi ngôn ngữ linh hoạt. Hỗ trợ 3 kiểu hiển thị: inline, dropdown, và floating.
 * @param {string} variant - 'inline' (mặc định), 'dropdown' (trong menu), 'floating' (nút nổi FAB).
 */
const LanguageSwitcher = ({ variant = 'inline' }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.split('-')[0]; // Lấy mã ngôn ngữ chính (en/vi)

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  // 1. Cấu hình giao diện FAB (Nút nổi) cho khách vãng lai
  if (variant === 'floating') {
    return (
      <button
        onClick={toggleLanguage}
        className="fixed bottom-32 right-8 z-[100] group flex items-center justify-center w-14 h-14 bg-white border border-outline/10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 ease-out-expo hover:-translate-y-1 active:scale-90 overflow-hidden"
        title={currentLang === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-outline/5 mb-0.5">
            <img 
              src={currentLang === 'en' ? 'https://flagcdn.com/us.svg' : 'https://flagcdn.com/vn.svg'} 
              alt={currentLang}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">
            {currentLang === 'en' ? 'EN' : 'VI'}
          </span>
        </div>
      </button>
    );
  }

  // 2. Cấu hình giao diện Item trong Dropdown Menu (User Profile)
  if (variant === 'dropdown') {
    return (
      <button
        onClick={toggleLanguage}
        className="w-full flex items-center gap-5 px-5 py-4.5 rounded-2xl hover:bg-primary/5 text-on-surface-variant hover:text-primary transition-all duration-500 ease-out-expo group"
      >
        <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center group-hover:bg-white transition-colors border border-outline/5 group-hover:border-primary/20 shadow-sm relative overflow-hidden">
          <img 
            src={currentLang === 'en' ? 'https://flagcdn.com/us.svg' : 'https://flagcdn.com/vn.svg'} 
            alt={currentLang}
            className="w-6 h-6 object-cover rounded-sm z-10"
          />
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[13px] font-bold tracking-tight">{t('common.language')}</span>
          <span className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest leading-none mt-1.5">
            {currentLang === 'en' ? 'English' : 'Tiếng Việt'}
          </span>
        </div>
        <div className="ml-auto">
          <span className="material-symbols-outlined text-outline/20 text-[18px] group-hover:text-primary transition-colors duration-300">sync_alt</span>
        </div>
      </button>
    );
  }

  // 3. Cấu hình mặc định (Inline)
  return (
    <button
      onClick={toggleLanguage}
      className="group relative flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-violet-50 border border-slate-200 hover:border-violet-200 rounded-xl transition-all duration-300 overflow-hidden"
    >
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-100 flex-shrink-0">
          <img 
            src={currentLang === 'en' ? 'https://flagcdn.com/us.svg' : 'https://flagcdn.com/vn.svg'} 
            alt={currentLang}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-violet-600 transition-colors">
          {currentLang === 'en' ? 'EN' : 'VI'}
        </span>
      </div>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="lang-bg"
      />
    </button>
  );
};

export default LanguageSwitcher;
