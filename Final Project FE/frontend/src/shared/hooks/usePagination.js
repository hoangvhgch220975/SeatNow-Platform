import { useState, useMemo } from 'react';

/**
 * Hook quản lý State phân trang thống nhất
 */
export const usePagination = ({ initialPage = 1, initialSize = 10, totalCount = 0 }) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const nextPage = () => setPage((current) => Math.min(current + 1, totalPages));
  const prevPage = () => setPage((current) => Math.max(current - 1, 1));
  const jumpToPage = (target) => {
    const pageObj = Number(target);
    if (!isNaN(pageObj) && pageObj >= 1 && pageObj <= totalPages) {
      setPage(pageObj);
    }
  };

  return {
    page,
    pageSize,
    totalCount,
    totalPages,
    setPageSize,
    nextPage,
    prevPage,
    jumpToPage,
  };
};
