import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import RestaurantHero from '../components/RestaurantHero';
import RestaurantGallery from '../components/RestaurantGallery';
import RestaurantInfo from '../components/RestaurantInfo';
import RestaurantMenuPreview from '../components/RestaurantMenuPreview';
import RestaurantPolicies from '../components/RestaurantPolicies';
import AvailabilityPanel from '../components/AvailabilityPanel';
import ReviewSection from '../../reviews/components/ReviewSection';
import { useRestaurant, useRestaurantMenu } from '../hooks.js';
import { useRestaurantReviewSummary } from '../../reviews/hooks.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';
import ErrorState from '../../../shared/feedback/ErrorState';

const POTENTIAL_AMENITIES = [
  { icon: 'wifi', labelKey: 'restaurants.amenities.wifi', color: 'blue' },
  { icon: 'local_parking', labelKey: 'restaurants.amenities.parking', color: 'amber' },
  { icon: 'deck', labelKey: 'restaurants.amenities.deck', color: 'emerald' },
  { icon: 'restaurant', labelKey: 'restaurants.amenities.restaurant', color: 'rose' },
  { icon: 'ac_unit', labelKey: 'restaurants.amenities.ac_unit', color: 'cyan' },
  { icon: 'local_bar', labelKey: 'restaurants.amenities.local_bar', color: 'violet' },
  { icon: 'meeting_room', labelKey: 'restaurants.amenities.meeting_room', color: 'slate' },
  { icon: 'family_restroom', labelKey: 'restaurants.amenities.family_restroom', color: 'pink' },
  { icon: 'music_note', labelKey: 'restaurants.amenities.music_note', color: 'indigo' },
  { icon: 'celebration', labelKey: 'restaurants.amenities.celebration', color: 'orange' },
  { icon: 'wine_bar', labelKey: 'restaurants.amenities.wine_bar', color: 'red' },
  { icon: 'child_care', labelKey: 'restaurants.amenities.child_care', color: 'teal' },
  { icon: 'accessible', labelKey: 'restaurants.amenities.accessible', color: 'sky' },
  { icon: 'credit_card', labelKey: 'restaurants.amenities.credit_card', color: 'green' },
  { icon: 'directions_car', labelKey: 'restaurants.amenities.directions_car', color: 'amber' },
  { icon: 'visibility', labelKey: 'restaurants.amenities.visibility', color: 'purple' }
];

const formatPolicies = (policiesData, t) => {
  if (!policiesData) return [
    t('restaurants.policies.grace_period'),
    t('restaurants.policies.cancellation'),
    t('restaurants.policies.dress_code')
  ];
  if (typeof policiesData === 'string') return [policiesData];
  const formatted = [];
  if (policiesData.gracePeriod) formatted.push(t('restaurants.policies.grace_period_param', { time: policiesData.gracePeriod }));
  if (policiesData.cancellationPolicy) formatted.push(t('restaurants.policies.cancellation_param', { policy: policiesData.cancellationPolicy }));
  if (formatted.length < 2) formatted.push(t('restaurants.policies.general'));
  return formatted;
};

/**
 * @file RestaurantDetailPage.jsx
 * @description Trang chi tiết nhà hàng cao cấp.
 */
const RestaurantDetailPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useRestaurant(idOrSlug);
  const { data: summaryData } = useRestaurantReviewSummary(idOrSlug);
  const { data: menuData } = useRestaurantMenu(idOrSlug);

  const restaurant = data?.data || data;
  const summary = summaryData?.data || summaryData || {};
  const menuItems = menuData?.data || menuData || [];

  const amenities = useMemo(() => {
    if (!restaurant?._id && !restaurant?.id) {
      return POTENTIAL_AMENITIES.slice(0, 4).map(a => ({ ...a, label: t(a.labelKey) }));
    }
    const seed = (restaurant._id || restaurant.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...POTENTIAL_AMENITIES].sort(() => 0.5 - (seed % 10) / 10);
    return shuffled.slice(0, 4).map(a => ({ ...a, label: t(a.labelKey) }));
  }, [restaurant, t]);

  const policies = useMemo(() => formatPolicies(restaurant?.policies, t), [restaurant, t]);

  const handleViewFullMenu = () => {
    navigate(ROUTES.RESTAURANT_MENU(idOrSlug));
  };

  if (isLoading) return <LoadingSpinner message={t('restaurants.detail.loading')} />;

  if (isError || !restaurant) {
    return <ErrorState message={error?.response?.data?.message || t('restaurants.detail.error_default')} />;
  }

  const uiRestaurant = {
    ...restaurant,
    rating: (summaryData && typeof summary.averageRating === 'number') ? summary.averageRating : (restaurant.ratingAvg || 0),
    reviewCount: (summaryData && typeof summary.totalReviews === 'number') ? summary.totalReviews : (restaurant.ratingCount || 0),
    coverImage: restaurant.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    photos: restaurant.images || [],
    priceRange: '$'.repeat(restaurant.priceRange || 2),
    cuisine: (restaurant.cuisineTypes && restaurant.cuisineTypes[0]) || restaurant.cuisine || 'Cuisine',
    location: restaurant.address || restaurant.location || 'Vietnam'
  };

  return (
    <div className="bg-surface pb-40">
      <RestaurantHero restaurant={uiRestaurant} />
      <RestaurantGallery photos={uiRestaurant.photos} />

      <div className="px-12 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RestaurantInfo 
              description={uiRestaurant.description || t('restaurants.detail.default_description')} 
              amenities={amenities} 
              cuisineTypes={restaurant.cuisineTypes || []}
              openingHours={uiRestaurant.openingHours || uiRestaurant.openingHoursJson}
              depositEnabled={uiRestaurant.depositEnabled}
              latitude={uiRestaurant.latitude}
              longitude={uiRestaurant.longitude}
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RestaurantMenuPreview 
              menuItems={menuItems} 
              onViewFullMenu={handleViewFullMenu}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ReviewSection 
              restaurantId={idOrSlug} 
              baseRestaurant={uiRestaurant} 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <RestaurantPolicies policies={policies} />
          </motion.div>
        </div>

        <aside className="lg:col-span-4 relative">
          <div className="sticky top-32">
            <AvailabilityPanel restaurant={uiRestaurant} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
