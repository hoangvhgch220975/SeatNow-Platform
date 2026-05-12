import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import MenuItemModal from './MenuItemModal.jsx';

const CATEGORY_PLACEHOLDERS = {
  'Appetizers': 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=600&auto=format&fit=crop',
  'Main Course': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop'
};

/**
 * @file RestaurantMenuPreview.jsx
 * @description Hiển thị danh sách các món ăn tiêu biểu cao cấp.
 */
const RestaurantMenuPreview = ({ menuItems, onViewFullMenu }) => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState(null);

  const displayItems = menuItems?.slice(0, 4) || [];
  const hasMore = menuItems?.length > 4;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold tracking-tight text-on-surface headline">
            {t('restaurants.menu.preview_title')}
          </h2>
          <p className="text-lg text-on-surface-variant/60 font-medium">
            <Trans i18nKey="restaurants.menu.preview_desc">
              A glimpse into our chef's finest creations. <span className="text-primary italic">Click any dish to explore.</span>
            </Trans>
          </p>
        </div>
        {hasMore && (
          <motion.button
            whileHover={{ x: 5 }}
            onClick={onViewFullMenu}
            className="flex items-center gap-3 text-primary font-bold text-xs uppercase tracking-[0.2em] hover:text-primary/80 transition-all border-b-2 border-primary/10 pb-2"
          >
            {t('restaurants.menu.view_full')}
            <span className="material-symbols-outlined text-[18px]">arrow_right_alt</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {displayItems.map((item, index) => (
          <motion.div
            key={item._id || item.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex gap-8 bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border border-outline/5 hover:border-primary/20 cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative w-32 h-32 rounded-[1.8rem] overflow-hidden flex-shrink-0 shadow-lg border-2 border-white">
              {item.discountPrice && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase z-10 shadow-lg">
                  {t('restaurants.menu.offer_badge')}
                </div>
              )}
              <img
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                src={(item.images && item.images[0]) || item.image || item.imageUrl || item.img || item.imgUrl || item.photo || CATEGORY_PLACEHOLDERS[item.category] || CATEGORY_PLACEHOLDERS.Default}
                alt={item.name}
              />
            </div>

            <div className="flex-1 flex flex-col justify-center gap-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-xl text-on-surface line-clamp-1 group-hover:text-primary transition-colors tracking-tight">{item.name}</h3>
              </div>
              <p className="text-[13px] text-on-surface-variant/50 line-clamp-2 leading-relaxed font-medium">
                {item.description || t('restaurants.menu.fallback_desc')}
              </p>
              <div className="mt-2 flex items-center justify-between">
                 <span className="text-primary font-bold tracking-tighter">{(item.discountPrice || item.price)?.toLocaleString()} VNĐ</span>
                 <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px] text-primary">add</span>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenuPreview;
