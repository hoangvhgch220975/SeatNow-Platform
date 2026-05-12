import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file DashboardFilter.jsx
 * @description Bộ lọc thời gian cho Admin Dashboard (Ngày, Tuần, Tháng, Quý, Năm).
 * Sử dụng phong cách Glassmorphism và chuyển đổi linh hoạt.
 */
const DashboardFilter = ({ currentPeriod, onPeriodChange }) => {
  const { t } = useTranslation();

  // Danh sách các chu kỳ thời gian hỗ trợ (VI: Supported periods)
  const periods = [
    { id: 'day', label: t('admin.dashboard.filter.day') },
    { id: 'week', label: t('admin.dashboard.filter.week') },
    { id: 'month', label: t('admin.dashboard.filter.month') },
    { id: 'quarter', label: t('admin.dashboard.filter.quarter') },
    { id: 'year', label: t('admin.dashboard.filter.year') },
  ];

  return (
    <div className="flex bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/50">
      {periods.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`
            px-4 py-1.5 text-xs font-black transition-all duration-300 rounded-lg
            ${currentPeriod === period.id 
              ? 'bg-white text-violet-600 shadow-sm ring-1 ring-slate-200' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}
          `}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardFilter;
