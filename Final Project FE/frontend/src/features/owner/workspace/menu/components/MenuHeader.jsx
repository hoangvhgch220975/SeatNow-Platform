import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Menu Header Component
 * Displays the page title, description and "Add New Dish" action button
 * 
 * @param {Function} onAddItem - Triggered when the add button is clicked
 */
const MenuHeader = ({ onAddItem }) => {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
          {t('menu_mgmt.title')}
        </h2>
        <p className="text-slate-500 font-bold text-lg">
          {t('menu_mgmt.subtitle')}
        </p>
      </div>
      
      <button 
        onClick={onAddItem}
        className="flex items-center gap-2 px-8 py-4 bg-violet-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-200 hover:bg-violet-800 transition-all active:scale-95 group flex-nowrap"
      >
        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
        <span className="whitespace-nowrap">{t('menu_mgmt.add_dish')}</span>
      </button>
    </section>
  );
};

export default MenuHeader;
