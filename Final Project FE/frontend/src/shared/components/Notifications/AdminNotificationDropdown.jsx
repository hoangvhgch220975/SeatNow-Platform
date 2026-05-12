import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, CheckCheck, Inbox, ShieldCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { useDisclosure } from '../../hooks/useDisclosure';
import useAdminNotificationStore from '../../hooks/useAdminNotificationStore';
import AdminNotificationItem from './AdminNotificationItem';

/**
 * @file AdminNotificationDropdown.jsx
 * @description Dropdown thông báo dành riêng cho Admin Console.
 */
const AdminNotificationDropdown = () => {
  const { t } = useTranslation();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const dropdownRef = useRef(null);

  const notifications = useAdminNotificationStore((state) => state.notifications);
  const unreadCount = useAdminNotificationStore((state) => state.unreadCount);
  const fetchNotifications = useAdminNotificationStore((state) => state.fetchNotifications);
  const markAllAsRead = useAdminNotificationStore((state) => state.markAllAsRead);

  // Tải thông báo khi mount (Vietnamese: Tải dữ liệu từ DB ngay khi mount để cập nhật số lượng chưa đọc)
  useEffect(() => {
    fetchNotifications({ limit: 20, offset: 0 });
  }, [fetchNotifications]);

  // Đóng khi click ngoài (Vietnamese: Đóng khi click ra ngoài vùng dropdown)
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
      <button
        onClick={onToggle}
        className={clsx(
          "relative p-2.5 rounded-2xl transition-all border group",
          isOpen 
            ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/20" 
            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
        )}
      >
        <Bell size={20} className={clsx("transition-transform", isOpen ? "scale-110" : "group-hover:scale-110")} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 text-[10px] text-white flex items-center justify-center font-black">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute right-0 mt-4 w-[420px] bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-200/50 z-[999] overflow-hidden origin-top-right ring-1 ring-black/[0.03]"
          >
            {/* Header Section */}
            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 backdrop-blur-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <ShieldCheck size={18} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    {t('admin.notifications.title', 'Console Alerts')}
                  </h3>
                </div>
                
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors"
                  >
                    {t('common.clear_all')}
                  </button>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                {t('admin.notifications.subtitle', 'Secure Administrative Protocol')}
              </p>
            </div>
  
            {/* List Section */}
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <AdminNotificationItem 
                      key={n.id} 
                      notification={n} 
                      onClose={onClose}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 px-12 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                    <Inbox size={40} />
                  </div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2">
                    {t('admin.notifications.empty_title', 'All Systems Clear')}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[220px]">
                    {t('admin.notifications.empty_message', 'No critical administrative notifications at the moment.')}
                  </p>
                </div>
              )}
            </div>
  
            {/* Footer Section */}
            <div className="p-8 bg-slate-50/80 border-t border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                {t('admin.notifications.gateway_active', 'Real-time Audit Gateway Active')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotificationDropdown;
