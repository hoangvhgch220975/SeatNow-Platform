import React from 'react';
import { useTranslation } from 'react-i18next';


/**
 * @file RatingSummary.jsx
 * @description Hiển thị tổng quan điểm số trung bình và biểu đồ phân bổ sao.
 */
const RatingSummary = ({ rating, reviewCount, summary = {} }) => {
  const { t } = useTranslation();

  // Tính toán phần trăm cho các thanh biểu đồ (Progress bars)
  const totalSummary = Object.values(summary).reduce((acc, val) => acc + val, 0) || 1;
  const getPercentage = (count) => (count / totalSummary) * 100;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-12 border-b border-outline-variant/10 pb-12">
      {/* Overall Rating Section */}
      <div className="text-center md:text-left">
        <div className="text-7xl font-black text-on-surface tracking-tighter leading-none">
          {reviewCount > 0 ? rating : 'N/A'}
        </div>
        <div className={`flex mt-4 mb-2 justify-center md:justify-start ${reviewCount > 0 ? 'text-yellow-400' : 'text-slate-300'}`}>
          {[...Array(5)].map((_, i) => (
            <span 
              key={i} 
              className="material-symbols-outlined text-base" 
              style={{ fontVariationSettings: `'FILL' ${reviewCount > 0 && i < Math.floor(rating) ? 1 : 0}` }}
            >
              star
            </span>
          ))}
        </div>
        <div className="text-sm font-medium text-on-surface-variant italic">
          {reviewCount > 0 
            ? t('restaurants.reviews.count_verified', { count: reviewCount })
            : t('restaurants.reviews.no_reviews')
          }
        </div>

      </div>

      {/* Rating Breakdown Bars */}
      <div className="flex-1 w-full max-w-sm space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = summary[`${star}_star`] || 0;
          const percentage = getPercentage(count);
          return (
            <div key={star} className="flex items-center gap-4 group">
              <span className="text-xs font-bold w-3 text-on-surface-variant group-hover:text-primary transition-colors">{star}</span>
              <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-700 ease-out" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-medium text-on-surface-variant/60 w-8 text-right italic">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummary;
