import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, Store, MapPin, Phone, Mail, Info, Clock, 
  Tag, Image as ImageIcon, ShieldCheck, Zap, 
  Globe, Calendar, DollarSign, Wallet
} from 'lucide-react';
import AdminStatusBadge from '../../components/AdminStatusBadge';
import restaurantPlaceholder from '../../../../assets/placeholder/restaurant_placeholder.png';

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
 * @file RestaurantDetailDialog.jsx
 * @description Premium read-only dialog for restaurant details.
 */
const RestaurantDetailDialog = ({ isOpen, onClose, restaurant }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('info');

  if (!isOpen || !restaurant) return null;

  const openingHours = restaurant.openingHours || (restaurant.openingHoursJson ? JSON.parse(restaurant.openingHoursJson) : {});
  const images = Array.isArray(restaurant.images) ? restaurant.images : (restaurant.imageJson ? JSON.parse(restaurant.imageJson) : []);
  const cuisines = Array.isArray(restaurant.cuisineTypes) ? restaurant.cuisineTypes : (restaurant.cuisineTypeJson ? JSON.parse(restaurant.cuisineTypeJson) : []);

  const tabs = [
    { id: 'info', label: t('workspace.settings.sections.basic_info'), icon: Info },
    { id: 'operation', label: t('common.operation'), icon: Zap },
    { id: 'gallery', label: t('workspace.settings.sections.images'), icon: ImageIcon },
    { id: 'system', label: t('admin.nav.settings'), icon: ShieldCheck },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        {/* Header with Cover Photo */}
        <div className="relative h-48 sm:h-64 bg-slate-100 overflow-hidden">
          <img 
            src={restaurant.coverImage || (images && images[0]) || restaurantPlaceholder} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md transition-all border border-white/30"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="hidden sm:flex w-20 h-20 rounded-3xl bg-white p-1 shadow-2xl border border-white/20">
                <img 
                   src={restaurant.logo || images[0] || restaurantPlaceholder} 
                   className="w-full h-full object-cover rounded-[20px]"
                   alt="Logo"
                />
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {restaurant.name}
                  </h2>
                  {restaurant.isPremium && (
                    <div className="px-2 py-0.5 bg-amber-400 text-black text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg shadow-amber-400/20">
                      Premium
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-white/70 text-xs font-bold uppercase tracking-widest">
                   <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                     <MapPin size={12} className="text-blue-400" />
                     {restaurant.address?.split(',').slice(-2).join(',')}
                   </div>
                   <AdminStatusBadge status={restaurant.status} className="!py-1 shadow-none border-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-8 py-2 bg-slate-50 border-b border-slate-100 gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 border-b-2 transition-all shrink-0 ${
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

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-8 no-scrollbar scroll-smooth bg-white">
          {activeTab === 'info' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Info size={12} className="text-violet-500" /> {t('workspace.settings.sections.basic_info')}
                      </h4>
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Store size={18}/></div>
                           <div>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('admin.restaurants.edit_form.name')}</p>
                             <p className="text-sm font-black text-slate-800">{restaurant.name}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><MapPin size={18}/></div>
                           <div>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('admin.restaurants.edit_form.address')}</p>
                             <p className="text-sm font-bold text-slate-700 leading-snug">{restaurant.address}</p>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Phone size={12} className="text-blue-500" /> {t('workspace.settings.sections.contact_info')}
                      </h4>
                      <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Phone size={18}/></div>
                           <div>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{t('admin.restaurants.edit_form.phone')}</p>
                             <p className="text-sm font-black text-slate-800">{restaurant.phone || restaurant.ownerPhone || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100"><Mail size={18}/></div>
                           <div>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Email</p>
                             <p className="text-sm font-black text-slate-800">{restaurant.email || 'N/A'}</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Globe size={12} className="text-emerald-500" /> {t('admin.restaurants.edit_form.description')}
                      </h4>
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner h-full min-h-[200px]">
                        <p className="text-sm text-slate-600 font-medium leading-[1.8] italic whitespace-pre-line">
                          "{restaurant.description || t('admin.restaurants.edit_form.desc_placeholder')}"
                        </p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'operation' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Opening Hours */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <Clock size={12} className="text-orange-500" /> {t('admin.restaurants.edit_form.operating_schedule')}
                  </h4>
                  <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner overflow-hidden p-6">
                    <div className="space-y-3">
                      {Object.keys(openingHours).length > 0 ? (
                        Object.entries(openingHours).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{key}</span>
                            <div className="flex items-center gap-2">
                               <Clock size={12} className="text-slate-300" />
                               <span className="text-xs font-black text-slate-800">{value}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic text-center py-4">{t('common.no_data')}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cuisine & Pricing */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                      <Tag size={12} className="text-indigo-500" /> {t('admin.restaurants.edit_form.cuisine_tags')}
                    </h4>
                    <div className="flex flex-wrap gap-2 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      {cuisines.length > 0 ? (
                        cuisines.map(c => (
                          <span key={c} className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 rounded-xl shadow-xs">
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">{t('admin.restaurants.table.cuisine_default')}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                      <DollarSign size={12} className="text-emerald-500" /> {t('admin.restaurants.edit_form.price_category')}
                    </h4>
                    <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4].map(p => (
                          <div 
                             key={p}
                             className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${
                               restaurant.priceRange >= p ? 'bg-violet-600 text-white shadow-lg shadow-violet-100 scale-110' : 'bg-white text-slate-200 border border-slate-100'
                             }`}
                          >
                            $
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.length > 0 ? (
                    images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-3xl overflow-hidden border border-slate-100 shadow-sm group relative">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Restaurant ${i}`} />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <ImageIcon className="text-white" size={24} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                       <ImageIcon size={48} className="text-slate-200" />
                       <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{t('common.no_images')}</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                       <Wallet size={12} className="text-emerald-500" /> {t('wallet.title')}
                     </h4>
                     <div className="p-8 bg-emerald-600 rounded-[2.5rem] text-white space-y-4 shadow-xl shadow-emerald-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-10"><DollarSign size={100} /></div>
                        <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">{t('admin.restaurants.edit_form.commission_label')}</p>
                          <h3 className="text-4xl font-black">{restaurant.commissionRate || 10}%</h3>
                          <p className="text-xs font-bold mt-4 text-white/80 leading-relaxed italic">
                            {t('admin.restaurants.edit_form.premium_desc')}
                          </p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                       <Calendar size={12} className="text-blue-500" /> {t('admin.restaurants.table.registered')}
                     </h4>
                     <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-inner space-y-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500"><Calendar size={22} /></div>
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.restaurants.table.registered')}</p>
                              <p className="text-lg font-black text-slate-800">{new Date(restaurant.createdAt).toLocaleDateString()}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
          <button 
             onClick={onClose}
             className="px-10 py-3.5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailDialog;
