import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import MediaLightbox from '../../../shared/ui/MediaLightbox.jsx';

/**
 * @file ProfileHero.jsx
 * @description Thẻ Hero lớn trong hồ sơ cá nhân cao cấp.
 */
const ProfileHero = ({ user, avatarUrl, onEdit }) => {
  const { t } = useTranslation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white rounded-[3.5rem] p-12 lg:p-14 border border-outline/5 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.1)] flex flex-col md:flex-row items-center gap-14 relative overflow-hidden group transition-all duration-700"
    >
      <MediaLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={[avatarUrl]}
        initialIndex={0}
      />

      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full -mr-32 -mt-32 blur-[120px] opacity-60 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -2 }}
        onClick={() => setIsLightboxOpen(true)}
        className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-[2.5rem] overflow-hidden ring-8 ring-white shadow-xl flex-shrink-0 cursor-zoom-in group/avatar"
      >
        <img 
          alt={user?.name} 
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out-expo group-hover/avatar:scale-110" 
          src={avatarUrl} 
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500 flex items-center justify-center text-white backdrop-blur-sm">
           <span className="material-symbols-outlined text-[32px] animate-pulse">zoom_in</span>
        </div>
      </motion.div>

      <div className="flex-1 text-center md:text-left space-y-8 relative z-10 w-full">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10 hover:bg-primary/10 transition-colors cursor-default">
           <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
           {t('profile.hero.identity_verified')}
        </div>
        
        <div className="space-y-2">
          <h1 className="text-5xl lg:text-6xl font-black text-on-surface headline tracking-tighter">
            {user?.name || t('profile.hero.default_member')}<span className="text-primary">.</span>
          </h1>
          <p className="text-on-surface-variant/60 text-lg lg:text-xl font-bold tracking-tight italic flex items-center justify-center md:justify-start gap-2">
            <span className="material-symbols-outlined text-xl text-primary/40">mail</span>
            {user?.email || t('profile.hero.no_email')}
          </p>
        </div>
        
        <div className="pt-6">
          <motion.button 
            whileHover={{ y: -5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.4)] hover:brightness-110 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {t('profile.hero.edit_button')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHero;
