import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ROUTES } from '@/config/routes.js';
import { useAuthStore } from '@/features/auth/store.js';
import bannerImg from '@/assets/images/banners/banner.png';

/**
 * @file HeroSection.jsx
 * @description Hero Section cao cấp với hiệu ứng 3D Parallax tương tác theo chuột và cuộn trang.
 */
const HeroSection = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Scroll Parallax
  const { scrollY } = useScroll();
  const scrollYTransform = useTransform(scrollY, [0, 500], [0, 250]);
  const scrollScale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const scrollOpacity = useTransform(scrollY, [0, 500], [0.7, 0.2]);

  // Mouse Parallax (Only on Desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const bgX = useTransform(springX, [-0.5, 0.5], ["2%", "-2%"]);
  const bgY = useTransform(springY, [-0.5, 0.5], ["2%", "-2%"]);
  
  // Combined Parallax Y (Scroll + Mouse)
  const combinedBgY = useTransform(
    [scrollYTransform, bgY],
    ([sY, mY]) => isMobile ? `${sY}px` : `calc(${sY}px + ${mY})`
  );
  
  const textX = useTransform(springX, [-0.5, 0.5], ["20px", "-20px"]);
  const textY = useTransform(springY, [-0.5, 0.5], ["10px", "-10px"]);

  // Floating elements parallax
  const floatX1 = useTransform(springX, [-0.5, 0.5], ["100px", "-100px"]);
  const floatY1 = useTransform(springY, [-0.5, 0.5], ["50px", "-50px"]);
  const floatX2 = useTransform(springX, [-0.5, 0.5], ["-60px", "60px"]);
  const floatY2 = useTransform(springY, [-0.5, 0.5], ["-30px", "30px"]);

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const isCustomer = isAuthenticated && user?.role?.toUpperCase() === 'CUSTOMER';
  const displayName = user?.fullName || user?.name || 'Friend';

  return (
    <section 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      className="relative min-h-[950px] flex items-center overflow-hidden px-8 bg-black"
      style={{ perspective: 1500 }}
    >
      {/* 3D Background Layer */}
      <motion.div 
        style={{ 
          scale: scrollScale,
          x: isMobile ? 0 : bgX,
          y: combinedBgY
        }}
        className="absolute inset-0 z-0"
      >
        <img 
          className="w-full h-full object-cover brightness-[0.6] scale-110" 
          alt="Luxury fine dining" 
          src={bannerImg}
        />
        <motion.div 
          style={{ opacity: scrollOpacity }}
          className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"
        />
      </motion.div>

      {/* Decorative 3D Elements (Floating Icons) */}
      <motion.div 
        style={{ 
          x: isMobile ? 0 : floatX1,
          y: isMobile ? 0 : floatY1,
          rotateZ: 15
        }}
        className="absolute top-1/4 right-1/4 z-10 opacity-20 hidden lg:block pointer-events-none"
      >
        <span className="material-symbols-outlined text-[120px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
      </motion.div>

      <motion.div 
        style={{ 
          x: isMobile ? 0 : floatX2,
          y: isMobile ? 0 : floatY2,
          rotateZ: -20
        }}
        className="absolute bottom-1/4 left-1/4 z-10 opacity-10 hidden lg:block pointer-events-none"
      >
        <span className="material-symbols-outlined text-[80px] text-white">wine_bar</span>
      </motion.div>

      {/* Content Layer */}
      <div className="relative z-20 max-w-7xl mx-auto w-full pt-20">
        <motion.div 
          style={{ x: isMobile ? 0 : textX, y: isMobile ? 0 : textY }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Badge */}
          {isCustomer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-4 mb-14 group cursor-default"
            >
              {/* Outer glow ring */}
              <div className="relative inline-flex items-center gap-4 px-8 py-4 rounded-full bg-primary border border-primary/50 shadow-[0_0_40px_rgba(99,14,212,0.7),0_0_80px_rgba(99,14,212,0.3)] backdrop-blur-xl overflow-hidden">
                {/* Animated shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out" />
                {/* Pulse dot */}
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span>
                </span>
                <span className="text-white text-[13px] font-black tracking-[0.35em] uppercase relative z-10 drop-shadow">
                  {t('home.hero.welcome_back', { name: displayName })}
                </span>
              </div>
            </motion.div>
          )}

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[5.5rem] font-bold leading-[0.95] text-white mb-12 tracking-[-0.04em] headline drop-shadow-2xl"
            dangerouslySetInnerHTML={{ 
              __html: isCustomer ? t('home.hero.title_customer') : t('home.hero.title_guest') 
            }}
          />

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl text-white/60 mb-16 leading-relaxed max-w-2xl font-medium"
          >
            {isCustomer 
              ? t('home.hero.subtitle_customer')
              : t('home.hero.subtitle_guest')
            }
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-8"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.08, y: -10, rotateX: 10 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link 
                to={ROUTES.RESTAURANT_LIST}
                className="bg-primary text-white px-14 py-6 rounded-2xl font-bold text-xl shadow-[0_20px_50px_rgba(99,14,212,0.4)] inline-block tracking-wider"
                style={{ transform: "translateZ(30px)" }}
              >
                {isCustomer ? t('home.hero.book_table') : t('home.hero.book_now')}
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.08, y: -10, rotateX: -10 }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link 
                to={isCustomer ? ROUTES.BOOKING_HISTORY : ROUTES.RESTAURANT_LIST}
                className="group flex items-center gap-5 text-on-surface font-bold text-xl px-14 py-6 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all duration-500 hover:bg-white/95"
                style={{ transform: "translateZ(30px)" }}
              >
                {isCustomer ? t('home.hero.my_reservations') : t('home.hero.explore_restaurants')}
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-3 transition-transform duration-500 ease-out-expo">
                  {isCustomer ? 'history' : 'arrow_forward'}
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
