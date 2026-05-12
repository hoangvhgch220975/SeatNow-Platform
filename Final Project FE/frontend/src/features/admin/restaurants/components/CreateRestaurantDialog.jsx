import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Info, ShieldCheck, Clock, CheckCircle2, 
  MapPin, Phone, Mail, FileText, DollarSign,
  TrendingUp, Star, LayoutGrid, Calendar,
  ArrowRight, Save, Loader2, Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import OwnerPicker from './OwnerPicker.jsx';
import MapLocationPicker from '@/shared/components/MapLocationPicker.jsx';

const ALL_CUISINES = [
  'Vietnamese Cuisine', 'European Cuisine', 'Japanese Cuisine',
  'Chinese Cuisine', 'Korean Cuisine', 'Italian Cuisine',
  'French Cuisine', 'Spanish Cuisine', 'Mexican Cuisine',
  'Indian Cuisine', 'Thai Cuisine', 'Hotpot', 'Grill',
  'Seafood', 'Street Food', 'Fast Food', 'Cafe',
  'Bar & Pub', 'Fine Dining', 'Buffet', 'Vegetarian'
];
import TimeInput from '@/shared/components/TimeInput.jsx';

/**
 * @file CreateRestaurantDialog.jsx
 * @description Dialog tạo mới nhà hàng cho Admin. Cấu trúc Bento Tabs chuyên nghiệp.
 */
const CreateRestaurantDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  // Khởi tạo state cho form tạo mới
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 21.0285,
    longitude: 105.8542,
    phone: '',
    email: '',
    description: '',
    priceRange: 2,
    cuisineTypes: [],
    ownerId: '', // ID chủ sở hữu bắt buộc
    commissionRate: 10,
    isPremium: false,
    status: 'active', // Mặc định Admin tạo là active
    openingHours: {}
  });

  const [ohMode, setOhMode] = useState('all');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t('restaurants.admin.error.name_required');
    if (!formData.address) newErrors.address = t('restaurants.admin.error.address_required');
    if (!formData.phone) newErrors.phone = t('restaurants.admin.error.phone_required');
    if (!formData.ownerId) newErrors.ownerId = t('restaurants.admin.error.owner_required');
    if (formData.cuisineTypes.length === 0) newErrors.cuisineTypes = t('restaurants.admin.error.cuisine_required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('general');
      toast.error(t('restaurants.admin.error.validation_failed'));
      return;
    }
    onConfirm(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const updateOpeningHour = (key, start, end) => {
    const newVal = `${start} - ${end}`;
    setFormData(p => ({
      ...p,
      openingHours: { ...p.openingHours, [key]: newVal }
    }));
  };

  const tabs = [
    { id: 'general', label: t('workspace.settings.sections.basic_info'), icon: Info },
    { id: 'system', label: t('admin.nav.settings'), icon: ShieldCheck },
    { id: 'operation', label: t('common.operation'), icon: Clock },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Dialog Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
                <LayoutGrid className="text-white w-6 h-6" />
              </div>
              {t('admin.restaurants.edit_form.create_title')}
            </h2>
            <p className="text-slate-500 font-bold text-sm mt-1 ml-16">{t('admin.restaurants.edit_form.create_subtitle')}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-white hover:shadow-xl rounded-2xl transition-all text-slate-400 hover:text-rose-500 active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-10 py-4 bg-white border-b border-slate-50 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all font-black text-sm whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
          <form id="create-restaurant-form" onSubmit={handleSubmit} className="space-y-10">
            
            {/* Tab: General */}
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                
                {/* 1. Owner Selection (Crucial) */}
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <OwnerPicker 
                    value={formData.ownerId}
                    onChange={(val) => handleChange('ownerId', val)}
                    error={errors.ownerId}
                  />
                </div>

                {/* 2. Basic Info Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 mb-3 ml-1 uppercase tracking-widest leading-none bg-white w-fit px-2 -mt-10 mb-6">{t('admin.restaurants.edit_form.basic_info')}</label>
                    <div className="space-y-6">
                      <div>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder=" "
                            className={`w-full px-5 py-4 bg-slate-50 border rounded-2xl transition-all outline-none font-bold text-slate-800 peer ${errors.name ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10'}`}
                          />
                          <label className="absolute left-5 top-4 text-slate-400 text-sm font-bold transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-violet-500 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 pointer-events-none uppercase tracking-widest">{t('admin.restaurants.edit_form.rest_name')}</label>
                        </div>
                        {errors.name && <p className="mt-2 text-xs font-bold text-rose-500 ml-4 italic">*{errors.name}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            placeholder=" "
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all outline-none font-bold text-slate-800 peer focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                          />
                          <label className="absolute left-5 top-4 text-slate-400 text-sm font-bold transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-violet-500 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 pointer-events-none uppercase tracking-widest">{t('admin.restaurants.edit_form.phone')}</label>
                        </div>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder=" "
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all outline-none font-bold text-slate-800 peer focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10"
                          />
                          <label className="absolute left-5 top-4 text-slate-400 text-sm font-bold transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-violet-500 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 pointer-events-none uppercase tracking-widest">{t('admin.restaurants.edit_form.email')}</label>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleChange('description', e.target.value)}
                          placeholder=" "
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl transition-all outline-none font-bold text-slate-800 peer focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 min-h-[120px] resize-none"
                        />
                        <label className="absolute left-5 top-4 text-slate-400 text-sm font-bold transition-all peer-focus:-top-2 peer-focus:left-4 peer-focus:text-[10px] peer-focus:text-violet-500 peer-focus:bg-white peer-focus:px-2 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-violet-500 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2 pointer-events-none uppercase tracking-widest">{t('admin.restaurants.edit_form.description')}</label>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm md:col-span-2 relative">
                    <label className="block text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em]">{t('admin.restaurants.edit_form.location')}</label>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="relative group flex-1">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder={t('admin.restaurants.edit_form.address_placeholder')}
                            className={`w-full pl-14 pr-5 py-4 bg-slate-50 border rounded-2xl transition-all outline-none font-bold text-slate-800 ${errors.address ? 'border-rose-300 ring-4 ring-rose-500/10' : 'border-slate-100 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10'}`}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(true)}
                          className="px-6 py-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 font-bold"
                        >
                          <MapPin className="w-5 h-5" />
                          Map
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold ml-2 italic">{t('admin.restaurants.edit_form.location_notice')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: System Settings */}
            {activeTab === 'system' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Economics Card */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <label className="block text-xs font-black text-slate-400 mb-8 uppercase tracking-widest">{t('admin.restaurants.edit_form.economics')}</label>
                    
                    <div className="space-y-8">
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                              <DollarSign className="w-5 h-5 text-violet-600" />
                            </div>
                            <span className="text-sm font-black text-slate-700">{t('admin.restaurants.edit_form.commission_rate')}</span>
                          </div>
                          <span className="text-xl font-black text-violet-600">{formData.commissionRate}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={formData.commissionRate}
                          onChange={(e) => handleChange('commissionRate', parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-tighter px-1">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleChange('isPremium', !formData.isPremium)}
                        className={`flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer group/toggle ${
                          formData.isPremium 
                            ? 'bg-amber-50 border-amber-200 shadow-lg shadow-amber-500/5' 
                            : 'bg-slate-50 border-slate-100 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                            formData.isPremium ? 'bg-amber-500 shadow-lg shadow-amber-200' : 'bg-white shadow-sm'
                          }`}>
                            <TrendingUp className={`w-6 h-6 ${formData.isPremium ? 'text-white' : 'text-slate-400'}`} />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-black ${formData.isPremium ? 'text-amber-900' : 'text-slate-700'}`}>{t('admin.restaurants.edit_form.premium_status')}</span>
                            <span className="text-[10px] text-slate-400 font-bold leading-none mt-1">{t('admin.restaurants.edit_form.premium_desc')}</span>
                          </div>
                        </div>
                        <div className={`w-14 h-7 rounded-full transition-all relative ${formData.isPremium ? 'bg-amber-500' : 'bg-slate-200'}`}>
                          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${formData.isPremium ? 'left-8' : 'left-1'}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Card */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/5 rounded-full -ml-20 -mb-20" />
                    <label className="absolute top-10 left-10 text-xs font-black text-slate-400 uppercase tracking-widest">{t('admin.restaurants.edit_form.system_status')}</label>
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transition-all group-hover:scale-110 ${
                      formData.status === 'active' ? 'bg-emerald-500 shadow-emerald-200' : 
                      formData.status === 'suspended' ? 'bg-rose-500 shadow-rose-200' : 'bg-amber-500 shadow-amber-200'
                    }`}>
                      {formData.status === 'active' ? <CheckCircle2 className="text-white w-10 h-10" /> : 
                       formData.status === 'suspended' ? <X className="text-white w-10 h-10" /> : <Clock className="text-white w-10 h-10" />}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{t(`admin.restaurants.edit_form.status_${formData.status}`)}</h4>
                      <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed italic">{t('admin.restaurants.edit_form.status_notice')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Operations (Opening Hours & Cuisines) */}
            {activeTab === 'operation' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                
                {/* 1. Cuisine Selection (Preserved Layout but mapped correctly) */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <label className="block text-xs font-black text-slate-400 mb-8 uppercase tracking-widest">{t('admin.restaurants.edit_form.cuisine_management')}</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CUISINES.map((type) => {
                      const isSelected = formData.cuisineTypes.includes(type);
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const next = isSelected 
                              ? formData.cuisineTypes.filter(t => t !== type)
                              : [...formData.cuisineTypes, type];
                            handleChange('cuisineTypes', next);
                          }}
                          className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                            isSelected 
                              ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200 scale-105' 
                              : 'bg-white border-slate-100 text-slate-400 hover:border-violet-200 hover:text-slate-600'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                  {errors.cuisineTypes && <p className="mt-4 text-xs font-bold text-rose-500 ml-1 italic">{errors.cuisineTypes}</p>}
                </div>

                {/* 2. Opening Hours from Edit Form */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform" />
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-10">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">{t('admin.restaurants.edit_form.operating_schedule')}</label>
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                         {[
                           { id: 'all', label: t('admin.restaurants.edit_form.schedule_all') },
                           { id: 'split', label: t('admin.restaurants.edit_form.schedule_split') },
                           { id: 'custom', label: t('admin.restaurants.edit_form.schedule_custom') }
                         ].map(m => (
                            <button
                              key={m.id} type="button"
                              onClick={() => setOhMode(m.id)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${
                                ohMode === m.id ? 'bg-white text-violet-600 shadow-sm scale-105' : 'text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {m.label}
                            </button>
                         ))}
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      {ohMode === 'all' && (
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row gap-6 hover:bg-white hover:shadow-xl transition-all">
                          <div className="flex items-center gap-3 min-w-[140px]">
                            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-200"><Calendar size={20}/></div>
                            <span className="text-xs font-black text-slate-700 uppercase">{t('admin.restaurants.edit_form.everyday')}</span>
                          </div>
                          <div className="flex gap-6 flex-grow items-center">
                            {(() => {
                               const val = formData.openingHours['Monday-Sunday'] || '08:00 - 22:00';
                               const [start, end] = val.split('-').map(s => s.trim());
                               return (
                                 <>
                                   <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour('Monday-Sunday', v, end)} />
                                   <ArrowRight className="text-slate-300 w-5 h-5 flex-shrink-0" />
                                   <TimeInput label={t('admin.restaurants.edit_form.closes_at')} value={end} lang={i18n.language} onChange={(v) => updateOpeningHour('Monday-Sunday', start, v)} />
                                 </>
                               )
                            })()}
                          </div>
                        </div>
                      )}

                      {ohMode === 'split' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {['weekday', 'weekend'].map(key => {
                            const val = formData.openingHours[key] || '08:00 - 22:00';
                            const [start, end] = val.split('-').map(s => s.trim());
                            return (
                              <div key={key} className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex flex-col gap-6 hover:bg-white hover:shadow-xl transition-all">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md ${key === 'weekday' ? 'text-indigo-500' : 'text-orange-500'}`}>
                                    <Calendar size={20}/>
                                  </div>
                                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{t(`admin.restaurants.edit_form.${key}`)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                   <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour(key, v, end)} />
                                   <ArrowRight className="text-slate-300 w-4 h-4" />
                                   <TimeInput label={t('admin.restaurants.edit_form.closes_at')} value={end} lang={i18n.language} onChange={(v) => updateOpeningHour(key, start, v)} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {ohMode === 'custom' && (
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                           {daysOfWeek.map(day => {
                             const val = formData.openingHours[day] || '09:00 - 22:00';
                             const [start, end] = val.split('-').map(s => s.trim());
                             return (
                               <div key={day} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-lg transition-all">
                                 <div className="text-[10px] font-black w-32 text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                   <Clock size={12} className="opacity-50" /> {t(`common.days.${day.toLowerCase()}`)}
                                 </div>
                                 <div className="flex items-center gap-4 flex-1">
                                   <TimeInput label={t('admin.restaurants.edit_form.opens_at')} value={start} lang={i18n.language} onChange={(v) => updateOpeningHour(day, v, end)} />
                                   <ArrowRight className="text-slate-200 w-4 h-4" />
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

              </motion.div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${formData.ownerId ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {formData.ownerId ? t('admin.restaurants.edit_form.owner_ready') : t('admin.restaurants.edit_form.owner_required')}
              </span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('admin.restaurants.edit_form.commission')}: <span className="text-violet-600">{formData.commissionRate}%</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-sm font-black text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
            >
              {t('common.cancel')}
            </button>
            <button
              form="create-restaurant-form"
              type="submit"
              disabled={isLoading}
              className="group relative px-10 py-4 bg-violet-600 rounded-2xl text-sm font-black text-white shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
              <div className="flex items-center gap-3 relative z-10">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('common.creating')}...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>{t('admin.restaurants.edit_form.create_confirm')}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Map Picker Overlay */}
      <MapLocationPicker
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        initialLocation={{ 
          lat: formData.latitude || 21.0285, 
          lng: formData.longitude || 105.8542 
        }}
        onConfirm={(position, selectedAddress) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.lat,
            longitude: position.lng,
            address: selectedAddress || prev.address
          }));
          setIsMapOpen(false);
          toast.success(t('admin.restaurants.edit_form.location_notice') || 'Updated Location GPS');
        }}
      />
    </div>
  );
};

export default CreateRestaurantDialog;
