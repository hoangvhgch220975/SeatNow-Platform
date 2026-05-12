import React from 'react';
import { useAuthStore } from '@/features/auth/store.js';
import { usePortfolioDashboard } from '../hooks.js';
import { ROUTES } from '@/config/routes.js';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next'; // Áp dụng hook ngôn ngữ (Vietnamese comment)

// Import các sub-components đã tách
import DashboardHeader from '../components/DashboardHeader';
import MetricGrid from '../components/MetricGrid';
import CompositionAnalysis from '../components/CompositionAnalysis';
import PortfolioChart from '../components/PortfolioChart';
import RestaurantCard from '../components/RestaurantCard';
import EmptyRestaurantsState from '../components/EmptyRestaurantsState';

/**
 * @file OwnerHomePage.jsx
 * @description Trang chủ quản lý danh mục (Portfolio Overview) dành cho Owner.
 * Đã tái cấu trúc sạch sẽ, tách component và tích hợp Recharts cùng dữ liệu BE mới.
 */
const OwnerHomePage = () => {
  const { t, i18n } = useTranslation(); // Khởi tạo i18n (Vietnamese comment)
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState('revenue'); // Mặc định hiển thị Doanh thu
  const [revenuePeriod, setRevenuePeriod] = React.useState('month'); 
  const [bookingPeriod, setBookingPeriod] = React.useState('day'); 
  const [currentPage, setCurrentPage] = React.useState(1); // Trang hiện tại cho danh sách nhà hàng
  const itemsPerPage = 6; // Giới hạn 6 nhà hàng mỗi trang

  // --- LOGIC TÍNH TOÁN DẢI NGÀY ---
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  
  const getRange = (period) => {
    const now = new Date();
    let from = today;
    let to = today;

    if (period === 'week') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      from = d.toISOString().split('T')[0];
    } else if (period === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      from = firstDay.toISOString().split('T')[0];
      to = lastDay.toISOString().split('T')[0];
    } else if (period === 'year') {
      const firstJan = new Date(now.getFullYear(), 0, 1);
      from = firstJan.toISOString().split('T')[0];
    }
    
    return { from, to, period };
  };

  const revRange = getRange(revenuePeriod);
  const bookRange = getRange(bookingPeriod);

  // Gọi Hook dashboard để lấy dữ liệu từ Backend
  // Gọi Hook dashboard để lấy dữ liệu từ Backend
  const { 
    venueSummary, 
    businessSummary, 
    myRestaurants, 
    revenueStats,
    bookingStats,
    isLoading, 
    isStatsLoading,
    isError 
  } = usePortfolioDashboard(
    { status: 'all' }, // Lấy tất cả nhà hàng (Active, Suspended, Pending)
    revRange, 
    bookRange,
    { from: today, to: today } 
  );

  // --- QUY TRÌNH BÓC TÁCH DỮ LIỆU SẠCH ---
  const restaurantsList = Array.isArray(myRestaurants) ? myRestaurants : (myRestaurants?.data || []);
  const stats = businessSummary?.summary || venueSummary?.summary || {};
  
  // Tính toán số lượng dựa trên toàn bộ danh sách nhà hàng
  const activeVenuesCount = restaurantsList.filter(r => r.status === 'active').length;
  const suspendedVenuesCount = restaurantsList.filter(r => r.status === 'suspended').length;
  const totalVenuesCount = stats.totalRestaurants || stats.totalVenues || restaurantsList.length;
  const inactiveVenuesCount = totalVenuesCount - activeVenuesCount;

  // Sử dụng dữ liệu đánh giá trung bình trọng số, giữ nguyên 2 chữ số thập phân (Vietnamese comment)
  const avgRating = (stats.portfolioRatingAvg || 0).toFixed(2);
  const portfolioTotalReviews = stats.portfolioTotalReviews || 0;

  // Chuẩn bị dữ liệu cho biểu đồ Recharts dựa trên Tab đang chọn
  const getChartSegments = () => {
    const dataObj = activeTab === 'bookings' 
      ? (bookingStats?.data || bookingStats)
      : (revenueStats?.data || revenueStats);
    
    const rawData = Array.isArray(dataObj) ? dataObj : (dataObj?.data || []);

    return rawData.map(d => ({
      label: d.timePeriod || (d.hour ? `${d.hour}:00` : '') || d.label || '---',
      val: activeTab === 'bookings' 
        ? Number(d.totalBookings || d.count || 0)
        : Number(d.totalRevenue || d.amount || 0),
      cancelledVal: activeTab === 'bookings' ? Number(d.totalCancelled || 0) : 0
    }));
  };

  const chartData = getChartSegments();
  const currentPeriod = activeTab === 'revenue' ? revenuePeriod : bookingPeriod;
  const setCurrentPeriod = activeTab === 'revenue' ? setRevenuePeriod : setBookingPeriod;

  // --- TÍNH TOÁN DỮ LIỆU TỔNG CHO PHẦN FOOTER BIỂU ĐỒ (DỰA TRÊN DỮ LIỆU ĐANG HIỂN THỊ) ---
  const rawRevData = Array.isArray(revenueStats) ? revenueStats : (revenueStats?.data || []);
  const periodNetRevenue = rawRevData.reduce((acc, curr) => acc + Number(curr.totalRevenue || curr.amount || 0), 0);
  const periodGrossRevenue = rawRevData.reduce((acc, curr) => acc + Number(curr.totalGrossRevenue || curr.grossAmount || 0), 0);
  
  const rawBookData = Array.isArray(bookingStats) ? bookingStats : (bookingStats?.data || []);
  const periodTotalBookings = rawBookData.reduce((acc, curr) => acc + Number(curr.totalBookings || curr.count || 0), 0);
  const periodTotalCancelled = rawBookData.reduce((acc, curr) => acc + Number(curr.totalCancelled || 0), 0);

  // Tìm giờ bận rộn nhất (chỉ áp dụng khi xem theo ngày)
  const busyHourData = [...rawBookData].sort((a, b) => Number(b.totalBookings || b.count || 0) - Number(a.totalBookings || a.count || 0))[0];
  const busyHour = (busyHourData?.totalBookings > 0 || busyHourData?.count > 0) 
    ? (busyHourData.timePeriod || `${busyHourData.hour}:00`) 
    : null;

  // Xây dựng nhãn hiển thị khoảng thời gian cho biểu đồ
  const getDisplayRangeLabel = () => {
    if (chartData.length === 0) {
      return currentPeriod === 'day' 
        ? t('owner_portal.home.today_performance') 
        : t('owner_portal.home.trend', { period: t(`analytics.${currentPeriod}`) });
    }
    const first = chartData[0].label;
    const last = chartData[chartData.length - 1].label;
    if (currentPeriod === 'day') {
      return t('owner_portal.home.real_time_activity', { 
        date: new Date().toLocaleDateString(i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US') 
      });
    }
    return t('owner_portal.home.analysis_timeline', { first, last });
  };

  // --- TRẠNG THÁI LOADING/ERROR ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin shadow-inner"></div>
        <p className="text-slate-400 font-black animate-pulse uppercase tracking-widest text-[10px]">{t('owner_portal.home.syncing')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-rose-50 p-16 rounded-[3rem] border border-rose-100 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto">
           <span className="material-symbols-outlined text-4xl">cloud_off</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900">{t('owner_portal.home.sync_failed')}</h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">{t('owner_portal.home.sync_failed_desc')}</p>
        </div>
        <button onClick={() => window.location.reload()} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-xl shadow-rose-200/50">
           {t('owner_portal.home.retry_connection')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* 1. Dashboard Header Section */}
      <DashboardHeader 
        userName={user?.fullName || user?.name}
        activeVenues={activeVenuesCount}
        inactiveVenues={inactiveVenuesCount}
      />

      {/* 2. KPI Metrics Grid */}
      <MetricGrid 
        stats={stats}
        avgRating={avgRating}
        totalReviews={portfolioTotalReviews}
        activeVenuesCount={activeVenuesCount}
        totalVenuesCount={totalVenuesCount}
      />

      {/* 3. Composition Analysis (Bento) */}
      <CompositionAnalysis guestSizeCounts={stats.guestSizeCounts} />

      {/* 4. Interactive Analytics Section (Recharts) */}
      <PortfolioChart 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={chartData}
        isStatsLoading={isStatsLoading}
        displayRange={getDisplayRangeLabel()}
        period={currentPeriod}
        setPeriod={setCurrentPeriod}
        totalBookings={periodTotalBookings}
        totalCancelled={periodTotalCancelled || 0} 
        grossRevenue={periodGrossRevenue}
        totalRevenue={periodNetRevenue}
        busyHour={busyHour}
      />

      {/* 5. Managed Venues Management Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('owner_portal.home.venue_operations')}</h3>
             <p className="text-sm text-slate-400 font-medium tracking-tight">{t('owner_portal.home.venue_operations_desc')}</p>
          </div>
          <Link 
            to={ROUTES.CREATE_RESTAURANT}
            className="text-violet-600 font-black text-[10px] uppercase tracking-widest bg-violet-50 px-6 py-3 rounded-xl hover:bg-violet-600 hover:text-white transition-all shadow-sm"
          >
            {t('owner_portal.home.expand_portfolio')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurantsList.length > 0 ? (
            restaurantsList
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((res) => (
                <RestaurantCard key={res.id} restaurant={res} />
              ))
          ) : (
            <EmptyRestaurantsState />
          )}
        </div>

        {/* BỘ PHÂN TRANG (Cùng theme với App) */}
        {restaurantsList.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 px-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 mt-6">
             <div className="space-y-1">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                   {t('owner_portal.home.operational_inventory')}
                </div>
                <div className="text-xs font-bold text-slate-600 italic">
                   <Trans 
                     i18nKey="owner_portal.home.showing_entities"
                     values={{
                       start: (currentPage - 1) * itemsPerPage + 1,
                       end: Math.min(currentPage * itemsPerPage, restaurantsList.length),
                       total: restaurantsList.length
                     }}
                   >
                     Showing <span className="text-violet-600 font-black not-italic">{"{{start}}"} - {"{{end}}"}</span> of <span className="text-slate-900 font-black not-italic">{"{{total}}"}</span> entities
                   </Trans>
                </div>
             </div>
             
             <div className="flex items-center gap-3 bg-white p-1.5 rounded-[2rem] shadow-sm border border-slate-100">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.ceil(restaurantsList.length / itemsPerPage))].map((_, idx) => {
                    const p = idx + 1;
                    return (
                      <button 
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-11 h-11 rounded-full text-[11px] font-black transition-all ${
                          currentPage === p 
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button 
                  disabled={currentPage === Math.ceil(restaurantsList.length / itemsPerPage)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
             </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default OwnerHomePage;
