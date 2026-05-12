import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Component xử lý tự động cuộn lên đầu trang mỗi khi URL thay đổi.
 * Khắc phục vấn đề của React Router không tự scroll lên đầu.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
