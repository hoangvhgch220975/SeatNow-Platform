import React from 'react';
import { CUISINES } from '@/constants/cuisines';
import { X } from 'lucide-react';

/**
 * @component CuisineSelector
 * @description Thành phần chọn nhiều loại hình ẩm thực từ danh sách hằng số.
 * Sử dụng nhãn tiếng Anh, chú thích tiếng Việt.
 */
const CuisineSelector = ({ selectedCuisines = [], onChange }) => {
  // Thêm hoặc xóa một loại hình ẩm thực (Vietnamese comment)
  const toggleCuisine = (cuisineValue) => {
    if (selectedCuisines.includes(cuisineValue)) {
      onChange(selectedCuisines.filter((c) => c !== cuisineValue));
    } else {
      onChange([...selectedCuisines, cuisineValue]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CUISINES.map((cuisine) => (
          <button
            key={cuisine.value}
            type="button"
            onClick={() => toggleCuisine(cuisine.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              selectedCuisines.includes(cuisine.value)
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-white text-on-surface-variant border-outline-variant hover:border-primary/50'
            }`}
          >
            {cuisine.label}
          </button>
        ))}
      </div>

      {/* Danh sách các mục đã chọn (Vietnamese comment) */}
      {selectedCuisines.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-outline-variant/30">
          <span className="text-xs font-bold text-primary uppercase tracking-wider w-full mb-1">
            Selected:
          </span>
          {selectedCuisines.map((cuisineValue) => (
            <div
              key={cuisineValue}
              className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold"
            >
              {cuisineValue}
              <button
                type="button"
                onClick={() => toggleCuisine(cuisineValue)}
                className="hover:text-red-500 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CuisineSelector;
