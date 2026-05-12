import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file BookingFilters.jsx
 * @description Bộ lọc nâng cao cho danh sách đặt bàn.
 * Cho phép lọc theo ngày cụ thể hoặc trạng thái đơn hàng.
 */

// Danh sách trạng thái tab filter (Vietnamese comment)
const STATUS_TABS = [
  { key: 'ALL', labelKey: 'filters.status_all' },
  { key: 'PENDING', labelKey: 'filters.status_pending' },
  { key: 'CONFIRMED', labelKey: 'filters.status_confirmed' },
  { key: 'ARRIVED', labelKey: 'filters.status_arrived' },
  { key: 'COMPLETED', labelKey: 'filters.status_completed' },
  { key: 'CANCELLED', labelKey: 'filters.status_cancelled' },
  { key: 'NO_SHOW', labelKey: 'filters.status_no_show' },
];

// Định nghĩa bảng màu cho các tab trạng thái (Vietnamese comment)
const STATUS_COLORS = {
  ALL: 'bg-slate-100 text-slate-600 border-slate-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ARRIVED: 'bg-purple-50 text-purple-700 border-purple-200',
  COMPLETED: 'bg-blue-50 text-blue-700 border-blue-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  NO_SHOW: 'bg-slate-100 text-slate-600 border-slate-300',
};

const STATUS_ACTIVE = {
  ALL: 'bg-slate-800 text-white border-slate-800',
  PENDING: 'bg-amber-500 text-white border-amber-500',
  CONFIRMED: 'bg-emerald-500 text-white border-emerald-500',
  ARRIVED: 'bg-purple-600 text-white border-purple-600',
  COMPLETED: 'bg-blue-600 text-white border-blue-600',
  CANCELLED: 'bg-rose-500 text-white border-rose-500',
  NO_SHOW: 'bg-slate-500 text-white border-slate-500',
};

const BookingFilters = ({ selectedDate, onDateChange, selectedStatus, onStatusChange }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
        {/* Bộ chọn Ngày (Date Selection) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 text-slate-400">
            <span className="material-symbols-outlined text-xl">calendar_today</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {t('owner_bookings.filters.date_label')}
            </span>
          </div>
          <div className="relative group">
            <input
              id="booking-date-filter"
              type="date"
              value={selectedDate || ''}
              onChange={(e) => onDateChange(e.target.value)}
              className="px-4 py-2.5 text-sm font-black text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl 
                         focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer 
                         hover:bg-slate-100 group-hover:border-primary/30"
            />
            {/* Nút Xóa Ngày (Clear Date) - Để quay về chế độ Load All */}
            {selectedDate && (
              <button
                onClick={() => onDateChange(null)}
                className="absolute -right-2 -top-2 w-6 h-6 bg-white border border-slate-100 rounded-full 
                           flex items-center justify-center text-slate-400 hover:text-red-500 
                           shadow-sm transition-all hover:scale-110 active:scale-90"
                title={t('owner_bookings.filters.clear_filter')}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Thông báo trạng thái lọc */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl h-fit">
          <span className="material-symbols-outlined text-sm text-slate-400">filter_alt</span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {selectedDate ? t('owner_bookings.stats.for_date', { date: selectedDate }) : t('owner_bookings.stats.all_time')}
          </span>
        </div>
      </div>

      {/* Danh sách các tab trạng thái (Status Filter Tabs) */}
      <div className="mt-6 flex flex-wrap gap-2.5">
        {STATUS_TABS.map((tab) => {
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              id={`status-tab-${tab.key.toLowerCase()}`}
              onClick={() => onStatusChange(tab.key)}
              className={`
                px-5 py-2.5 text-[10px] font-black rounded-2xl border transition-all duration-300
                uppercase tracking-widest leading-none
                ${isActive ? STATUS_ACTIVE[tab.key] : STATUS_COLORS[tab.key]}
                ${isActive ? 'shadow-lg shadow-slate-200' : 'hover:border-slate-300 hover:bg-slate-50'}
              `}
            >
              {t(`owner_bookings.${tab.labelKey}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingFilters;
