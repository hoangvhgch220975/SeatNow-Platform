import React, { useState, useMemo } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';

import RestaurantHeader from '../components/RestaurantHeader';
import RestaurantFilters from '../components/RestaurantFilters';
import RestaurantCard from '../components/RestaurantCard';
import Pagination from '../../../shared/ui/Pagination.jsx';
import { useRestaurants } from '../hooks.js';

/**
 * @file RestaurantListPage.jsx
 * @description Trang chính quản lý hiển thị danh sách và lọc nhà hàng.
 */

// Premium Skeleton (Vietnamese comment)
const RestaurantSkeleton = () => (
  <div className="w-full flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-outline/5 animate-pulse">
    <div className="h-72 bg-surface"></div>
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <div className="h-8 bg-surface rounded-xl w-3/4 mb-4"></div>
          <div className="h-4 bg-surface rounded-lg w-1/2"></div>
        </div>
        <div className="h-6 bg-surface rounded-lg w-12"></div>
      </div>
      <div className="h-10 bg-surface rounded-xl w-32"></div>
      <div className="pt-6 flex gap-4">
        <div className="flex-1 h-14 rounded-2xl bg-surface"></div>
        <div className="flex-1 h-14 rounded-2xl bg-surface"></div>
      </div>
    </div>
  </div>
);

