import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const { t } = useTranslation();

  const features = [
    { id: 'instant', icon: 'bolt', delay: 0.1 },
    { id: 'curated', icon: 'verified', delay: 0.2 },
    { id: 'smart', icon: 'smart_toy', delay: 0.3 },
    { id: 'ai', icon: 'support_agent', delay: 0.4 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-40 bg-surface relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-6"
        >
          <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">
            {t('home.why.badge') || 'Excellence'}
          </span>
          <h2 className="text-6xl font-bold text-on-surface headline tracking-tight uppercase">
            {t('home.why.title')}
          </h2>
          <p className="text-xl text-on-surface-variant/50 max-w-2xl mx-auto font-medium italic">
            {t('home.why.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{ y: -15 }}
              className="group bg-white p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] border border-outline/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-xl group-hover:shadow-primary/30">
                <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-4 text-on-surface headline tracking-tight uppercase">
                {t(`home.why.features.${feature.id}.title`)}
              </h4>
              <p className="text-on-surface-variant/60 leading-relaxed font-medium text-sm italic">
                {t(`home.why.features.${feature.id}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
