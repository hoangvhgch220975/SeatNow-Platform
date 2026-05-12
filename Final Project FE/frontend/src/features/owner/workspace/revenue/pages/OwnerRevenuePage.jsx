import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRevenueDashboard } from '../hooks';
import RevenueHeader from '../components/RevenueHeader';
import RevenueKPIs from '../components/RevenueKPIs';
import RevenueTrendChart from '../components/RevenueTrendChart';
import GuestGroupAnalysis from '../components/GuestGroupAnalysis';
import PeakHoursChart from '../components/PeakHoursChart';
import TransactionHistory from '../components/TransactionHistory';
import { TrendingUp } from 'lucide-react';

/**
 * Trang quản lý doanh thu và phân tích chuyên sâu cho nhà hàng
 */
const OwnerRevenuePage = () => {
  const { t } = useTranslation();
  const { 
    period, 
    setPeriod, 
    summary, 
    trend, 
    peakHours, 
    transactions, 
    restaurant,
    isLoading, 
    refresh 
  } = useRevenueDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
      {/* 1. Header & Period Switcher */}
      <RevenueHeader 
        period={period} 
        setPeriod={setPeriod} 
        onRefresh={refresh}
      />

      {/* 2. Primary KPIs */}
      <RevenueKPIs summary={summary} />

      {/* 3. Charts Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Growth Trend */}
        <div className="lg:col-span-2">
          <RevenueTrendChart data={trend} period={period} />
        </div>

        {/* Guest Group Analysis */}
        <div className="lg:col-span-1">
          <GuestGroupAnalysis data={summary?.guestSizeCounts} />
        </div>
      </div>

      {/* 4. Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 items-start">
        {/* Peak Hours Distribution */}
        <div className="lg:col-span-1">
          <PeakHoursChart data={peakHours} openingHours={restaurant?.openingHours} />
          
          {/* Pro Tip / Insight Card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 group overflow-hidden relative">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <TrendingUp size={20} className="text-white" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/60">{t('workspace_revenue.insights.label')}</span>
             </div>
             <h4 className="text-lg font-black mb-2 relative z-10">{t('workspace_revenue.insights.title')}</h4>
             <p className="text-sm font-medium text-white/80 leading-relaxed relative z-10">
                {t('workspace_revenue.insights.description')}
             </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
};

export default OwnerRevenuePage;
