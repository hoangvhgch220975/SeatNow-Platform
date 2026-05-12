import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Save, Store, Phone, Tag, Info, AlertTriangle, 
  Settings, Clock, Image as ImageIcon, MapPin, 
  Mail, DollarSign, ShieldCheck, Zap, ToggleRight, 
  Plus, Trash2, Globe, Calendar
} from 'lucide-react';

/**
 * Helper: ALL_CUISINES (Chuẩn hệ thống)
 */
const ALL_CUISINES = [
  'Vietnamese Cuisine', 'European Cuisine', 'Japanese Cuisine',
  'Chinese Cuisine', 'Korean Cuisine', 'Italian Cuisine',
  'French Cuisine', 'Spanish Cuisine', 'Mexican Cuisine',
  'Indian Cuisine', 'Thai Cuisine', 'Hotpot', 'Grill',
  'Seafood', 'Street Food', 'Fast Food', 'Cafe',
  'Bar & Pub', 'Fine Dining', 'Buffet', 'Vegetarian'
];

/**
 * Helper: TIME_OPTIONS (Mốc 30 phút)
 */
const TIME_OPTIONS = (() => {
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
const formatTimeLocale = (timeStr, lang) => {
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
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 group-focus-within:text-violet-600 transition-colors">
      <Clock size={10} /> {label}
    </label>
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

/**
 * Main Component: EditRestaurantDialog
 */
const EditRestaurantDialog = ({ isOpen, onClose, onConfirm, data, loading }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    priceRange: 1,
    cuisineTypes: [],
    images: [],
    openingHours: {},
    commissionRate: 10,
    isPremium: false,
    status: 'active'
  });

  // State for Opening Hours Mode (Owner-style)
  const [ohMode, setOhMode] = useState('all');

  // Sync data when opened
  useEffect(() => {
    if (data && isOpen) {
      const oh = data.openingHours || (data.openingHoursJson ? JSON.parse(data.openingHoursJson) : {});
      
      // Determine mode from data
      if (oh['weekday'] || oh['weekend']) setOhMode('split');
      else if (oh['Monday-Sunday']) setOhMode('all');
      else setOhMode('custom');

      setFormData({
        name: data.name || '',
        address: data.address || '',
        phone: data.phone || data.ownerPhone || '',
        email: data.email || '',
        description: data.description || '',
        priceRange: data.priceRange || 1,
        cuisineTypes: Array.isArray(data.cuisineTypes) ? data.cuisineTypes : (data.cuisineTypeJson ? JSON.parse(data.cuisineTypeJson) : []),
        images: Array.isArray(data.images) ? data.images : (data.imageJson ? JSON.parse(data.imageJson) : []),
        openingHours: oh,
        commissionRate: data.commissionRate || 10,
        isPremium: data.isPremium || false,
        status: data.status || 'active'
      });
      setActiveTab('general');
    }
  }, [data, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(data.id, formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const updateOpeningHour = (key, start, end) => {
    const newVal = `${start} - ${end}`;
    setFormData(p => ({
      ...p,
      openingHours: { ...p.openingHours, [key]: newVal }
    }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: t('workspace.settings.sections.basic_info'), icon: Store },
    { id: 'system', label: t('admin.nav.settings'), icon: Settings },
    { id: 'operation', label: t('common.operation'), icon: Zap }
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-100">
              <Settings size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {t('admin.restaurants.actions.edit_title')}
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <ShieldCheck size={10} className="text-emerald-500" /> Operational Authority Access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 hover:text-rose-500 text-slate-400 rounded-xl transition-all border border-slate-100">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-8 py-2 bg-slate-50/50 border-b border-slate-100 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all shrink-0 ${
                  isActive 
                    ? 'border-violet-600 text-violet-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 no-scrollbar scroll-smooth">
          {/* Tab 1: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                     {t('admin.restaurants.edit_form.name')}
                   </label>
                   <input name="name" value={formData.name} onChange={handleChange} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-violet-500 outline-none transition-all shadow-inner" />
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                     {t('admin.restaurants.edit_form.phone')}
                   </label>
                   <div className="relative">
                      <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-violet-500 outline-none transition-all shadow-inner" />
                   </div>
                 </div>
                 <div className="space-y-3 md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                     {t('admin.restaurants.edit_form.address')}
                   </label>
                   <div className="relative">
                      <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input name="address" value={formData.address} onChange={handleChange} className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white focus:border-violet-500 outline-none transition-all shadow-inner" />
                   </div>
                 </div>
                 <div className="space-y-3 md:col-span-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                     {t('admin.restaurants.edit_form.description')}
                   </label>
                   <textarea rows={4} name="description" value={formData.description} onChange={handleChange} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium focus:bg-white focus:border-violet-500 outline-none transition-all resize-none shadow-inner leading-relaxed" placeholder={t('admin.restaurants.edit_form.desc_placeholder')} />
                 </div>
              </div>
            </div>
          )}

          {/* Tab 2: System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-violet-600 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-violet-100">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Zap size={24} />
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name="isPremium" checked={formData.isPremium} onChange={(e) => setFormData(p => ({ ...p, isPremium: e.target.checked }))} className="sr-only peer" />
                      <div className="w-14 h-8 bg-white/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-white transition-all"></div>
                      <div className="absolute inset-0 peer-checked:opacity-0 bg-transparent transition-all"></div>
                      <div className="absolute left-[40px] top-[10px] peer-checked:bg-violet-600 w-4 h-4 rounded-full transition-all opacity-0 peer-checked:opacity-100"></div>
                    </label>
                  </div>
                  <div>
                    <h4 className="text-xl font-black italic">{t('admin.restaurants.edit_form.premium_title')}</h4>
                    <p className="text-xs text-white/70 font-bold leading-relaxed">
                      {t('admin.restaurants.edit_form.premium_desc')}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <DollarSign size={12} /> {t('admin.restaurants.edit_form.commission_label')}
                    </label>
                    <div className="relative">
                      <input type="number" name="commissionRate" value={formData.commissionRate} onChange={handleChange} className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-slate-700 focus:bg-white focus:border-violet-500 outline-none transition-all shadow-inner" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-black text-slate-400">%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <ShieldCheck size={12} /> {t('admin.restaurants.edit_form.system_status')}
                    </label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:bg-white focus:border-violet-500 outline-none transition-all cursor-pointer shadow-inner">
                      <option value="active">{t('admin.restaurants.edit_form.status_active')}</option>
                      <option value="pending">{t('admin.restaurants.edit_form.status_pending')}</option>
                      <option value="suspended">{t('admin.restaurants.edit_form.status_suspended')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Operation */}
          {activeTab === 'operation' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Cuisines */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Tag size={12} /> {t('admin.restaurants.edit_form.cuisine_tags')}
                </label>
                <div className="flex flex-wrap gap-2.5 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                  {ALL_CUISINES.map(cuisine => {
                    const isSelected = formData.cuisineTypes.includes(cuisine);
                    return (
                      <button
                        key={cuisine} type="button"
                        onClick={() => {
                          const next = isSelected 
                            ? formData.cuisineTypes.filter(c => c !== cuisine)
                            : [...formData.cuisineTypes, cuisine];
                          setFormData(p => ({ ...p, cuisineTypes: next }));
                        }}
                        className={`px-5 py-2.5 text-[10px] font-black rounded-xl uppercase tracking-wider border-2 transition-all ${
                          isSelected 
                            ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-100' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {cuisine}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <DollarSign size={12} /> {t('admin.restaurants.edit_form.price_category')}
                 </label>
                 <div className="flex gap-2 p-2 bg-slate-100 rounded-2xl w-full max-w-sm">
                   {[1, 2, 3, 4].map((range) => (
                     <button
                       key={range} type="button"
                       onClick={() => setFormData(p => ({ ...p, priceRange: range }))}
                       className={`h-12 flex-1 flex items-center justify-center rounded-xl transition-all ${
                         range === formData.priceRange
                         ? 'bg-white text-violet-600 shadow-sm ring-1 ring-black/5'
                         : 'text-slate-400 hover:text-slate-600'
                       }`}
                     >
                       <span className="text-sm font-black">{'$'.repeat(range)}</span>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Opening Hours - FULL OWNER MODE */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> {t('admin.restaurants.edit_form.operating_schedule')}
                  </label>
                  <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
                     {[
                       { id: 'all', label: t('admin.restaurants.edit_form.schedule_all') },
                       { id: 'split', label: t('admin.restaurants.edit_form.schedule_split') },
                       { id: 'custom', label: t('admin.restaurants.edit_form.schedule_custom') }
                     ].map(m => (
                        <button
                          key={m.id} type="button"
                          onClick={() => setOhMode(m.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all ${
                            ohMode === m.id ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {m.label}
                        </button>
                     ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {ohMode === 'all' && (
                    <div className="p-6 bg-violet-50/50 rounded-[2.5rem] border border-violet-100 flex flex-col sm:flex-row gap-6">
                      <div className="flex items-center gap-3 min-w-[140px]">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-violet-600 shadow-sm"><Calendar size={18}/></div>
                        <span className="text-xs font-black text-slate-700 uppercase italic">
                          {t('admin.restaurants.edit_form.everyday')}
                        </span>
                      </div>
                      <div className="flex gap-6 flex-grow">
                        {(() => {
                           const val = formData.openingHours['Monday-Sunday'] || '08:00 - 22:00';
                           const [start, end] = val.split('-').map(s => s.trim());
                           return (
                             <>
                               <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour('Monday-Sunday', v, end)} />
                               <TimeInput label={t('admin.restaurants.edit_form.closes_at')} value={end} lang={i18n.language} onChange={(v) => updateOpeningHour('Monday-Sunday', start, v)} />
                             </>
                           )
                        })()}
                      </div>
                    </div>
                  )}

                  {ohMode === 'split' && (
                    <div className="space-y-4">
                      {['weekday', 'weekend'].map(key => {
                        const val = formData.openingHours[key] || '08:00 - 22:00';
                        const [start, end] = val.split('-').map(s => s.trim());
                        return (
                          <div key={key} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex flex-col sm:flex-row gap-6 shadow-inner">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <div className={`w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm ${key === 'weekday' ? 'text-indigo-500' : 'text-orange-500'}`}>
                                <Calendar size={18}/>
                              </div>
                              <span className="text-xs font-black text-slate-700 uppercase italic">{key}</span>
                            </div>
                            <div className="flex gap-6 flex-grow">
                               <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour(key, v, end)} />
                               <TimeInput label={t('admin.restaurants.edit_form.closes_at')} value={end} lang={i18n.language} onChange={(v) => updateOpeningHour(key, start, v)} />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {ohMode === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {daysOfWeek.map(day => {
                         const val = formData.openingHours[day] || '09:00 - 22:00';
                         const [start, end] = val.split('-').map(s => s.trim());
                         return (
                           <div key={day} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-4 shadow-inner">
                             <div className="text-[10px] font-black text-slate-400 px-1 uppercase tracking-tighter flex justify-between">
                               {day} <Clock size={12} className="opacity-30" />
                             </div>
                             <div className="flex gap-4">
                               <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour(day, v, end)} />
                               <TimeInput label={t('admin.restaurants.edit_form.closes_at')} value={end} lang={i18n.language} onChange={(v) => updateOpeningHour(day, start, v)} />
                             </div>
                           </div>
                         )
                       })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 bg-white flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-all">
            {t('common.cancel')}
          </button>
          <button 
            type="submit" onClick={handleSubmit} disabled={loading}
            className="px-12 py-4 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-violet-100 flex items-center gap-3 active:scale-95 group"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
            {t('admin.restaurants.edit_form.save_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurantDialog;

