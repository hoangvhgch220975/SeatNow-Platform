import React, { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import PageTransition from './shared/components/PageTransition.jsx';
import { useAuthStore } from './features/auth/store';
import LanguageSwitcher from './shared/components/LanguageSwitcher.jsx';
import AIFloatingButton from './shared/components/AIFloatingButton.jsx';

/**
 * @file App.jsx
 * @description Root Component. Quản lý các sự kiện toàn cục và chuyển cảnh trang.
 */

function App() {
  const location = useLocation();
  const element = useOutlet();
  const { logout, isAuthenticated, user } = useAuthStore();

  const isCustomer = isAuthenticated && user?.role?.toUpperCase() === 'CUSTOMER';
  const isAdminOrOwnerPath = location.pathname.startsWith('/admin') || location.pathname.startsWith('/owner');

  // ✅ Lắng nghe sự kiện Logout tự động khi Token hết hạn (phát ra từ axios interceptor)
  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn('⚠️ [Session] Token expired or invalid. Redirecting to login...');
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  const isAuthPath = location.pathname.startsWith('/login') || 
                     location.pathname.startsWith('/register') || 
                     location.pathname.startsWith('/forgot-password');

  return (
    <>
      <Toaster 
        position="top-center" 
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{
          duration: 5000, // Mặc định 5s cho các thông báo chung
          success: {
            duration: 2000, // 2s cho thông báo thành công
          },
          error: {
            duration: 2000, // 2s cho thông báo thất bại
          },
        }}
      />
      <AnimatePresence mode="wait" initial={false}>
        {element}
      </AnimatePresence>

      {/* 
        Language Switcher: Hiển thị cho Guest ở các trang Public & Auth
        AI Button: Chỉ hiển thị ở các trang Public (không phải Auth/Admin/Owner)
      */}
      {!isCustomer && !isAdminOrOwnerPath && (
        <>
          <LanguageSwitcher variant="floating" />
          {!isAuthPath && <AIFloatingButton />}
        </>
      )}
    </>
  );
}

export default App;
