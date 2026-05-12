/**
 * Tiện ích wrap local storage và Cookie để quản lý token an toàn.
 * Sử dụng Session Cookie cho Token: Tự động logout khi đóng trình duyệt (Window).
 * Sử dụng LocalStorage cho Data: Lưu trữ tạm thời, chỉ hợp lệ khi Token còn trong Cookie.
 */

// Helper: Quản lý Cookie thủ công (Vietnamese comment)
const cookieStorage = {
  set: (name, value) => {
    // Không set expires/max-age => Cookie sẽ tự xóa khi đóng trình duyệt (Vietnamese comment)
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
  },
  get: (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  },
  erase: (name) => {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
  }
};

export const storage = {
  // Token được lưu ở Cookie (Session) (Vietnamese comment)
  getToken: () => cookieStorage.get('access_token'),
  setToken: (token) => {
    cookieStorage.set('access_token', token);
    // ✅ Đánh dấu tab này đang có session hoạt động
    sessionStorage.setItem('is_tab_active', 'true');
  },
  
  getRefreshToken: () => cookieStorage.get('refresh_token'),
  setRefreshToken: (token) => cookieStorage.set('refresh_token', token),

  clearToken: () => {
    cookieStorage.erase('access_token');
    cookieStorage.erase('refresh_token');
    localStorage.removeItem('user');
    // ✅ Xóa dấu hiệu session active
    sessionStorage.removeItem('is_tab_active');
  },
  
  getItem: (key) => {
    // Nếu là thông tin User, phải kiểm tra xem Token còn tồn tại không (Vietnamese comment)
    if (key === 'user') {
      const hasToken = !!cookieStorage.get('access_token');
      if (!hasToken) {
        localStorage.removeItem('user');
        return null;
      }
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return localStorage.getItem(key);
    }
  },
  
  setItem: (key, value) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  
  removeItem: (key) => localStorage.removeItem(key),

  /**
   * Logic đồng bộ phiên làm việc giữa các Tab (Session Sync)
   * Đảm bảo Logout khi xóa toàn bộ tab/trình duyệt nhưng vẫn duy trì khi mở tab mới.
   */
  initSessionSync: () => {
    // 1. Nếu tab đã được đánh dấu active (ví dụ F5) -> Bỏ qua
    if (sessionStorage.getItem('is_tab_active')) return;

    // 2. Nếu có token cũ nhưng chưa có dấu hiệu active ở tab này -> Có thể là browser restart hoặc tab mới
    if (cookieStorage.get('access_token')) {
      const syncKey = `sync_${Date.now()}`;
      localStorage.setItem('request_session_sync', syncKey);

      // Đợi phản hồi từ các tab khác đang mở (nếu có)
      setTimeout(() => {
        if (!sessionStorage.getItem('is_tab_active')) {
          // Không tab nào phản hồi -> Đây là phiên mở lại sau khi tắt trình duyệt
          console.log('🔄 [Auth] Fresh session detected after browser close. Clearing stale tokens.');
          storage.clearToken();
          if (window.location.pathname.startsWith('/owner')) {
             window.location.href = '/login';
          }
        }
        localStorage.removeItem('request_session_sync');
      }, 400);
    }

    // 3. Lắng nghe yêu cầu đồng bộ từ các Tab khác
    window.addEventListener('storage', (e) => {
      // Tab khác đang hỏi: "Có ai online không?"
      if (e.key === 'request_session_sync' && e.newValue) {
        if (sessionStorage.getItem('is_tab_active')) {
          localStorage.setItem('respond_session_sync', e.newValue);
        }
      }
      
      // Nhận được phản hồi: "Tôi vẫn đang online đây"
      if (e.key === 'respond_session_sync' && e.newValue === localStorage.getItem('request_session_sync')) {
        sessionStorage.setItem('is_tab_active', 'true');
        localStorage.removeItem('respond_session_sync');
      }
    });
  }
};
