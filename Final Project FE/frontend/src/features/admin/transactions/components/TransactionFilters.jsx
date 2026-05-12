import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Store, Tag, ShieldCheck, Calendar } from 'lucide-react';
import { useAdminRestaurantsList } from '../../bookings/hooks';

/**
 * @file TransactionFilters.jsx
 * @description Hệ thống lọc nâng cao cho quản lý Giao dịch Admin.
 */
const TransactionFilters = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  
  // Tái sử dụng hook để lấy danh sách nhà hàng
  const { data: restaurantsData, isLoading: isRestaurantsLoading } = useAdminRestaurantsList();
  const restaurants = restaurantsData?.data || [];

  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const types = [
    { value: '', label: t('admin.transactions.filters.type_all') },
    { value: 'DEPOSIT_PAYMENT', label: t('admin.transactions.filters.type_deposit') },
    { value: 'TOP_UP', label: t('admin.transactions.filters.type_topup') },
    { value: 'COMMISSION', label: t('admin.transactions.filters.type_commission') },
    { value: 'WITHDRAWAL', label: t('admin.transactions.filters.type_withdrawal') },
    { value: 'REFUND', label: t('admin.transactions.filters.type_refund') },
    { value: 'SETTLEMENT', label: t('admin.transactions.filters.type_settlement') },
  ];

  const statuses = [
    { value: '', label: t('admin.transactions.filters.status_all') },
    { value: 'PENDING', label: t('admin.bookings.filters.status_pending') },
    { value: 'COMPLETED', label: t('admin.bookings.filters.status_completed') },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: t('admin.bookings.filters.status_cancelled') },
  ];

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4 animate-in fade-in duration-700">
      {/* Lọc theo Nhà hàng */}
      <div className="relative flex-1 max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
          <Store size={18} />
        </div>
        <select 
          value={filters.restaurantId || ''}
          onChange={(e) => handleInputChange('restaurantId', e.target.value)}
          disabled={isRestaurantsLoading}
          className="block w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer disabled:opacity-50"
        >
          <option value="">{t('admin.transactions.filters.restaurant_all')}</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Lọc theo Khoảng thời gian */}
      <div className="flex items-center gap-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Calendar size={14} />
          </div>
          <input 
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleInputChange('dateFrom', e.target.value)}
            className="block pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer"
            placeholder={t('admin.transactions.filters.date_from')}
          />
        </div>
        <span className="text-slate-300 font-bold">→</span>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Calendar size={14} />
          </div>
          <input 
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleInputChange('dateTo', e.target.value)}
            className="block pl-9 pr-3 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer"
            placeholder={t('admin.transactions.filters.date_to')}
          />
        </div>
      </div>

      {/* Lọc chọn Loại & Trạng thái */}
      <div className="flex items-center gap-3">
        <div className="relative group min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Tag size={16} />
          </div>
          <select 
            value={filters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer"
          >
            {types.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="relative group min-w-[160px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <ShieldCheck size={16} />
          </div>
          <select 
            value={filters.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="block w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
