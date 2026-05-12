import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Clock, ShieldCheck, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime } from '../../../../shared/utils/formatDateTime';
import AdminEmptyState from '../../components/AdminEmptyState';
import restaurantPlaceholder from '../../../../assets/placeholder/restaurant_placeholder.png';

/**
 * @file PendingRestaurantTable.jsx
 * @description Bảng chuyên biệt cho danh sách nhà hàng đang chờ duyệt.
 */
const PendingRestaurantTable = ({ 
  restaurants = [], 
  loading, 
  onApprove, 
  onReject,
  pagination = {},
  onPageChange
}) => {
  const { t } = useTranslation();
  const { page = 1, total = 0, limit = 5 } = pagination ?? {};
  const totalPages = Math.ceil(total / limit);

  const parseCuisine = (cuisineData) => {
    if (!cuisineData) return t('admin.restaurants.table.cuisine_default');
    try {
      const parsed = typeof cuisineData === 'string' ? JSON.parse(cuisineData) : cuisineData;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]; // Lấy cái đầu tiên theo yêu cầu
      }
      return parsed;
    } catch (e) {
      return cuisineData;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm" />
          ))}
        </div>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <AdminEmptyState 
        icon={Clock}
        title={t('admin.restaurants.empty_pending')}
        subtitle={t('admin.restaurants.subtitle')}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((res) => (
          <div 
            key={res.id} 
            className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all group relative overflow-hidden flex flex-col"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-50 group-hover:bg-violet-50 transition-colors" />

            {/* Header Info */}
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-xs">
                <img 
                  src={res.coverImage || (res.images && res.images[0]) || restaurantPlaceholder} 
                  alt={res.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = restaurantPlaceholder;
                  }}
                />
              </div>
              <div className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-100 shadow-xs">
                {t('admin.restaurants.filters.pending')}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-black text-slate-800 text-lg mb-1 group-hover:text-violet-600 transition-colors uppercase tracking-tight break-words">
                {res.name}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                <Clock size={12} />
                {t('admin.restaurants.table.registered')}: {formatDateTime(res.createdAt)}
              </div>
              <div className="text-[10px] text-violet-500 font-black uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded-md inline-block">
                {parseCuisine(res.cuisineTypeJson)}
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="flex-grow space-y-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-violet-50/30 transition-colors">
              <div className="flex items-center gap-3 text-slate-600 group/item">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-violet-500 transition-colors shadow-sm">
                  <Mail size={14} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t('admin.restaurants.table.owner')}</span>
                  <span className="text-xs font-bold truncate">
                    {res.ownerEmail || res.owner_email || res.OwnerEmail || res.owner?.email || 'contact@partner.vn'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 group/item">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-violet-500 transition-colors shadow-sm">
                  <Phone size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{t('common.phone')}</span>
                  <span className="text-xs font-bold">
                    {res.ownerPhone || res.owner_phone || res.OwnerPhone || res.owner?.phone || '090-XXX-XXXX'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button
                onClick={() => onReject(res)}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-transparent hover:border-rose-100"
              >
                <XCircle size={16} />
                {t('common.cancel')}
              </button>
              <button
                onClick={() => onApprove(res)}
                className="flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 active:scale-95"
              >
                <ShieldCheck size={16} />
                {t('admin.restaurants.actions.approve')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {total > limit && (
        <div className="px-6 py-8 bg-slate-50/50 border border-slate-100 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('common.showing')} <span className="text-slate-700">{restaurants.length}</span> {t('common.of')} <span className="text-slate-700">{total}</span> {t('admin.audit.tabs.venues')}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${
                    page === i + 1 
                      ? 'bg-violet-600 text-white shadow-xl shadow-violet-200' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300 hover:text-slate-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRestaurantTable;
