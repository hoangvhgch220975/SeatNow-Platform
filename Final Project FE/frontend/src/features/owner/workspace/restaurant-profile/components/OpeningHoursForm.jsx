import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file OpeningHoursForm.jsx
 * @description Hiển thị thời gian hoạt động của nhà hàng theo từng ngày (View-only).
 */
const OpeningHoursForm = ({ restaurant, isLoading }) => {
  const { t } = useTranslation();
  
  // Bộ giải mã thông minh (Smart Parser) (Vietnamese comment)
  const getWeeklyHours = () => {
    if (!restaurant?.openingHours) return [];
    
    let hoursObj = restaurant.openingHours;
    if (typeof hoursObj === 'string') {
      try {
        hoursObj = JSON.parse(hoursObj);
      } catch (e) {
        // Fallback cho định dạng string đơn giản (Vietnamese comment)
        return days.map(day => ({ 
          key: day, 
          label: t(`restaurants.info.days.${day.charAt(0).toUpperCase() + day.slice(1)}`), 
          hours: hoursObj 
        }));
      }
    }

    if (typeof hoursObj !== 'object' || hoursObj === null) return [];

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyData = {};
    daysOrder.forEach(d => weeklyData[d] = t('workspace.profile.hero.inactive'));

    Object.entries(hoursObj).forEach(([key, value]) => {
      const k = key.toLowerCase();
      
      if (k.includes('monday-sunday') || k.includes('mon-sun') || k.includes('everyday')) {
        daysOrder.forEach(d => weeklyData[d] = value);
      } else if (k.includes('weekday') || k.includes('mon-fri') || k.includes('monday-friday')) {
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(d => weeklyData[d] = value);
      } else if (k.includes('weekend') || k.includes('sat-sun') || k.includes('saturday-sunday')) {
        ['Saturday', 'Sunday'].forEach(d => weeklyData[d] = value);
      } else {
        const matchedDay = daysOrder.find(d => k.includes(d.toLowerCase()) || k.includes(d.toLowerCase().substring(0, 3)));
        if (matchedDay) weeklyData[matchedDay] = value;
      }
    });

    return daysOrder.map(day => ({
      key: day.toLowerCase(),
      label: t(`restaurants.info.days.${day}`),
      hours: weeklyData[day]
    }));
  };

  const parsedHours = getWeeklyHours();

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_-20px_rgba(14,165,233,0.1)] border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {t('workspace.profile.opening_hours')}
            </h3>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
              {t('workspace.profile.common.section')} 03
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {parsedHours.map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl group border border-transparent hover:border-amber-100">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-black text-slate-600 uppercase tracking-tight group-hover:text-slate-900">
                {item.label}
              </span>
            </div>
            
            <div className="px-4 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
              <span className="text-sm font-bold text-slate-900">
                {item.hours}
              </span>
            </div>
          </div>
        ))}
      </div>


      <div className="mt-6 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
        <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
          {t('workspace.profile.deposit.opening_hours_note')}
        </p>
      </div>
    </div>
  );
};

export default OpeningHoursForm;
