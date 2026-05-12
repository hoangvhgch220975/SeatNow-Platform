import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * @file RestaurantHero.jsx
 * @description Hero section cinematic cho trang chi tiết nhà hàng.
 */
const RestaurantHero = ({ restaurant }) => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 250]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  // Split name for staggered reveal
  const nameChars = restaurant.name.split("");

  return (
    <section className="relative w-full h-[650px] overflow-hidden bg-black rounded-b-[4rem]">
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img 
          alt={restaurant.name} 
          className="w-full h-full object-cover brightness-[0.6] scale-110" 
          src={restaurant.coverImage}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      
      <div className="absolute inset-0 flex items-end pb-32 px-12">
        <div className="max-w-[1440px] mx-auto w-full">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-wrap items-center gap-6"
            >
              <span className="bg-primary text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] shadow-2xl shadow-primary/30">
                {restaurant.cuisine}
              </span>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-2.5 rounded-full border border-white/20 shadow-2xl">
                <span className="material-symbols-outlined text-amber-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="text-white font-bold text-[14px]">
                  {restaurant.reviewCount > 0 ? (Number(restaurant.rating).toFixed(1)) : 'N/A'}
                </span>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full mx-1"></div>
                <span className="text-white/50 text-[11px] font-bold uppercase tracking-[0.2em]">
                  {restaurant.reviewCount || 0} {t('restaurants.card.reviews')}
                </span>
              </div>
            </motion.div>

            <h1 className="text-white text-8xl md:text-[8rem] font-bold tracking-tighter headline leading-[0.85] flex flex-wrap">
              {nameChars.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 40, rotateX: -45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.1 + index * 0.03, 
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  style={{ display: char === " " ? "inline" : "inline-block", marginRight: char === " " ? "0.3em" : "0" }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-wrap items-center gap-12 text-white/50 text-xs font-bold uppercase tracking-[0.25em]"
            >
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500 border border-white/10">
                  <span className="material-symbols-outlined text-white text-[20px]">location_on</span>
                </div>
                <span className="group-hover:text-white transition-colors">{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-500 border border-white/10">
                  <span className="material-symbols-outlined text-white text-[20px]">payments</span>
                </div>
                <span className="group-hover:text-white transition-colors">{restaurant.priceRange}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHero;
