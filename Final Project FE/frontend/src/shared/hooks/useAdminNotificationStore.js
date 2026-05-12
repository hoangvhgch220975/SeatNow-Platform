import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../../lib/axios';
import { connectNotificationSocket, disconnectSockets } from '../../lib/socket';
import toast from 'react-hot-toast';

/**
 * @file useAdminNotificationStore.js
 * @description Quản lý thông báo Admin với cơ chế DB-First (Nguồn sự thật từ Database).
 */

const ADMIN_EVENTS = [
  'notification',
  'PARTNER_REQUEST_SUBMITTED',
  'RESTAURANT_CREATED',
  'WITHDRAWAL_REQUESTED',
  'TRANSACTION_TOPUP',
  'COMMISSION_SETTLED'
];

let lastShownToastId = null;
let lastShownTimestamp = 0;

const useAdminNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      total: 0,
      isLoading: false,
      isSocketConnected: false,

      /**
       * Tải danh sách thông báo lịch sử từ Database
       * Được thiết kế để ghi đè dữ liệu cũ, đảm bảo đồng bộ 100% với DB
       */
      fetchNotifications: async (params = { limit: 20, offset: 0 }) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get('/admin/activity', { params });
          if (res.success) {
            const serverItems = res.data.items || [];
            
            // Sắp xếp theo thời gian mới nhất
            const finalNotifications = serverItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            set({
              notifications: finalNotifications,
              unreadCount: res.data.unreadCount || 0,
              total: res.data.total || 0,
            });
          }
        } catch (error) {
          console.error('❌ [Admin Store] Fetch failed:', error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      initAdminSocket: (userId, role, token) => {
        const socket = connectNotificationSocket(userId, role, token);
        
        // Tránh gắn listener trùng lặp nhưng vẫn đảm bảo listener luôn được gắn vào socket instance hiện tại
        if (get().isSocketConnected && socket.listeners(ADMIN_EVENTS[0]).length > 0) {
           return;
        }

        const handleAdminNotification = (payload, eventName) => {
          const type = payload.type || payload.event || eventName;
          const payloadId = payload.id;
          const now = Date.now();
          
          // Toast deduplication
          const isToastDuplicate = payloadId && payloadId === lastShownToastId && (now - lastShownTimestamp < 2000);
          
          if (!isToastDuplicate) {
            lastShownToastId = payloadId;
            lastShownTimestamp = now;

            import('../components/Notifications/AdminNotificationToast').then((module) => {
              const AdminNotificationToast = module.default;
              toast.custom((t) => {
                return React.createElement(AdminNotificationToast, { 
                  t, 
                  payload: { ...payload, type }, 
                });
              }, { duration: 5000, position: 'top-right' });
            }).catch(err => console.error('❌ [Admin Store] Toast Component Load Error:', err));
          }

          // Real-time update: Chỉ thêm vào list nếu chưa tồn tại
          set((state) => {
            const existsInStore = payloadId && state.notifications.some(n => n.id === payloadId);
            if (existsInStore) return state;

            const newNotification = {
              id: payloadId || `admin-rt-${now}`,
              type: type,
              title: payload.title || 'System Alert',
              message: payload.message || '',
              link: payload.link || payload.data?.link || payload.metadata?.link || '',
              metadata: payload.data || payload.metadata || {},
              isRead: false,
              createdAt: payload.createdAt || new Date().toISOString(),
            };

            return {
              notifications: [newNotification, ...state.notifications],
              unreadCount: state.unreadCount + 1,
            };
          });
        };

        ADMIN_EVENTS.forEach(eventName => {
          socket.off(eventName);
          socket.on(eventName, (payload) => handleAdminNotification(payload, eventName));
        });

        // Catch-all cho các event không định danh cụ thể
        socket.onAny((event, payload) => {
          if (!ADMIN_EVENTS.includes(event) && (payload?.type || payload?.message)) {
             handleAdminNotification(payload, event);
          }
        });

        set({ isSocketConnected: true });
      },

      cleanup: () => {
        disconnectSockets();
        set({ isSocketConnected: false });
      },

      /**
       * Đánh dấu một thông báo là đã đọc (Sync với Database)
       */
      markAsRead: async (id) => {
        try {
          const notification = get().notifications.find(n => n.id === id);
          if (!notification || notification.isRead) return;

          // Cập nhật UI trước (Optimistic Update)
          set((state) => ({
            notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }));

          // Gọi API persistent vào DB
          await apiClient.put(`/admin/activity/${id}/read`);
        } catch (error) {
          console.error('❌ [Admin Store] markAsRead failed:', error.message);
        }
      },

      /**
       * Đánh dấu toàn bộ là đã đọc (Sync với Database)
       */
      markAllAsRead: async () => {
        try {
          const { unreadCount } = get();
          if (unreadCount === 0) return;

          set((state) => ({
            notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
            unreadCount: 0,
          }));

          await apiClient.put('/admin/activity/read-all');
        } catch (error) {
          console.error('❌ [Admin Store] markAllAsRead failed:', error.message);
        }
      },

      clearAll: () => {
        set({ notifications: [], unreadCount: 0, total: 0 });
      }
    }),
    {
      name: 'admin-notifications-storage',
      partialize: (state) => ({ 
        // Chỉ lưu thông tin số lượng, không lưu mảng notifications 
        // để đảm bảo tính đồng bộ tuyệt đối với DB khi tải lại trang.
        unreadCount: state.unreadCount,
        total: state.total
      }),
    }
  )
);

export default useAdminNotificationStore;
