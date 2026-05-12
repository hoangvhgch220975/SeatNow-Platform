import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [1, 2, 3, 4];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-40 bg-surface relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <h2 className="text-6xl font-black text-on-surface headline tracking-tight uppercase">
            {t('home.how.title')}
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center"
        >
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-16 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
          
          {steps.map((step) => (
            <motion.div 
              key={step}
              variants={stepVariants}
              className="relative space-y-10 group"
            >
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/40 transition-colors duration-500"></div>
                <div className="relative w-full h-full bg-white rounded-full border-4 border-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-4xl font-black text-primary headline italic">{step}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <h5 className="text-2xl font-bold text-on-surface headline tracking-tight uppercase group-hover:text-primary transition-colors">
                  {t(`home.how.step${step}.title`)}
                </h5>
                <p className="text-on-surface-variant/50 font-medium italic leading-relaxed text-sm">
                  {t(`home.how.step${step}.desc`)}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
