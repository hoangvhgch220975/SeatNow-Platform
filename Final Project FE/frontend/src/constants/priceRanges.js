/**
 * Mapping dải giá hiển thị cho người dùng 
 * 1: Rẽ -> 4: Rất đắt
 */
export const PRICE_RANGES = [
  { value: 1, label: '$ (Affordable)', description: 'Under 100k/person' },
  { value: 2, label: '$$ (Mid-range)', description: '100k - 300k/person' },
  { value: 3, label: '$$$ (High-end)', description: '300k - 1M/person' },
  { value: 4, label: '$$$$ (Luxury)', description: 'Over 1M/person' }
];

// Helper get price label quickly
export const getPriceLabel = (val) => {
  const match = PRICE_RANGES.find(p => p.value === val);
  return match ? match.label.substring(0, match.value) : 'N/A';
};
