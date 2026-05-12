import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileQuery } from '../hooks.js';

import ProfileSidebar from '../components/ProfileSidebar.jsx';
import ProfileHero from '../components/ProfileHero.jsx';
import LoyaltyCard from '../components/LoyaltyCard.jsx';
import InfoSummary from '../components/InfoSummary.jsx';
import RecentOrders from '../components/RecentOrders.jsx';
import PasswordForm from '../components/PasswordForm.jsx';
import SettingsForm from '../components/SettingsForm.jsx';

/**
 * @file ProfilePage.jsx
 * @description Trang hồ sơ cá nhân cao cấp.
 */
const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfileQuery();
  const [activeTab, setActiveTab] = useState('Overview');
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface py-20 px-12 flex gap-12 max-w-[1440px] mx-auto animate-pulse">
        <div className="w-80 h-[700px] bg-white rounded-[3rem] shadow-sm border border-outline/5" />
        <div className="flex-1 space-y-12">
           <div className="h-72 bg-white rounded-[3rem] shadow-sm" />
           <div className="grid grid-cols-3 gap-12">
              <div className="col-span-1 h-72 bg-white rounded-[3rem]" />
              <div className="col-span-2 h-72 bg-white rounded-[3rem]" />
           </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex justify-center pt-32 p-6 text-center">
        <div className="max-w-md w-full space-y-12">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-red-50 text-red-500 rounded-[2.5rem] flex items-center justify-center shadow-inner">
               <span className="material-symbols-outlined text-6xl animate-pulse">lock_person</span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-on-surface headline tracking-tight">
              {t('profile.errors.access_denied')}
            </h2>
            <p className="text-on-surface-variant/60 font-medium leading-relaxed">
              {t('profile.errors.session_timeout')}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')} 
            className="w-full py-6 bg-primary text-white font-bold rounded-[2rem] shadow-2xl shadow-primary/20"
          >
            {t('profile.errors.relogin_button')}
          </motion.button>
        </div>
      </div>
    );
  }

  const user = profile || {};
  const avatarUrl = user.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.email || 'default'}`;
  
  return (
    <div className="min-h-screen bg-surface pt-16 pb-40 px-12 relative overflow-hidden">
      {/* Premium Background Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row gap-16 relative z-10">
        
        {/* Sidebar Navigation */}
        <aside className="xl:w-80 shrink-0">
          <div className="xl:sticky xl:top-32">
            <ProfileSidebar 
              user={user} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <section className="flex-1 min-h-[800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="space-y-16"
            >
              {activeTab === 'Overview' ? (
                <>
                  {/* Bento Layer 1 */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                     <div className="lg:col-span-8">
                        <ProfileHero user={user} avatarUrl={avatarUrl} onEdit={() => setActiveTab('Settings')} />
                     </div>
                     <div className="lg:col-span-4">
                        <LoyaltyCard points={user.loyaltyPoints} />
                     </div>
                  </div>

                  {/* Bento Layer 2 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
                     <InfoSummary user={user} onEdit={() => setActiveTab('Settings')} />
                     <RecentOrders />
                  </div>
                </>
              ) : activeTab === 'Password' ? (
                 <PasswordForm />
              ) : (
                 <SettingsForm user={user} />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
