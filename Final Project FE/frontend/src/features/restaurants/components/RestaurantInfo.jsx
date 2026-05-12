import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file RestaurantInfo.jsx
 * @description Hiển thị thông tin chi tiết nhà hàng (About, Hours, Deposit, Map, Amenities).
 */
const RestaurantInfo = ({ 
  description, 
  amenities, 
  cuisineTypes, 
  openingHours, 
  depositEnabled,
  latitude,
  longitude
}) => {
  const { t } = useTranslation();
  
  const getWeeklyHours = () => {
    if (!openingHours) return [];
    let hoursObj = openingHours;
    if (typeof openingHours === 'string') {
      try { hoursObj = JSON.parse(openingHours); } 
      catch (e) { return [{ day: t('restaurants.info.everyday'), hours: openingHours, isToday: true }]; }
    }
    if (typeof hoursObj !== 'object' || hoursObj === null) return [];

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weeklyData = {};
    daysOrder.forEach(d => weeklyData[d] = t('restaurants.info.closed'));

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

    const standardDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const realToday = standardDayNames[new Date().getDay()];

    return daysOrder.map(day => ({
      day: t(`restaurants.info.days.${day}`),
      hours: weeklyData[day],
      isToday: day === realToday
    }));
  };

  const weeklyHours = getWeeklyHours();
  const mapEmbedUrl = (latitude && longitude) 
    ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
    : null;

  return (
    <div className="space-y-32">
      {/* About Section - Luxury Reveal */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-12"
      >
        <div className="flex items-center gap-6">
          <div className="h-px bg-primary/20 flex-1"></div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary whitespace-nowrap">
            {t('restaurants.info.about')}
          </h2>
          <div className="h-px bg-primary/20 flex-1"></div>
        </div>
        <p className="text-3xl text-on-surface leading-[1.6] font-medium headline italic text-center max-w-5xl mx-auto px-10">
          "{description}"
        </p>
      </motion.div>

      {/* Bento Layout: Main Details */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
        
        {/* Card 1: Operating Hours (Bento Large) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="xl:col-span-7 p-12 bg-white rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-primary/10 transition-all duration-700 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-5 mb-12">
              <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                <span className="material-symbols-outlined text-3xl font-bold">schedule</span>
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
                {t('restaurants.info.operating_hours')}
              </h4>
            </div>
            
            <div className="flex flex-col gap-3">
              {weeklyHours.length > 0 ? (
                weeklyHours.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className={`flex justify-between items-center px-10 py-5 rounded-[2rem] transition-all duration-500 border relative group overflow-hidden ${
                      item.isToday 
                        ? 'bg-primary text-white border-primary shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] scale-[1.02] z-10' 
                        : 'text-on-surface-variant/60 hover:bg-primary/5 border-transparent hover:border-primary/20'
                    }`}
                  >
                    {item.isToday && (
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12 pointer-events-none"
                      />
                    )}
                    <div className="flex items-center gap-6 relative z-10">
                      <div className={`w-2 h-2 rounded-full ${item.isToday ? 'bg-white animate-pulse' : 'bg-on-surface-variant/20 group-hover:bg-primary/40 transition-colors'}`}></div>
                      <span className={`text-[13px] uppercase tracking-[0.2em] whitespace-nowrap ${item.isToday ? 'font-black' : 'font-bold'}`}>
                        {item.day}
                      </span>
                    </div>
                    <span className={`text-[14px] relative z-10 ${item.isToday ? 'font-black' : 'font-bold tracking-tight'}`}>
                      {item.hours}
                    </span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant/30 text-center py-4 italic">
                  {t('restaurants.info.hours_not_available')}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-outline/5 flex items-center gap-4 text-primary/40">
             <span className="material-symbols-outlined text-xl">info</span>
             <p className="text-[10px] font-bold uppercase tracking-widest">{t('restaurants.info.arrival_reminder')}</p>
          </div>
        </motion.div>

        {/* Card 2: Policies (Bento Right) */}
        <div className="xl:col-span-5 flex flex-col gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 p-12 bg-white rounded-[3.5rem] border border-outline/5 shadow-sm flex flex-col items-center text-center justify-center space-y-6 group hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-700"
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 transition-transform duration-700 group-hover:scale-110 ${depositEnabled ? 'bg-amber-500/10 text-amber-500 shadow-xl shadow-amber-500/10' : 'bg-green-500/10 text-green-500 shadow-xl shadow-green-500/10'}`}>
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {depositEnabled ? 'payments' : 'verified'}
              </span>
            </div>
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/30">
                {t('restaurants.info.deposit_policy')}
              </h4>
              <p className="text-3xl font-black text-on-surface headline leading-tight">
                {depositEnabled ? t('restaurants.info.deposit_required') : t('restaurants.info.deposit_free')}
              </p>
              <p className="text-[13px] text-on-surface-variant/50 font-medium leading-relaxed max-w-[280px]">
                {depositEnabled ? t('restaurants.info.deposit_required_desc') : t('restaurants.info.deposit_free_desc')}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-white rounded-[2.5rem] border border-outline/5 flex items-center gap-6 group hover:bg-primary/5 hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-default"
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
               <span className="material-symbols-outlined text-xl">menu_book</span>
            </div>
            <div>
               <h5 className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface group-hover:text-primary transition-colors">{t('restaurants.policies.general')}</h5>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map & Styles Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Style & Tags (Bento Small) */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-4 space-y-10 p-12 bg-white rounded-[3.5rem] border border-outline/5 shadow-sm hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-700"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
               <span className="material-symbols-outlined">restaurant_menu</span>
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
              {t('restaurants.info.cuisine_style')}
            </h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {cuisineTypes.map((type, idx) => (
              <motion.span 
                key={idx} 
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-6 py-3 rounded-2xl bg-surface text-on-surface text-[12px] font-bold border border-outline/5 hover:border-primary/20 hover:bg-white transition-all shadow-sm"
              >
                {type}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Amenities Grid (Bento Medium) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 p-12 bg-white rounded-[3.5rem] border border-outline/5 shadow-sm hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-700 space-y-10"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
               <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
              {t('restaurants.info.amenities_features')}
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
            {amenities.map((item, index) => {
              const colorMap = {
                blue: 'from-blue-500/20 to-indigo-500/20 text-blue-600',
                amber: 'from-amber-500/20 to-orange-500/20 text-amber-600',
                emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-600',
                rose: 'from-rose-500/20 to-pink-500/20 text-rose-600',
                cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-600',
                violet: 'from-violet-500/20 to-purple-500/20 text-violet-600',
                slate: 'from-slate-500/20 to-gray-500/20 text-slate-600',
                pink: 'from-pink-500/20 to-rose-500/20 text-pink-600',
                indigo: 'from-indigo-500/20 to-blue-500/20 text-indigo-600',
                orange: 'from-orange-500/20 to-amber-500/20 text-orange-600',
                red: 'from-red-500/20 to-orange-500/20 text-red-600',
                teal: 'from-teal-500/20 to-emerald-500/20 text-teal-600',
                sky: 'from-sky-500/20 to-cyan-500/20 text-sky-600',
                green: 'from-green-500/20 to-emerald-500/20 text-green-600',
                purple: 'from-purple-500/20 to-violet-500/20 text-purple-600'
              };
              const colorClass = colorMap[item.color] || colorMap.blue;

              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center text-center gap-6 group relative"
                >
                  <div className={`w-24 h-24 rounded-[2.5rem] bg-gradient-to-br ${colorClass.split(' ').slice(0, 2).join(' ')} flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-lg shadow-black/5 group-hover:shadow-2xl group-hover:shadow-primary/10 border border-white`}>
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
                    <span className={`material-symbols-outlined text-4xl relative z-10 transition-all duration-500 group-hover:scale-110 ${colorClass.split(' ').pop()}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                    {/* Ambient glow effect on hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${colorClass.split(' ').slice(0, 2).join(' ')} blur-xl`} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 group-hover:text-on-surface transition-colors duration-300">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Full Width Live Map - Final Cinematic Section */}
      {mapEmbedUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),1)]"></div>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary">
                {t('restaurants.info.location_title')}
              </h3>
            </div>
            <span className="px-5 py-2 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-xl shadow-primary/20">
              {t('restaurants.info.live_map')}
            </span>
          </div>
          <div className="w-full h-[600px] rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl relative bg-surface group">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('restaurants.info.location_title')}
              className="grayscale-[0.6] contrast-[1.1] brightness-[0.9] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[3.5rem]"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RestaurantInfo;
