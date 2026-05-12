import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/config/routes.js';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next'; // Áp dụng hook ngôn ngữ (Vietnamese comment)

/**
 * @file EmptyRestaurantsState.jsx
 * @description Thành phần hiển thị khi Owner chưa có bất kỳ nhà hàng nào trong hệ thống.
 */
const EmptyRestaurantsState = () => {
  const { t } = useTranslation(); // Khởi tạo i18n (Vietnamese comment)
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="md:col-span-3 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-20 space-y-8 relative overflow-hidden"
    >
      {/* Nền trang trí */}
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/20 to-transparent opacity-50"></div>
      
      <div className="relative z-10 space-y-6">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 mx-auto group hover:scale-110 mb-4 transition-transform duration-500">
          <span className="material-symbols-outlined text-5xl group-hover:text-violet-500 transition-colors">storefront</span>
        </div>
        
        <div className="space-y-3">
          <h5 className="text-3xl font-black text-slate-900 tracking-tight">{t('owner_portal.empty_state.title')}</h5>
          <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
            <Trans i18nKey="owner_portal.empty_state.description">
              Onboard your first restaurant and start managing its performance with SeatNow's <span className="text-violet-600 font-bold">AI-driven insights</span> and premium dashboard.
            </Trans>
          </p>
        </div>
        
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to={ROUTES.CREATE_RESTAURANT} 
            className="group h-16 px-10 bg-slate-900 text-white rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            {t('owner_portal.empty_state.register_venue')}
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
          
          <button className="h-16 px-8 rounded-2xl flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
            {t('owner_portal.empty_state.view_guide')}
          </button>
        </div>
      </div>

      {/* Trang trí góc */}
      <div className="absolute bottom-12 left-12 opacity-5">
         <span className="material-symbols-outlined text-[100px]">restaurant</span>
      </div>
    </motion.div>
  );
};

export default EmptyRestaurantsState;
