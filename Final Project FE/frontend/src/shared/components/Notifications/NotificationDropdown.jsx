import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Inbox } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useDisclosure } from '../../hooks/useDisclosure';
import useNotificationStore from '../../hooks/useNotificationStore.hooks.js';
import NotificationItem from './NotificationItem';

/**
 * @file NotificationDropdown.jsx
 * @description Component icon chuông hiển thị thông báo.
 * Hỗ trợ lọc theo restaurantId nếu được truyền vào (dùng trong nhà hàng cụ thể).
 */

const NotificationDropdown = ({ restaurantId }) => {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const dropdownRef = useRef(null);

  const activities = useNotificationStore((state) => state.activities);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  // Lọc thông báo dựa trên restaurantId nếu có
  const filteredActivities = restaurantId 
    ? activities.filter(item => item.restaurantId === restaurantId)
    : activities;

  // Tính toán số lượng chưa đọc của danh sách đã lọc
  const unreadCount = filteredActivities.filter(item => !item.isRead).length;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Trigger */}
      <button
        onClick={onToggle}
        className={clsx(
          "relative p-2 rounded-full transition-all hover:bg-gray-100 group",
          isOpen ? "bg-gray-100 text-blue-600" : "text-gray-600"
        )}
      >
        <Bell size={22} className="group-hover:scale-110 transition-transform" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white flex items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute right-0 mt-4 w-96 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 z-[999] overflow-hidden origin-top-right ring-1 ring-black/[0.02]"
          >
            {/* 1. Header with Glass effect (Vietnamese comment) */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white/50 backdrop-blur-sm">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {t('notifications.title')}
                </h3>
                {unreadCount > 0 && (
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                     {t('notifications.unreadDesc', { count: unreadCount, defaultValue: '{{count}} unread alerts' })}
                   </p>
                )}
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest shadow-sm"
                >
                  <CheckCheck size={14} />
                  {t('notifications.markAllRead')}
                </button>
              )}
            </div>
 
            {/* 2. Scrollable List with custom scrollbar (Vietnamese comment) */}
            <div className="max-h-[500px] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {filteredActivities.length > 0 ? (
                <div className="flex flex-col">
                  {filteredActivities.slice(0, 20).map((activity) => (
                    <NotificationItem 
                      key={activity.id} 
                      activity={activity} 
                      onClose={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-slate-50/20">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 border border-slate-50 transition-transform hover:scale-105">
                    <Inbox className="text-slate-200" size={48} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">
                    {t('notifications.emptyTitle', 'All Caught Up')}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    {t('notifications.emptyMessage', 'No new notifications to show right now.')}
                  </p>
                </div>
              )}
            </div>
 
            {/* 3. Footer Luxury Style (Vietnamese comment) */}
            {filteredActivities.length > 0 && (
              <div className="p-6 border-t border-slate-50 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <button 
                  onClick={() => {
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:shadow-blue-200 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  {t('notifications.viewAll')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
