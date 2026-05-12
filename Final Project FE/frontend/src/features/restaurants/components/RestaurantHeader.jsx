import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file RestaurantHeader.jsx
 * @description Tiêu đề chính của trang danh sách nhà hàng, bao gồm thanh tìm kiếm cao cấp.
 */
const RestaurantHeader = ({ onSearch, currentSearch }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState(currentSearch || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchQuery(currentSearch || '');
  }, [currentSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() === '') {
      onSearch('');
    }
  };

  return (
    <header className="pt-20 pb-20 flex flex-col items-center text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6 max-w-4xl"
      >
        <h1 className="text-[5rem] font-bold tracking-tighter text-on-surface headline leading-[0.9] mb-4 text-gradient">
          <Trans i18nKey="restaurants.search.header_title">
            Explore <span className="text-primary italic font-serif">Extraordinary</span> Dining
          </Trans>
        </h1>
        <p className="text-xl text-on-surface-variant/60 font-medium max-w-2xl mx-auto">
          {t('restaurants.search.header_desc')}
        </p>
      </motion.div>
      
      {/* Search Bar Container */}
      <motion.form 
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-4xl mt-16 px-6"
      >
        <div className={`relative flex items-center glass p-3 rounded-[2.5rem] transition-all duration-500 shadow-premium border ${isFocused ? 'border-primary ring-8 ring-primary/5' : 'border-outline/5 hover:border-outline/10'}`}>
          <div className={`pl-8 pr-6 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-on-surface-variant/30'}`}>
            <span className="material-symbols-outlined text-[32px]">search</span>
          </div>
          
          <input 
            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-on-surface text-xl font-medium placeholder:text-on-surface-variant/20" 
            placeholder={t('restaurants.search.placeholder')} 
            value={searchQuery}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            type="text"
          />

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-primary text-white px-12 py-5 rounded-[1.8rem] font-bold text-xs tracking-[0.2em] uppercase shadow-xl shadow-primary/20 hover:brightness-110 transition-all ml-2"
          >
            {t('restaurants.search.header_button')}
          </motion.button>
        </div>

      </motion.form>
    </header>
  );
};

export default RestaurantHeader;
