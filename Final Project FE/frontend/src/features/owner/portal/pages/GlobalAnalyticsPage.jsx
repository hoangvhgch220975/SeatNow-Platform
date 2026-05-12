import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePortfolioDashboard } from '../hooks.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Import sub-components (Vietnamese comment)
import DateRangePicker from '../components/DateRangePicker';
import AnalyticsSummary from '../components/AnalyticsSummary';
import AnalyticsCharts from '../components/AnalyticsCharts';
import GuestAnalytics from '../components/GuestAnalytics';
import TopVenuesList from '../components/TopVenuesList';
import PortfolioActivityFeed from '../components/PortfolioActivityFeed';

/**
 * @file GlobalAnalyticsPage.jsx
 * @description Trang quản lý phân tích danh mục (Portfolio Analytics). Hỗ trợ đa ngôn ngữ.
 */
const GlobalAnalyticsPage = () => {
  const { t, i18n } = useTranslation();

  // 1. State quản lý thời gian (Vietnamese comment)
  const [dateRange, setDateRange] = useState({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date())
  });
  const [activeTab, setActiveTab] = useState('DAY'); // DAY, WEEK, MONTH (Vietnamese comment)

  // 2. Chuẩn bị params cho API (Vietnamese comment)
  const rangeParams = useMemo(() => ({
    from: format(dateRange.start, 'yyyy-MM-dd'),
    to: format(dateRange.end, 'yyyy-MM-dd'),
    period: activeTab.toLowerCase()
  }), [dateRange, activeTab]);

  // 3. Fetch dữ liệu đồng bộ (Vietnamese comment)
  const { 
    venueSummary,
    businessSummary, 
    myRestaurants, 
    revenueStats, 
    bookingStats,
    isLoading,
    isStatsLoading 
  } = usePortfolioDashboard(
    { status: 'all' },
    rangeParams,
    rangeParams,
    rangeParams
  );

  // 4. Chuẩn bị dữ liệu biểu đồ (Vietnamese comment)
  const chartData = useMemo(() => {
    const rev = Array.isArray(revenueStats) ? revenueStats : (revenueStats?.data || []);
    const book = Array.isArray(bookingStats) ? bookingStats : (bookingStats?.data || []);

    return rev.map(r => {
      const b = book.find(bk => bk.timePeriod === r.timePeriod) || {};
      return {
        label: r.timePeriod || '---',
        totalRevenue: Number(r.totalRevenue || 0),
        totalBookings: Number(b.totalBookings || 0)
      };
    });
  }, [revenueStats, bookingStats]);

  const stats = businessSummary?.summary || {};

  // 6. Xử lý dữ liệu Top Performers (Vietnamese comment)
  const performanceData = useMemo(() => {
    const venues = Array.isArray(myRestaurants) ? myRestaurants : (myRestaurants?.data || []);
    const breakdown = businessSummary?.breakdown || [];

    return venues.map(v => {
      const b = breakdown.find(item => item.restaurantId === v.id) || {};
      return {
        ...v,
        totalRevenue: b.totalRevenue || 0,
        totalBookings: b.totalBookings || 0
      };
    });
  }, [myRestaurants, businessSummary]);

  return (
    <div className="space-y-10 pb-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 font-body">
      
      {/* TITLE HEADER SECTION (Vietnamese comment) */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
        <div className="space-y-1">
           <h1 className="text-[42px] font-black text-slate-900 tracking-tight leading-none">
             {t('common.global')} <span className="text-violet-600">{t('common.analytics')}</span>
           </h1>
        </div>

        {/* Action Button (Vietnamese comment) */}
        <div className="group relative">
          <button disabled className="px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-widest cursor-not-allowed opacity-60 flex items-center gap-2 shadow-sm">
             <span className="material-symbols-outlined text-[18px]">download</span>
             {t('common.export_analysis')}
          </button>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-[60]">
             {t('common.feature_coming_soon')}
          </div>
        </div>
      </header>

      {/* 1. KPI BENTO SUMMARY (Vietnamese comment) */}
      <AnalyticsSummary stats={stats} isLoading={isLoading} />

      {/* 2. MAIN CHARTS & FILTERS SECTION (Vietnamese comment) */}
      <div className="space-y-10">
        {/* IN-SECTION FILTERS - EXECUTIVE STATUS BAR (Vietnamese comment) */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white/80 p-5 px-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/10 backdrop-blur-xl relative z-50 transition-all hover:border-violet-100/50">
          
          {/* Left: Telemetry Status (Vietnamese comment) */}
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg overflow-hidden group/radar">
                <span className="material-symbols-outlined text-[24px] animate-pulse group-hover/radar:scale-110 transition-transform">radar</span>
             </div>
             <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                  {t('analytics.telemetry_system')}
                </p>
                <div className="flex items-center gap-1.5">
                   <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </div>
                   <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
                     {t('analytics.active_sync')}
                   </span>
                </div>
             </div>
          </div>

          {/* Center: REFINED TIMELINE BRIDGE (Vietnamese comment) */}
          <div className="flex-1 flex flex-col items-center justify-center py-2 xl:py-0">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2 leading-none">
               {t('analytics.observation_timeline')}
             </p>
             <div className="flex items-center gap-5">
                <div className="flex flex-col items-center">
                   <span className="text-sm font-black text-slate-900 tracking-tight">
                      {dateRange.start.toLocaleDateString(i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                   </span>
                </div>
                
                <div className="flex items-center gap-2 text-violet-200">
                   <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>
                   <span className="material-symbols-outlined text-[18px] text-violet-400">sync_alt</span>
                   <div className="w-8 h-[2px] bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>
                </div>

                <div className="flex flex-col items-center">
                   <span className="text-sm font-black text-slate-900 tracking-tight">
                      {dateRange.end.toLocaleDateString(i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                   </span>
                </div>
             </div>
          </div>

          {/* Right: Controls (Vietnamese comment) */}
          <div className="flex flex-wrap items-center justify-center gap-3">
             {/* Tab Switcher (Vietnamese comment) */}
             <div className="bg-slate-50/50 p-1 rounded-2xl flex items-center border-2 border-slate-100">
                {['DAY', 'WEEK', 'MONTH'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 ${
                      activeTab === tab 
                        ? 'bg-white text-violet-600 shadow-md shadow-violet-100 border border-violet-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t(`analytics.${tab.toLowerCase()}`)}
                  </button>
                ))}
             </div>

             <DateRangePicker 
               startDate={dateRange.start} 
               endDate={dateRange.end} 
               onRangeChange={(start, end) => setDateRange({ start, end })} 
             />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2">
              <AnalyticsCharts 
                data={chartData} 
                isLoading={isStatsLoading} 
                period={activeTab.toLowerCase()} 
              />
           </div>
           <div className="lg:col-span-1">
              <GuestAnalytics 
                stats={stats} 
                isLoading={isLoading} 
                venueCount={stats?.totalRestaurants || myRestaurants?.length || 0}
              />
           </div>
        </div>
      </div>

      {/* 3. PERFORMANCE RANKING & ACTIVITY FEED ROW (Vietnamese comment) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
         <section className="lg:col-span-1 flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                 {t('analytics.top_performers')}
               </h3>
            </div>
            <div className="flex-1">
               <TopVenuesList restaurants={performanceData} isLoading={isLoading} />
            </div>
         </section>
         
         <section className="lg:col-span-1 flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                 {t('analytics.recent_activity')}
               </h3>
            </div>
            <div className="flex-1">
               <PortfolioActivityFeed isLoading={isLoading} />
            </div>
         </section>
      </div>

    </div>
  );
};

export default GlobalAnalyticsPage;
