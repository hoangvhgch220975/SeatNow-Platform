import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file MenuItemModal.jsx
 * @description Popup chi tiết món ăn - hiển thị đúng các trường từ MongoDB menuitems collection. Hỗ trợ đa ngôn ngữ.
 *   name, description, price, discountPrice, category, images[], isAvailable,
 *   preparationTime, tags[], allergens[], createdAt
 */
const MenuItemModal = ({ item, onClose }) => {
  const { t, i18n } = useTranslation();
  const [activeImg, setActiveImg] = useState(0);
  const [dragStartX, setDragStartX] = useState(null);

  // Chuẩn hoá danh sách ảnh (Vietnamese comment)
  const images =
    Array.isArray(item?.images) && item.images.length > 0
      ? item.images
      : [
          item?.image ||
          item?.imageUrl ||
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
        ];

  const hasMultiple = images.length > 1;

  // ESC + phím mũi tên → điều hướng gallery (Vietnamese comment)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setActiveImg((p) => Math.max(p - 1, 0));
      if (e.key === 'ArrowRight') setActiveImg((p) => Math.min(p + 1, images.length - 1));
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, images.length]);

  // Khoá scroll body khi modal mở (Vietnamese comment)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Reset ảnh khi đổi item (Vietnamese comment)
  useEffect(() => { setActiveImg(0); }, [item]);

  if (!item) return null;

  // Tính giá hiển thị & giảm giá (Vietnamese comment)
  const finalPrice = item.discountPrice || item.price;
  const hasDiscount = !!item.discountPrice && item.discountPrice < item.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - item.discountPrice / item.price) * 100)
    : 0;

  // Format ngày tháng theo ngôn ngữ hiện tại (Vietnamese comment)
  const formatDate = (iso) => {
    if (!iso) return null;
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    return new Date(iso).toLocaleDateString(locale, {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  // Touch/mouse swipe (Vietnamese comment)
  const handleDragStart = (e) => {
    const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setDragStartX(x);
  };
  const handleDragEnd = (e) => {
    if (dragStartX === null || !hasMultiple) return;
    const x = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX - x;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setActiveImg((p) => Math.min(p + 1, images.length - 1));
      else setActiveImg((p) => Math.max(p - 1, 0));
    }
    setDragStartX(null);
  };

  return (
    <AnimatePresence>
      {/* Backdrop (Vietnamese comment) */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={onClose}
      >
        {/* Modal card (Vietnamese comment) */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >

          {/* ───── IMAGE GALLERY ───── (Vietnamese comment) */}
          <div
            className="relative flex-shrink-0 bg-slate-100 select-none"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {/* Main image (Vietnamese comment) */}
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={images[activeImg]}
                  alt={`${item.name} ${activeImg + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22 }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Gradient overlay (Vietnamese comment) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

              {/* Left / Right arrows (Vietnamese comment) */}
              {hasMultiple && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImg((p) => Math.max(p - 1, 0)); }}
                    disabled={activeImg === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImg((p) => Math.min(p + 1, images.length - 1)); }}
                    disabled={activeImg === images.length - 1}
                    className="absolute right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 backdrop-blur-sm text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </>
              )}

              {/* Top-left badges (Vietnamese comment) */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                {item.category && (
                  <span className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {item.category}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-red-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    -{discountPercent}% {t('restaurants.menu.modal.off')}
                  </span>
                )}
              </div>

              {/* Availability badge (Vietnamese comment) */}
              <div className="absolute top-4 right-14 pointer-events-none">
                <span className={`text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full shadow-sm ${
                  item.isAvailable !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {item.isAvailable !== false 
                    ? `✓ ${t('restaurants.menu.modal.available')}` 
                    : `✗ ${t('restaurants.menu.modal.unavailable')}`}
                </span>
              </div>

              {/* Prep time — bottom left (Vietnamese comment) */}
              {item.preparationTime && (
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 pointer-events-none">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {item.preparationTime} {t('restaurants.menu.modal.min')}
                </div>
              )}

              {/* Image counter — bottom right (Vietnamese comment) */}
              {hasMultiple && (
                <div className="absolute bottom-4 right-14 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full pointer-events-none">
                  {activeImg + 1} / {images.length}
                </div>
              )}

              {/* Close button (Vietnamese comment) */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-9 h-9 bg-black/35 hover:bg-black/55 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all z-10"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Thumbnail strip (Vietnamese comment) */}
            {hasMultiple && (
              <div className="flex gap-2 justify-center py-3 bg-slate-50 border-b border-slate-100 overflow-x-auto px-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="focus:outline-none flex-shrink-0"
                    aria-label={`Image ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className={`w-10 h-10 rounded-xl object-cover transition-all duration-200 ${
                        i === activeImg
                          ? 'ring-2 ring-primary ring-offset-1 scale-110'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ───── SCROLLABLE INFO ───── (Vietnamese comment) */}
          <div className="overflow-y-auto flex-1 p-7 space-y-6">

            {/* Tên + Giá (Vietnamese comment) */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight flex-1">{item.name}</h2>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-black text-primary">
                  {finalPrice?.toLocaleString()} VNĐ
                </div>
                {hasDiscount && (
                  <div className="text-sm text-slate-400 line-through font-medium">
                    {item.price?.toLocaleString()} VNĐ
                  </div>
                )}
              </div>
            </div>

            {/* Mô tả món ăn (Vietnamese comment) */}
            {item.description && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-3">
                  {t('restaurants.menu.modal.description')}
                </p>
                <p className="text-on-surface-variant/70 leading-relaxed text-[15px] italic font-medium">{item.description}</p>
              </div>
            )}

            {/* Thông tin danh mục và thời gian chuẩn bị (Vietnamese comment) */}
            {(item.category || item.preparationTime) && (
              <div className="grid grid-cols-2 gap-4">
                {item.category && (
                  <div className="flex items-center gap-4 bg-surface border border-outline/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-primary group-hover:text-white text-lg">category</span>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">
                        {t('restaurants.menu.modal.category')}
                      </p>
                      <p className="text-[13px] font-bold text-on-surface">{item.category}</p>
                    </div>
                  </div>
                )}
                {item.preparationTime && (
                  <div className="flex items-center gap-4 bg-surface border border-outline/5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 rounded-[1.5rem] p-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-primary group-hover:text-white text-lg">schedule</span>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">
                        {t('restaurants.menu.modal.prep_time')}
                      </p>
                      <p className="text-[13px] font-bold text-on-surface">
                        {item.preparationTime} {t('restaurants.menu.modal.min')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cảnh báo dị ứng (Vietnamese comment) */}
            {item.allergens?.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-lg text-amber-500">warning</span>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">
                    {t('restaurants.menu.modal.allergen_info')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.allergens.map((allergen) => (
                    <span key={allergen} className="bg-white text-amber-700 text-xs font-bold px-4 py-2 rounded-full shadow-sm capitalize border border-amber-500/10">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags của món ăn (Vietnamese comment) */}
            {item.tags?.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-3">
                  {t('restaurants.menu.modal.tags')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="text-xs font-bold text-on-surface-variant bg-surface px-4 py-2 rounded-full border border-outline/5 hover:border-primary/20 hover:text-primary transition-colors cursor-default">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ngày thêm món vào thực đơn (Vietnamese comment) */}
            {item.createdAt && (
              <p className="text-[11px] text-slate-300 text-right">
                {t('restaurants.menu.modal.added_on', { date: formatDate(item.createdAt) })}
              </p>
            )}

            {/* Bottom spacer (Vietnamese comment) */}
            <div className="h-1" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MenuItemModal;
