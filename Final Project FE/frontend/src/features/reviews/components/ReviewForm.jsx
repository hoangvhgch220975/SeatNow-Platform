import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import StarRatingInput from './StarRatingInput';
import ImageUploader from '../../media/components/ImageUploader';
import { createReview } from '../api';
import { useQueryClient } from '@tanstack/react-query';

/**
 * @file ReviewForm.jsx
 * @description Form đánh giá cao cấp với Star Rating, chi tiết trải nghiệm và upload ảnh.
 */

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  foodRating: z.number().min(1).max(5).optional().or(z.literal(0)),
  serviceRating: z.number().min(1).max(5).optional().or(z.literal(0)),
  atmosphereRating: z.number().min(1).max(5).optional().or(z.literal(0)),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000),
  images: z.array(z.string()).max(5, 'Maximum 5 images allowed').default([]),
});

const ReviewForm = ({ restaurantId, bookingId, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      foodRating: 0,
      serviceRating: 0,
      atmosphereRating: 0,
      comment: '',
      images: [],
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        rating: data.rating,
        comment: data.comment,
        images: data.images,
        ...(bookingId && { bookingId }),
        ...(data.foodRating > 0 && { foodRating: data.foodRating }),
        ...(data.serviceRating > 0 && { serviceRating: data.serviceRating }),
        ...(data.atmosphereRating > 0 && { atmosphereRating: data.atmosphereRating }),
      };

      await createReview(restaurantId, payload);
      toast.success(t('restaurants.reviews.success_toast'));
      queryClient.invalidateQueries(['reviews', 'list', restaurantId]);
      queryClient.invalidateQueries(['reviews', 'summary', restaurantId]);
      
      if (onSuccess) onSuccess();
      else navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || t('restaurants.reviews.error_toast'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-surface p-10 rounded-[3rem] border border-outline/5 shadow-inner"
      >
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRatingInput
              label={t('restaurants.reviews.your_rating')}
              value={field.value}
              onChange={field.onChange}
              error={errors.rating?.message}
              size="md"
            />
          )}
        />
      </motion.div>

      <div className="space-y-8 p-10 bg-white border border-outline/5 rounded-[3rem] shadow-sm">
        <div className="flex items-center gap-6">
           <h3 className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] flex-shrink-0">
            {t('restaurants.reviews.detailed_rating')}
          </h3>
          <div className="h-px flex-1 bg-outline/5"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Controller
            name="foodRating"
            control={control}
            render={({ field }) => (
              <StarRatingInput
                label={t('restaurants.reviews.food_rating')}
                value={field.value}
                onChange={field.onChange}
                size="sm"
              />
            )}
          />
          <Controller
            name="serviceRating"
            control={control}
            render={({ field }) => (
              <StarRatingInput
                label={t('restaurants.reviews.service_rating')}
                value={field.value}
                onChange={field.onChange}
                size="sm"
              />
            )}
          />
          <Controller
            name="atmosphereRating"
            control={control}
            render={({ field }) => (
              <StarRatingInput
                label={t('restaurants.reviews.vibe_rating')}
                value={field.value}
                onChange={field.onChange}
                size="sm"
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] ml-8">
          {t('restaurants.reviews.comment_label')}
        </label>
        <textarea
          {...control.register('comment')}
          className={`w-full min-h-[200px] p-10 rounded-[3rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none text-on-surface font-medium placeholder:text-outline/20 resize-none ${
            errors.comment ? 'border-rose-500/20' : ''
          }`}
          placeholder={t('restaurants.reviews.comment_placeholder')}
        />
        {errors.comment && (
          <p className="text-rose-500 text-[10px] font-bold px-8 uppercase tracking-wider">
            {errors.comment.message}
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-8">
          <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em]">
            {t('restaurants.reviews.upload_photos')}
          </label>
          <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full">
             {t('restaurants.reviews.upload_limit_hint')}
          </span>
        </div>
        
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <div className="bg-surface p-8 rounded-[3rem] border border-outline/5">
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                maxImages={5}
              />
            </div>
          )}
        />
        {errors.images && (
          <p className="text-rose-500 text-[10px] font-bold px-8 uppercase tracking-wider">
            {errors.images.message}
          </p>
        )}
      </div>

      <div className="pt-8">
        <motion.button
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full h-24 bg-primary text-white rounded-[2.5rem] font-bold text-[11px] uppercase tracking-[0.4em] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all flex items-center justify-center gap-6 disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-3xl">send</span>
          )}
          {isSubmitting ? t('restaurants.reviews.submitting') : t('restaurants.reviews.submit_review')}
        </motion.button>
      </div>
    </form>
  );
};

export default ReviewForm;
