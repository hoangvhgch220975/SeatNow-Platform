import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../../lib/utils';

/**
 * @file StarRatingInput.jsx
 * @description Bộ chọn sao chuyên nghiệp cho Form đánh giá.
 */
const StarRatingInput = ({ value, onChange, label, error, size = 'md' }) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(0);

  const starLabels = {
    1: t('restaurants.reviews.one_star'),
    2: t('restaurants.reviews.two_stars'),
    3: t('restaurants.reviews.three_stars'),
    4: t('restaurants.reviews.four_stars'),
    5: t('restaurants.reviews.five_stars'),
  };

  const isSmall = size === 'sm';

  return (
    <div className={cn("space-y-3", isSmall && "space-y-2")}>
      {label && (
        <label className={cn(
          "font-black text-on-surface uppercase tracking-[0.2em] block opacity-60",
          isSmall ? "text-[9px]" : "text-xs"
        )}>
          {label}
        </label>
      )}
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={cn(
                "transition-all duration-300 transform hover:scale-110 focus:outline-none",
                (hovered || value) >= star ? "text-[#FFB800]" : "text-zinc-200"
              )}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => onChange(star)}
            >
              <span 
                className={cn(
                  "material-symbols-outlined",
                  isSmall ? "text-2xl" : "text-3xl md:text-4xl"
                )}
                style={{ 
                  fontVariationSettings: `'FILL' ${ (hovered || value) >= star ? 1 : 0}, 'wght' 500`,
                  filter: (hovered || value) >= star ? 'drop-shadow(0 0 6px rgba(255, 184, 0, 0.2))' : 'none'
                }}
              >
                star
              </span>
            </button>
          ))}
          
          <div className="ml-3">
            <span className={cn(
              "font-black text-primary italic transition-all duration-300 block transform",
              isSmall ? "text-[10px]" : "text-base",
              (hovered || value) ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
            )}>
              {starLabels[hovered || value]}
            </span>
          </div>
        </div>
        
        {error && (
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default StarRatingInput;
