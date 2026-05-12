import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Star, Navigation } from 'lucide-react';
import { ROUTES } from '../../../config/routes.js';
import { slugify } from '../../../shared/utils/slugify.js';

/**
 * @file RestaurantCard.jsx
 * @description Card nhà hàng cao cấp với hiệu ứng 3D Tilt tương tác theo chuột và Glare effect.
 */
const RestaurantCard = ({ restaurant }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Chuẩn hóa dữ liệu từ API
  const id = restaurant.id || restaurant._id || 'mock-id';
  const imageUrl = restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop';
  const { distanceKm } = restaurant;
  const rating = restaurant.ratingAvg ? Number(restaurant.ratingAvg).toFixed(1) : 'N/A';
  const address = restaurant.address || restaurant.location || 'Vietnam';
  const cuisine = (restaurant.cuisineTypes && restaurant.cuisineTypes[0]) || restaurant.cuisine || t('restaurants.menu.title');
  const priceDisplay = '$'.repeat(restaurant.priceRange || restaurant.priceLevel?.length || 2);
  const formattedDistance = distanceKm != null ? (Number(distanceKm) < 1 ? '< 1 km' : `${Number(distanceKm).toFixed(1)} km`) : null;
  const urlParam = restaurant.slug || slugify(restaurant.name) || id;

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glareOpacity = useTransform(mouseXSpring, (v) => !isMobile && (Math.abs(v) > 0 || Math.abs(y.get()) > 0) ? 0.15 : 0);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isMobile ? {} : { y: -12 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-outline/5 shadow-premium hover:shadow-[0_50px_100px_-20px_rgba(99,14,212,0.15)] transition-all duration-700"
    >
      {/* Glare effect */}
      <motion.div 
        style={{ opacity: glareOpacity }}
        className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-br from-white via-transparent to-transparent" 
      />

      {/* Main Link Overlay */}
      <Link to={ROUTES.RESTAURANT_DETAIL(urlParam)} className="absolute inset-0 z-30" />

      {/* Media Section */}
      <div className="relative h-72 overflow-hidden bg-surface">
        <motion.img 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          src={imageUrl} 
          alt={restaurant.name} 
          style={{ transform: "translateZ(-20px)" }}
        />
        
        {/* Floating Elements */}
        <div className="absolute top-6 left-6 z-40 flex flex-col gap-3">
          {restaurant.featured && (
            <motion.span 
              style={{ transform: "translateZ(30px)" }}
              className="bg-primary text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl shadow-primary/20"
            >
              {t('restaurants.list.sort_featured')}
            </motion.span>
          )}
        </div>

        <motion.div 
          style={{ transform: "translateZ(40px)" }}
          className="absolute top-6 right-6 glass-dark px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl z-40"
        >
          <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
          <span className="text-[13px] font-bold text-white">{rating}</span>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <motion.h3 
              style={{ transform: "translateZ(20px)" }}
              className="text-2xl font-bold headline text-on-surface leading-tight group-hover:text-primary transition-colors duration-500 line-clamp-1"
            >
              {restaurant.name}
            </motion.h3>
            
            <div className="flex items-center gap-3 mt-4">
              <span className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
                {cuisine}
              </span>
              {formattedDistance && (
                <div className="flex items-center gap-1.5 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-sm">near_me</span>
                  <span className="text-[11px] font-bold uppercase tracking-widest">{formattedDistance}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-primary font-bold text-xl tracking-tighter">{priceDisplay}</span>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant/60 flex items-center gap-2 mb-8">
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          <span className="line-clamp-1 font-medium">{address}</span>
        </p>

        {/* Actions */}
        <div className="pt-6 mt-auto flex gap-4 relative z-40 border-t border-outline/5">
          <Link 
            to={ROUTES.RESTAURANT_DETAIL(urlParam)}
            className="flex-1 px-4 py-4 rounded-2xl border border-outline/10 text-xs font-bold text-on-surface-variant/60 text-center transition-all duration-500 hover:bg-surface hover:text-on-surface uppercase tracking-[0.1em]"
          >
            {t('restaurants.card.view_details')}
          </Link>

          <Link 
            to={ROUTES.CREATE_BOOKING(urlParam)}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-4 py-4 rounded-2xl bg-primary text-white text-xs font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all text-center flex items-center justify-center uppercase tracking-[0.1em]"
          >
            {t('restaurants.card.book_now')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
