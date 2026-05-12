import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Helper: TIME_OPTIONS (Mốc 30 phút)
 */
export const TIME_OPTIONS = (() => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const h = i.toString().padStart(2, '0');
    options.push(`${h}:00`);
    options.push(`${h}:30`);
  }
  return options;
})();

/**
 * Helper: Format HH:mm to localized display
 */
export const formatTimeLocale = (timeStr, lang) => {
  if (!timeStr) return '';
  const time = timeStr.includes('-') ? timeStr.split('-')[0].trim() : timeStr;
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;
  const isPM = hours >= 12;
  const hours12 = hours % 12 || 12;
  const period = lang === 'vi' ? (isPM ? 'CH' : 'SA') : (isPM ? 'PM' : 'AM');
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Sub-component: TimeInput (Dropdown Version)
 */
const TimeInput = ({ label, value, onChange, lang }) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-0 group">
    {label && (
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 group-focus-within:text-violet-600 transition-colors">
        <Clock size={10} /> {label}
      </label>
    )}
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 opacity-0 absolute inset-0 z-10 cursor-pointer"
      >
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {formatTimeLocale(time, lang)}
          </option>
        ))}
      </select>
      <div className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group-focus-within:border-violet-500 group-focus-within:ring-2 group-focus-within:ring-violet-500/10 transition-all overflow-hidden shadow-inner">
        <span className="text-xs font-black text-slate-700 truncate">{formatTimeLocale(value, lang)}</span>
        <Clock size={14} className="text-slate-300 shrink-0" />
      </div>
    </div>
  </div>
);

export default TimeInput;
