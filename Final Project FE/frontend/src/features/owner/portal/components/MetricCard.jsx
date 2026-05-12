import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file MetricCard.jsx
 * @description Thành phần thẻ hiển thị chỉ số đơn lẻ (KPI Card) có tích hợp mức tăng trưởng.
 */
const MetricCard = ({ icon, title, value, growth, iconColor = 'bg-violet-100', textIconColor = 'text-violet-600' }) => {
  
  // Hàm hiển thị Badge tăng trưởng (trending)
  const renderGrowthBadge = (val) => {
    if (val > 0) {
      return (
        <div className="flex items-center text-emerald-600 text-[10px] font-black bg-emerald-50/50 w-fit px-3 py-1 rounded-lg border border-emerald-100/50">
          <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
          +{val}%
        </div>
      );
    } else if (val < 0) {
      return (
        <div className="flex items-center text-rose-600 text-[10px] font-black bg-rose-50/50 w-fit px-3 py-1 rounded-lg border border-rose-100/50">
          <span className="material-symbols-outlined text-[14px] mr-1">trending_down</span>
          {val}%
        </div>
      );
    }
    return (
      <div className="flex items-center text-slate-400 text-[10px] font-black bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-100">
        <span className="material-symbols-outlined text-[14px] mr-1">horizontal_rule</span>
        0%
      </div>
    );
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] border border-slate-100/50 space-y-6 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={`h-12 w-12 ${iconColor} rounded-2xl flex items-center justify-center ${textIconColor} shadow-inner`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {renderGrowthBadge(growth)}
      </div>
      
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className={`font-black text-slate-900 tracking-tight leading-none ${
          value?.toString().length > 15 ? 'text-lg' : 
          value?.toString().length > 12 ? 'text-xl' : 
          value?.toString().length > 10 ? 'text-2xl' : 'text-3xl'
        }`}>
           {value}
        </p>
      </div>
      
      {/* ProgressBar trang trí nhỏ ở dưới */}
      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: '70%' }}
           className={`h-full ${textIconColor.replace('text', 'bg')} opacity-20`}
         />
      </div>
    </motion.div>
  );
};

export default MetricCard;
