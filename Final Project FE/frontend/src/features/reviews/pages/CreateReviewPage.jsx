import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useRestaurant } from '../../restaurants/hooks';
import { useAuthStore } from '../../auth/store';
import { useRestaurantReviewSummary } from '../hooks';
import ReviewForm from '../components/ReviewForm';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';
import { cn } from '../../../lib/utils';

/**
 * @file CreateReviewPage.jsx
 * @description Trang viết đánh giá cao cấp với giao diện cinematic.
 */
const CreateReviewPage = () => {
  const { id: restaurantId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const { data: restaurantResponse, isLoading: isRestaurantLoading, error: restaurantError } = useRestaurant(restaurantId);
  const restaurant = restaurantResponse?.data || restaurantResponse;

  const { data: summaryResponse } = useRestaurantReviewSummary(restaurantId);
  const summary = summaryResponse?.data || summaryResponse;

  useEffect(() => {
    if (bookingId && !isAuthenticated) {
      toast.error(t('restaurants.reviews.login_required_review'), {
        icon: '🔐',
        duration: 4000
      });
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [bookingId, isAuthenticated, navigate, t]);

  if (isRestaurantLoading) return <LoadingSpinner fullPage />;
  
  if (restaurantError || !restaurant) {
    return (
      <main className="min-h-screen flex items-center justify-center p-12 bg-surface">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center text-rose-500 mx-auto">
            <span className="material-symbols-outlined text-5xl">error</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-on-surface headline">
              {t('restaurants.detail.error_default')}
            </h2>
            <p className="text-on-surface-variant/40 font-medium italic">
              {t('restaurants.detail.error_desc') || "We couldn't find the restaurant you're looking for."}
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="px-12 py-5 bg-primary text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-primary/20"
          >
            {t('common.back')}
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface pt-32 pb-40 px-12 relative overflow-hidden -mt-16">
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16">
          
          {/* Left Side: Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center gap-4 text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
              {t('common.back')}
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline/5 space-y-10 sticky top-32"
            >
              <div className="space-y-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white mx-auto">
                  <img 
                    src={restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop'} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-on-surface headline tracking-tight">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-amber-500">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-lg font-bold text-on-surface">
                      {summary?.averageRating ? Number(summary.averageRating).toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-[11px] font-bold text-on-surface-variant/40 uppercase tracking-widest ml-2">
                      ({summary?.totalReviews || 0} {t('restaurants.card.reviews')})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-10 border-t border-outline/5">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-2xl">location_on</span>
                  </div>
                  <p className="text-[11px] font-medium text-on-surface-variant/60 leading-relaxed pt-2">
                    {restaurant.address}
                  </p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                     <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {restaurant.cuisineTypes?.[0] && (
                      <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">
                        {restaurant.cuisineTypes[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-2xl">payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <span 
                          key={i} 
                          className={cn(
                            "text-lg font-bold",
                            i <= restaurant.priceRange ? "text-primary" : "text-primary/10"
                          )}
                        >
                          $
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-[0.2em] ml-2">
                      {restaurant.priceRange === 1 ? 'Budget' : restaurant.priceRange === 2 ? 'Moderate' : restaurant.priceRange === 3 ? 'Expensive' : 'Luxury'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={cn(
                "p-8 rounded-[2.5rem] flex flex-col gap-4 border text-center transition-all duration-500",
                bookingId 
                  ? "bg-green-500/5 border-green-500/10 text-green-600" 
                  : "bg-surface border-outline/5 text-on-surface-variant/60"
              )}>
                <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-3xl">
                    {bookingId ? 'verified_user' : 'rate_review'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    {bookingId ? t('restaurants.reviews.verified_badge') : t('restaurants.reviews.guest_opinion')}
                  </span>
                  <p className="text-[10px] font-medium opacity-60 leading-relaxed italic">
                     {bookingId ? t('restaurants.reviews.verified_badge_desc') : t('restaurants.reviews.guest_opinion_desc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Right Side: Form Content */}
          <section className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[4rem] p-16 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
                <span className="material-symbols-outlined text-[15rem]">reviews</span>
              </div>

              <header className="mb-20 space-y-6 relative z-10">
                <div className="text-primary font-bold uppercase tracking-[0.4em] text-[10px]">
                   {t('restaurants.reviews.share_exp') || 'SHARE YOUR EXPERIENCE'}
                </div>
                <h1 className="text-6xl font-bold text-on-surface tracking-tighter leading-none headline">
                   {t('restaurants.reviews.write_review')}
                </h1>
                <div className="h-1.5 w-24 bg-primary rounded-full"></div>
              </header>

              <ReviewForm 
                restaurantId={restaurant.id} 
                bookingId={bookingId}
                onSuccess={() => navigate(`/restaurants/${restaurantId}`)}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 px-16 space-y-6"
            >
               <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
                {t('restaurants.reviews.tips_title')}
              </h4>
               <ul className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <li className="space-y-2">
                    <span className="material-symbols-outlined text-primary text-xl">stylus</span>
                    <p className="text-[11px] font-medium text-on-surface-variant/60 leading-relaxed italic">
                      {t('restaurants.reviews.tip_1')}
                    </p>
                  </li>
                  <li className="space-y-2">
                    <span className="material-symbols-outlined text-primary text-xl">photo_camera</span>
                    <p className="text-[11px] font-medium text-on-surface-variant/60 leading-relaxed italic">
                      {t('restaurants.reviews.tip_2')}
                    </p>
                  </li>
                  <li className="space-y-2">
                    <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    <p className="text-[11px] font-medium text-on-surface-variant/60 leading-relaxed italic">
                      {t('restaurants.reviews.tip_3')}
                    </p>
                  </li>
               </ul>
            </motion.div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default CreateReviewPage;
