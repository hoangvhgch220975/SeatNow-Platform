import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Áp dụng hook ngôn ngữ (Vietnamese comment)

/**
 * @file VenueFilters.jsx
 * @description Bộ lọc cho danh sách nhà hàng: Tìm kiếm và Trạng thái.
 */
const VenueFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  activeStatus, 
  setActiveStatus,
  counts = {},
  viewMode,
  setViewMode
}) => {
  const { t } = useTranslation(); // Khởi tạo i18n (Vietnamese comment)

  const statuses = [
    { id: 'all', label: t('owner_portal.filters.status_all'), icon: 'apps' },
    { id: 'active', label: t('owner_portal.filters.status_active'), icon: 'check_circle', color: 'text-emerald-500' },
    { id: 'pending', label: t('owner_portal.filters.status_pending'), icon: 'hourglass_empty', color: 'text-amber-500' },
    { id: 'suspended', label: t('owner_portal.filters.status_suspended'), icon: 'block', color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-8 mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Thanh tìm kiếm (Search Bar) */}
        <div className="relative flex-1 max-w-xl group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder={t('owner_portal.filters.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 py-4 pl-14 pr-6 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all shadow-sm"
          />
        </div>

        {/* Chuyển đổi chế độ hiển thị (View Mode Toggle) */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setViewMode('grid')}
             className={`p-2.5 rounded-xl transition-all ${
               viewMode === 'grid' 
                 ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' 
                 : 'text-slate-400 hover:text-slate-600'
             }`}
           >
              <span className="material-symbols-outlined text-xl">grid_view</span>
           </button>
           <button 
             onClick={() => setViewMode('table')}
             className={`p-2.5 rounded-xl transition-all ${
               viewMode === 'table' 
                 ? 'bg-white shadow-sm text-slate-900 border border-slate-200/50' 
                 : 'text-slate-400 hover:text-slate-600'
             }`}
           >
              <span className="material-symbols-outlined text-xl">view_list</span>
           </button>
        </div>
      </div>

      {/* Các tab trạng thái (Status Tabs) */}
      <div className="flex flex-wrap items-center gap-3">
        {statuses.map((status) => {
          const isActive = activeStatus === status.id;
          const count = counts[status.id] || 0;

          return (
            <button
              key={status.id}
              onClick={() => setActiveStatus(status.id)}
              className={`relative px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-300 border ${
                isActive 
                  ? 'bg-violet-600 text-white border-violet-600 shadow-xl shadow-violet-200 scale-105' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${!isActive && status.color}`}>
                {status.icon}
              </span>
              <span>{status.label}</span>
              
              {count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[9px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {count}
                </span>
              )}

              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-2xl bg-violet-500/10 -z-10 blur-xl"
                  initial={false}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VenueFilters;
