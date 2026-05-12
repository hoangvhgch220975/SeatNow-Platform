import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file BookingStats.jsx
 * @description Hiển thị 3 thẻ KPI thống kê đặt bàn tổng quát.
 * Dữ liệu được lấy trực tiếp từ trường 'summary' trong phản hồi của API danh sách booking.
 */

// Cấu hình các thẻ thống kê (Vietnamese comment)
const STAT_CONFIGS = [
  {
    key: 'total_bookings',
    icon: 'calendar_month',
    gradient: 'from-violet-600 to-purple-700',
    lightBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    getValue: (summary) => summary?.total ?? 0,
  },
  {
    key: 'completed',
    icon: 'check_circle',
    gradient: 'from-emerald-500 to-green-600',
    lightBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    getValue: (summary) => summary?.completed ?? 0,
  },
  {
    key: 'cancelled',
    icon: 'cancel',
    gradient: 'from-rose-500 to-red-600',
    lightBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    getValue: (summary) => summary?.cancelled ?? 0,
  },
];

const BookingStatCard = ({ config, value, isLoading, selectedDate }) => {
  const { t } = useTranslation();

  // Định dạng ngày hiển thị (Vietnamese comment)
  const dateLabel = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(t('i18next_code'), {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Đường kẻ màu phía trên thẻ */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${config.gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between">
          {/* Biểu tượng đại diện */}
          <div className={`w-12 h-12 rounded-2xl ${config.lightBg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <span className={`material-symbols-outlined text-2xl ${config.iconColor}`}>
              {config.icon}
            </span>
          </div>

          {/* Giá trị số lượng */}
          <div className="text-right">
            {isLoading ? (
              <div className="h-9 w-16 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <p className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">
                {value.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
            {t(`owner_bookings.stats.${config.key}`)}
          </p>
          {/* Hiển thị phạm vi thời gian đang áp dụng */}
          <p className="text-[11px] font-medium text-slate-400 mt-1">
            {dateLabel 
              ? t('owner_bookings.stats.for_date', { date: dateLabel })
              : t('owner_bookings.stats.all_time')}
          </p>
        </div>
      </div>

      {/* Hiệu ứng ánh sáng khi di chuột qua */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
    </div>
  );
};

const BookingStats = ({ summary, isLoading, selectedDate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {STAT_CONFIGS.map((config) => (
        <BookingStatCard
          key={config.key}
          config={config}
          value={config.getValue(summary)}
          isLoading={isLoading}
          selectedDate={selectedDate}
        />
      ))}
    </div>
  );
};

export default BookingStats;
