import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurant, useRestaurantMenu } from '../hooks.js';

/**
 * @file RestaurantGalleryPage.jsx
 * @description Trang gallery toàn bộ ảnh nhà hàng — bao gồm ảnh nhà hàng và ảnh món ăn.
 * Cinematic luxury aesthetic with smooth animations and lightbox.
 */
const RestaurantGalleryPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const { data: restaurantData, isLoading: isRestaurantLoading, isError: isRestaurantError } = useRestaurant(idOrSlug);
  const { data: menuData, isLoading: isMenuLoading } = useRestaurantMenu(idOrSlug);

  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const restaurant = restaurantData?.data || restaurantData;
  const menuItems = Array.isArray(menuData?.data) ? menuData.data : Array.isArray(menuData) ? menuData : [];

  // Collect all images with source labels
  const allImages = useMemo(() => {
    if (!restaurant && menuItems.length === 0) return [];

    // 1. Restaurant Images
    const restaurantImgs = (restaurant?.images || []).map((url, i) => ({
      url,
      category: 'restaurant',
      label: restaurant?.name || 'Restaurant',
      index: i,
    }));

    // 2. Menu Item Images (Extracting from multiple possible keys)
    const menuImgs = [];
    menuItems.forEach((item, itemIdx) => {
      const itemTitle = item.name || item.itemName || `Menu Item ${itemIdx + 1}`;
      
      // Handle array of images
      if (Array.isArray(item.images) && item.images.length > 0) {
        item.images.forEach((imgUrl, imgIdx) => {
          if (imgUrl) menuImgs.push({
            url: imgUrl,
            category: 'menu',
            label: itemTitle,
            index: `${itemIdx}-${imgIdx}`
          });
        });
      } else {
        // Handle single image keys
        const singleImgUrl = item.image || item.imageUrl || item.img || item.imgUrl || item.photo;
        if (singleImgUrl) {
          menuImgs.push({
            url: singleImgUrl,
            category: 'menu',
            label: itemTitle,
            index: itemIdx
          });
        }
      }
    });

    return [...restaurantImgs, ...menuImgs];
  }, [restaurant, menuItems]);

  const filteredImages = useMemo(() => {
    if (activeFilter === 'all') return allImages;
    return allImages.filter(img => img.category === activeFilter);
  }, [allImages, activeFilter]);

  const tabs = [
    { key: 'all', label: t('restaurants.gallery.filter_all'), count: allImages.length },
    { key: 'restaurant', label: t('restaurants.gallery.filter_restaurant'), count: allImages.filter(i => i.category === 'restaurant').length },
    { key: 'menu', label: t('restaurants.gallery.filter_menu'), count: allImages.filter(i => i.category === 'menu').length },
  ];

  const isLoading = isRestaurantLoading || isMenuLoading;

  const lightboxImages = filteredImages.map(i => i.url);
  const currentImg = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  const prevImage = () => setLightboxIndex(i => (i > 0 ? i - 1 : filteredImages.length - 1));
  const nextImage = () => setLightboxIndex(i => (i < filteredImages.length - 1 ? i + 1 : 0));

  return (
    <div className="min-h-screen bg-surface pt-24 pb-40 px-6 md:px-12 relative overflow-hidden -mt-16">
      {/* Ambient glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-primary/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-on-surface-variant/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.4em] group mb-10"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </div>
            {t('restaurants.gallery.back')}
          </motion.button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-primary/5 border border-primary/10 rounded-full">
                <span className="material-symbols-outlined text-primary text-[18px]">photo_library</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                  {t('restaurants.gallery.badge')}
                </span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-on-surface headline tracking-tighter leading-[0.9]">
                {restaurant?.name || t('restaurants.gallery.title_default')}
                <span className="text-primary">.</span>
              </h1>
              <p className="text-on-surface-variant/60 text-lg font-bold italic">
                {t('restaurants.gallery.subtitle', { count: allImages.length })}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              {tabs.slice(1).map(tab => (
                <div key={tab.key} className="text-center">
                  <p className="text-3xl font-black text-on-surface headline">{tab.count}</p>
                  <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em]">{tab.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-4 mb-12 flex-wrap"
        >
          {tabs.map(tab => {
            const isActive = activeFilter === tab.key;
            return (
              <motion.button
                key={tab.key}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-black transition-all whitespace-nowrap border text-[11px] uppercase tracking-[0.2em] ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-[0_15px_30px_-5px_rgba(var(--primary-rgb),0.3)] scale-[1.02]'
                    : 'bg-white text-on-surface-variant/50 border-outline/10 hover:border-primary/20 hover:text-primary hover:shadow-md'
                }`}
              >
                {tab.label}
                <span className={`flex items-center justify-center min-w-[24px] h-[24px] rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-primary' : 'bg-on-surface-variant/5 text-on-surface-variant/40'
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`rounded-[2rem] bg-surface animate-pulse ${i % 3 === 0 ? 'h-64' : 'h-48'}`} />
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        {!isLoading && filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 space-y-6"
          >
            <div className="w-24 h-24 bg-surface rounded-[2rem] flex items-center justify-center mx-auto border border-outline/5">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">image_not_supported</span>
            </div>
            <p className="text-[13px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em]">
              {t('restaurants.gallery.empty')}
            </p>
          </motion.div>
        )}

        {!isLoading && filteredImages.length > 0 && (
          <div
            className="columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5"
          >
              {filteredImages.map((img, idx) => (
                <motion.div
                  key={`${img.category}-${img.index}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  onClick={() => setLightboxIndex(idx)}
                  className="break-inside-avoid relative rounded-[2rem] overflow-hidden cursor-zoom-in group shadow-sm hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.2)] transition-all duration-700 mb-5"
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out-expo"
                    loading="lazy"
                    onError={e => { e.target.closest('.break-inside-avoid').style.display = 'none'; }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] truncate">{img.label}</p>
                      <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        img.category === 'menu' 
                          ? 'bg-amber-500/80 text-white' 
                          : 'bg-primary/80 text-white'
                      }`}>
                        {img.category === 'menu' ? t('restaurants.gallery.tag_menu') : t('restaurants.gallery.tag_restaurant')}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">zoom_in</span>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
              <span className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em]">
                {lightboxIndex + 1} / {filteredImages.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                currentImg.category === 'menu' ? 'bg-amber-500/80 text-white' : 'bg-primary/80 text-white'
              }`}>
                {currentImg.category === 'menu' ? t('restaurants.gallery.tag_menu') : t('restaurants.gallery.tag_restaurant')}
              </span>
            </div>

            {/* Prev */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
            </motion.button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={currentImg.url}
                alt={currentImg.label}
                className="max-w-full max-h-[78vh] object-contain rounded-[2rem] shadow-2xl"
              />
              <p className="text-white/60 text-sm font-black uppercase tracking-[0.3em]">{currentImg.label}</p>
            </motion.div>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={e => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RestaurantGalleryPage;
