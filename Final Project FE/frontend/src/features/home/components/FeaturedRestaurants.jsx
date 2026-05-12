import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import { useRestaurants } from '../hooks.js';

// Import Swiper React components & modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import RestaurantCard from './RestaurantCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { useQueries } from '@tanstack/react-query';
import { getRestaurantReviewSummary } from '../../reviews/api.js';

/**
 * Component hiển thị Skeleton khi đang load dữ liệu
 */
const RestaurantSkeleton = () => (
  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-outline/5 animate-pulse">
    <div className="h-72 bg-slate-100"></div>
    <div className="p-10 space-y-6">
      <div className="flex justify-between items-start">
        <div className="h-8 bg-slate-100 rounded-full w-2/3"></div>
        <div className="h-8 bg-slate-100 rounded-full w-12"></div>
      </div>
      <div className="h-4 bg-slate-100 rounded-full w-1/2"></div>
      <div className="h-14 bg-slate-100 rounded-full w-full"></div>
    </div>
  </div>
);

const FeaturedRestaurants = () => {
  const { t } = useTranslation();
  
  // Fetch danh sách nhà hàng
  const { data, isLoading, isError } = useRestaurants({ limit: 20, sort: 'rating' });
  
  // 1. Chuẩn hóa dữ liệu ban đầu từ SQL
  const rawRestaurants = data?.data || data?.restaurants || (Array.isArray(data) ? data : []);

  // 2. Fetch Review Summary hàng loạt từ MongoDB
  const summaries = useQueries({
    queries: rawRestaurants.map(res => ({
      queryKey: ['reviews', 'summary', res.slug || res.id || res._id],
      queryFn: () => getRestaurantReviewSummary(res.slug || res.id || res._id),
      staleTime: 1000 * 60 * 10,
    }))
  });

  const isSummariesLoaded = summaries.every(s => s.isSuccess || s.isError);

  // 3. Lọc và Sắp xếp
  const featuredList = React.useMemo(() => {
    if (!isSummariesLoaded) return [];

    return rawRestaurants
      .map((res, index) => {
        const s = summaries[index].data?.data || summaries[index].data || {};
        const finalRating = s.averageRating || res.rating || 0;
        const finalCount = s.totalReviews || res.review_count || 0;

        return {
          ...res,
          verifiedRating: finalRating,
          verifiedCount: finalCount,
          hasRealReviews: (s.totalReviews || 0) > 0 
        };
      })
      .sort((a, b) => {
        if (a.hasRealReviews !== b.hasRealReviews) {
          return b.hasRealReviews ? 1 : -1;
        }
        return (b.verifiedRating || 0) - (a.verifiedRating || 0);
      })
      .slice(0, 6);
  }, [rawRestaurants, summaries, isSummariesLoaded]);

  if (isError) return null;

  return (
    <section className="py-40 bg-surface w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-20"
        >
          <div className="space-y-6">
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">
              {t('home.featured.badge') || 'Top Picks'}
            </span>
            <h2 className="text-6xl font-black text-on-surface headline tracking-tight uppercase">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-on-surface-variant/50 font-medium italic">
              {t('home.featured.subtitle')}
            </p>
          </div>
          
          <motion.div whileHover={{ x: 10 }} transition={{ type: "spring" }}>
            <Link 
              to={ROUTES.RESTAURANT_LIST || '/restaurants'} 
              className="flex items-center gap-4 text-primary font-black text-[11px] uppercase tracking-[0.3em] group"
            >
              {t('home.featured.view_all')}
              <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <div className="relative -mx-12 px-12 pb-24">
          {(isLoading || !isSummariesLoaded) ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[...Array(3)].map((_, i) => <RestaurantSkeleton key={i} />)}
            </div>
          ) : (
            <Swiper
              modules={[Autoplay, Pagination, FreeMode]}
              spaceBetween={48}
              slidesPerView={1.1}
              grabCursor={true}
              freeMode={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              pagination={{ clickable: true, dynamicBullets: true }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="featured-swiper !overflow-visible"
            >
              {featuredList.map((restaurant, idx) => (
                <SwiperSlide key={restaurant.id || idx} className="pb-10">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <RestaurantCard restaurant={restaurant} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
