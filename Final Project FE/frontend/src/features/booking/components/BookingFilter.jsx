import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file BookingFilter.jsx
 * @description Bộ lọc tabs cao cấp cho lịch sử đặt bàn.
 */
const BookingFilter = ({ activeTab, setActiveTab, counts }) => {
  const { t } = useTranslation();
  const tabs = [
    { label: t('booking.history.tabs.all'), key: 'all' },
    { label: t('booking.history.tabs.upcoming'), key: 'upcoming' },
    { label: t('booking.history.tabs.completed'), key: 'completed' },
    { label: t('booking.history.tabs.canceled'), key: 'canceled' }
  ];

  return (
    <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-6 pt-2 px-2 no-scrollbar mask-edges">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <motion.button
            key={tab.key}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-black transition-all whitespace-nowrap border ${
              isActive
                ? 'bg-primary text-white border-primary shadow-[0_15px_30px_-5px_rgba(var(--primary-rgb),0.3)] scale-[1.02]'
                : 'bg-surface text-on-surface-variant/40 border-outline/5 hover:bg-white hover:border-primary/20 hover:text-primary hover:shadow-md'
            }`}
          >
            <span className="text-[11px] uppercase tracking-[0.2em]">{tab.label}</span>
            <span className={`flex items-center justify-center min-w-[24px] h-[24px] rounded-full text-[10px] font-black ${
              isActive ? 'bg-white text-primary' : 'bg-on-surface-variant/5 text-on-surface-variant/40 group-hover:text-primary'
            }`}>
              {counts[tab.key] || 0}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default BookingFilter;
