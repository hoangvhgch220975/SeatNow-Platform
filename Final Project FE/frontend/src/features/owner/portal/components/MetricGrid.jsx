import React from 'react';
import MetricCard from './MetricCard';
import { useTranslation } from 'react-i18next'; // Áp dụng hook ngôn ngữ (Vietnamese comment)

/**
 * @file MetricGrid.jsx
 * @description Lưới hiển thị các chỉ số kinh doanh chính (KPIs) cho Owner.
 */
const MetricGrid = ({ stats, avgRating, totalReviews, activeVenuesCount, totalVenuesCount }) => {
  const { t } = useTranslation(); // Lấy hàm dịch (Vietnamese comment)
  const revenueGrowth = stats.comparisons?.revenueGrowth || 0;
  const bookingsGrowth = stats.comparisons?.bookingsGrowth || 0;

  // Format tiền tệ VND chuyên nghiệp
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        maximumFractionDigits: 0 
    }).format(amount || 0).replace('₫', '₫');
  };

  // Rút gọn các con số lớn (VD: 1.2k)
  const formatCompact = (num) => {
    return new Intl.NumberFormat('en-US', { 
        notation: 'compact', 
        maximumFractionDigits: 1 
    }).format(num || 0);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
         icon="payments"
         title={t('owner_portal.metrics.portfolio_revenue')}
         value={formatVND(stats.totalRevenue)}
         growth={revenueGrowth}
         iconColor="bg-emerald-50"
         textIconColor="text-emerald-500"
      />
      
      <MetricCard 
         icon="calendar_month"
         title={t('owner_portal.metrics.total_bookings')}
         value={formatCompact(stats.totalBookings)}
         growth={bookingsGrowth}
         iconColor="bg-blue-50"
         textIconColor="text-blue-500"
      />
      
      <MetricCard 
         icon="star"
         title={t('owner_portal.metrics.portfolio_satisfied')}
         value={`${avgRating} ★`}
         growth={t('owner_portal.metrics.reviews_suffix', { count: totalReviews })} // Hiển thị tổng số lượng review thực tế đã thu thập với i18n (Vietnamese comment)
         iconColor="bg-orange-50"
         textIconColor="text-orange-500"
      />
      
      {/* Thẻ Venue Count với thiết kế đặc biệt (Violet Primary) */}
      <div className="bg-violet-600 p-8 rounded-[2.5rem] shadow-xl shadow-violet-200 space-y-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <span className="material-symbols-outlined text-[120px] -translate-y-8 translate-x-8">storefront</span>
        </div>
        
        <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm relative z-10">
          <span className="material-symbols-outlined">restaurant</span>
        </div>
        
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-violet-100 uppercase tracking-[0.2em] opacity-80 mb-1">{t('owner_portal.metrics.managed_venues')}</p>
          <p className="text-3xl font-black uppercase tracking-tight">
            {activeVenuesCount} <span className="text-sm font-bold opacity-60">/ {totalVenuesCount}</span>
          </p>
        </div>
        
        <div className="flex items-center text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm relative z-10">
           {t('owner_portal.metrics.system_operational')}
        </div>
      </div>
    </section>
  );
};

export default MetricGrid;
