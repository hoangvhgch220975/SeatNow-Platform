import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/shared/utils/formatCurrency';

/**
 * Menu Table Component
 * Hiển thị các món ăn dưới dạng bảng có cấu trúc chuyên nghiệp
 * 
 * @param {Array} items - Danh sách các món ăn
 * @param {boolean} isLoading - Trạng thái đang tải
 * @param {Function} onEdit - Callback khi bấm sửa
 * @param {Function} onDelete - Callback khi bấm xóa
 * @param {Function} onView - Callback khi bấm vào dòng để xem chi tiết
 */
const MenuTable = ({ items, isLoading, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 italic text-slate-400">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-slate-50 rounded-2xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-20 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-300 gap-4">
        <span className="material-symbols-outlined text-6xl">restaurant_menu</span>
        <p className="font-black uppercase tracking-widest text-xs">{t('common.no_data')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 animate-in fade-in duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('menu_mgmt.dish_name')}</th>
              <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('menu_mgmt.category')}</th>
              <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('menu_mgmt.prep_time')}</th>
              <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('menu_mgmt.price')}</th>
              <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{t('menu_mgmt.status')}</th>
              <th className="py-6 px-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item) => (
              <tr 
                key={item._id} 
                onClick={() => onView?.(item)}
                className="group hover:bg-violet-50/30 transition-colors cursor-pointer"
              >
                {/* Thông tin món ăn */}
                <td className="py-6 px-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                      <img 
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                      />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1 max-w-[200px]">{item.description}</p>
                    </div>
                  </div>
                </td>

                {/* Danh mục */}
                <td className="py-6 px-8">
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-200/50">
                    {item.category}
                  </span>
                </td>

                {/* Thời gian chuẩn bị */}
                <td className="py-6 px-8">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    <span className="text-sm font-bold text-slate-600">
                      {item.preparationTime || '--'} {t('menu_mgmt.prep_time_unit')}
                    </span>
                  </div>
                </td>

                {/* Giá tiền */}
                <td className="py-6 px-8">
                  <div className="flex flex-col">
                    {item.discountPrice && item.discountPrice < item.price ? (
                      <>
                        <span className="text-sm font-black text-violet-700">{formatCurrency(item.discountPrice)}</span>
                        <span className="text-[10px] font-bold text-slate-300 line-through tracking-tighter">{formatCurrency(item.price)}</span>
                      </>
                    ) : (
                      <span className="text-sm font-black text-slate-700">{formatCurrency(item.price)}</span>
                    )}
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="py-6 px-8">
                  <div className="flex justify-center">
                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                      item.isAvailable 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.isAvailable ? t('menu_mgmt.active') : t('menu_mgmt.inactive')}
                    </span>
                  </div>
                </td>

                {/* Các thao tác */}
                <td className="py-6 px-10 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item);
                      }}
                      className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-violet-700 hover:text-white transition-all shadow-sm border border-slate-100 group/btn"
                      title={t('common.edit')}
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                      }}
                      className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100 group/btn"
                      title={t('common.delete')}
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuTable;
