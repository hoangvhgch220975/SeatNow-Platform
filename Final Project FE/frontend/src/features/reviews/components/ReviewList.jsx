import React from 'react';
import ReviewCard from './ReviewCard';
import { useTranslation } from 'react-i18next';

/**
 * @file ReviewList.jsx
 * @description Hiển thị danh sách các bài đánh giá hoặc trạng thái loading/trống.
 */
const ReviewList = ({ reviews = [], isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-10">
      {isLoading ? (
        // Review Skeletons
        [...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-8 items-start animate-pulse">
            <div className="flex items-center sm:flex-col gap-4 sm:w-32 flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-slate-200"></div>
              <div className="sm:text-center space-y-2">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-2 bg-slate-100 rounded w-16"></div>
              </div>
            </div>
            <div className="flex-1 h-32 bg-slate-50 rounded-3xl border border-dashed border-slate-200"></div>
          </div>
        ))
      ) : reviews.length > 0 ? (
        reviews.map((review, index) => (
          <ReviewCard key={review.id || index} review={review} index={index} />
        ))
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-outline-variant/10 rounded-3xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-3">rate_review</span>
          <p className="text-on-surface-variant font-medium italic">
            {t('restaurants.reviews.no_reviews')}
          </p>

        </div>
      )}
    </div>
  );
};

export default ReviewList;
