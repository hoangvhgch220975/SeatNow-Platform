import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '../../features/auth/store.js';
import { ROUTES } from '../../config/routes.js';

/**
 * Component bọc lại các Route yêu cầu User phải Login
 * Nếu chưa báo lỗi 401 thì văng ra form Login và nhớ đường dẫn cũ để redirect lại
 */
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
};
