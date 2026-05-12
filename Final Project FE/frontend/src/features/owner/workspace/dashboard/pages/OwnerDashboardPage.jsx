import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation, Trans } from 'react-i18next';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  startOfDay,
  endOfDay,
  subDays
} from 'date-fns';
import { useWorkspaceDashboard } from '../hooks';
import KPIStatCard from '../components/KPIStatCard';
import RevenueAnalysisChart from '../components/RevenueAnalysisChart';
import BookingVolumeChart from '../components/BookingVolumeChart';
import UpcomingArrivalsTable from '../components/UpcomingArrivalsTable';
import LiveFloorPlan from '../components/LiveFloorPlan';
import GuestAnalysisBreakdown from '../components/GuestAnalysisBreakdown';
import { ROUTES } from '@/config/routes';


/**
 * @file OwnerDashboardPage.jsx
 * @description Trang Tổng quan (Overview) cho từng nhà hàng riêng biệt trong Workspace.
 * Hiển thị các chỉ số kinh doanh, biểu đồ và sơ đồ bàn thời gian thực.
 */
const OwnerDashboardPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  
  // Hàm tính toán dải ngày mặc định (Vietnamese comment)
  const getDefaultParams = (p) => {
    const now = new Date();
    let from, to;

    switch (p) {
      case 'year':
        from = format(startOfYear(now), 'yyyy-MM-dd');
        to = format(endOfYear(now), 'yyyy-MM-dd');
        break;
      case 'month':
        from = format(startOfMonth(now), 'yyyy-MM-dd');
        to = format(endOfMonth(now), 'yyyy-MM-dd');
        break;
      case 'week':
        // Lùi lại 6 ngày từ hiện tại + ngày hôm nay = 7 ngày (Vietnamese comment)
        from = format(subDays(now, 6), 'yyyy-MM-dd');
        to = format(now, 'yyyy-MM-dd');
        break;
      case 'day':
      default:
        from = format(startOfDay(now), 'yyyy-MM-dd');
        to = format(endOfDay(now), 'yyyy-MM-dd');
        break;
    }
    return { period: p, from, to };
  };

  const [revenueParams, setRevenueParams] = useState(getDefaultParams('day'));
  
  // State riêng biệt cho Booking Volume Chart (Hourly) (Vietnamese comment)
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const hourlyParams = { period: 'day', from: bookingDate, to: bookingDate };
  
  // Lấy toàn bộ dữ liệu cần thiết cho Dashboard từ Hook tập trung (Vietnamese comment)
  const { 
    restaurant, 
    stats, 
    dailyStats,
    revenue, 
    hourly, 
    recentBookings, 
    dayBookings,
    tables, 
    isLoading 
  } = useWorkspaceDashboard(idOrSlug, revenueParams, hourlyParams);

  // Xử lý khi thay đổi chu kỳ (Vietnamese comment)
  const handlePeriodChange = (newPeriod) => {
    setRevenueParams(getDefaultParams(newPeriod));
  };

  // Định dạng tiền tệ VND (Vietnamese comment)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val || 0).replace('₫', '₫');
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Welcome Header Section */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {t('workspace.dashboard.title')}
          </h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">
            <Trans i18nKey="workspace.dashboard.welcome" values={{ name: restaurant?.name || '...' }}>
              Here's what's happening at <span className="text-primary font-black"></span> today.
            </Trans>
          </p>
        </div>
        
        {/* Dynamic Period Indicator (Optional) */}
        <div className="hidden md:block">
           <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {new Date().toLocaleDateString(t('i18next_code'), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </div>
        </div>
      </div>

      {/* KPI Cards Grid - High level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* 1. Lượt đặt bàn (Total Bookings) */}
        <KPIStatCard 
          title={t('workspace.dashboard.total_bookings', { defaultValue: 'Total Bookings' })}
          value={dailyStats?.totalBookings || 0}
          trend={dailyStats?.comparisons?.bookingsGrowth ? `${dailyStats.comparisons.bookingsGrowth > 0 ? '+' : ''}${dailyStats.comparisons.bookingsGrowth}%` : undefined}
          icon="calendar_today"
          bgColorClass="bg-purple-50"
          iconColorClass="text-primary"
          to={ROUTES.WORKSPACE_BOOKINGS(idOrSlug)}
        />

        {/* 2. Doanh thu thực nhận (Net Revenue) */}
        <KPIStatCard 
          title={t('workspace.dashboard.net_revenue', { defaultValue: 'Net Revenue' })}
          value={formatCurrency(dailyStats?.totalRevenue)}
          trend={dailyStats?.comparisons?.revenueGrowth ? `${dailyStats.comparisons.revenueGrowth > 0 ? '+' : ''}${dailyStats.comparisons.revenueGrowth}%` : undefined}
          icon="payments"
          bgColorClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
          to={ROUTES.WORKSPACE_REVENUE(idOrSlug)}
        />

        {/* 3. Doanh thu gộp (Gross Revenue) */}
        <KPIStatCard 
          title={t('workspace.dashboard.gross_revenue', { defaultValue: 'Gross Revenue' })}
          value={formatCurrency(dailyStats?.totalGrossRevenue)}
          subtext={t('workspace.dashboard.before_commission', { defaultValue: 'Before Commission' })}
          icon="account_balance_wallet"
          bgColorClass="bg-blue-50"
          iconColorClass="text-blue-600"
          to={ROUTES.WORKSPACE_REVENUE(idOrSlug)}
        />

        {/* 4. Hiệu suất vận hành (Cancellation Rate) */}
        <KPIStatCard 
          title={t('workspace.dashboard.cancellation_rate', { defaultValue: 'Cancellation Rate' })}
          value={`${((dailyStats?.cancellationRate || 0) * 100).toFixed(1)}%`}
          subtext={t('workspace.dashboard.no_shows', { defaultValue: '{{count}} No-shows', count: dailyStats?.totalNoShow || 0 })}
          icon="event_busy"
          bgColorClass="bg-rose-50"
          iconColorClass="text-rose-600"
          to={ROUTES.WORKSPACE_REVENUE(idOrSlug)}
        />

        {/* 5. Đánh giá khách hàng (Rating) */}
        <KPIStatCard 
          title={t('workspace.dashboard.customer_rating', { defaultValue: 'Avg. Rating' })}
          value={restaurant?.ratingAvg || '0.0'}
          subtext={t('workspace.dashboard.total_reviews', { defaultValue: '{{count}} Reviews', count: restaurant?.ratingCount || 0 })}
          icon="stars"
          bgColorClass="bg-amber-50"
          iconColorClass="text-amber-600"
        />
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-12 gap-8 items-stretch">
        <div className="col-span-12 lg:col-span-8 h-[450px]">
          <RevenueAnalysisChart 
            data={revenueParams.period === 'day' ? dayBookings : revenue} 
            isLoading={isLoading} 
            period={revenueParams.period}
            onPeriodChange={handlePeriodChange}
            restaurant={restaurant}
            selectedDate={revenueParams.from}
          />
        </div>
        <div className="col-span-12 lg:col-span-4 h-[450px]">
          <BookingVolumeChart 
            data={hourly} 
            isLoading={isLoading} 
            restaurant={restaurant} 
            selectedDate={bookingDate}
            onDateChange={setBookingDate}
          />
        </div>
      </div>

      {/* Operations Overview: Arrivals, Guest Analysis and Floor Plan */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Arrivals (8/12) */}
        <div className="col-span-12 lg:col-span-8">
          <UpcomingArrivalsTable bookings={recentBookings} isLoading={isLoading} />
        </div>
        
        {/* Right Column: Analytics & Space (4/12) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col">
          <GuestAnalysisBreakdown guestSizeCounts={dailyStats?.guestSizeCounts} isLoading={isLoading} />
          <LiveFloorPlan 
            tables={tables} 
            bookings={dayBookings} 
            restaurant={restaurant} 
            selectedDate={bookingDate} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
