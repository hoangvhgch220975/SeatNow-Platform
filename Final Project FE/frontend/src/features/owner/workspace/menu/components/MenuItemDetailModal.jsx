import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/shared/utils/formatCurrency';

/**
 * MenuItemDetailModal Component
 * Popup hiển thị chi tiết món ăn với phong cách Glassmorphism cao cấp.
 * Hỗ trợ vuốt trượt ảnh và hiển thị đầy đủ thông tin: giá, mô tả, tags, allergens...
 */
const MenuItemDetailModal = ({ isOpen, onClose, item }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const images = item.images && item.images.length > 0 
    ? item.images 
    : ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'];

  const nextImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Các biến thể animation cho chuyển động ảnh
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div 
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col md:flex-row border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gallery Section - Bên trái (hoặc trên cùng mobile) */}
        <div className="w-full md:w-3/5 h-[400px] md:h-auto relative bg-zinc-100 group">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={currentImageIndex}
              src={images[currentImageIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>

          {/* Controls - Hiện khi hover (hoặc luôn hiện trên mobile) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl font-bold">chevron_left</span>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all active:scale-90"
              >
                <span className="material-symbols-outlined text-3xl font-bold">chevron_right</span>
              </button>
              
              {/* Pagination Dots */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Close Button Mobile */}
          <button 
            onClick={onClose}
            className="md:hidden absolute top-6 right-6 w-12 h-12 bg-black/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content Section - Bên phải (hoặc dưới cùng mobile) */}
        <div className="w-full md:w-2/5 p-10 md:p-16 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-none">
          <div className="flex justify-between items-start mb-8">
            <span className="px-4 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-violet-100">
              {item.category}
            </span>
            <button 
              onClick={onClose}
              className="hidden md:flex w-12 h-12 bg-zinc-50 hover:bg-zinc-100 rounded-2xl items-center justify-center transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-zinc-400">close</span>
            </button>
          </div>

          <h2 className="text-4xl font-black text-zinc-900 tracking-tight mb-4 leading-tight">
            {item.name}
          </h2>

          <div className="flex items-baseline gap-4 mb-8">
            {item.discountPrice ? (
              <>
                <span className="text-3xl font-black text-violet-600">
                  {formatCurrency(item.discountPrice)}
                </span>
                <span className="text-lg font-bold text-zinc-300 line-through">
                  {formatCurrency(item.price)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-black text-zinc-900">
                {formatCurrency(item.price)}
              </span>
            )}
          </div>

          <p className="text-lg text-zinc-500 font-medium leading-relaxed mb-10">
            {item.description || t('restaurants.menu.fallback_desc')}
          </p>

          <div className="space-y-8 mt-auto border-t border-zinc-50 pt-10">
            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t('menu_mgmt.prep_time')}</p>
                <div className="flex items-center gap-2 text-zinc-700 font-bold">
                  <span className="material-symbols-outlined text-xl text-violet-400">schedule</span>
                  <span>{item.preparationTime || '--'} {t('menu_mgmt.prep_time_unit')}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t('menu_mgmt.status')}</p>
                <div className={`flex items-center gap-2 font-bold ${item.isAvailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                  <div className={`w-2 h-2 rounded-full ${item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{item.isAvailable ? t('menu_mgmt.active') : t('menu_mgmt.inactive')}</span>
                </div>
              </div>
            </div>

            {/* Tags & Allergens */}
            {item.tags?.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t('menu_mgmt.tags')}</p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-50 text-zinc-500 text-[11px] font-bold rounded-lg border border-zinc-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {item.allergens?.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{t('menu_mgmt.allergens')}</p>
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map(allergen => (
                    <span key={allergen} className="px-3 py-1 bg-rose-50 text-rose-500 text-[11px] font-bold rounded-lg border border-rose-100">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MenuItemDetailModal;
