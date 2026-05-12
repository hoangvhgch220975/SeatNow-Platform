import React from 'react';
import { useTranslation } from 'react-i18next';
import InfoCard from './InfoCard.jsx';
import { formatDateTime } from '@/shared/utils/formatDateTime.js';

/**
 * @file OwnerInfoSummary.jsx
 * @description Card tổng hợp thông tin xác thực doanh nghiệp dành cho Chủ nhà hàng. Hỗ trợ đa ngôn ngữ.
 */
const OwnerInfoSummary = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full relative overflow-hidden">
      
      {/* Structural Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
        <div className="space-y-1">
           <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
             {t('profile.owner.summary.title')}
           </h2>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
             {t('profile.owner.summary.reg_details')}
           </p>
        </div>
        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
           <span className="material-symbols-outlined">badge</span>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        <InfoCard 
          label={t('profile.owner.summary.id_label')}
          value={user?.id} 
          icon="fingerprint" 
          color="bg-slate-900 text-white" 
        />
        
        <InfoCard 
          label={t('profile.owner.summary.email_label')}
          value={user?.email} 
          icon="alternate_email" 
          color="bg-violet-50 text-violet-600" 
        />

        <InfoCard 
          label={t('profile.owner.summary.phone_label')}
          value={user?.phone || t('profile.owner.summary.not_registered')} 
          icon="call" 
          color="bg-slate-100 text-slate-600" 
        />

        <InfoCard 
          label={t('profile.owner.summary.reg_timeline')}
          value={user?.createdAt ? formatDateTime(user?.createdAt) : 'N/A'} 
          icon="calendar_month" 
          color="bg-violet-50 text-violet-500" 
        />
        
        <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center justify-between mt-auto">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                 <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                 <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                   {t('profile.owner.summary.protocol_status')}
                 </p>
                 <p className="text-sm font-black text-emerald-900">
                   {t('profile.owner.summary.system_active')}
                 </p>
              </div>
           </div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">
             {t('profile.owner.summary.encrypted')}
           </span>
        </div>
      </div>
    </div>
  );
};

export default OwnerInfoSummary;
