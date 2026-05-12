import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file AnalyticsSummary.jsx
 * @description Hiển thị các chỉ số KPI theo phong cách Executive Bento Grid. Hỗ trợ đa ngôn ngữ.
 */
const AnalyticsSummary = ({ stats, isLoading }) => {
  const { t } = useTranslation();
  
  // Hàm định dạng tiền tệ (Vietnamese comment)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val || 0).replace('₫', '₫');
  };

  // Màn hình loading (Vietnamese comment)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`${i === 0 ? 'md:col-span-2' : 'md:col-span-1'} h-64 bg-slate-50 animate-pulse rounded-[3rem]`} />
        ))}
      </div>
    );
  }

  const comparisons = stats?.comparisons || {};
  const avgTransaction = (stats?.totalRevenue || 0) / (stats?.totalBookings || 1);

  // Render chỉ số tăng trưởng (Vietnamese comment)
  const renderGrowth = (value, period) => {
    if (value === undefined || value === null) return null;
    const num = parseFloat(value);
    const isPositive = num > 0;
    const isNegative = num < 0;
    
    const colorClass = isPositive ? 'text-emerald-500' : isNegative ? 'text-rose-500' : 'text-slate-400';
    const icon = isPositive ? 'trending_up' : isNegative ? 'trending_down' : 'trending_flat';

    return (
      <div className={`flex items-center gap-1 text-[11px] font-black ${colorClass}`}>
         <span className="material-symbols-outlined text-[16px]">{icon}</span>
         {isPositive ? `+${value}` : value}% {t(`analytics.${period?.toLowerCase() || 'day'}`)}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {/* 1. GROSS PORTFOLIO REVENUE (Vietnamese comment) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
               </div>
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 {t('analytics.gross_revenue')}
               </h4>
            </div>
            
            <div className="space-y-2">
                <h2 className={`font-black text-slate-900 tracking-tighter leading-none ${
                   formatCurrency(stats?.totalGrossRevenue || 0).length > 15 ? 'text-4xl' : 
                   formatCurrency(stats?.totalGrossRevenue || 0).length > 12 ? 'text-5xl' : 
                   formatCurrency(stats?.totalGrossRevenue || 0).length > 10 ? 'text-6xl' : 'text-7xl'
                 }`}>
                   {formatCurrency(stats?.totalGrossRevenue || 0)}
                 </h2>
               <div className="flex items-center gap-3 pt-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">
                    {t('analytics.total_deposit_volume')}
                  </span>
                  {renderGrowth(comparisons.revenueGrowth, comparisons.period)}
               </div>
            </div>
          </div>
          
          <p className="mt-8 text-xs font-bold text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('analytics.financial_sync')}
          </p>
        </div>
      </motion.div>

      {/* 2. TOTAL COMPLETED BOOKINGS (Vietnamese comment) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="md:col-span-1 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group"
      >
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 {t('analytics.total_completed_bookings')}
               </h4>
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
               </div>
            </div>
            <div className="space-y-1">
               <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{stats?.totalBookings || 0}</h2>
               <div className="pt-2">
                 {renderGrowth(comparisons.bookingsGrowth, comparisons.period)}
               </div>
            </div>
          </div>
          <div className="pt-6 border-t border-slate-50">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {stats?.totalCancelled || 0} {t('analytics.cancellations_recorded')}
             </p>
          </div>
        </div>
      </motion.div>

      {/* 3. NET PORTFOLIO REVENUE (Vietnamese comment) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-1 bg-violet-600 rounded-[3.5rem] p-12 shadow-2xl shadow-violet-200 relative overflow-hidden group"
      >
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="flex flex-col h-full justify-between relative z-10 text-white">
          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em]">
              {t('analytics.net_revenue')}
            </h4>
            <div className="space-y-2">
                <h2 className={`font-black tracking-tighter leading-none ${
                   formatCurrency(stats?.totalRevenue).length > 15 ? 'text-2xl' : 
                   formatCurrency(stats?.totalRevenue).length > 12 ? 'text-3xl' : 
                   formatCurrency(stats?.totalRevenue).length > 10 ? 'text-4xl' : 'text-5xl'
                 }`}>{formatCurrency(stats?.totalRevenue)}</h2>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                 {t('analytics.after_system_commissions')}
               </p>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center self-end">
             <span className="material-symbols-outlined text-white">payments</span>
          </div>
        </div>
      </motion.div>

      {/* 4. PORTFOLIO SATISFACTION (Vietnamese comment) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="md:col-span-1 bg-amber-400 rounded-[3.5rem] p-12 shadow-2xl shadow-amber-200 relative overflow-hidden group"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
        
        <div className="flex flex-col h-full justify-between relative z-10 text-amber-950">
          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-amber-900/50 uppercase tracking-[0.3em]">
              {t('analytics.satisfaction')}
            </h4>
            <div className="space-y-4">
               <h2 className="text-6xl font-black tracking-tighter leading-none">
                 {((stats?.portfolioRatingAvg || 0) * 20).toFixed(1)}%
               </h2>
               <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`material-symbols-outlined text-xs ${(stats?.portfolioRatingAvg || 0) >= star ? 'text-white' : 'text-amber-950/20'}`}>star</span>
                  ))}
               </div>
            </div>
          </div>
          <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">
            {t('analytics.based_on_reviews', { count: stats?.portfolioTotalReviews || 0 })}
          </p>
        </div>
      </motion.div>

      {/* 5. AVG. TRANSACTION VALUE (Vietnamese comment) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="md:col-span-1 bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group"
      >
        <div className="flex flex-col h-full justify-between relative z-10">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 {t('analytics.avg_transaction')}
               </h4>
               <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">insights</span>
               </div>
            </div>
            <h2 className={`font-black text-slate-900 tracking-tighter leading-none ${
               formatCurrency(avgTransaction).length > 15 ? 'text-2xl' : 
               formatCurrency(avgTransaction).length > 12 ? 'text-3xl' : 
               formatCurrency(avgTransaction).length > 10 ? 'text-4xl' : 'text-5xl'
             }`}>{formatCurrency(avgTransaction)}</h2>
          </div>
          <p className="text-[10px] font-bold text-slate-300 italic">
            {t('analytics.financial_efficiency')}
          </p>
        </div>
      </motion.div>

    </div>
  );
};

export default AnalyticsSummary;
