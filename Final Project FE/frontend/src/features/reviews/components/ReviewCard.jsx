import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../../shared/utils/formatDateTime.js';
import MediaLightbox from '../../../shared/ui/MediaLightbox.jsx';

/**
 * Helper: Lấy chữ cái đầu của tên để làm avatar
 */
const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * @file ReviewCard.jsx
 * @description Thành phần hiển thị một thẻ đánh giá đơn lẻ cao cấp.
 */
const ReviewCard = ({ review, index }) => {
  const { t } = useTranslation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleImageClick = (idx) => {
    setActiveImageIndex(idx);
    setIsLightboxOpen(true);
  };

  const rawName = 
    review.customerName || 
    review.customer_name || 
    review.user?.fullName || 
    review.customer?.fullName || 
    review.fullName || 
    review.displayName || 
    review.name;

  const isPlaceholder = !rawName || rawName === 'Khách vãng lai' || rawName === 'Khách' || rawName === 'Guest';
  const isGuest = !review.customerId && !review.userId && !review.customer?.id;
  
  const reviewerName = isPlaceholder 
    ? (review.isVerified ? t('restaurants.reviews.verified_customer') : t('restaurants.reviews.guest_reviewer'))
    : rawName;
  
  const baseAvatar = 
    review.customerAvatar || 
    review.customer_avatar || 
    review.user?.avatar || 
    review.customer?.avatar || 
    review.avatar;

  const isPlaceholderAvatar = typeof baseAvatar === 'string' && (baseAvatar.includes('ui-avatars.com') || baseAvatar.includes('placeholder'));

  const reviewerAvatar = (!isPlaceholderAvatar && baseAvatar) || (isGuest
    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${review.id || review._id || index}&backgroundColor=b6e3f4,c0aede,d1d4f9` 
    : null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <div className="flex flex-col sm:flex-row gap-10 items-start">
        {/* Author Metadata */}
        <div className="flex items-center sm:flex-col gap-6 sm:w-40 flex-shrink-0">
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-[2rem] bg-surface flex items-center justify-center font-bold text-xl shadow-xl border-4 border-white overflow-hidden"
            >
              {reviewerAvatar ? (
                <img src={reviewerAvatar} alt={reviewerName} className="w-full h-full object-cover" />
              ) : (
                getInitials(reviewerName)
              )}
            </motion.div>
            {review.isVerified && (
              <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                <span className="material-symbols-outlined text-sm leading-none block font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            )}
          </div>
          <div className="sm:text-center space-y-1">
            <h4 className="font-bold text-on-surface text-sm line-clamp-1 headline tracking-tight">{reviewerName}</h4>
            {review.isVerified && (
              <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{t('restaurants.reviews.verified_badge')}</p>
            )}
            <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.2em]">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>

        {/* Review Body */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 space-y-6 bg-white p-10 rounded-[3rem] border border-outline/5 shadow-sm hover:shadow-xl transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex text-amber-500 gap-0.5 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: `'FILL' ${i < review.rating ? 1 : 0}` }}>star</span>
                ))}
              </div>
              <div className="flex gap-2">
                {review.foodRating && (
                  <span className="text-[9px] font-bold text-on-surface-variant/40 bg-surface px-4 py-1.5 rounded-full uppercase tracking-widest">Food: {review.foodRating}</span>
                )}
                {review.serviceRating && (
                  <span className="text-[9px] font-bold text-on-surface-variant/40 bg-surface px-4 py-1.5 rounded-full uppercase tracking-widest">Service: {review.serviceRating}</span>
                )}
                {review.atmosphereRating && (
                  <span className="text-[9px] font-bold text-on-surface-variant/40 bg-surface px-4 py-1.5 rounded-full uppercase tracking-widest">Vibe: {review.atmosphereRating}</span>
                )}
              </div>
            </div>
          </div>

          <p className="text-on-surface-variant/80 text-lg leading-relaxed font-medium italic relative">
            <span className="absolute -left-4 -top-2 text-primary/10 text-4xl font-serif">"</span>
            {review.comment}
            <span className="text-primary/10 text-4xl font-serif">"</span>
          </p>

          {review.images?.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-4">
              {review.images.map((img, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                  onClick={() => handleImageClick(i)}
                  className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-surface shadow-md cursor-zoom-in"
                >
                  <img src={img} alt={`review-img-${i}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <MediaLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={review.images}
        initialIndex={activeImageIndex}
      />
    </motion.div>
  );
};

export default ReviewCard;
