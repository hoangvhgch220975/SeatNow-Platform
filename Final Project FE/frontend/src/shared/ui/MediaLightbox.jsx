import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file MediaLightbox.jsx
 * @description Lightbox xem ảnh fullscreen premium - hỗ trợ swipe, thumbnail strip,
 *   phím mũi tên, click ngoài để đóng, zoom caption.
 */
const MediaLightbox = ({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
}) => {
  const [current, setCurrent] = useState(initialIndex);
  const [dragStartX, setDragStartX] = useState(null);

  // Đồng bộ index khi mở lại
  // Reset về ảnh được chọn mỗi lần mở lại
  useEffect(() => {
    if (isOpen) { setCurrent(initialIndex); }
  }, [isOpen, initialIndex]);

  // Khoá scroll body
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Phím tắt
  const handleKey = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') setCurrent((p) => Math.max(p - 1, 0));
    if (e.key === 'ArrowRight') setCurrent((p) => Math.min(p + 1, images.length - 1));
  }, [isOpen, onClose, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // Swipe handlers
  const onDragStart = (e) => {
    const x = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    setDragStartX(x);
  };
  const onDragEnd = (e) => {
    if (dragStartX === null) return;
    const x = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX - x;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrent((p) => Math.min(p + 1, images.length - 1));
      else setCurrent((p) => Math.max(p - 1, 0));
    }
    setDragStartX(null);
  };

  if (!isOpen || images.length === 0) return null;

  const hasMultiple = images.length > 1;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl"
      >
        {/* ── TOP BAR ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 pt-5 pb-3 z-10">
          <div className="text-white/50 text-sm font-bold tracking-widest select-none">
            {hasMultiple ? `${current + 1}  /  ${images.length}` : ''}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-95 ml-auto"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* ── MAIN IMAGE ── */}
        <div
          className="flex-1 relative flex items-center justify-center overflow-hidden select-none"
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={images[current]}
              alt={`Photo ${current + 1}`}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none"
              initial={{ opacity: 0, scale: 0.96, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.96, x: -30 }}
              transition={{ duration: 0.2 }}
              draggable={false}
            />
          </AnimatePresence>

          {/* Prev / Next Arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={() => setCurrent((p) => Math.max(p - 1, 0))}
                disabled={current === 0}
                className="absolute left-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
                aria-label="Previous image"
              >
                <span className="material-symbols-outlined text-2xl">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrent((p) => Math.min(p + 1, images.length - 1))}
                disabled={current === images.length - 1}
                className="absolute right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 text-white rounded-full transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed backdrop-blur-sm border border-white/10"
                aria-label="Next image"
              >
                <span className="material-symbols-outlined text-2xl">chevron_right</span>
              </button>
            </>
          )}


        </div>

        {/* ── THUMBNAIL STRIP ── */}
        {hasMultiple && (
          <div className="flex-shrink-0 pb-5 pt-3 px-6">
            <div className="flex gap-2.5 justify-center overflow-x-auto no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="focus:outline-none flex-shrink-0 group"
                  aria-label={`View image ${i + 1}`}
                >
                  <div className={`w-14 h-14 rounded-xl overflow-hidden transition-all duration-200 ring-offset-2 ring-offset-black ${
                    i === current
                      ? 'ring-2 ring-white scale-110 opacity-100'
                      : 'opacity-40 hover:opacity-70 ring-0'
                  }`}>
                    <img
                      src={img}
                      alt={`thumb-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default MediaLightbox;
