import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * @file VenuePerformanceTable.jsx
 * @description Bảng so sánh hiệu suất giữa các nhà hàng trong Portfolio.
 */
const VenuePerformanceTable = ({ restaurants, isLoading }) => {
  const { t } = useTranslation();
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val || 0);
  };

  // Mock-up data bóc tách từ Business Summary (vì API breakdown trả về mảng)
  // Thực tế sẽ lấy từ businessSummary.breakdown
  const performanceData = restaurants.map(v => ({
    ...v,
    revenue: Math.floor(Math.random() * 50000000) + 10000000, // Mock cho minh họa
    bookings: Math.floor(Math.random() * 100) + 20,
    growth: (Math.random() * 15).toFixed(1)
  })).sort((a, b) => b.revenue - a.revenue);

  if (isLoading) {
    return (
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm h-[400px] animate-pulse" />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mb-20"
    >
      <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('analytics.asset_ranking')}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('analytics.comparative_analysis')}</p>
        </div>
        <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-violet-300 hover:text-violet-600 transition-all shadow-sm">
           {t('analytics.export_analysis')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-slate-50">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('analytics.table_venue_entity')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('analytics.table_total_revenue')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('analytics.table_successful_bookings')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('analytics.table_efficiency')}</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('analytics.table_momentum')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {performanceData.map((venue, idx) => (
              <tr key={venue.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-200 overflow-hidden shadow-sm transition-transform group-hover:scale-105">
                       {venue.images?.[0] ? (
                         <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                       ) : (
                         <span className="material-symbols-outlined text-[20px]">restaurant</span>
                       )}
                    </div>
                    <div>
                       <h5 className="font-bold text-slate-800 text-sm group-hover:text-violet-600 transition-colors">{venue.name}</h5>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('analytics.rank_prefix')}{idx+1}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('analytics.portfolio_pillar')}</span>
                       </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 font-black text-slate-900 text-sm italic">
                  {formatCurrency(venue.revenue)}
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-700">{venue.bookings}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('analytics.units')}</span>
                  </div>
                </td>
                <td className="px-6 py-6">
                   <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between w-28">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('analytics.success_rate')}</span>
                         <span className="text-xs font-black text-emerald-500">{(venue.ratingAvg * 20).toFixed(0)}%</span>
                      </div>
                      <div className="w-28 h-1 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${venue.ratingAvg * 20}%` }} />
                      </div>
                   </div>
                </td>
                <td className="px-10 py-6 text-right">
                   <div className="flex items-center justify-end gap-2 text-emerald-500 font-black">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      <span className="text-sm">+{venue.growth}%</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default VenuePerformanceTable;
