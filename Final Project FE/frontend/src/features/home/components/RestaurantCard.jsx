import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import { slugify } from '../../../shared/utils/slugify.js';
import { useRestaurantReviewSummary } from '../../reviews/hooks.js';

/**
 * @file RestaurantCard.jsx
 * @description Card nhà hàng cao cấp với hiệu ứng 3D Tilt tương tác theo chuột và Glare effect.
 */
const RestaurantCard = ({ restaurant }) => {
  const { t } = useTranslation();
  const cardRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const restId = restaurant.id || restaurant._id;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { data: summaryData } = useRestaurantReviewSummary(restaurant.slug || restId);
  const summary = summaryData?.data || summaryData;

  const hasHistory = summary && typeof summary.totalReviews === 'number';
  const displayRating = hasHistory ? summary.averageRating : (restaurant.ratingAvg || 0);
  const displayCount = hasHistory ? summary.totalReviews : (restaurant.ratingCount || 0);
  const isAvailable = displayCount > 0;

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
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Glare effect logic
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useTransform(mouseXSpring, (v) => !isMobile && (Math.abs(v) > 0 || Math.abs(y.get()) > 0) ? 0.15 : 0);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isMobile ? {} : { y: -10 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: isMobile ? 0 : rotateX,
        rotateY: isMobile ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white rounded-[2rem] overflow-hidden shadow-sm border border-outline/5 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out-expo h-full"
    >
      {/* Glare/Shine Effect */}
      <motion.div 
        style={{ 
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, transparent 80%)`,
          opacity: glareOpacity
        }}
        className="absolute inset-0 z-30 pointer-events-none"
      />

      <Link 
        to={ROUTES.RESTAURANT_DETAIL(restaurant.slug || slugify(restaurant.name) || restId)}
        className="absolute inset-0 z-50 cursor-pointer"
      />

      <div className="h-64 relative overflow-hidden" style={{ transform: "translateZ(30px)" }}>
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out-expo" 
          alt={restaurant.name} 
          src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'}
          draggable="false"
        />
        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl flex items-center gap-1.5 z-20 shadow-xl shadow-black/10 border border-white/20">
          <span className={`material-symbols-outlined text-sm ${isAvailable ? 'text-amber-500' : 'text-outline/20'}`} style={{fontVariationSettings: "'FILL' 1"}}>star</span>
          <span className="text-xs font-bold text-on-surface">
            {isAvailable ? Number(displayRating).toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
      
      <div className="p-8" style={{ transform: "translateZ(50px)" }}>
        <div className="flex justify-between items-start mb-3">
          <div className="pr-2 text-left">
            <h3 className="text-xl font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors duration-500">{restaurant.name}</h3>
          </div>
          <span className="text-primary font-bold text-lg tracking-tighter">
            {'$'.repeat(restaurant.priceRange || 2)}
          </span>
        </div>
        
        <p className="text-on-surface-variant/50 text-xs mb-6 flex items-center gap-2 text-left font-bold uppercase tracking-widest">
          <span className="material-symbols-outlined text-[18px] text-primary/40">location_on</span> 
          <span className="line-clamp-1">{restaurant.address || restaurant.location || 'Vietnam'}</span>
        </p>
        
        <div className="flex items-center gap-3 mb-10">
          <span className="px-3 py-1.5 rounded-xl bg-surface text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/60 border border-outline/5">
            {(restaurant.cuisineTypes && restaurant.cuisineTypes[0]) || restaurant.cuisine || t('home.featured.cuisine_fallback')}
          </span>
        </div>
        
        <div className="relative z-20">
          <div className="flex items-center justify-center w-full py-4 border border-outline/10 rounded-2xl font-bold text-primary group-hover:bg-primary group-hover:text-white group-hover:border-transparent group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-500 ease-out-expo text-[11px] uppercase tracking-[0.2em]">
            {t('home.featured.view_details')}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
