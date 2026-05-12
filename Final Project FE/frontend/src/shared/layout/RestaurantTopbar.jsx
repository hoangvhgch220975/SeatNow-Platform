import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/features/auth/store';
import { useProfileQuery } from '@/features/profile/hooks'; // Hook lấy dữ liệu thực từ DB (Vietnamese comment)
import LanguageSwitcher from '../components/LanguageSwitcher';
import NotificationDropdown from '../components/Notifications/NotificationDropdown';

/**
 * @file RestaurantTopbar.jsx
 * @description Thanh công cụ phía trên dành cho Workspace, tích hợp tìm kiếm, thông báo và thông tin người dùng thực từ DB.
 */
const RestaurantTopbar = ({ restaurantName, restaurantId }) => {
  const { t } = useTranslation();
  const { user: authUser } = useAuthStore();
  const { data: profile } = useProfileQuery(); // Lấy profile mới nhất từ Database (Vietnamese comment)
  
  // Ưu tiên dữ liệu từ Profile (DB), fallback về AuthStore (Local) (Vietnamese comment)
  const user = profile || authUser;
  
  // Xử lý ảnh đại diện (Vietnamese comment)
  const avatarUrl = user?.avatar || user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.email || 'default'}`;

  return (
    <header className="fixed top-0 right-0 left-72 h-20 bg-white/70 backdrop-blur-xl z-40 flex items-center justify-between px-8 shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] border-b border-white/10">
      <div className="flex items-center gap-6">
        {/* Placeholder for left side elements if needed in future */}
      </div>

      <div className="flex items-center gap-6">
        <LanguageSwitcher />

        {/* Notifications Icon */}
        <NotificationDropdown restaurantId={restaurantId} />

        {/* User Profile Summary */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right flex flex-col items-end">
            <p className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1 uppercase">
              {user?.fullName || user?.name || 'Partner'}
            </p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
              {user?.role === 'RESTAURANT_OWNER' 
                ? t('workspace.roles.owner') 
                : t('workspace.roles.manager')}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
            <img 
              src={avatarUrl} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://api.dicebear.com/9.x/avataaars/svg?seed=default"; // Fallback nếu ảnh lỗi (Vietnamese comment)
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default RestaurantTopbar;
