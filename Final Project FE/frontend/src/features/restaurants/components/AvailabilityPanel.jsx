import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file AvailabilityPanel.jsx
 * @description Bảng điều khiển đặt bàn cao cấp (Sticky Sidebar).
 */
const AvailabilityPanel = ({ restaurant }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(ROUTES.CREATE_BOOKING(restaurant.slug || restaurant.id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotateX: 2, rotateY: -2 }}
      className="bg-white rounded-[4rem] p-12 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.08)] border border-outline/5 text-center space-y-12 relative overflow-hidden group"
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors duration-700"></div>
      
      <div className="space-y-6 relative z-10">
        <h2 className="text-4xl font-bold text-on-surface headline tracking-tight leading-tight">
          {t('restaurants.availability.title')}
        </h2>
        <p className="text-on-surface-variant/50 font-medium text-[13px] leading-relaxed max-w-[240px] mx-auto italic">
          {t('restaurants.availability.description', { cuisine: restaurant.cuisine })}
        </p>
      </div>

      <div className="relative z-10 group/btn">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 bg-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
        ></motion.div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBookNow}
          className="relative w-full bg-primary text-white py-8 rounded-[2rem] font-bold text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:brightness-110 transition-all flex items-center justify-center gap-4"
        >
          {t('restaurants.card.book_now')}
          <span className="material-symbols-outlined text-lg animate-bounce-x">arrow_forward</span>
        </motion.button>
      </div>

      <div className="flex items-center justify-between px-6 pt-12 border-t border-outline/5 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-4xl font-black text-on-surface headline tracking-tighter">
            {restaurant.reviewCount > 0 ? Number(restaurant.rating || 0).toFixed(1) : 'N/A'}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/30 font-black">
            {t('restaurants.card.rating')}
          </span>
        </motion.div>
        
        <div className="w-px h-14 bg-outline/10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-4xl font-black text-on-surface headline tracking-tighter">
            {restaurant.reviewCount >= 1000 
              ? `${(restaurant.reviewCount / 1000).toFixed(1)}k` 
              : restaurant.reviewCount}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/30 font-black">
            {t('restaurants.card.reviews')}
          </span>
        </motion.div>
      </div>

      <div className="pt-6 relative z-10">
         <div className="flex items-center justify-center gap-3 text-green-500/60">
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em]">
               {t('restaurants.availability.secure_booking')}
            </p>
         </div>
      </div>
    </motion.div>
  );
};

export default AvailabilityPanel;
