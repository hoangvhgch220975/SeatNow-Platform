import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file BookingEmptyState.jsx
 * @description Trạng thái trống cao cấp với kích thước ổn định.
 */
const BookingEmptyState = ({ activeTab }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center bg-white rounded-[3.5rem] border border-outline/5 min-h-[600px] p-12 shadow-sm"
    >
       <motion.div 
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="w-48 h-48 mb-8 flex items-center justify-center rounded-[2.5rem] bg-surface shadow-inner"
       >
          <span className="material-symbols-outlined text-7xl text-primary/40 animate-pulse">restaurant_menu</span>
       </motion.div>
       
       <div className="space-y-4 mb-12">
         <h2 className="text-3xl font-black text-on-surface headline tracking-tight uppercase">
            {t('booking.history.empty.title', { tab: t(`booking.history.tabs.${activeTab?.toLowerCase()}`) })}
         </h2>
         <p className="text-[13px] text-on-surface-variant/60 font-medium max-w-sm leading-relaxed">
            {t('booking.history.empty.subtitle')}
         </p>
       </div>

       <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }}>
         <Link 
            to={ROUTES.RESTAURANT_LIST}
            className="flex items-center gap-3 px-12 py-5 rounded-full bg-primary text-white font-black shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.5)] transition-all uppercase tracking-[0.2em] text-[11px]"
         >
            <span className="material-symbols-outlined text-sm">explore</span>
            {t('booking.history.empty.explore')}
         </Link>
       </motion.div>
    </motion.div>
  );
};

export default BookingEmptyState;
