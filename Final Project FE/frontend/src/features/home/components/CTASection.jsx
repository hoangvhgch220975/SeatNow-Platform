import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file CTASection.jsx
 * @description Phần kêu gọi hành động cuối trang chủ. Hỗ trợ đa ngôn ngữ.
 */
const CTASection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-24 max-w-7xl mx-auto px-8 w-full">
      <div className="bg-primary rounded-xl p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" width="100%">
            <path d="M0 100 C 20 0 50 0 100 100" fill="transparent" stroke="white" strokeWidth="0.5"></path>
            <path d="M0 80 C 30 10 70 10 100 80" fill="transparent" stroke="white" strokeWidth="0.5"></path>
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-[3rem] font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-200 mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link 
            to={ROUTES.RESTAURANT_LIST || '/restaurants'}
            className="inline-block bg-white text-primary px-12 py-5 rounded-full font-extrabold text-xl hover:scale-105 transition-transform shadow-2xl"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
