import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useRestaurant } from '../hooks.js';
import RestaurantMenu from '../components/RestaurantMenu';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';
import ErrorState from '../../../shared/feedback/ErrorState';
import { ROUTES } from '../../../config/routes.js';

const RestaurantMenuPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { data: restaurantData, isLoading, isError } = useRestaurant(idOrSlug);
  const restaurant = restaurantData?.data || restaurantData;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorState onRetry={() => window.location.reload()} />;
  if (!restaurant) return <ErrorState message={t('restaurants.menu.not_found')} />;

  return (
    <div className="min-h-screen bg-surface pt-20 pb-40 px-12 -mt-16">
      {/* Cinematic Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-10"
      >
        <div className="space-y-6">
          <motion.button 
            whileHover={{ x: -10 }}
            onClick={() => navigate(ROUTES.RESTAURANT_DETAIL(idOrSlug))}
            className="flex items-center gap-4 text-on-surface-variant/40 hover:text-primary transition-all text-[11px] font-black uppercase tracking-[0.4em] group"
          >
            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </div>
            {t('common.back')}
          </motion.button>
          
          <div className="space-y-4">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2, duration: 1 }}
               className="text-5xl md:text-6xl font-black text-on-surface headline tracking-tighter uppercase"
             >
               {t('restaurants.menu.title')}
             </motion.h1>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="flex items-center flex-wrap gap-3 text-lg md:text-xl"
             >
               <span className="font-black text-primary bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
                 {restaurant.name}
               </span>
               <span className="text-on-surface-variant/40">•</span>
               <span className="text-on-surface-variant/70 font-medium italic">
                 {restaurant.cuisine}
               </span>
             </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.05)] border border-outline/5"
        >
          <RestaurantMenu restaurantId={idOrSlug} />
        </motion.div>
      </main>

      {/* Floating Action Button for Booking */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed top-28 right-12 z-50"
      >
        <button 
          onClick={() => navigate(ROUTES.CREATE_BOOKING(idOrSlug))}
          className="bg-primary text-white p-6 rounded-full shadow-[0_30px_60px_-10px_rgba(var(--primary-rgb),0.5)] hover:scale-105 transition-all active:scale-95 group flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-3xl leading-none">event_seat</span>
          <span className="font-black text-[11px] uppercase tracking-[0.3em] max-w-0 opacity-0 overflow-hidden group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-4 transition-all duration-500 whitespace-nowrap">
            {t('restaurants.card.book_now')}
          </span>
        </button>
      </motion.div>
    </div>
  );
};

export default RestaurantMenuPage;
