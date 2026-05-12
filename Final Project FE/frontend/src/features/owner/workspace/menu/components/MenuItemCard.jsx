import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/shared/utils/formatCurrency';

/**
 * Menu Item Card Component
 * Hiển thị một món ăn đơn lẻ với hình ảnh, giá cả, trạng thái và các hành động
 * 
 * @param {object} item - Dữ liệu món ăn
 * @param {Function} onEdit - Callback khi bấm sửa
 * @param {Function} onDelete - Callback khi bấm xóa
 * @param {Function} onView - Callback khi bấm vào thẻ để xem chi tiết
 */
const MenuItemCard = ({ item, onEdit, onDelete, onView }) => {
  const { t } = useTranslation();

  const isAvailable = item.isAvailable;
  
  // Lấy ảnh đầu tiên hoặc ảnh mặc định từ Unsplash nếu không có ảnh
  const imageUrl = item.images && item.images.length > 0 
    ? item.images[0] 
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

  return (
    <div 
      onClick={() => onView?.(item)}
      className={`
        group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col border border-slate-100/50 cursor-pointer
        ${!isAvailable ? 'opacity-85 grayscale-[0.3]' : ''}
    `}>
      {/* Lớp phủ đa phương tiện */}
      <div className="h-72 relative overflow-hidden">
        <img 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          src={imageUrl} 
          alt={item.name}
        />
        
        {/* Badge trạng thái */}
        <div className={`
          absolute top-6 left-6 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase backdrop-blur-md shadow-lg border border-white/20
          ${isAvailable 
            ? 'bg-emerald-500/80 text-white' 
            : 'bg-rose-500/80 text-white'}
        `}>
          {isAvailable ? t('menu_mgmt.active') : t('menu_mgmt.inactive')}
        </div>

        {/* Lớp phủ hành động */}
        <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-violet-700 hover:text-white transition-all shadow-xl active:scale-90"
            title={t('menu_mgmt.edit_dish')}
          >
            <span className="material-symbols-outlined text-xl">edit</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id);
            }}
            className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-90"
            title={t('common.delete')}
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="p-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-5">
          <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-violet-700 transition-colors">
            {item.name}
          </h3>
          <div className="flex flex-col items-end">
            {item.discountPrice && item.discountPrice < item.price ? (
              <>
                <span className="text-xl font-black text-violet-700">
                  {formatCurrency(item.discountPrice)}
                </span>
                <span className="text-xs font-bold text-slate-300 line-through tracking-tighter">
                  {formatCurrency(item.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-violet-700">
                {formatCurrency(item.price)}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-base text-slate-500 line-clamp-2 mb-8 font-medium leading-relaxed">
          {item.description || t('restaurants.menu.fallback_desc')}
        </p>

        {/* Thông tin bổ sung (Meta) */}
        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Danh mục */}
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 rounded-2xl text-slate-400 font-black text-[9px] uppercase tracking-widest">
              <span className="material-symbols-outlined text-sm">restaurant</span>
              <span>{item.category}</span>
            </div>

            {/* Thời gian chuẩn bị */}
            {item.preparationTime && (
              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">schedule</span>
                <span>{item.preparationTime} {t('menu_mgmt.prep_time_unit')}</span>
              </div>
            )}
          </div>
          
          {/* Nhãn khuyến mãi (nếu có) */}
          {item.discountPrice && item.discountPrice < item.price && (
            <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <span className="material-symbols-outlined text-sm">local_offer</span>
              <span>OFFER</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
