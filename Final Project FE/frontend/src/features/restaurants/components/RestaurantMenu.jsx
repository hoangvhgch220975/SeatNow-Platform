import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurantMenu } from '../hooks.js';
import MenuItemModal from './MenuItemModal.jsx';

/**
 * Cấu hình ảnh placeholder chất lượng cao theo danh mục (Source: Unsplash) (Vietnamese comment)
 */
const CATEGORY_PLACEHOLDERS = {
  'Appetizers': 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=600&auto=format&fit=crop',
  'Main Course': 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
  'Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=600&auto=format&fit=crop',
  'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=600&auto=format&fit=crop',
  'Drinks': 'https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=600&auto=format&fit=crop',
  'Seafood': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop',
  'Vegetarian': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop'
};

/**
 * @file RestaurantMenu.jsx
 * @description Component hiển thị đầy đủ thực đơn nhà hàng, phân chia theo danh mục. Hỗ trợ đa ngôn ngữ.
 */
const RestaurantMenu = ({ restaurantId }) => {
  const { t } = useTranslation();
  const { data: menuData, isLoading, isError } = useRestaurantMenu(restaurantId);
  const [activeCategory, setActiveCategory] = useState(t('restaurants.menu.all_categories'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // 1. Chuẩn hóa & Nhóm dữ liệu (Vietnamese comment)
  const items = menuData?.data || menuData || [];
  
  const groupedMenu = useMemo(() => {
    const allKey = t('restaurants.menu.all_categories');
    const groups = { [allKey]: items };
    items.forEach(item => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [items, t]);

  const categories = Object.keys(groupedMenu);

  // 2. Lọc theo category và search query (Vietnamese comment)
  const filteredItems = useMemo(() => {
    let result = groupedMenu[activeCategory] || [];
    if (searchQuery.trim()) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [activeCategory, groupedMenu, searchQuery]);

  if (isLoading) return (
    <div className="flex flex-col gap-6">
      <div className="h-10 w-64 bg-slate-200 rounded-full animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (isError || items.length === 0) return null;

  return (
    <div className="space-y-10 py-4">
      {/* Menu Header & Search (Vietnamese comment) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden">
        <h2 className="text-4xl font-black headline tracking-tighter text-on-surface uppercase">
          {t('restaurants.menu.title')}
        </h2>
        <div className="relative group max-w-md w-full">
          <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors text-xl">search</span>
          <input 
            type="text" 
            placeholder={t('restaurants.menu.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-4 bg-white border border-outline/10 rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/30 transition-all text-[13px] font-bold text-on-surface placeholder:text-on-surface-variant/40 placeholder:font-medium"
          />
        </div>
      </div>

      {/* Category Tabs (Vietnamese comment) */}
      <div className="flex overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide gap-3 no-scrollbar mask-edges">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500
              ${activeCategory === cat 
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                : 'bg-surface text-on-surface-variant/60 hover:text-on-surface hover:bg-white border border-outline/5 hover:border-primary/20 hover:shadow-md'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items Grid (Vietnamese comment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item._id || item.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.215, 0.610, 0.355, 1.000] // Cubic bezier cho hiệu ứng mượt mà (Vietnamese comment)
              }}
              className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden border border-outline/5 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              {/* Image Container (Vietnamese comment) */}
              <div className="relative h-56 overflow-hidden">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src={(item.images && item.images[0]) || item.image || item.imageUrl || item.img || item.imgUrl || item.photo || CATEGORY_PLACEHOLDERS[item.category] || CATEGORY_PLACEHOLDERS.Default} 
                    alt={item.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {item.discountPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-xl">
                    {t('restaurants.menu.special_offer')}
                  </div>
                )}
                {item.category && (
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-sm">
                    {item.category}
                  </div>
                )}
              </div>

              {/* Content (Vietnamese comment) */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <h3 className="font-bold text-lg text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-right">
                    {item.discountPrice ? (
                      <div className="flex flex-col items-end">
                        <span className="text-primary font-black text-lg">{item.discountPrice?.toLocaleString()} VNĐ</span>
                        <span className="text-[11px] text-on-surface-variant line-through opacity-50 font-bold">{item.price?.toLocaleString()} VNĐ</span>
                      </div>
                    ) : (
                      <span className="text-primary font-black text-lg">{item.price?.toLocaleString()} VNĐ</span>
                    )}
                  </div>
                </div>
                
                <p className="text-[13px] text-on-surface-variant/70 line-clamp-2 leading-relaxed italic font-medium mb-6">
                  {item.description || t('restaurants.menu.fallback_desc')}
                </p>

                {/* Tags (Vietnamese comment) */}
                {item.tags?.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-2 pt-5 border-t border-dotted border-outline/10">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 bg-surface px-3 py-1.5 rounded-full border border-outline/5 group-hover:border-primary/20 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State (Vietnamese comment) */}
      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-32 bg-white rounded-[3.5rem] border border-outline/5 shadow-sm"
        >
          <div className="w-24 h-24 bg-surface rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
            <span className="material-symbols-outlined text-5xl text-primary animate-bounce">search_off</span>
          </div>
          <h3 className="text-xl font-black text-on-surface mb-3 uppercase tracking-widest">
            {t('restaurants.menu.no_results')}
          </h3>
          <p className="text-[14px] text-on-surface-variant/60 font-medium max-w-md">
            We couldn't find any dishes matching your search. Please try adjusting your filters or explore our full menu.
          </p>
        </motion.div>
      )}

      {/* Menu Item Detail Popup (Vietnamese comment) */}
      <AnimatePresence>
        {selectedItem && (
          <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantMenu;
