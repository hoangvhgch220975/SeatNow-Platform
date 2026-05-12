import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import PartnerRequestModal from '../components/PartnerRequestModal';

/**
 * @file OwnerJoinPage.jsx
 * @description Trang giới thiệu dành cho chủ nhà hàng muốn tham gia hệ thống SeatNow.
 * Thiết kế phong cách Landing Page cao cấp, cinematic và hỗ trợ đa ngôn ngữ.
 */
const OwnerJoinPage = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-primary/10 font-body text-on-surface overflow-hidden -mt-15">
      {/* Background Cinematic Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px]"></div>
      </div>

      <main className="relative z-10 pt-28 pb-40 px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto relative"
        >
          {/* Back Navigation - Repositioned to Absolute */}
          <motion.div variants={itemVariants} className="absolute -top-12 left-0 z-20">
            <Link 
              to={ROUTES.HOME}
              className="inline-flex items-center gap-4 text-on-surface-variant/40 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.4em] group"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </div>
              {t('auth.ownerJoin.backHome')}
            </Link>
          </motion.div>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-40">
            <div className="lg:col-span-8 space-y-10">
              <motion.div variants={itemVariants}>
                <span className="inline-block px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-10 border border-primary/10">
                   Partnership Program
                </span>
                <h1 className="text-8xl md:text-[9rem] font-black leading-[0.85] tracking-tighter headline uppercase mb-12">
                  {t('auth.ownerJoin.heroTitle')} <br/>
                  <span className="text-primary italic">SeatNow.</span>
                </h1>
                <p className="text-2xl text-on-surface-variant/50 leading-relaxed font-medium max-w-3xl italic">
                  {t('auth.ownerJoin.heroSubtitle')}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-8">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openModal}
                  className="px-16 py-8 bg-primary text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-[0_40px_80px_-20px_rgba(var(--primary-rgb),0.4)] hover:brightness-110 transition-all active:scale-95 flex items-center gap-6 group"
                >
                  {t('auth.ownerJoin.applyBtn')}
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </motion.button>
              </motion.div>
            </div>

            <motion.div 
              variants={itemVariants}
              className="lg:col-span-4 relative hidden lg:block"
            >
               <div className="absolute inset-0 bg-primary/10 rounded-[4rem] blur-3xl -z-10 rotate-12"></div>
               <div className="aspect-[4/5] bg-surface rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop" 
                    alt="Luxury Restaurant" 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-12 left-12 right-12 text-white space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Success Story</p>
                     <p className="text-xl font-bold italic leading-tight">"Joining SeatNow was our best business decision in 2026."</p>
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-24">
            <motion.div variants={itemVariants} className="text-center space-y-6">
               <h2 className="text-5xl font-black headline tracking-tight uppercase">Why partner with us?</h2>
               <p className="text-on-surface-variant/40 font-bold uppercase tracking-[0.3em] text-[11px]">The ultimate ecosystem for growth</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: 'trending_up',
                  title: t('auth.ownerJoin.benefit1Title'),
                  desc: t('auth.ownerJoin.benefit1Desc'),
                  color: 'bg-emerald-500/10 text-emerald-600'
                },
                {
                  icon: 'analytics',
                  title: t('auth.ownerJoin.benefit2Title'),
                  desc: t('auth.ownerJoin.benefit2Desc'),
                  color: 'bg-primary/5 text-primary'
                },
                {
                  icon: 'hub',
                  title: t('auth.ownerJoin.benefit3Title'),
                  desc: t('auth.ownerJoin.benefit3Desc'),
                  color: 'bg-amber-500/10 text-amber-600'
                }
              ].map((benefit, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -20 }}
                  className="bg-white p-14 rounded-[4rem] shadow-sm hover:shadow-[0_60px_120px_-20px_rgba(0,0,0,0.08)] border border-outline/5 transition-all duration-700 group flex flex-col items-start"
                >
                  <div className={`w-20 h-20 ${benefit.color} rounded-3xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 shadow-inner`}>
                    <span className="material-symbols-outlined text-4xl font-bold">{benefit.icon}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-6 tracking-tight headline leading-tight">{benefit.title}</h3>
                  <p className="text-on-surface-variant/50 leading-relaxed font-medium italic text-[15px]">
                    {benefit.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Identity */}
      <footer className="py-32 border-t border-outline/5 bg-surface/30">
        <div className="max-w-4xl mx-auto px-8 text-center space-y-12">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-6xl font-black tracking-tighter italic text-on-surface-variant/20 headline uppercase"
          >
            "{t('auth.ownerJoin.footerSlogan')}"
          </motion.h2>
          <div className="h-px w-32 bg-outline/10 mx-auto"></div>
          <div className="space-y-4">
             <span className="block text-[11px] font-black uppercase tracking-[0.5em] text-primary">
               SeatNow Executive Business Solutions
             </span>
             <p className="text-on-surface-variant/30 text-[10px] font-bold uppercase tracking-widest">
                &copy; 2026 Global Partners Network. All Rights Reserved.
             </p>
          </div>
        </div>
      </footer>

      {/* Partner Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <PartnerRequestModal isOpen={isModalOpen} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerJoinPage;
