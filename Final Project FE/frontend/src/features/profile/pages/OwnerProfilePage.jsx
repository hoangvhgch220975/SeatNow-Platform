import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfileQuery } from '../hooks.js';
import { motion } from 'framer-motion';

// Import sub-components từ features/profile (Vietnamese comment)
import PasswordForm from '../components/PasswordForm.jsx';
import SettingsForm from '../components/SettingsForm.jsx';
import OwnerProfileHero from '../components/OwnerProfileHero.jsx';
import OwnerInfoSummary from '../components/OwnerInfoSummary.jsx';
import { usePortfolioDashboard } from '../../owner/portal/hooks.js';

/**
 * @file OwnerProfilePage.jsx
 * @description Trang hồ sơ cá nhân dành riêng cho Chủ nhà hàng (Owner). Hỗ trợ đa ngôn ngữ.
 * Thiết kế tối giản, chuyên nghiệp và tập trung vào quản lý doanh nghiệp.
 */
const OwnerProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  
  // 1. Tải dữ liệu Profile (Vietnamese comment)
  const { data: profile, isLoading: isProfileLoading, error } = useProfileQuery();

  // 2. Tải dữ liệu Portfolio để tính toán Trust Score thật (Vietnamese comment)
  const { myRestaurants, isLoading: isPortfolioLoading } = usePortfolioDashboard({ status: 'all' });

  // Xử lý Loading (bao gồm cả dữ liệu Profile và Portfolio) (Vietnamese comment)
  if (isProfileLoading || isPortfolioLoading) {
    return (
      <div className="space-y-12 animate-pulse">
        <div className="h-64 bg-slate-100 rounded-[2.5rem]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="h-80 bg-slate-50 rounded-[2.5rem]"></div>
           <div className="h-80 bg-slate-50 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  // Xử lý lỗi truy cập (Vietnamese comment)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-sm">
           <span className="material-symbols-outlined text-4xl">domain_disabled</span>
        </div>
        <div className="space-y-2">
           <h3 className="text-2xl font-black text-slate-900">
             {t('profile.owner.error.sync_failed')}
           </h3>
           <p className="text-slate-500 max-w-sm font-medium">
             {t('profile.owner.error.verify_failed')}
           </p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-600 transition-all"
        >
          {t('profile.errors.relogin_button')}
        </button>
      </div>
    );
  }

  const user = profile || {};
  const avatarUrl = user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email || 'partner'}`;

  // Danh sách các tab điều hướng nội bộ (Business Navigation) (Vietnamese comment)
  const navItems = [
    { id: 'Overview', label: t('profile.owner.nav.overview'), icon: 'dashboard_customize' },
    { id: 'Settings', label: t('profile.owner.nav.settings'), icon: 'manage_accounts' },
    { id: 'Password', label: t('profile.owner.nav.security'), icon: 'security' },
  ];

  // --- LOGIC TÍNH TOÁN TRUST SCORE DỰA TRÊN RATING THẬT --- (Vietnamese comment)
  const restaurantsList = Array.isArray(myRestaurants) ? myRestaurants : (myRestaurants?.data || []);
  const ratedRestaurants = restaurantsList.filter(r => (r.ratingAvg || 0) > 0);
  const avgRatingBase = ratedRestaurants.length > 0 
    ? (ratedRestaurants.reduce((acc, curr) => acc + (curr.ratingAvg || 0), 0) / ratedRestaurants.length)
    : 0;
  
  // Quy đổi sang thang điểm 100 (Rating 5 * 20 = 100) (Vietnamese comment)
  const trustScore = (avgRatingBase * 20).toFixed(1);

  // --- LOGIC PHÂN HẠNG ĐỐI TÁC (PARTNERSHIP TIERS - FE ONLY) --- (Vietnamese comment)
  const getPartnerTier = (count) => {
    if (count >= 10) return { label: 'VIP', icon: 'diamond', color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100' };
    if (count >= 5) return { label: 'Elite', icon: 'military_tech', color: 'text-amber-600 bg-amber-50 border-amber-100' };
    if (count >= 3) return { label: 'Premium', icon: 'stars', color: 'text-blue-600 bg-blue-50 border-blue-100' };
    return { label: 'Standard', icon: 'handshake', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  };

  const partnerTier = getPartnerTier(restaurantsList.length);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 1. Executive Branding Header - Full Width Tier (Vietnamese comment) */}
      <div className="w-full">
         <OwnerProfileHero 
           user={user} 
           avatarUrl={avatarUrl} 
           onEdit={() => setActiveTab('Settings')} 
           tier={partnerTier}
         />
      </div>

      {/* 2. Navigation & Content Tier (Vietnamese comment) */}
      <div className="space-y-10">
        {/* Modern Tab Navigation (Vietnamese comment) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="px-4">
             <h2 className="text-xl font-black text-slate-900 tracking-tight">
               {t('profile.owner.nav.identity_management')}
             </h2>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
               {t('profile.owner.nav.account_telemetry')}
             </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/40">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === item.id 
                    ? 'bg-white text-violet-600 shadow-sm border border-slate-200/50' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content Rendering (Vietnamese comment) */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'Overview' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Detailed Information (Left - 7 cols) (Vietnamese comment) */}
              <div className="lg:col-span-7">
                 <OwnerInfoSummary 
                   user={user} 
                   onEdit={() => setActiveTab('Settings')} 
                 />
              </div>

              {/* Quick Actions / System Status (Right - 5 cols) (Vietnamese comment) */}
              <div className="lg:col-span-5 space-y-10">
                 {/* Compact Settings Trigger (Vietnamese comment) */}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-50 pb-4">
                      {t('profile.owner.integrity.title')}
                    </h4>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                             <span className="material-symbols-outlined text-violet-500">lock</span>
                             <span className="text-xs font-bold text-slate-600">
                               {t('profile.owner.integrity.password_security')}
                             </span>
                          </div>
                          <button onClick={() => setActiveTab('Password')} className="text-[10px] font-black text-violet-600 uppercase">
                            {t('profile.owner.integrity.update')}
                          </button>
                       </div>
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                             <span className="material-symbols-outlined text-blue-500">ad_units</span>
                             <span className="text-xs font-bold text-slate-600">
                               {t('profile.owner.integrity.metadata')}
                             </span>
                          </div>
                          <button onClick={() => setActiveTab('Settings')} className="text-[10px] font-black text-blue-600 uppercase">
                            {t('profile.owner.integrity.manage')}
                          </button>
                       </div>
                    </div>
                 </div>

                 {/* System Integrity (Visual only) (Vietnamese comment) */}
                 <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-violet-200/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full"></div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">
                      {t('profile.owner.integrity.cloud_synced')}
                    </p>
                    <h5 className="text-xl font-black mb-4">
                      {t('profile.owner.integrity.hub_title')}
                    </h5>
                    <p className="text-xs text-violet-100 leading-relaxed active:opacity-100 opacity-80 font-medium">
                      {t('profile.owner.integrity.hub_desc')}
                    </p>
                 </div>
              </div>
            </div>
          ) : activeTab === 'Password' ? (
             <div className="max-w-3xl mx-auto">
                <PasswordForm />
             </div>
          ) : (
             <div className="max-w-3xl mx-auto">
                <SettingsForm user={user} />
             </div>
          )}
        </motion.div>
      </div>

      {/* 3. Global Integrity Bar - Bottom Footer Tier (Always Full Width) (Vietnamese comment) */}
      <div className="w-full">
         <div className="bg-slate-900 rounded-[2rem] p-6 px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-white relative overflow-hidden group border border-slate-800 shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center border border-violet-500/20 text-violet-400">
                  <span className="material-symbols-outlined text-2xl animate-pulse">verified</span>
               </div>
               <div className="space-y-0.5">
                  <h3 className="text-xl font-black tracking-tight">
                    {t('profile.owner.integrity.verified_title')}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                     {t('profile.owner.integrity.sync_network')}
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-10 relative z-10 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-10">
               <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    {t('profile.owner.integrity.trust_score')}
                  </p>
                  <p className="text-lg font-black text-emerald-400 tracking-tighter">{trustScore} <span className="text-[10px] text-slate-500 font-medium">/ 100.0</span></p>
               </div>
               <div className="text-center md:text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
                    {t('profile.owner.integrity.security_level')}
                  </p>
                  <div className="flex gap-1 mt-1">
                     {[1,2,3,4,5].map(i => <div key={i} className={`h-1 w-4 rounded-full ${i <= 4 ? 'bg-violet-500' : 'bg-slate-700'}`}></div>)}
                  </div>
               </div>
               <div className="hidden lg:block">
                  <span className="material-symbols-outlined text-slate-700 text-3xl">verified_user</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OwnerProfilePage;
