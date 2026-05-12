import React from 'react';
import { useTranslation } from 'react-i18next';
import MenuItemForm from './MenuItemForm';

/**
 * Menu Item Modal Component
 * Orchestrates the display of the Add/Edit form within a premium glassmorphic modal
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {Function} onClose - Callback to close modal
 * @param {object} initialData - Data for editing (null for add mode)
 * @param {Function} onSubmit - Form submission handler
 * @param {boolean} isSubmitting - Loading state for the action
 */
const MenuItemModal = ({ isOpen, onClose, initialData, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[3.5rem] w-full max-w-7xl max-h-[95vh] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] animate-in zoom-in-95 duration-500 scrollbar-hide border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10 md:p-24">
          {/* Modal Header */}
          <div className="flex justify-between items-start mb-20">
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-zinc-900 tracking-tight">
                {initialData ? t('menu_mgmt.edit_dish') : t('menu_mgmt.add_dish')}
              </h2>
              <p className="text-xl text-zinc-400 font-medium max-w-xl leading-relaxed">
                {t('menu_mgmt.subtitle')}
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="w-16 h-16 bg-zinc-50 hover:bg-zinc-100 rounded-3xl flex items-center justify-center transition-all group active:scale-90 border border-zinc-100"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-zinc-300 group-hover:text-zinc-950 transition-colors text-3xl">close</span>
            </button>
          </div>

          {/* Form Content */}
          <MenuItemForm 
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
