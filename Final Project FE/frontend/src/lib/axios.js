import axios from 'axios';
import { ENV } from '../config/env.js';
import { storage } from './storage.js';


const decodeToken = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    const header = JSON.parse(window.atob(parts[0]));
    const payload = JSON.parse(window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { header, payload };
  } catch (e) {
    return null;
  }
};

/**
 * @description Đảm bảo token lấy ra luôn là chuỗi JWT sạch tuyệt đối.
 * Giải quyết các trường hợp: Stringified JSON, Stringified Object, dư thừa nháy kép (""), trailing spaces.
 */
const sanitizeToken = (raw) => {
  if (!raw || typeof raw !== 'string') return raw;
  
  let clean = raw.trim();
  
  // 1. Tháo lớp nháy kép nếu có
  if (clean.startsWith('"') && clean.endsWith('"')) {
    clean = clean.slice(1, -1).trim();
  }
  
  // 2. Kiểm tra nếu là JSON Object Stringified
  if (clean.startsWith('{')) {
    try {
      const parsed = JSON.parse(clean);
      clean = (parsed.accessToken || parsed.token || parsed.access_token || parsed.refreshToken || parsed.refresh_token || clean);
    } catch (e) {}
  }
  
  // 3. Strict Whitelist: Chỉ giữ lại ký tự hợp lệ cho JWT (a-z, A-Z, 0-9, ., -, _)
  // Loại bỏ hoàn toàn nháy kép, nháy đơn, khoảng trắng hoặc ký tự đặc biệt khác bị dính vào
  return String(clean).replace(/[^a-zA-Z0-9\._\-]/g, '');
};

export const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const rawToken = storage.getToken();
    const token = sanitizeToken(rawToken);
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    

    if (config.url && !config.url.startsWith('http')) {
      const baseUrlFull = ENV.API_BASE_URL.replace(/\/$/, '');
      config.url = `${baseUrlFull}/${config.url.replace(/^\//, '')}`;
      config.baseURL = ''; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

/**
 * Xử lý hàng đợi các request bị tạm dừng trong khi refresh token
 * @param {Error} error - Lỗi nếu refresh thất bại
 * @param {string} token - Access Token mới nếu refresh thành công
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Nếu request yêu cầu lấy toàn bộ response (bao gồm headers), trả về response thay vì chỉ data
    if (response.config?._full) return response;
    return response.data;
  },

  async (error) => {
    const originalRequest = error.config;

    // Nếu không phải lỗi 401 hoặc request này đã từng retry rồi thì reject luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu đang trong quá trình refresh token, cho request này vào hàng đợi (Vietnamese comment)
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Bắt đầu quá trình refresh token (Vietnamese comment)
    const refreshToken = sanitizeToken(storage.getRefreshToken());
    
    // Nếu không có Refresh Token -> Logout luôn
    if (!refreshToken) {
      storage.clearToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
      return Promise.reject(error);
    }

    isRefreshing = true;
    originalRequest._retry = true;

    try {
      const baseUrlClean = ENV.API_BASE_URL.replace(/\/$/, '');
      const refreshUrl = `${baseUrlClean}/auth/refresh-token`;
      
      const response = await axios.post(refreshUrl, { refreshToken });
      const root = response.data?.data || response.data;

      // Trích xuất token mới (hỗ trợ cả dạng string và object mới) (Vietnamese comment)
      let newAccessToken = root.accessToken;
      if (newAccessToken && typeof newAccessToken === 'object') {
          newAccessToken = newAccessToken.accessToken || newAccessToken.token;
      }

      let newRefreshToken = root.refreshToken;
      if (newRefreshToken && typeof newRefreshToken === 'object') {
          newRefreshToken = newRefreshToken.refreshToken || newRefreshToken.token || newRefreshToken.refresh_token;
      }

      if (!newAccessToken) throw new Error("No access token returned from refresh flow");

      // Cập nhật storage
      storage.setToken(newAccessToken);
      if (newRefreshToken) storage.setRefreshToken(newRefreshToken);

      // Giải phóng hàng đợi với token mới
      processQueue(null, newAccessToken);
      
      // Thực hiện lại request gốc
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh thất bại -> Hủy hàng đợi và Logout
      processQueue(refreshError, null);
      storage.clearToken();
      window.dispatchEvent(new Event('auth:unauthorized'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
