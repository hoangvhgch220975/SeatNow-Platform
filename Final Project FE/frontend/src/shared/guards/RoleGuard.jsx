import { Navigate } from 'react-router';
import { useAuthStore } from '../../features/auth/store.js';
import { ROUTES } from '../../config/routes.js';

/**
 * Component kiểm tra RBAC (Role-Based Access Control) theo Array `allowedRoles`
 * Render UI của Component Con nếu đạt hợp lệ
 */
export const RoleGuard = ({ allowedRoles = [], children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Nếu vai trò của user không khớp list truyền vào (Ví dụ user là CUSTOMER mà vô route OWNER)
  if (!allowedRoles.includes(user?.role)) {
    // Tạm văng về trang chủ, sau này lúc UI Phase 2 sẽ render Page 403 Forbidden
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};
