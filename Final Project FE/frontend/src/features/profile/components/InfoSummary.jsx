import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { formatDateTime } from '@/shared/utils/formatDateTime.js';
import InfoCard from './InfoCard.jsx';

/**
 * @file InfoSummary.jsx
 * @description Card tổng hợp các trường thông tin chi tiết cao cấp.
 */
const InfoSummary = ({ user }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-12 lg:p-14 rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] flex flex-col h-full hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.1)] transition-all duration-700"
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-black text-on-surface headline tracking-tight">
          {t('profile.summary.title')}
        </h2>
        <span className="material-symbols-outlined text-primary/20 text-3xl animate-pulse">shield_with_heart</span>
      </div>

      <div className="space-y-4 flex-grow">
        <InfoCard 
          label={t('profile.summary.id_label')}
          value={user?.id} 
          icon="fingerprint" 
          color="bg-slate-900 text-white" 
        />
        
        <InfoCard 
          label={t('profile.summary.email_label')}
          value={user?.email} 
          icon="alternate_email" 
          color="bg-primary/10 text-primary" 
        />

        <InfoCard 
          label={t('profile.summary.phone_label')}
          value={user?.phone || t('profile.summary.not_provided')}
          icon="call" 
          color="bg-green-500/10 text-green-500" 
        />

        <InfoCard 
          label={t('profile.summary.protocol_label')}
          value={t('profile.summary.status_active')} 
          icon="verified_user" 
          color="bg-blue-500/10 text-blue-500" 
        />

        <InfoCard 
          label={t('profile.summary.reg_date_label')}
          value={user?.createdAt ? formatDateTime(user?.createdAt) : 'N/A'} 
          icon="event_note" 
          color="bg-amber-500/10 text-amber-500" 
        />
      </div>

      <div className="mt-12 pt-8 border-t border-outline/5 text-center">
        <p className="text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.4em] italic">
          {t('profile.summary.encrypted_storage')}
        </p>
      </div>
    </motion.div>
  );
};

export default InfoSummary;
