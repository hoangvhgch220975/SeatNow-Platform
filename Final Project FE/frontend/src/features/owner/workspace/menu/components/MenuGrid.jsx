import React from 'react';
import MenuItemCard from './MenuItemCard';
import { useTranslation } from 'react-i18next';

/**
 * Menu Grid Component
 * Hiển thị danh sách MenuItemCards hoặc các trạng thái trống/đang tải
 * 
 * @param {Array} items - Danh sách món ăn cần hiển thị
 * @param {Function} onEdit - Callback khi sửa món
 * @param {Function} onDelete - Callback khi xóa món
 * @param {Function} onView - Callback khi xem chi tiết món
 * @param {boolean} isLoading - Trạng thái đang tải
 */
const MenuGrid = ({ items, onEdit, onDelete, onView, isLoading }) => {
  const { t } = useTranslation();

  // Skeleton khi đang tải
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-zinc-50 rounded-[2.5rem] h-[520px] animate-pulse border border-zinc-100" />
        ))}
      </div>
    );
  }

  // Trạng thái trống
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-40 h-40 bg-zinc-50 rounded-full flex items-center justify-center mb-10 shadow-inner">
          <span className="material-symbols-outlined text-6xl text-zinc-200">restaurant_menu</span>
        </div>
        <h3 className="text-3xl font-black text-zinc-900 mb-4">{t('restaurants.menu.no_results')}</h3>
        <p className="text-zinc-500 font-medium max-w-sm mx-auto leading-relaxed">
          {t('owner_portal.empty_state.description')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 pb-24">
      {items.map((item, index) => (
        <div 
          key={item._id || index} 
          style={{ animationDelay: `${index * 100}ms` }}
          className="animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both"
        >
          <MenuItemCard 
            item={item} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onView={onView}
          />
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
