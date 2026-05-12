import React from 'react';
import { useTranslation } from 'react-i18next';
import { Filter, Store } from 'lucide-react';
import { useAdminRestaurantsList } from '../hooks';

/**
 * @file BookingFilters.jsx
 * @description Refactored filters for Admin Booking Management (Restaurant dropdown & Status)
 */
const BookingFilters = ({ filters, onFilterChange }) => {
  const { t } = useTranslation();
  
  // Fetch restaurants for dropdown
  const { data: restaurantsData, isLoading: isRestaurantsLoading } = useAdminRestaurantsList();
  const restaurants = restaurantsData?.data || [];

  const statuses = [
    { value: '', label: t('admin.bookings.filters.status_all') },
    { value: 'PENDING', label: t('admin.bookings.filters.status_pending') },
    { value: 'CONFIRMED', label: t('admin.bookings.filters.status_confirmed') },
    { value: 'ARRIVED', label: t('admin.bookings.filters.status_arrived') },
    { value: 'COMPLETED', label: t('admin.bookings.filters.status_completed') },
    { value: 'CANCELLED', label: t('admin.bookings.filters.status_cancelled') },
    { value: 'NO_SHOW', label: t('admin.bookings.filters.status_no_show') }
  ];

  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
      {/* Restaurant Dropdown */}
      <div className="relative flex-1 max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
          <Store size={18} />
        </div>
        <select 
          value={filters.restaurantId || ''}
          onChange={(e) => handleInputChange('restaurantId', e.target.value)}
          disabled={isRestaurantsLoading}
          className="block w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer disabled:opacity-50"
        >
          <option value="">{t('admin.bookings.filters.restaurant_all')}</option>
          {restaurants.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
          <Filter size={14} />
        </div>
      </div>

      {/* Status Filter */}
      <div className="relative group min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Filter size={16} />
        </div>
        <select 
          value={filters.status || ''}
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="block w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm appearance-none cursor-pointer"
        >
          {statuses.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BookingFilters;
