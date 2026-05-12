import { useEffect } from 'react';
import { Outlet, useParams, useLocation } from 'react-router';
import SidebarRestaurantWorkspace from './SidebarRestaurantWorkspace';
import RestaurantTopbar from './RestaurantTopbar';
import { useWorkspaceDashboard } from '@/features/owner/workspace/dashboard/hooks';
import useNotificationStore from '@/shared/hooks/useNotificationStore.hooks.js';
import { useAuthStore } from '@/features/auth/store';
import { storage } from '@/lib/storage';
import { ROLES } from '@/config/roles';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

/**
 * @file RestaurantWorkspaceLayout.jsx
 * @description Layout chính cho không gian làm việc của từng nhà hàng (Workspace).
 */
const RestaurantWorkspaceLayout = () => {
  const location = useLocation();
  const { idOrSlug } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { initNotificationSocket, fetchActivities, cleanupSocket } = useNotificationStore();
  
  // Lấy thông tin cơ bản của nhà hàng để hiển thị trên Sidebar/Topbar
  const { restaurant, isLoading } = useWorkspaceDashboard(idOrSlug);

  // Khởi tạo Realtime Notification khi vào vùng Restaurant Workspace
  useEffect(() => {
    if (isAuthenticated && user?.id && user?.role === ROLES.OWNER) {
      const token = storage.getToken();
      initNotificationSocket(user.id, user.role, token);
      fetchActivities();
    }
  }, [isAuthenticated, user, initNotificationSocket, fetchActivities]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      {/* Sidebar cố định bên trái */}
      <SidebarRestaurantWorkspace 
        restaurantName={restaurant?.name} 
        isLoading={isLoading} 
      />

      {/* Vùng nội dung chính bên phải */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        {/* Topbar cố định bên trên */}
        <RestaurantTopbar 
          restaurantName={restaurant?.name} 
          restaurantId={restaurant?.id}
          isLoading={isLoading} 
        />

        {/* Nội dung trang thay đổi theo route */}
        <main className="flex-1 pt-28 px-8 pb-12">
          {/* Outlet render các trang con (Overview, Profile, v.v.) */}
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet context={{ restaurant, isLoading }} />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default RestaurantWorkspaceLayout;
