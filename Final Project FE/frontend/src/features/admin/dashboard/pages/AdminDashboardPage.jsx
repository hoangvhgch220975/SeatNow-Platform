import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  useDashboardStats, 
  useRevenueStats, 
  usePartnerRequests, 
  usePendingWithdrawals 
} from '../hooks.js';

// Import components (VI: Import các thành phần giao diện)
import DashboardFilter from '../components/DashboardFilter.jsx';
import StatsCards from '../components/StatsCards.jsx';
import RevenueChart from '../components/RevenueChart.jsx';
import BookingDistributionChart from '../components/BookingDistributionChart.jsx';
import DashboardAuditSection from '../components/DashboardAuditSection.jsx';
import SystemStatusGrid from '../components/SystemStatusGrid.jsx';

/**
 * @file AdminDashboardPage.jsx
 * @description Trang quản trị tổng quan (Orchestrator).
 * Quản lý trạng thái lọc thời gian và phân bổ các thành phần theo mô hình Bento Grid chuyên nghiệp.
 */
const AdminDashboardPage = () => {
  const { t } = useTranslation();
  
  // State quản lý chu kỳ thời gian thống kê (VI: State quản lý chu kỳ thời gian)
  const [period, setPeriod] = useState('month');

  // Truy vấn dữ liệu từ API (VI: Fetching data from API)
  const { data: stats, isLoading: isStatsLoading } = useDashboardStats(period);
  const { data: revenueData, isLoading: isRevenueLoading } = useRevenueStats(period);
  const { data: partnerRequests, isLoading: isPartnersLoading } = usePartnerRequests(5);
  const { data: withdrawals, isLoading: isWithdrawalsLoading } = usePendingWithdrawals(5);

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
            {t('admin.dashboard.title')}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {t('admin.dashboard.subtitle')}
          </p>
        </div>
        <DashboardFilter currentPeriod={period} onPeriodChange={setPeriod} />
      </div>

      {/* Top Row: Executive Metrics (VI: Các chỉ số điều hành cấp cao) */}
      <StatsCards stats={stats} loading={isStatsLoading} />

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Row 2: Charts & Visuals */}
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} loading={isRevenueLoading} period={period} />
        </div>
        
        <div className="xl:col-span-1">
          <BookingDistributionChart stats={stats} loading={isStatsLoading} />
        </div>

        {/* Row 3: Audit & System Status */}
        <div className="xl:col-span-2">
          <DashboardAuditSection 
            partnerRequests={partnerRequests}
            withdrawals={withdrawals}
            loadingRequests={isPartnersLoading}
            loadingWithdrawals={isWithdrawalsLoading}
          />
        </div>

        <div className="xl:col-span-1">
          <SystemStatusGrid />
        </div>

      </div>

      {/* Footer Decoration (VI: Trang trí phần chân trang) */}
      <div className="pt-8 border-t border-slate-100/50 flex justify-center opacity-50">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          {t('admin.dashboard.powered_by')}
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
