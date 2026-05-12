import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Custom Select Component
 * Replacement for native <select> to provide a high-end, glassmorphic dropdown experience.
 */
const CustomSelect = ({ label, value, options, onChange, icon, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Logic to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full lg:w-72" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full border-2 rounded-[2rem] py-5 px-8 flex items-center justify-between transition-all group shadow-inner
          ${isOpen ? 'bg-white border-violet-100 ring-4 ring-violet-50' : isActive ? 'bg-violet-700 border-violet-600 shadow-lg shadow-violet-200' : 'bg-zinc-50/50 border-transparent hover:bg-white'}
        `}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-violet-700 text-white' : isActive ? 'bg-white/20 text-white' : 'bg-white text-zinc-300 shadow-sm border border-zinc-50'}`}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5 transition-colors ${isActive ? 'text-violet-200' : 'text-slate-400'}`}>{label}</span>
            <span className={`text-sm font-black leading-none truncate max-w-[120px] transition-colors ${isActive ? 'text-white' : 'text-slate-900'}`}>{selectedOption?.label}</span>
          </div>
        </div>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={`material-symbols-outlined transition-colors ${isOpen ? 'text-violet-700' : isActive ? 'text-white' : 'text-zinc-300'}`}
        >
          expand_more
        </motion.span>
      </button>

      {/* Popover/Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-4 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-[60] overflow-hidden"
          >
            <div className="space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-6 py-4 rounded-2xl text-left text-sm font-bold transition-all flex items-center justify-between group/opt
                    ${value === opt.value 
                      ? 'bg-violet-700 text-white shadow-xl shadow-violet-100' 
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-violet-700'}
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="material-symbols-outlined text-base"
                    >
                      check_circle
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Menu Filters Component
 * Upgrade with Framer Motion and Custom Selects for a Premium UI experience.
 */
const MenuFilters = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus, 
  onStatusChange,
  searchValue,
  onSearchChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  counts = { status: {}, category: {} }
}) => {
  const { t } = useTranslation();

  const categories = [
    { id: 'all', label: t('menu_mgmt.all_categories') },
    { id: 'Appetizers', label: t('menu_mgmt.categories.appetizers') },
    { id: 'Main Course', label: t('menu_mgmt.categories.main_course') },
    { id: 'Desserts', label: t('menu_mgmt.categories.desserts') },
    { id: 'Drinks', label: t('menu_mgmt.categories.drinks') }
  ];

  const statusOptions = [
    { value: '', label: t('menu_mgmt.status_all'), icon: 'apps' },
    { value: 'available', label: t('menu_mgmt.active'), icon: 'check_circle' },
    { value: 'unavailable', label: t('menu_mgmt.inactive'), icon: 'block' },
  ];

  const sortOptions = [
    { value: 'name_asc', label: t('menu_mgmt.sort_options.name_asc'), icon: 'sort_by_alpha' },
    { value: 'name_desc', label: t('menu_mgmt.sort_options.name_desc'), icon: 'sort_by_alpha' },
    { value: 'newest', label: t('menu_mgmt.sort_options.newest'), icon: 'schedule' },
    { value: 'oldest', label: t('menu_mgmt.sort_options.oldest'), icon: 'history' },
    { value: 'price_asc', label: t('menu_mgmt.sort_options.price_asc'), icon: 'payments' },
    { value: 'price_desc', label: t('menu_mgmt.sort_options.price_desc'), icon: 'payments' },
  ];

  return (
    <section className="space-y-12 pt-6 border-t border-slate-100 animate-in fade-in duration-700">
      {/* Search & Actions Row */}
      <div className="flex flex-col lg:flex-row gap-8 items-center">
        {/* Search Field Interface */}
        <div className="flex-1 w-full relative group">
          <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${!!searchValue ? 'bg-violet-700 text-white shadow-lg shadow-violet-200' : 'bg-white text-slate-300 shadow-sm border border-slate-50 group-focus-within:border-violet-100'}`}>
            <span className={`material-symbols-outlined text-2xl transition-colors ${!!searchValue ? 'text-white' : 'group-focus-within:text-violet-700'}`}>manage_search</span>
          </div>
          <input 
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('menu_mgmt.search_placeholder')}
            className={`w-full bg-slate-50 border-2 rounded-[2.5rem] py-6 pl-24 pr-8 focus:ring-8 focus:ring-violet-700/5 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 shadow-inner ${!!searchValue ? 'border-violet-100/50 bg-violet-50/10' : 'border-transparent focus:border-violet-100'}`}
          />
        </div>

        {/* View Mode & Selection Controls */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          {/* View Mode Toggle (Grid/Table) */}
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200">
            <button 
              onClick={() => onViewModeChange('grid')}
              className={`p-3.5 rounded-xl transition-all flex items-center justify-center ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-md text-violet-700 border border-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button 
              onClick={() => onViewModeChange('table')}
              className={`p-3.5 rounded-xl transition-all flex items-center justify-center ${
                viewMode === 'table' 
                  ? 'bg-white shadow-md text-violet-700 border border-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>

          {/* Custom Premium Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            <CustomSelect 
              label={t('menu_mgmt.status')}
              value={selectedStatus}
              options={statusOptions}
              onChange={onStatusChange}
              icon="checklist"
              isActive={!!selectedStatus}
            />
            <CustomSelect 
              label={t('menu_mgmt.sort_by')}
              value={sortBy}
              options={sortOptions}
              onChange={onSortByChange}
              icon="sort"
              isActive={sortBy !== 'name_asc'}
            />
          </div>
        </div>
      </div>

      {/* Category Navigation Layer with Layout Animation */}
      <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-10 px-10 lg:mx-0 lg:px-0">
        <div className="flex items-center gap-4 bg-zinc-50 p-2 rounded-[2.25rem] border border-zinc-100/50">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory);
            const count = cat.id === 'all' ? counts.category.all : (counts.category[cat.id] || 0);

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id === 'all' ? '' : cat.id)}
                className="relative px-10 py-5 rounded-[1.75rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all group"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-violet-700 rounded-[1.5rem] shadow-xl shadow-violet-200"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-violet-50/0 group-hover:bg-violet-50/50 rounded-[1.5rem] transition-all duration-300" />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-violet-700'}`}>
                    {cat.label}
                  </span>
                  <span className={`text-[9px] transition-colors ${isActive ? 'text-white/40' : 'text-zinc-300'}`}>
                    {count || 0}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MenuFilters;
