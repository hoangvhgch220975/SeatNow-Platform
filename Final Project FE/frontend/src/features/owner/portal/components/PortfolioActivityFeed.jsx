import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Wallet, Star, Info, Inbox, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import useNotificationStore from '@/shared/hooks/useNotificationStore.hooks.js';

/**
 * @file PortfolioActivityFeed.jsx
 * @description Hiển thị dòng thời gian các hoạt động gần đây của Owner từ Notification Store.
 */
const PortfolioActivityFeed = ({ isLoading: parentLoading }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu và actions từ Zustand Store
  const { 
    activities, 
    unreadCount, 
    isLoading, 
    fetchActivities, 
    markAllAsRead, 
    markAsRead 
  } = useNotificationStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load data lần đầu khi mount (nếu chưa có dữ liệu)
  useEffect(() => {
    if (activities.length === 0) {
      fetchActivities({ limit: 10, offset: 0 });
    }
  }, [fetchActivities, activities.length]);

  // 1. Cấu hình loại thông báo (Dùng Icon từ Lucide cho đồng nhất)
  const getActivityConfig = (type) => {
    if (type.startsWith('BOOKING_')) {
      return { 
        icon: Calendar, 
        color: 'bg-indigo-100 text-indigo-600', 
        borderColor: 'border-indigo-200'
      };
    }
    if (type.startsWith('TRANSACTION_') || type === 'COMMISSION_SETTLED') {
      return { 
        icon: Wallet, 
        color: 'bg-emerald-100 text-emerald-600', 
        borderColor: 'border-emerald-200'
      };
    }
    if (type === 'REVIEW_NEW') {
      return { 
        icon: Star, 
        color: 'bg-amber-100 text-amber-600', 
        borderColor: 'border-amber-200'
      };
    }
    return { 
      icon: Info, 
      color: 'bg-slate-100 text-slate-600', 
      borderColor: 'border-slate-200'
    };
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchActivities({ limit: 10, offset: 0 });
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleActivityClick = async (activity) => {
    const { id, isRead, type, metadata } = activity;
    
    // 1. Mark as read
    if (!isRead) {
      await markAsRead(id);
    }

    // 2. Logic điều hướng (Đồng nhất với NotificationItem)
    let targetPath = '';
    const restaurantId = metadata?.booking?.restaurantId || metadata?.restaurant?.id || activity.restaurantId;

    if (type.startsWith('BOOKING_')) {
      const bookingId = metadata?.booking?.id;
      if (restaurantId && bookingId) {
        targetPath = `/owner/restaurants/${restaurantId}/bookings/${bookingId}`;
      }
    } else if (type.startsWith('TRANSACTION_') || type === 'COMMISSION_SETTLED') {
      if (restaurantId) {
        targetPath = `/owner/restaurants/${restaurantId}/wallet`;
      }
    } else if (type === 'REVIEW_NEW') {
      if (restaurantId) {
        targetPath = `/owner/restaurants/${restaurantId}/dashboard`;
      }
    }

    if (targetPath) {
      navigate(targetPath);
    }
  };

  if ((isLoading && activities.length === 0) || parentLoading) {
    return (
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden h-full">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="p-8 flex items-center gap-6 border-b border-slate-50 last:border-0">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 animate-pulse flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-50 animate-pulse rounded-lg w-3/4" />
              <div className="h-3 bg-slate-50 animate-pulse rounded-lg w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Lấy 6 hoạt động gần nhất để hiển thị ở Dashboard
  const displayActivities = activities.slice(0, 6);

  return (
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full relative group/feed">
      {/* 1. Header Control */}
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          {t('activity.header_title', 'Recent Activity')}
          {unreadCount > 0 && (
            <span className="bg-violet-600 text-white text-[10px] px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-all"
          >
            {t('activity.mark_all_read')}
          </button>
        )}
      </div>

      {/* 2. Dòng hoạt động */}
      <div className="divide-y divide-slate-50 overflow-y-auto flex-1 custom-scrollbar">
        {displayActivities.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="text-slate-200" size={40} />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
              {t('activity.no_activity')}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayActivities.map((activity, idx) => {
              const config = getActivityConfig(activity.type);
              const Icon = config.icon;

              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleActivityClick(activity)}
                  className={`p-8 flex items-center justify-between gap-6 hover:bg-slate-50/80 transition-all group/item cursor-pointer relative ${
                    !activity.isRead ? 'bg-violet-50/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all group-hover/item:scale-110 border ${config.color} ${config.borderColor} relative shadow-sm`}>
                      <Icon size={24} />
                      {!activity.isRead && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-violet-600 rounded-full border-2 border-white shadow-sm" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={`text-sm font-black tracking-tight leading-tight group-hover/item:text-violet-600 transition-colors ${
                        !activity.isRead ? 'text-slate-900' : 'text-slate-600 font-bold'
                      }`}>
                        {activity.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold leading-snug line-clamp-1 max-w-[280px]">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">
                        {new Date(activity.createdAt).toLocaleString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
                          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-all -translate-x-4 group-hover/item:translate-x-0 flex-shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
                    <ArrowRight className="text-violet-600" size={18} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 3. Nút Refresh (Luxury Style) */}
      <div className="p-6 border-t border-slate-50">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${
            isRefreshing
              ? 'bg-violet-100 text-violet-600 cursor-wait'
              : 'bg-slate-900 text-white hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-200 active:scale-95'
          }`}
        >
          {isRefreshing ? (
             <RefreshCw className="animate-spin" size={16} />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{isRefreshing ? t('activity.updating') : t('activity.refresh_feed')}</span>
        </button>
      </div>
    </div>
  );
};

export default PortfolioActivityFeed;
