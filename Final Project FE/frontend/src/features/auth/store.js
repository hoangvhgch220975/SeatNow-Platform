import { create } from 'zustand';
import { storage } from '../../lib/storage.js';
import { queryClient } from '../../lib/queryClient.js';
import useNotificationStore from '../../shared/hooks/useNotificationStore.hooks.js';

/**
 * Zustand Store Global quản lý State Đăng Nhập / Token của User
 * Tự động đồng bộ với LocalStorage thông qua Helper
 */
export const useAuthStore = create((set) => ({
  user: storage.getItem('user') || null,
  token: storage.getToken() || null,
  isAuthenticated: !!storage.getToken(),

  login: (userData, authToken, refreshToken) => {
    storage.setToken(authToken);
    if (refreshToken) storage.setRefreshToken(refreshToken);
    storage.setItem('user', userData);
    set({ user: userData, token: authToken, isAuthenticated: true });
  },

  logout: () => {
    // 1. Xóa toàn bộ cache của React Query để tránh lộ dữ liệu người dùng cũ (Vietnamese comment)
    queryClient.clear();
    
    // 2. Xóa thông tin đăng nhập trong Storage (Vietnamese comment)
    storage.clearToken();
    storage.removeItem('user');
    
    // 3. Ngắt kết nối Socket (Vietnamese comment)
    useNotificationStore.getState().cleanupSocket();

    // 3. Reset state trong Store (Vietnamese comment)
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
