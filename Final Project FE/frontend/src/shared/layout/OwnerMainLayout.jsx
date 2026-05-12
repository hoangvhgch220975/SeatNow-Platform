import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { useAuthStore } from '@/features/auth/store.js';
import { ROLES } from '@/config/roles.js';
import SidebarOwnerMain from './SidebarOwnerMain.jsx';
import OwnerTopbar from './OwnerTopbar.jsx';
import OwnerFooter from './OwnerFooter.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';
import useNotificationStore from '@/shared/hooks/useNotificationStore.hooks.js';
import { storage } from '@/lib/storage';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

/**
 * @file OwnerMainLayout.jsx
 * @description Layout chính dành cho cấp độ "Quản lý danh mục" (Portfolio Level) của Owner.
 */
const OwnerMainLayout = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { initNotificationSocket, fetchActivities, cleanupSocket } = useNotificationStore();

  // Khởi tạo Realtime Notification khi vào vùng Owner
  useEffect(() => {
    if (isAuthenticated && user?.id && user?.role === ROLES.OWNER) {
      const token = storage.getToken();
      initNotificationSocket(user.id, user.role, token);
      fetchActivities();
    }
  }, [isAuthenticated, user, initNotificationSocket, fetchActivities]);

  // Kiểm tra quyền truy cập: Chỉ cho phép OWNER
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role?.toUpperCase() !== ROLES.OWNER) return <Navigate to="/" replace />;

  return (
    <div className="flex min-h-screen bg-slate-50 font-body antialiased text-slate-900 transition-colors duration-200">
      <ScrollToTop />
      
      {/* Sidebar cố định */}
      <SidebarOwnerMain />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative overflow-x-hidden">
        {/* Topbar dính trên cùng */}
        <OwnerTopbar />

        {/* Nội dung chính của trang */}
        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full transition-all duration-300">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        
        <OwnerFooter />
      </div>
    </div>
  );
};

export default OwnerMainLayout;
