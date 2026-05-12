import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ROUTES } from '@/config/routes.js';

/**
 * @file TopVenuesList.jsx
 * @description Hiển thị danh sách các nhà hàng hoạt động tốt nhất. Hỗ trợ đa ngôn ngữ.
 */
const TopVenuesList = ({ restaurants, isLoading }) => {
  const { t } = useTranslation();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val || 0).replace('₫', '₫');
  };

  // Sắp xếp theo Doanh thu (Vietnamese comment)
  const sortedVenues = [...restaurants]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-[2.5rem]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {sortedVenues.map((venue, idx) => {
        const isTop = idx === 0;

        return (
          <Link 
            key={venue.id}
            to={ROUTES.WORKSPACE_DASHBOARD(venue.slug || venue.id)}
            className="block h-full cursor-pointer no-underline"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group flex items-center p-6 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-violet-200 hover:bg-violet-50/20 transition-all duration-300 relative overflow-hidden h-full"
            >
              {/* Image Box (Vietnamese comment) */}
              <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform duration-500">
                {venue.images?.[0] ? (
                  <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <span className="material-symbols-outlined text-2xl">restaurant</span>
                  </div>
                )}
              </div>

              {/* Info Box (Vietnamese comment) */}
              <div className="ml-6 flex-1 space-y-2">
                <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-violet-600 transition-colors uppercase">
                  {venue.name}
                </h4>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 tracking-[0.2em]">
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/50 uppercase">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {venue.ratingAvg || '5.0'}
                    </div>
                    <span className="uppercase">{venue.cuisineTypes?.[0] || t('common.premium')}</span>
                </div>
              </div>

              {/* Performance Stats (Vietnamese comment) */}
              <div className="text-right flex flex-col justify-center gap-1">
                <p className="font-black text-slate-900 leading-tight">
                  {formatCurrency(venue.totalRevenue)}
                </p>
                <p className={`text-[10px] font-black uppercase tracking-widest ${isTop ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {venue.totalBookings || 0} {t('common.bookings')}
                </p>
              </div>

              {/* Rank Bubble (Vietnamese comment) */}
              <div className="absolute top-2 right-4 text-[40px] font-black text-slate-50 opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
                #{idx + 1}
              </div>
            </motion.div>
          </Link>
        );
      })}
      
      {/* View All Button (Vietnamese comment) */}
      <Link
        to={ROUTES.OWNER_RESTAURANTS}
        className="group mt-auto flex items-center justify-center gap-3 w-full py-5 text-[11px] font-black uppercase tracking-widest border-2 border-slate-200 rounded-[2rem] text-slate-500 hover:border-violet-500 hover:text-violet-600 hover:bg-violet-50 hover:shadow-lg hover:shadow-violet-100 transition-all duration-300"
      >
        <span>{t('analytics.view_full_stack')}</span>
        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
      </Link>
    </div>
  );
};

export default TopVenuesList;
