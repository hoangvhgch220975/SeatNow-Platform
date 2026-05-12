import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file PolicyPage.jsx
 * @description Trang Chính sách & Điều khoản của SeatNow - Dựa trên thiết kế premium được cung cấp.
 */
const PolicyPage = () => {
  const { t } = useTranslation();

  const tocItems = [
    { id: 'terms-of-use', label: t('public_policy.sections.toc.items.terms') },
    { id: 'privacy-policy', label: t('public_policy.sections.toc.items.privacy') },
    { id: 'booking-policy', label: t('public_policy.sections.toc.items.booking') },
    { id: 'deposit-policy', label: t('public_policy.sections.toc.items.deposit') },
    { id: 'refund-policy', label: t('public_policy.sections.toc.items.refund') },
    { id: 'responsibility', label: t('public_policy.sections.toc.items.liability') },
    { id: 'contact', label: t('public_policy.sections.toc.items.support') }
  ];

  const refundItems = t('public_policy.sections.refund.items', { returnObjects: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <main className="-mt-16 min-h-screen pt-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-surface-container-low mb-32 rounded-b-[5rem] shadow-2xl"
      >
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>
        <div className="relative z-10 text-center px-6 space-y-10">
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block py-3 px-8 rounded-full bg-primary/5 text-primary font-black text-[10px] tracking-[0.5em] uppercase mb-6 border border-primary/10"
          >
            {t('public_policy.hero.tag')}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-7xl md:text-[9rem] font-black tracking-tighter text-on-surface mb-8 headline leading-none uppercase"
          >
            {t('public_policy.hero.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-on-surface-variant/50 max-w-3xl mx-auto font-medium text-xl italic leading-relaxed"
          >
            {t('public_policy.hero.desc')}
          </motion.p>
        </div>
      </motion.section>

      {/* Main Content Layout */}
      <div className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-24">
        
        {/* Sidebar Table of Contents */}
        <aside className="lg:col-span-4 self-start sticky top-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 bg-white rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline/5"
          >
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] mb-12 flex items-center gap-5 text-primary">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
              {t('public_policy.sections.toc.title')}
            </h4>
            <nav className="space-y-2">
              {tocItems.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 p-5 rounded-2xl text-on-surface-variant/50 hover:bg-surface hover:text-primary transition-all group"
                >
                  <span className="w-2 h-2 rounded-full bg-outline/20 group-hover:bg-primary transition-all group-hover:scale-150"></span>
                  <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        </aside>

        {/* Content Area */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:col-span-8 space-y-32 pb-40"
        >
          
          {/* Section: Terms of Service */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-10" id="terms-of-use">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.terms.title')}
            </h2>
            <div className="text-on-surface-variant/70 space-y-8 leading-relaxed text-lg font-medium italic">
              <p>
                <Trans i18nKey="public_policy.sections.terms.intro">
                  Welcome to <strong>SeatNow</strong>. By accessing and using our services, you agree to comply with the following regulations.
                </Trans>
              </p>
              <p>{t('public_policy.sections.terms.p1')}</p>
              <ul className="space-y-6">
                {t('public_policy.sections.terms.list', { returnObjects: true }).map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 items-start group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <span className="pt-2">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Section: Privacy Policy */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-12" id="privacy-policy">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.privacy.title')}
            </h2>
            <div className="p-12 bg-surface rounded-[3rem] border border-outline/5 shadow-inner">
              <h3 className="text-[11px] font-black text-primary mb-6 flex items-center gap-4 uppercase tracking-[0.3em]">
                <span className="material-symbols-outlined text-2xl">security</span>
                {t('public_policy.sections.privacy.security_title')}
              </h3>
              <p className="text-on-surface-variant/60 leading-relaxed text-base font-medium italic">
                {t('public_policy.sections.privacy.security_desc')}
              </p>
            </div>
            <div className="space-y-8 text-on-surface-variant/70 leading-relaxed text-lg font-medium">
              <p>{t('public_policy.sections.privacy.p1')}</p>
            </div>
          </motion.section>

          {/* Section: Booking Policy */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-12" id="booking-policy">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.booking.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-12 border border-outline/5 rounded-[3rem] bg-white shadow-sm hover:shadow-2xl transition-all duration-700 group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-3xl">schedule</span>
                </div>
                <h4 className="font-black text-on-surface mb-4 headline text-xl">{t('public_policy.sections.booking.advance.title')}</h4>
                <p className="text-[15px] text-on-surface-variant/50 leading-relaxed font-medium italic">
                  {t('public_policy.sections.booking.advance.desc')}
                </p>
              </div>
              <div className="p-12 border border-outline/5 rounded-[3rem] bg-white shadow-sm hover:shadow-2xl transition-all duration-700 group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <h4 className="font-black text-on-surface mb-4 headline text-xl">{t('public_policy.sections.booking.guests.title')}</h4>
                <p className="text-[15px] text-on-surface-variant/50 leading-relaxed font-medium italic">
                  {t('public_policy.sections.booking.guests.desc')}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section: Deposit Policy */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-10" id="deposit-policy">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.deposit.title')}
            </h2>
            <p className="text-on-surface-variant/70 mb-10 leading-relaxed text-lg font-medium">
              {t('public_policy.sections.deposit.desc')}
            </p>
            <div className="bg-primary/5 p-16 rounded-[4rem] border-l-[1rem] border-primary shadow-2xl shadow-primary/5 italic">
              <p className="text-2xl text-on-surface font-medium leading-relaxed">
                "{t('public_policy.sections.deposit.quote')}"
              </p>
            </div>
          </motion.section>

          {/* Section: Cancellation & Refund */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-12" id="refund-policy">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.refund.title')}
            </h2>
            <div className="space-y-12">
              {refundItems.map((item, idx) => (
                <motion.div 
                  key={item.step} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="flex items-start gap-10 group"
                >
                  <span className="font-black text-primary py-4 px-8 bg-primary/5 rounded-[2rem] group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-xl shadow-primary/5 text-xl">
                    {item.step}
                  </span>
                  <div className="space-y-3">
                    <h4 className="font-black text-on-surface text-2xl headline leading-tight">{item.title}</h4>
                    <p className="text-[15px] text-on-surface-variant/50 leading-relaxed font-medium italic">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section: Liability */}
          <motion.section variants={itemVariants} className="scroll-mt-32 space-y-10" id="responsibility">
            <h2 className="text-6xl font-black tracking-tight text-on-surface headline leading-tight">
              {t('public_policy.sections.liability.title')}
            </h2>
            <div className="text-on-surface-variant/70 space-y-8 leading-relaxed text-2xl font-medium italic text-center py-10">
              <p>
                <Trans i18nKey="public_policy.sections.liability.p1">
                  <strong>SeatNow</strong> is not responsible for claims related to food quality, direct service at the restaurant, or incidents beyond the control of the platform.
                </Trans>
              </p>
              <div className="h-px bg-outline/10 w-32 mx-auto"></div>
              <p className="text-on-surface-variant/30 text-[13px] uppercase tracking-[0.3em] not-italic font-black">{t('public_policy.sections.liability.p2')}</p>
            </div>
          </motion.section>

          {/* Section: Support Contact */}
          <motion.section variants={itemVariants} className="scroll-mt-32" id="contact">
            <div className="bg-primary p-20 rounded-[5rem] text-on-primary shadow-[0_60px_120px_-20px_rgba(var(--primary-rgb),0.4)] relative overflow-hidden group">
               {/* Decorative background circle */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-64 -mt-64 transition-transform duration-[2s] group-hover:scale-110"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32"></div>

              <h3 className="text-6xl font-black mb-6 relative z-10 headline leading-tight">{t('public_policy.sections.support.hero_title')}</h3>
              <p className="mb-16 text-white/70 font-medium text-xl italic relative z-10">
                {t('public_policy.sections.support.hero_desc')}
              </p>
              <div className="flex flex-wrap gap-10 relative z-10">
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="flex items-center gap-6 bg-white/10 px-10 py-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
                >
                  <span className="material-symbols-outlined text-white text-3xl">call</span>
                  <span className="font-black text-2xl tracking-tighter">(0812823285)</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -10 }}
                  className="flex items-center gap-6 bg-white/10 px-10 py-6 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl"
                >
                  <span className="material-symbols-outlined text-white text-3xl">mail</span>
                  <span className="font-black text-2xl tracking-tighter">hoangvhgch220975@fpt.edu.vn</span>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
};

export default PolicyPage;
