import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ExternalLink, ShieldCheck, ShieldAlert, Lock, Unlock, Edit3, Eye
} from 'lucide-react';
import AdminStatusBadge from '../../components/AdminStatusBadge';
import { formatDate } from '../../../../shared/utils/formatDateTime';
import restaurantPlaceholder from '../../../../assets/placeholder/restaurant_placeholder.png';

/**
 * @file RestaurantTable.jsx
 * @description Bảng hiển thị danh sách nhà hàng dùng cho Admin.
 */
const RestaurantTable = ({ restaurants = [], loading, onAction, onViewDetail }) => {
  const { t } = useTranslation();

  const parseCuisine = (cuisineData) => {
    if (!cuisineData) return t('admin.restaurants.table.cuisine_default');
    try {
      const parsed = typeof cuisineData === 'string' ? JSON.parse(cuisineData) : cuisineData;
      return Array.isArray(parsed) ? parsed.join(', ') : parsed;
    } catch (e) {
      return cuisineData;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
        <div className="h-12 bg-slate-50 border-b border-slate-200" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 border-b border-slate-100 last:border-0" />
        ))}
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-20 text-center shadow-sm">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="text-slate-300" size={40} />
        </div>
        <h3 className="text-slate-800 font-bold mb-1">{t('admin.restaurants.empty')}</h3>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          {t('admin.restaurants.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-200">
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('admin.restaurants.table.restaurant')}
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('admin.restaurants.table.owner')}
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('admin.restaurants.table.status')}
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t('admin.restaurants.table.registered')}
            </th>
            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
              {t('admin.restaurants.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {restaurants.map((res) => (
            <tr 
              key={res.id} 
              className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
              onClick={() => onViewDetail && onViewDetail(res)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-xs">
                    <img 
                      src={res.coverImage || (res.images && res.images[0]) || restaurantPlaceholder} 
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = restaurantPlaceholder;
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      {res.name}
                      <ExternalLink size={12} className="text-slate-300 group-hover:text-primary transition-colors cursor-pointer" />
                    </div>
                    <div className="text-xs text-slate-500">{parseCuisine(res.cuisineTypeJson)}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-700">
                  {res.ownerName || res.owner_name || res.OwnerName || t('admin.restaurants.table.owner_default')}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {res.ownerEmail || res.owner_email || res.OwnerEmail || 'no-email@seatnow.vn'}
                </div>
              </td>
              <td className="px-6 py-4">
                <AdminStatusBadge status={res.status} />
              </td>
              <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                {formatDate(res.createdAt)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                  {res.status?.toLowerCase() === 'pending' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAction('approve', res); }}
                      className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold rounded-lg transition-all shadow-sm shadow-primary/20 flex items-center gap-1.5"
                    >
                      <ShieldCheck size={14} />
                      {t('admin.restaurants.actions.approve')}
                    </button>
                  )}
                  {res.status?.toLowerCase() === 'active' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAction('suspend', res); }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title={t('admin.restaurants.actions.suspend')}
                    >
                      <Lock size={18} />
                    </button>
                  )}
                  {res.status?.toLowerCase() === 'suspended' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onAction('activate', res); }}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                      title={t('admin.restaurants.actions.activate')}
                    >
                      <Unlock size={18} />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAction('edit', res); }}
                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                    title={t('common.edit') || 'Chỉnh sửa'}
                  >
                    <Edit3 size={18} />
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); onViewDetail && onViewDetail(res); }}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title={t('common.view_detail') || 'Xem chi tiết'}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantTable;
