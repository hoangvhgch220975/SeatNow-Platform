import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file RestaurantGallery.jsx
 * @description Bộ sưu tập ảnh nhà hàng phong cách Bento Grid cao cấp.
 * Includes a premium "View All Gallery" button linking to the full gallery page.
 */
const RestaurantGallery = ({ photos }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idOrSlug } = useParams();

  if (!photos || photos.length === 0) return null;

  return (
    <section className="px-12 max-w-[1440px] mx-auto -mt-32 relative z-30 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        {/* Main large photo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-2 md:row-span-2 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] group border-4 border-white/10 relative"
        >
          <img 
            alt="Main view" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
            src={photos[0]} 
          />
        </motion.div>
        
        {/* Smaller photos */}
        {photos.slice(1, 4).map((photo, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1), duration: 0.8 }}
            className="rounded-[2.5rem] overflow-hidden shadow-xl group border-4 border-white/10 relative"
          >
            <img 
              alt={`Gallery item ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
              src={photo} 
            />
          </motion.div>
        ))}

        {/* 5th slot: Integrated "View All Gallery" interaction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          onClick={() => navigate(ROUTES.RESTAURANT_GALLERY(idOrSlug))}
          className="rounded-[2.5rem] overflow-hidden relative group cursor-pointer border-4 border-white/10 shadow-xl"
        >
          {/* Background image preview */}
          {photos[4] && (
            <img
              src={photos[4]}
              alt="Gallery preview"
              className="w-full h-full object-cover scale-105 group-hover:scale-125 transition-transform duration-[2s] ease-out-expo brightness-[0.4] group-hover:brightness-[0.2]"
            />
          )}
          {!photos[4] && (
            <div className="absolute inset-0 bg-on-surface/90" />
          )}

          {/* Interaction layer */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {/* Central Blurred Icon Box - Now the primary button */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center gap-4"
            >
              {/* Animated glow background */}
              <div className="absolute inset-0 bg-primary/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-24 h-24 bg-white/10 backdrop-blur-2xl rounded-[2rem] flex items-center justify-center border border-white/20 shadow-2xl relative z-10 group-hover:bg-primary group-hover:border-primary transition-all duration-700">
                <span className="material-symbols-outlined text-white text-4xl group-hover:scale-110 transition-transform duration-500">photo_library</span>
              </div>

              {/* Text Label */}
              <div className="relative z-10 text-center">
                <p className="text-white text-[11px] font-black uppercase tracking-[0.4em] opacity-60 group-hover:opacity-100 group-hover:text-primary-light transition-all duration-500">
                  {t('restaurants.gallery.view_gallery_btn')}
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Subtle shimmer effect on the whole card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
        </motion.div>
      </div>
    </section>
  );
};

export default RestaurantGallery;
