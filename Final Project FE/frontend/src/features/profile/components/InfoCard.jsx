import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file InfoCard.jsx
 * @description Thành phần thẻ hiển thị thông tin chi tiết cao cấp.
 */
const InfoCard = ({ label, value, icon, color }) => (
  <motion.div 
    whileHover={{ x: 5, scale: 1.01 }}
    className="group flex items-center gap-6 p-6 bg-surface/30 rounded-[2.5rem] border border-transparent hover:border-outline/5 hover:bg-surface hover:shadow-sm transition-all duration-500 cursor-default"
  >
    <div className={`w-14 h-14 ${color} rounded-[1.5rem] flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
    
    <div className="flex-grow space-y-1">
      <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.25em]">{label}</p>
      <p className="text-sm font-black text-on-surface break-all tracking-tight group-hover:text-primary transition-colors duration-300">{value}</p>
    </div>
  </motion.div>
);

export default InfoCard;
