import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file LoyaltyCard.jsx
 * @description Thẻ hiển thị điểm thưởng (Loyalty Points) cao cấp.
 */
const LoyaltyCard = ({ points }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-black p-12 lg:p-14 rounded-[3.5rem] shadow-2xl flex flex-col justify-between items-center text-center relative overflow-hidden group border border-[#333] h-full min-h-[300px] transition-all duration-700 cursor-default text-amber-500"
    >
      {/* Dynamic Gold Metallic Shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-200/10 to-amber-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
      
      {/* Background Icon */}
      <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-[2s] ease-out-expo text-amber-500">
        <span className="material-symbols-outlined text-[15rem]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
      </div>
      
      <div className="relative z-10 space-y-8 w-full">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500/50 block">
          {t('profile.loyalty.total_rewards')}
        </span>
        <div className="text-7xl lg:text-8xl font-black tracking-tighter headline bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 text-transparent bg-clip-text drop-shadow-sm">
          {points?.toLocaleString() || 0}
        </div>
        <div className="flex items-center justify-center gap-3 bg-amber-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-amber-500/20 w-fit mx-auto group-hover:bg-amber-500/20 transition-colors duration-500">
           <span className="material-symbols-outlined text-[18px] text-amber-400">stars</span>
           <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400">{t('profile.loyalty.points_label')}</span>
        </div>
      </div>
      
      <div className="mt-12 relative z-10 w-full pt-8 border-t border-amber-500/10">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500/30">
          {t('profile.loyalty.premium_protocol')}
        </p>
      </div>
    </motion.div>
  );
};

export default LoyaltyCard;
