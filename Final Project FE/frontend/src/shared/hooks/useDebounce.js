import { useState, useEffect } from 'react';

/**
 * Trì hoãn việc update value sau một khoảng thời gian (delay). 
 * Hữu ích cho việc giảm API Call khi User gõ Search Input
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
