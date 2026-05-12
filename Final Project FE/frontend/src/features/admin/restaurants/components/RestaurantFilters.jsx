import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../../../../shared/hooks/useDebounce';
import { Search, RotateCcw, Filter } from 'lucide-react';

/**
 * @file RestaurantFilters.jsx
 * @description Bộ lọc cho trang danh sách nhà hàng Admin.
 * Hỗ trợ tìm kiếm tên và lọc theo trạng thái.
 */
const RestaurantFilters = ({ onFilterChange, initialFilters = {} }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialFilters.q || '');
  const [status, setStatus] = useState(initialFilters.status || 'all');
  
  const debouncedSearch = useDebounce(search, 400);

  // Cập nhật lên component cha khi search text thay đổi (debounced)
  useEffect(() => {
    onFilterChange({ q: debouncedSearch, status });
  }, [debouncedSearch]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    onFilterChange({ q: debouncedSearch, status: newStatus });
  };

  const statusTabs = [
    { id: 'all', label: t('admin.restaurants.filters.all') },
    { id: 'active', label: t('admin.restaurants.filters.active') },
    { id: 'pending', label: t('admin.restaurants.filters.pending') },
    { id: 'suspended', label: t('admin.restaurants.filters.suspended') },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('admin.restaurants.filters.search_placeholder')}
          className="block w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleStatusChange(tab.id)}
            className={`
              px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap
              ${status === tab.id 
                ? 'bg-white text-violet-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}
            `}
          >
            {tab.label}
          </button>
        ))}
        
        <div className="mx-2 w-px h-6 bg-slate-200" />
        
        <button 
          onClick={() => {
            setSearch('');
            handleStatusChange('all');
          }}
          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
          title="Reset filters"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

export default RestaurantFilters;
