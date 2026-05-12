import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import RestaurantCard from './RestaurantCard';
import VenueTable from './VenueTable';

/**
 * @file VenueList.jsx
 * @description Hiển thị danh sách nhà hàng với hai chế độ: Grid hoặc Table.
 * Hỗ trợ đa ngôn ngữ và các hiệu ứng chuyển cảnh.
 */
const VenueList = ({ restaurants, isLoading, viewMode }) => {
  const { t } = useTranslation();

  if (isLoading) {
    // Trạng thái đang tải (Skeleton Loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-[2.5rem] h-[450px] animate-pulse border border-slate-100/50 flex flex-col">
            <div className="h-56 bg-slate-100 rounded-t-[2.5rem]" />
            <div className="p-8 space-y-4">
              <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
              <div className="h-8 w-2/3 bg-slate-100 rounded-lg" />
              <div className="h-20 w-full bg-slate-100 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    // Trạng thái không có kết quả (No Results Found)
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[40vh] bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200 p-12 text-center"
      >
        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-6">
           <span className="material-symbols-outlined text-4xl">search_off</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{t('owner_portal.venues_page.no_results_found')}</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">
           {t('owner_portal.venues_page.no_results_desc')}
        </p>
      </motion.div>
    );
  }

  // Chế độ hiển thị Bảng
  if (viewMode === 'table') {
    return <VenueTable restaurants={restaurants} />;
  }

  // Chế độ hiển thị Lưới (Mặc định)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default VenueList;
