import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file GuestAnalysisBreakdown.jsx
 * @description Thành phần phân tích quy mô nhóm khách (Guest Size Breakdown).
 */
const GuestAnalysisBreakdown = ({ guestSizeCounts, isLoading }) => {
  const { t } = useTranslation();

  const categories = [
    { 
      key: 'couple', 
      label: t('workspace.analysis.couple', { defaultValue: 'Couple (1-2)' }), 
      count: guestSizeCounts?.couple || 0, 
      percent: guestSizeCounts?.percentCouple || 0,
      color: 'bg-violet-500',
      icon: 'person'
    },
    { 
      key: 'smallGroup', 
      label: t('workspace.analysis.small_group', { defaultValue: 'Small Group (3-7)' }), 
      count: guestSizeCounts?.smallGroup || 0, 
      percent: guestSizeCounts?.percentSmallGroup || 0,
      color: 'bg-indigo-500',
      icon: 'group'
    },
    { 
      key: 'party', 
      label: t('workspace.analysis.party', { defaultValue: 'Party (8+)' }), 
      count: guestSizeCounts?.party || 0, 
      percent: guestSizeCounts?.percentParty || 0,
      color: 'bg-blue-500',
      icon: 'groups'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(99,14,212,0.02)] border border-slate-50 flex flex-col h-full">
      <div className="mb-5">
        <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
          {t('workspace.dashboard.guest_analysis', { defaultValue: 'Guest Analysis' })}
        </h4>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
          {t('workspace.dashboard.demographics_capacity', { defaultValue: 'Demographics & Capacity' })}
        </p>
      </div>

      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-slate-50 animate-pulse rounded-lg" />
              <div className="h-2 w-full bg-slate-50 animate-pulse rounded-full" />
            </div>
          ))
        ) : (
          categories.map((cat, idx) => (
            <div key={cat.key} className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm">{cat.icon}</span>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{cat.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">{cat.percent.toFixed(1)}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    <span className="text-primary font-black text-[10px] mr-1">{cat.count}</span>
                    {t('workspace.analysis.bookings', { defaultValue: 'Bookings' })}
                  </p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.percent}%` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                  className={`h-full ${cat.color} rounded-full`}
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-50">
        <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
           <span>{t('workspace.analysis.period_summary', { defaultValue: 'Period Summary' })}</span>
           <span className="text-slate-900">{t('workspace.analysis.total_percent', { defaultValue: '100% Total' })}</span>
        </div>
      </div>
    </div>
  );
};

export default GuestAnalysisBreakdown;
