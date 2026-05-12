import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * @file KPIStatCard.jsx
 * @description Thành phần hiển thị chỉ số quan trọng (KPI) trên Dashboard.
 */
const KPIStatCard = ({ title, value, trend, icon, colorClass, bgColorClass, iconColorClass, subtext, to }) => {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className={`h-12 w-12 ${bgColorClass} rounded-2xl flex items-center justify-center ${iconColorClass} shadow-inner`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50/50 border-emerald-100/50' : 'text-rose-600 bg-rose-50/50 border-rose-100/50'} text-[10px] font-black w-fit px-3 py-1 rounded-lg border`}>
            <span className="material-symbols-outlined text-[14px] mr-1">
              {trend.startsWith('+') ? 'trending_up' : 'trending_down'}
            </span>
            {trend}
          </div>
        )}
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
        {subtext && !trend && (
          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-80">
            {subtext}
          </p>
        )}
      </div>
      
      {/* ProgressBar trang trí nhỏ ở dưới */}
      <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: '70%' }}
           className={`h-full ${iconColorClass.replace('text', 'bg')} opacity-20`}
         />
      </div>
    </>
  );

  if (to) {
    return (
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="transition-all duration-300"
      >
        <Link 
          to={to}
          className="bg-white p-6 rounded-[2rem] shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] border border-slate-100/50 space-y-6 flex flex-col justify-between h-full hover:border-violet-200 cursor-pointer block"
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] border border-slate-100/50 space-y-6 flex flex-col justify-between"
    >
      {content}
    </motion.div>
  );
};

export default KPIStatCard;