const RestaurantListPage = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    cuisine: '',
    priceRange: null,
    sort: 'rating',
    location: '',
    q: '',
    radiusKm: 20,
    page: 1,
    limit: 6
  });

  const [isLocating, setIsLocating] = useState(false);
  const { data, isLoading, isError, error } = useRestaurants(filters);

  const restaurants = useMemo(() => data?.data || [], [data]);
  const totalCount = data?.total || 0;

  const totalPages = useMemo(() => {
    if (totalCount > 0) return Math.ceil(totalCount / filters.limit);
    return data?.hasMore ? filters.page + 1 : filters.page;
  }, [totalCount, filters.limit, filters.page, data?.hasMore]);

  const requestLocation = () => {
    return new Promise(async (resolve) => {
      const fetchLocationByIP = async () => {
        const apis = ['https://freeipapi.com/api/json', 'https://ipapi.co/json/'];
        for (const url of apis) {
          try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const data = await response.json();
            if (data.latitude && data.longitude) return { lat: data.latitude, lng: data.longitude };
          } catch (err) {}
        }
        return null;
      };

      const DEFAULT_LOCATION = { lat: 21.0285, lng: 105.8542 };
      if (!navigator.geolocation) {
        const ipCoords = await fetchLocationByIP();
        return resolve(ipCoords || DEFAULT_LOCATION);
      }

      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        async () => {
          const ipCoords = await fetchLocationByIP();
          setIsLocating(false);
          resolve(ipCoords || DEFAULT_LOCATION);
        },
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    });
  };

  const handleFilterChange = async (newFilters) => {
    let finalFilters = { ...filters, ...newFilters, page: 1 };
    if (newFilters.sort && newFilters.sort !== 'distance') {
      delete finalFilters.lat; delete finalFilters.lng;
      finalFilters.radiusKm = 20;
    }
    if (finalFilters.sort === 'distance' && (!finalFilters.lat || !finalFilters.lng)) {
      try {
        const coords = await requestLocation();
        finalFilters = { ...finalFilters, ...coords, radiusKm: 20 };
      } catch (err) { finalFilters.sort = 'rating'; }
    }
    setFilters(finalFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="max-w-[1440px] mx-auto px-12 pb-32">
      <RestaurantHeader 
        onSearch={(q) => handleFilterChange({ q })} 
        currentSearch={filters.q}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] w-full gap-20 mt-12 items-start">
          <aside className="w-full lg:sticky lg:top-32">
            <div className="glass rounded-[2.5rem] border border-outline/5 p-10 shadow-premium">
              <RestaurantFilters 
                currentFilters={filters} 
                onChange={handleFilterChange} 
              />
            <button 
              onClick={() => setFilters({ sort: 'rating', q: '', cuisine: '', priceRange: null, radiusKm: 20, page: 1, limit: 6 })}
              className="w-full mt-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 hover:text-primary transition-colors border-t border-outline/5 pt-8"
            >
              {t('restaurants.list.clear_filters')}
            </button>
          </div>
        </aside>

        <section className="min-w-0 w-full space-y-10">
          {/* List Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-10 border-b border-outline/5">
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-on-surface headline tracking-tight">
                {t('restaurants.list.title')}
              </h2>
              <p className="text-on-surface-variant/40 font-medium mt-2">
                {isLocating 
                  ? t('restaurants.list.detecting_location')
                  : isLoading 
                    ? t('restaurants.list.searching') 
                    : t('restaurants.list.found_results', { count: totalCount })}
              </p>
            </div>
            
            {/* Custom Premium Sort */}
            <div className="flex items-center gap-4 bg-surface px-6 py-3 rounded-2xl border border-outline/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/30">
                {t('restaurants.list.sort_by')}
              </span>
              <select 
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="bg-transparent border-none text-on-surface font-bold text-xs focus:ring-0 cursor-pointer outline-none hover:text-primary transition-colors p-0 uppercase tracking-wider"
              >
                <option value="rating">{t('restaurants.list.sort_featured')}</option>
                <option value="newest">{t('restaurants.list.sort_newest')}</option>
                <option value="distance">{t('restaurants.list.sort_distance')}</option>
              </select>
            </div>
          </div>

          {/* List Content */}
          <div className="w-full min-h-[1400px]">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[...Array(6)].map((_, i) => <RestaurantSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <div className="py-32 text-center bg-red-50/30 rounded-[3rem] border border-red-100 text-red-600">
                 <span className="material-symbols-outlined text-5xl mb-4 opacity-50">error</span>
                 <p className="font-bold text-xl headline">{t('restaurants.list.error_title')}</p>
                 <button onClick={() => window.location.reload()} className="mt-10 px-12 py-4 bg-red-600 text-white rounded-full text-xs font-bold shadow-xl shadow-red-200 uppercase tracking-widest">{t('restaurants.list.try_again')}</button>
              </div>
            ) : restaurants.length > 0 ? (
              <div className="space-y-16">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard 
                      key={restaurant.id}
                      restaurant={{
                        ...restaurant,
                        distanceKm: filters.sort === 'distance' ? restaurant.distanceKm : null
                      }} 
                    />
                  ))}
                </div>
                
                <Pagination 
                  currentPage={filters.page} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="w-238 self-stretch py-32 px-12 text-center bg-surface rounded-[4rem] border-2 border-dashed border-outline/10 shadow-inner flex flex-col items-center justify-center min-h-[800px]">
                <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center mb-10 shadow-2xl border border-outline/5 transform transition-transform hover:scale-105">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/20">restaurant_menu</span>
                </div>
                <h3 className="text-on-surface-variant/60 text-3xl font-bold headline mb-6 italic">
                  {t('restaurants.list.no_destinations')}
                </h3>
                <p className="text-[12px] font-bold text-on-surface-variant/30 uppercase tracking-[0.4em] max-w-2xl mx-auto mb-14 leading-relaxed">
                  <Trans i18nKey="restaurants.list.no_destinations_desc">
                    We couldn't find any curated destinations matching your current filters. 
                    <br/>Try searching with fewer criteria.
                  </Trans>
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilters({ sort: 'rating', q: '', cuisine: '', priceRange: null, page: 1, limit: 6 })}
                  className="px-16 py-7 bg-primary text-white font-bold rounded-full shadow-2xl shadow-primary/20 uppercase text-[11px] tracking-[0.4em] transition-all"
                >
                  {t('restaurants.list.clear_filters')}
                </motion.button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RestaurantListPage;
