import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CUISINES } from '../../../constants/cuisines';
import { PRICE_RANGES } from '../../../constants/priceRanges';

/**
 * @file RestaurantFilters.jsx 
 * @description Bộ lọc Sidebar cao cấp (Location, Cuisine, Price, Sort). Hỗ trợ đa ngôn ngữ.
 */
const RestaurantFilters = ({ currentFilters, onChange }) => {
  const { t } = useTranslation();

  const mainCuisines = CUISINES.slice(0, 7);

  const handleCuisineChange = (cuisineValue) => {
    const newValue = currentFilters.cuisine === cuisineValue ? '' : cuisineValue;
    onChange({ cuisine: newValue });
  };

  return (
    <aside className="space-y-12 w-full">
      {/* 1. Location Selection */}
      <div className="space-y-6">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t('restaurants.filters.location_label')}
        </label>
        <div className="relative group">
          <select 
            value={currentFilters.location || t('restaurants.filters.all_locations')}
            onChange={(e) => onChange({ location: e.target.value === t('restaurants.filters.all_locations') ? '' : e.target.value })}
            className="w-full bg-surface border border-outline/5 rounded-2xl px-6 py-4 text-on-surface focus:border-primary/40 appearance-none font-bold text-sm outline-none shadow-sm transition-all hover:bg-white hover:shadow-xl hover:shadow-black/5"
          >
            <option>{t('restaurants.filters.all_locations')}</option>
            <option>Ha Noi</option>
            <option>Ho Chi Minh City</option>
            <option>Da Nang</option>
            <option>Hai Phong</option>
            <option>Can Tho</option>
            <option>Quang Ninh</option>
            <option>Da Lat</option>
            <option>Nha Trang</option>
            <option>Vung Tau</option>
          </select>
          <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant/30 group-hover:text-primary transition-colors">expand_more</span>
        </div>
      </div>

      {/* 2. Cuisine Choice */}
      <div className="space-y-6">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t('restaurants.filters.cuisine_label')}
        </label>
        <div className="space-y-3">
          {mainCuisines.map((item) => (
            <label key={item.value} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <input 
                  className="peer appearance-none w-6 h-6 rounded-lg border border-outline/10 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                  type="checkbox"
                  checked={currentFilters.cuisine === item.value}
                  onChange={() => handleCuisineChange(item.value)}
                />
                <span className="material-symbols-outlined absolute text-white text-sm scale-0 peer-checked:scale-100 transition-transform pointer-events-none">check</span>
              </div>
              <span className="ml-4 text-[13px] font-bold text-on-surface-variant/60 group-hover:text-primary transition-colors tracking-tight">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Price Range */}
      <div className="space-y-6">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t('restaurants.filters.price_label')}
        </label>
        <div className="flex gap-3">
          {PRICE_RANGES.map((p) => (
            <motion.button 
              key={p.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange({ priceRange: currentFilters.priceRange === p.value ? null : p.value })}
              className={`flex-1 py-3 rounded-2xl font-bold transition-all border text-xs tracking-widest ${
                currentFilters.priceRange === p.value 
                  ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' 
                  : 'bg-white border-outline/5 hover:border-primary/20 text-on-surface-variant/40'
              }`}
            >
              {'$'.repeat(p.value)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 4. Sorting Options */}
      <div className="space-y-6">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          {t('restaurants.filters.sort_label')}
        </label>
        <div className="space-y-3">
          {[
            { label: t('restaurants.filters.sort_highest'), val: 'rating', icon: 'stars' },
            { label: t('restaurants.filters.sort_newest'), val: 'newest', icon: 'auto_awesome' },
            { label: t('restaurants.filters.sort_distance'), val: 'distance', icon: 'near_me' }
          ].map((item) => (
            <button 
              key={item.val} 
              onClick={() => onChange({ sort: item.val })}
              className={`w-full flex justify-between items-center px-6 py-4 rounded-2xl transition-all font-bold text-xs tracking-tight border ${
                currentFilters.sort === item.val 
                  ? 'bg-primary/5 border-primary/20 text-on-surface shadow-sm' 
                  : 'bg-transparent border-outline/5 hover:bg-surface text-on-surface-variant/40 hover:text-on-surface'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${currentFilters.sort === item.val ? 'text-primary' : 'opacity-30'}`} style={{ fontVariationSettings: currentFilters.sort === item.val ? "'FILL' 1" : "" }}>
                  {item.icon}
                </span> 
                {item.label}
              </span>
              <div className={`w-2 h-2 rounded-full transition-all ${currentFilters.sort === item.val ? 'bg-primary scale-125' : 'bg-outline/20 scale-100'}`} />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RestaurantFilters;
