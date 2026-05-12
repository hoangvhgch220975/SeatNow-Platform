import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Helper: Format HH:mm to localized AM/PM or SA/CH (Vietnamese comment)
 */
const formatTimeLocale = (timeStr, lang) => {
  if (!timeStr) return '';
  const time = timeStr.includes('-') ? timeStr.split('-')[0].trim() : timeStr;
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;

  const isPM = hours >= 12;
  const hours12 = hours % 12 || 12;
  const period = lang === 'vi' 
    ? (isPM ? 'CH' : 'SA') 
    : (isPM ? 'PM' : 'AM');
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Sub-component: Controlled Time Input with localized display (Vietnamese comment)
 */
const TimeInput = ({ label, value, onChange, lang, icon: Icon = Clock }) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-0 group">
    <label className="text-[10px] font-extrabold text-on-surface-variant/60 uppercase tracking-widest flex items-center gap-1 group-focus-within:text-primary transition-colors">
      <Icon size={12} />
      {label}
    </label>
    <div className="relative">
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-2xl text-sm font-bold opacity-0 absolute inset-0 z-10 cursor-pointer shadow-none"
      />
      <div className="w-full h-12 px-3 bg-white border border-outline-variant rounded-2xl flex items-center justify-between group-focus-within:border-primary group-focus-within:ring-2 group-focus-within:ring-primary/10 transition-all overflow-hidden">
        <span className="text-xs sm:text-sm font-black text-on-surface truncate">
          {formatTimeLocale(value, lang)}
        </span>
        <Clock size={16} className="text-on-surface-variant/30 shrink-0 ml-1" />
      </div>
    </div>
  </div>
);

/**
 * @component OpeningHoursForm
 * @description Trình quản lý giờ mở cửa linh hoạt với định dạng bản địa hóa.
 */
const OpeningHoursForm = ({ value = {}, onChange }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  
  // Xác định chế độ hiện tại (Vietnamese comment)
  const determineMode = (val) => {
    if (!val || Object.keys(val).length === 0) return 'all';
    if (val['Monday-Sunday']) return 'all';
    if (val['weekday'] || val['weekend']) return 'split';
    return 'custom';
  };

  const [mode, setMode] = useState(determineMode(value));
  const [hours, setHours] = useState({
    start: '10:00',
    end: '22:00',
    weekdayStart: '09:00',
    weekdayEnd: '22:00',
    weekendStart: '10:00',
    weekendEnd: '23:00',
    days: {
      Monday: '10:00-22:00',
      Tuesday: '10:00-22:00',
      Wednesday: '10:00-22:00',
      Thursday: '10:00-22:00',
      Friday: '10:00-22:00',
      Saturday: '10:00-23:00',
      Sunday: '10:00-23:00',
    }
  });

  // Đồng bộ hóa dữ liệu (Vietnamese comment)
  useEffect(() => {
    let result = {};
    if (mode === 'all') {
      result = { 'Monday-Sunday': `${hours.start} - ${hours.end}` };
    } else if (mode === 'split') {
      result = { 
        'weekday': `${hours.weekdayStart} - ${hours.weekdayEnd}`,
        'weekend': `${hours.weekendStart} - ${hours.weekendEnd}`
      };
    } else {
      result = { ...hours.days };
    }
    onChange(result);
  }, [mode, hours]);

  const handleDayChange = (day, type, val) => {
    const currentDayVal = hours.days[day];
    const [start, end] = currentDayVal.split('-');
    const newVal = type === 'start' ? `${val}-${end}` : `${start}-${val}`;
    setHours(prev => ({
      ...prev,
      days: { ...prev.days, [day]: newVal }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector (Vietnamese comment) */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
        {[
          { id: 'all', label: t('owner_portal.create_restaurant.form.hours_all_days') },
          { id: 'split', label: t('owner_portal.create_restaurant.form.hours_split') },
          { id: 'custom', label: t('owner_portal.create_restaurant.form.hours_custom') },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`py-2 px-3 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              mode === m.id
                ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                : 'text-on-surface-variant/60 hover:text-on-surface hover:bg-black/5'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
        {mode === 'all' && (
          <div className="flex gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
            <TimeInput 
              label={t('owner_portal.create_restaurant.form.open_time')} 
              value={hours.start} 
              lang={currentLang}
              onChange={(v) => setHours(prev => ({ ...prev, start: v }))} 
            />
            <TimeInput 
              label={t('owner_portal.create_restaurant.form.close_time')} 
              value={hours.end} 
              lang={currentLang}
              onChange={(v) => setHours(prev => ({ ...prev, end: v }))} 
            />
          </div>
        )}

        {mode === 'split' && (
          <div className="space-y-4">
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-4 tracking-tighter">{t('owner_portal.create_restaurant.form.weekdays_range')}</p>
              <div className="flex gap-4">
                <TimeInput 
                  label={t('owner_portal.create_restaurant.form.start_time')} 
                  value={hours.weekdayStart} 
                  lang={currentLang}
                  onChange={(v) => setHours(prev => ({ ...prev, weekdayStart: v }))} 
                />
                <TimeInput 
                  label={t('owner_portal.create_restaurant.form.end_time')} 
                  value={hours.weekdayEnd} 
                  lang={currentLang}
                  onChange={(v) => setHours(prev => ({ ...prev, weekdayEnd: v }))} 
                />
              </div>
            </div>
            <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50">
              <p className="text-[10px] font-bold text-orange-600 uppercase mb-4 tracking-tighter">{t('owner_portal.create_restaurant.form.weekends_range')}</p>
              <div className="flex gap-4">
                <TimeInput 
                  label={t('owner_portal.create_restaurant.form.start_time')} 
                  value={hours.weekendStart} 
                  lang={currentLang}
                  onChange={(v) => setHours(prev => ({ ...prev, weekendStart: v }))} 
                />
                <TimeInput 
                  label={t('owner_portal.create_restaurant.form.end_time')} 
                  value={hours.weekendEnd} 
                  lang={currentLang}
                  onChange={(v) => setHours(prev => ({ ...prev, weekendEnd: v }))} 
                />
              </div>
            </div>
          </div>
        )}

        {mode === 'custom' && (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3">
            {Object.keys(hours.days).map((day) => {
              const [start, end] = hours.days[day].split('-');
              return (
                <div key={day} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant flex flex-col gap-4">
                  <span className="text-xs font-black text-on-surface uppercase tracking-widest">{day}</span>
                  <div className="flex gap-3">
                    <TimeInput 
                      label={t('owner_portal.create_restaurant.form.start_time')} 
                      value={start} 
                      lang={currentLang}
                      onChange={(v) => handleDayChange(day, 'start', v)} 
                    />
                    <TimeInput 
                      label={t('owner_portal.create_restaurant.form.end_time')} 
                      value={end} 
                      lang={currentLang}
                      onChange={(v) => handleDayChange(day, 'end', v)} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 bg-surface-container-high/50 rounded-xl border border-outline-variant/20 italic">
        <AlertCircle className="text-primary shrink-0" size={16} />
        <p className="text-[10px] text-on-surface-variant/70 leading-relaxed font-medium">
          {t('owner_portal.create_restaurant.form.hours_tip')}
        </p>
      </div>
    </div>
  );
};

export default OpeningHoursForm;
