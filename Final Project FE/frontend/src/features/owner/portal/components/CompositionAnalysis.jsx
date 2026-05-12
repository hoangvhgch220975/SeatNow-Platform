import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * @file CompositionAnalysis.jsx
 * @description Thành phần Bento Grid hiển thị phân tích cơ cấu khách hàng (Cặp đôi, Nhóm nhỏ, Đại tiệc).
 */
const CompositionAnalysis = ({ guestSizeCounts }) => {
  const { t } = useTranslation();
  const { 
    couple = 0, 
    smallGroup = 0, 
    party = 0, 
    percentCouple = 0, 
    percentSmallGroup = 0, 
    percentParty = 0 
  } = guestSizeCounts || {};

  // Find the truly dominant group
  const maxPercent = Math.max(percentCouple, percentSmallGroup, percentParty);
  
  // Create segment data for dynamic rendering
  const segments = [
    {
      id: 'couple',
      label: t('owner_portal.overview.composition_couples'),
      count: couple,
      percent: percentCouple,
      icon: 'people',
      isDominant: percentCouple === maxPercent && maxPercent > 0,
      desc: t('owner_portal.overview.couples_duos_desc', { count: couple })
    },
    {
      id: 'smallGroup',
      label: t('owner_portal.overview.composition_small'),
      count: smallGroup,
      percent: percentSmallGroup,
      icon: 'group',
      isDominant: percentSmallGroup === maxPercent && maxPercent > 0,
      desc: t('owner_portal.overview.small_groups_desc', { count: smallGroup })
    },
    {
      id: 'party',
      label: t('owner_portal.overview.composition_large'),
      count: party,
      percent: percentParty,
      icon: 'groups',
      isDominant: percentParty === maxPercent && maxPercent > 0,
      desc: t('owner_portal.overview.large_parties_desc', { count: party })
    }
  ];

  // Sort segments to put dominant first (optional, but better for visual hierarchy)
  const sortedSegments = [...segments].sort((a, b) => b.percent - a.percent);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-1.5 rounded-full bg-slate-900"></div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('owner_portal.overview.guest_composition_title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sortedSegments.map((segment, index) => {
          if (index === 0) {
            // Featured Card (Dominant)
            return (
              <div 
                key={segment.id}
                className="bg-violet-600 p-8 rounded-[2.5rem] shadow-xl shadow-violet-200 space-y-6 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 text-white relative overflow-hidden group min-h-[240px]"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-[100px] text-white">{segment.icon}</span>
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                  <p className="text-[10px] font-black text-violet-200 uppercase tracking-widest">{segment.label}</p>
                  <div className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
                    {t('owner_portal.overview.dominant_peak')}
                  </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-5xl font-black">{segment.percent.toFixed(0)}%</p>
                  <p className="text-xs font-bold text-violet-100 mt-1 opacity-80 uppercase tracking-wider">{segment.desc}</p>
                </div>
              </div>
            );
          }

          // Summary Cards
          return (
            <div 
              key={segment.id}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 group min-h-[240px]"
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                  segment.id === 'party' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  <span className="material-symbols-outlined text-2xl">{segment.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{segment.label}</p>
                  <p className="text-3xl font-black text-slate-900">{segment.percent.toFixed(0)}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${segment.percent}%` }}
                    className={`h-full ${segment.id === 'party' ? 'bg-rose-500' : 'bg-indigo-500'}`}
                  />
                </div>
                <p className="text-[11px] font-bold text-slate-400 tracking-tight leading-relaxed">
                  {segment.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CompositionAnalysis;
