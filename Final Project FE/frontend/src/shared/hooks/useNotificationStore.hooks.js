import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../../lib/axios';
import { connectNotificationSocket, bookingSocket, disconnectSockets } from '../../lib/socket';
import toast from 'react-hot-toast';
import { queryClient } from '../../lib/queryClient';

/**
 * @file useNotificationStore.hooks.js
 * @description Quản lý trạng thái thông báo toàn ứng dụng cho Owner (Zustand).
 * Cơ chế DB-First: Đồng bộ 100% với Database khi tải lại trang.
 */

const NOTIFICATION_EVENTS = [
  'notification',
  'BOOKING_NEW',
  'BOOKING_CONFIRMED',
  'BOOKING_CANCELLED',
  'BOOKING_NO_SHOW',
  'TRANSACTION_DEPOSIT',
  'TRANSACTION_TOPUP',
  'TRANSACTION_WITHDRAW_APPROVED',
  'TRANSACTION_WITHDRAW_REJECTED',
  'REVIEW_NEW',
  'COMMISSION_SETTLED',
  'RESTAURANT_APPROVED',
  'RESTAURANT_ACTIVATED',
  'RESTAURANT_SUSPENDED'
];

// Biến cục bộ để khử trùng lặp Toast trong cùng 1 phiên socket
let lastShownToastId = null;
let lastShownTimestamp = 0;

const useNotificationStore = create(
  persist(
    (set, get) => ({
      activities: [],
      unreadCount: 0,
      total: 0,
      isLoading: false,
      isSocketConnected: false,

      /**
       * Helper: Trích xuất restaurantId từ metadata đa cấu trúc
       */
      extractRestaurantId: (payload) => {
        return payload.restaurantId || 
               payload.restaurant_id ||
               payload.data?.restaurantId || 
               payload.data?.restaurant_id ||
               payload.metadata?.restaurantId ||
               payload.metadata?.restaurant_id ||
               payload.data?.booking?.restaurantId || 
               payload.metadata?.booking?.restaurantId || 
               payload.data?.restaurant?.id || 
               payload.metadata?.restaurant?.id;
      },

      /**
       * Tải danh sách thông báo lịch sử từ Database
       * Ghi đè dữ liệu cũ để đảm bảo đồng bộ 100% với DB (Source of Truth)
       */
      fetchActivities: async (params = { limit: 20, offset: 0 }) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.get('/owner/activity', { params });
          if (res.success) {
            const serverItems = res.data.items || [];
            
            // Chuẩn hóa và sắp xếp
            const finalActivities = serverItems.map(item => ({
              ...item,
              restaurantId: get().extractRestaurantId(item)
            })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            set({
              activities: finalActivities,
              unreadCount: res.data.unreadCount || 0,
              total: res.data.total || 0,
            });
          }
        } catch (error) {
          console.error('❌ [Owner Store] Fetch failed:', error.message);
        } finally {
          set({ isLoading: false });
        }
      },

      /**
       * Khởi tạo kết nối Socket và lắng nghe sự kiện
       */
      initNotificationSocket: (userId, role, token) => {
        if (get().isSocketConnected) return;

        const socket = connectNotificationSocket(userId, role, token);
        const bSocket = bookingSocket;

        const handleIncomingNotification = (payload, eventName) => {
          const payloadId = payload.id;
          const now = Date.now();

          // 1. Khử trùng lặp Toast (Toast-only deduplication)
          const isToastDuplicate = payloadId && payloadId === lastShownToastId && (now - lastShownTimestamp < 2000);
          
          if (!isToastDuplicate) {
            lastShownToastId = payloadId;
            lastShownTimestamp = now;

            const restaurantId = get().extractRestaurantId(payload);
            let restaurantName = payload.restaurantName || payload.data?.restaurantName || payload.metadata?.restaurant?.name || '';

            if (!restaurantName && restaurantId) {
              const queriesData = queryClient.getQueriesData({ queryKey: ['owner', 'restaurants'] });
              for (const [_, data] of queriesData) {
                const restaurants = data?.data || data?.items || data;
                if (Array.isArray(restaurants)) {
                  const found = restaurants.find(r => r.id === restaurantId);
                  if (found) {
                    restaurantName = found.name;
                    break;
                  }
                }
              }
            }

            // Hiển thị Toast
            import('./../components/Notifications/NotificationToast').then((module) => {
              const NotificationToast = module.default;
              toast.custom((t) => {
                 return React.createElement(NotificationToast, { 
                  t, 
                  payload, 
                  eventName, 
                  restaurantName 
                });
              }, { duration: 3000, position: 'top-right' });
            }).catch(err => console.error('❌ [Owner Store] Toast load error:', err));
          }

          // 2. Cập nhật Store (Store-only deduplication)
          // Không lưu vào Store các thông báo Reject (do không lưu DB) theo yêu cầu User (Vietnamese: Không lưu Reject)
          if (eventName === 'TRANSACTION_WITHDRAW_REJECTED') return;

          set((state) => {
            const existsInStore = payloadId && state.activities.some(a => a.id === payloadId);
            if (existsInStore) return state;

            const newActivity = {
              id: payloadId || `rt-${now}`,
              type: payload.event || payload.type || eventName,
              title: payload.title || eventName.replace(/_/g, ' '),
              message: payload.message || '',
              link: payload.link || payload.data?.link || payload.metadata?.link || '',
              isRead: false,
              metadata: payload.data || payload.metadata,
              restaurantId: get().extractRestaurantId(payload),
              createdAt: payload.createdAt || new Date().toISOString(),
            };

            return {
              activities: [newActivity, ...state.activities],
              unreadCount: state.unreadCount + 1,
            };
          });
        };

        NOTIFICATION_EVENTS.forEach(eventName => {
          socket.off(eventName);
          socket.on(eventName, (payload) => handleIncomingNotification(payload, eventName));
          
          if (bSocket) {
            bSocket.off(eventName);
            bSocket.on(eventName, (payload) => handleIncomingNotification(payload, eventName));
          }
        });

        set({ isSocketConnected: true });
      },

      cleanupSocket: () => {
        disconnectSockets();
        set({ isSocketConnected: false });
      },

      markAsRead: async (activityId) => {
        try {
          set((state) => ({
            activities: state.activities.map((item) =>
              item.id === activityId ? { ...item, isRead: true } : item
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));

          await apiClient.put(`/owner/activity/${activityId}/read`);
        } catch (error) {
          console.error('❌ [Owner Store] markAsRead failed:', error.message);
        }
      },

      markAllAsRead: async () => {
        try {
          const { unreadCount } = get();
          if (unreadCount === 0) return;

          set((state) => ({
            activities: state.activities.map((item) => ({ ...item, isRead: true })),
            unreadCount: 0,
          }));

          await apiClient.put('/owner/activity/read-all');
        } catch (error) {
          console.error('❌ [Owner Store] markAllAsRead failed:', error.message);
        }
      },
    }),
    {
      name: 'owner-notifications-storage',
      partialize: (state) => ({ 
        // Không lưu mảng activities để đảm bảo đồng bộ 100% với DB khi F5
        unreadCount: state.unreadCount,
        total: state.total
      }),
    }
  )
);

export default useNotificationStore;
