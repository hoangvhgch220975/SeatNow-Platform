import { useSearchParams } from 'react-router';
import { useMemo, useCallback } from 'react';

/**
 * Wrapper React Router hook hỗ trợ CRUD URL parameters dễ dàng
 */
export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryObj = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const getParam = useCallback((key) => searchParams.get(key), [searchParams]);

  const setParam = useCallback(
    (key, value) => {
      const newParams = { ...queryObj };
      if (value === null || value === undefined || value === '') {
        delete newParams[key];
      } else {
        newParams[key] = value;
      }
      setSearchParams(newParams);
    },
    [queryObj, setSearchParams]
  );

  return { queryObj, getParam, setParam, setSearchParams };
};
