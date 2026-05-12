import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

/**
 * @file NotificationToast.jsx
 * @description Component hiển thị thông báo nổi (Toast) phong cách Premium.
 * Hỗ trợ điều hướng thông minh vào Workspace nhà hàng.
 */
const NotificationToast = ({ t, payload, eventName, restaurantName }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleNav = (e) => {
    e?.stopPropagation();
    toast.dismiss(t.id);

    // 1. Tìm thông tin Nhà hàng (Vietnamese: Tìm info nhà hàng)
    const data = payload.data || payload.metadata || {};
    const restaurantId = payload.restaurantId || 
                        payload.restaurant_id ||
                        data.restaurantId || 
                        data.restaurant_id ||
                        data.booking?.restaurantId || 
                        data.restaurant?.id;
    
    let idOrSlug = restaurantId;

    if (restaurantId) {
      const queriesData = queryClient.getQueriesData({ queryKey: ['owner', 'restaurants'] });
      for (const [_, qData] of queriesData) {
        const restaurants = qData?.data || qData?.items || qData;
        if (Array.isArray(restaurants)) {
          const found = restaurants.find(r => r.id === restaurantId);
          if (found && found.slug) {
            idOrSlug = found.slug;
            break;
          }
        }
      }
    }

    // 2. Xác định đường dẫn tương ứng (Vietnamese: Xác định path)
    const rawLink = payload.link || data.link || "";
    const transactionId = data.transactionId || data.transaction_id || data.withdrawalId || data.id;

    // Helper: Chuyển đổi link /restaurant/ về đường dẫn workspace (Vietnamese: Giải mã link)
    const resolveWorkspacePath = (path) => {
      if (!idOrSlug) return '/owner';
      if (path.startsWith('/restaurant/')) {
        return path.replace('/restaurant/', `/owner/restaurants/${idOrSlug}/`);
      }
      // Nếu là link tài chính mà có ID giao dịch thì dẫn sâu (Vietnamese: Link sâu trans)
      if (eventName.startsWith('TRANSACTION') && transactionId) {
        return `/owner/restaurants/${idOrSlug}/wallet/transactions/${transactionId}`;
      }
      return path;
    };

    // Ưu tiên 1: Link từ Backend (Vietnamese: Ưu tiên link BE)
    if (rawLink && idOrSlug) {
      return navigate(resolveWorkspacePath(rawLink));
    }

    // Ưu tiên 2: Fallback theo Event Name (Vietnamese: Dự phòng theo event)
    if (idOrSlug) {
      if (eventName.startsWith('BOOKING')) return navigate(`/owner/restaurants/${idOrSlug}/bookings`);
      if (eventName.startsWith('TRANSACTION')) {
        if (transactionId) return navigate(`/owner/restaurants/${idOrSlug}/wallet/transactions/${transactionId}`);
        return navigate(`/owner/restaurants/${idOrSlug}/wallet`);
      }
      if (eventName === 'RESTAURANT_APPROVED' || eventName === 'RESTAURANT_ACTIVATED') return navigate(`/owner/restaurants/${idOrSlug}/dashboard`);
      if (eventName === 'RESTAURANT_SUSPENDED') return navigate(`/owner/restaurants/${idOrSlug}/profile`);
      
      return navigate(`/owner/restaurants/${idOrSlug}/dashboard`);
    }

    // Cuối cùng: Về Portal
    navigate('/owner');
  };

  return (
    <div
      onClick={handleNav}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white/90 backdrop-blur-xl shadow-2xl rounded-[2.5rem] pointer-events-auto flex ring-1 ring-black/5 overflow-hidden border border-white/20 cursor-pointer group hover:bg-white transition-all`}
    >
      <div className="flex-1 w-0 p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform ${
              eventName === 'TRANSACTION_WITHDRAW_REJECTED' || eventName === 'RESTAURANT_SUSPENDED'
                ? 'bg-rose-600 shadow-rose-200'
                : 'bg-violet-600 shadow-violet-200'
            }`}>
              <span className="material-symbols-outlined">
                {eventName === 'TRANSACTION_WITHDRAW_REJECTED' ? 'cancel' :
                 eventName.startsWith('BOOKING') ? 'calendar_today' : 
                 eventName.startsWith('TRANSACTION') || eventName === 'COMMISSION_SETTLED' ? 'payments' :
                 eventName === 'RESTAURANT_APPROVED' ? 'verified' :
                 eventName === 'RESTAURANT_ACTIVATED' ? 'bolt' :
                 eventName === 'RESTAURANT_SUSPENDED' ? 'block' :
                 'notifications_active'}
              </span>
            </div>
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-black text-slate-900 leading-tight">
              {payload.title || eventName.replace(/_/g, ' ')}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 line-clamp-2">
              {payload.message}
            </p>
            {restaurantName && (
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest border border-violet-100/50">
                  {restaurantName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            import('react-hot-toast').then(m => m.default.dismiss(t.id));
          }}
          className="w-16 border border-transparent rounded-none rounded-r-2xl flex items-center justify-center text-sm font-black text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
