import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file GuestAnalytics.jsx
 * @description Phân tích cơ cấu nhóm khách hàng trong toàn bộ Portfolio. Hỗ trợ đa ngôn ngữ.
 */
const GuestAnalytics = ({ stats, isLoading, venueCount = 0 }) => {
  const { t } = useTranslation();
  
  // Bóc tách dữ liệu (Vietnamese comment)
  const guests = stats?.guestSizeCounts || {};
  
  const getPercentage = (val, fallback) => {
    return (val !== undefined && val !== null) ? parseFloat(val).toFixed(2) : fallback;
  };

  const data = [
    { 
      label: t('guest.couples'), 
      percentage: getPercentage(guests.percentCouple, 42), 
      color: 'bg-violet-600' 
    },
    { 
      label: t('guest.small_groups'), 
      percentage: getPercentage(guests.percentSmallGroup, 38), 
      color: 'bg-violet-400' 
    },
    { 
      label: t('guest.parties'), 
      percentage: getPercentage(guests.percentParty, 20), 
      color: 'bg-violet-200' 
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm h-full animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm h-full relative overflow-hidden group">
      {/* Abstract Background Shape (Vietnamese comment) */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />

      <div className="space-y-2 mb-10 relative z-10">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {t('guest.breakdown')}
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          {t('guest.demographics')}
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        {data.map((item, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
              <span className="text-sm font-black text-violet-600">{item.percentage}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.2 }}
                className={`h-full ${item.color} rounded-full shadow-sm`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note (Vietnamese comment) */}
      <div className="mt-12 pt-8 border-t border-slate-50 relative z-10">
         <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
           {t('guest.footer_note', { count: venueCount || 0 })}
         </p>
      </div>
    </div>
  );
};

export default GuestAnalytics;
