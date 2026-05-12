import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ROUTES } from '@/config/routes.js';
import RestaurantStatusBadge from './RestaurantStatusBadge';
import { motion } from 'framer-motion';

/**
 * @file VenueTable.jsx
 * @description Hiển thị danh sách nhà hàng dưới dạng Bảng (Table).
 * Hỗ trợ đa ngôn ngữ cho các tiêu đề cột.
 */
const VenueTable = ({ restaurants }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('owner_portal.venues_page.table_venue_details')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('owner_portal.venues_page.table_status')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('owner_portal.venues_page.table_satisfaction')}</th>
              <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('owner_portal.venues_page.table_cuisine')}</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">{t('owner_portal.venues_page.table_action')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {restaurants.map((venue) => {
              const satisfaction = (venue.ratingAvg || 0) * 20;
              const isSuspended = venue.status?.toLowerCase() === 'suspended';

              return (
                <motion.tr 
                  key={venue.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`hover:bg-slate-50/50 transition-colors group ${isSuspended ? 'opacity-60' : ''}`}
                >
                  {/* Venue Details */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/50">
                        {venue.images?.[0] ? (
                          <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <span className="material-symbols-outlined text-xl">restaurant</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">{venue.name}</h5>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[200px]">
                          {venue.address}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-6">
                    <RestaurantStatusBadge status={venue.status} />
                  </td>

                  {/* Satisfaction Score */}
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between w-24">
                        <span className="text-xs font-black text-slate-700">{satisfaction.toFixed(0)}%</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${satisfaction}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                             satisfaction > 80 ? 'bg-emerald-500' : 
                             satisfaction > 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Cuisine */}
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {venue.cuisineTypes?.[0] || t('common.premium')}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-6 text-right">
                    <Link 
                      to={ROUTES.WORKSPACE_DASHBOARD(venue.slug || venue.id)}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all shadow-sm hover:shadow-lg active:scale-90 ${
                        isSuspended 
                          ? 'bg-slate-200 text-slate-500 hover:bg-slate-300' 
                          : 'bg-slate-900 text-white hover:bg-violet-600 hover:shadow-violet-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {isSuspended ? 'settings_suggest' : 'arrow_forward'}
                      </span>
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VenueTable;
