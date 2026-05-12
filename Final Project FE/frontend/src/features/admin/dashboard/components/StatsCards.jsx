import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/config/routes';

/**
 * @file StatsCards.jsx
 * @description Hiển thị 4 thẻ KPI tổng quan (Doanh thu, Chờ duyệt, Người dùng, Tỷ lệ thành công).
 * Hỗ trợ trạng thái Skeleton khi đang tải dữ liệu.
 */

// Component con hiển thị từng thẻ đơn lẻ (VI: Single metric card)
const MetricCard = ({ title, value, icon, color, loading, trend, path }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="h-10 w-10 bg-slate-100 rounded-xl" />
          <div className="h-4 w-12 bg-slate-50 rounded" />
        </div>
        <div className="h-4 w-24 bg-slate-100 rounded mb-2" />
        <div className="h-8 w-32 bg-slate-200 rounded" />
      </div>
    );
  }

  const handleClick = () => {
    if (path) navigate(path);
  };

  return (
    <div 
      onClick={handleClick}
      className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group ${path ? 'cursor-pointer hover:border-violet-200' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-xl font-bold transition-transform group-hover:scale-110`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            <span className="material-symbols-outlined text-xs">{trend > 0 ? 'trending_up' : 'trending_down'}</span>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors">
          {value}
        </h3>
      </div>
    </div>
  );
};

const StatsCards = ({ stats, loading }) => {
  const { t } = useTranslation();

  // Định nghĩa các thẻ KPI (VI: KPI definitions)
  const cards = [
    {
      id: 'revenue',
      title: t('admin.dashboard.stats.total_revenue'),
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalCommission || 0),
      icon: 'payments',
      color: 'text-emerald-600 bg-emerald-600',
      trend: 12.5,
    },
    {
      id: 'pending',
      title: t('admin.dashboard.stats.pending_venues'),
      value: stats?.pendingRestaurants || 0,
      icon: 'pending_actions',
      color: 'text-amber-600 bg-amber-600',
      trend: null, // Không hiển thị trend cho Snapshot (VI: No trend for snapshot)
      path: ROUTES.ADMIN_RESTAURANTS_PENDING,
    },
    {
      id: 'users',
      title: t('admin.dashboard.stats.total_users'),
      value: stats?.newUsers || 0,
      icon: 'group',
      color: 'text-violet-600 bg-violet-600',
      trend: 8.1,
    },
    {
      id: 'success',
      title: t('admin.dashboard.stats.success_rate'),
      value: `${stats?.totalBookings ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%`,
      icon: 'verified',
      color: 'text-blue-600 bg-blue-600',
      trend: 1.4,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <MetricCard key={card.id} {...card} loading={loading} />
      ))}
    </div>
  );
};

export default StatsCards;
