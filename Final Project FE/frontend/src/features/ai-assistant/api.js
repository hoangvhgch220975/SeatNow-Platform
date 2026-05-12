import { apiClient as axios } from '../../lib/axios.js';

/**
 * @file api.js
 * @description Các hàm gọi AI Service hoàn thiện theo Tài liệu thiết kế mới (FastAPI).
 */
export const aiApi = {
  // --- 1. PUBLIC AI (Khách vãng lai) ---
  publicRecommend: async (message, lang = 'en') => {
    // [Gợi ý public]: Không lưu lịch sử nên không cần sessionId
    return await axios.post('/ai/public/recommend', { message, lang });
  },

  getHealth: async () => {
    // [Kiểm tra sức khỏe]: Gọi endpoint health của AI service
    return await axios.get('/ai/health');
  },

  // --- 2. CUSTOMER AI (Khách hàng) ---
  
  customerChat: async (message, lang = 'en', sessionId = null) => {
    // [Chat Khách hàng]: Đính kèm sessionId để cô lập hội thoại
    return await axios.post('/ai/customer/chat', { message, lang, sessionId });
  },

  customerRecommend: async (lang = 'en') => {
    return await axios.post('/ai/customer/recommend', { lang });
  },

  clearCustomerHistory: async (sessionId = null) => {
    const url = sessionId ? `/ai/customer/chat/history?sessionId=${sessionId}` : '/ai/customer/chat/history';
    return await axios.delete(url);
  },

  getCustomerHistory: async (sessionId = null) => {
    const url = sessionId ? `/ai/customer/chat/history?sessionId=${sessionId}` : '/ai/customer/chat/history';
    return await axios.get(url);
  },

  // --- 3. OWNER AI (Chủ nhà hàng) ---

  ownerChat: async (message, restaurantId = null, lang = 'en', sessionId = null) => {
    const payload = { message, lang, sessionId };
    if (restaurantId) payload.restaurantId = restaurantId;
    return await axios.post('/ai/owner/chat', payload);
  },

  ownerRevenueSummary: async (restaurantId = null, lang = 'en') => {
    const payload = { lang };
    if (restaurantId) payload.restaurantId = restaurantId;
    return await axios.post('/ai/owner/revenue-summary', payload);
  },

  clearOwnerHistory: async (restaurantId = null, sessionId = null) => {
    let url = '/ai/owner/chat/history?';
    if (restaurantId) url += `restaurantId=${restaurantId}&`;
    if (sessionId) url += `sessionId=${sessionId}`;
    return await axios.delete(url);
  },

  getOwnerHistory: async (restaurantId = null, sessionId = null) => {
    let url = '/ai/owner/chat/history?';
    if (restaurantId) url += `restaurantId=${restaurantId}&`;
    if (sessionId) url += `sessionId=${sessionId}`;
    return await axios.get(url);
  },

  // --- 4. ADMIN AI (Quản trị viên) ---

  adminChat: async (message, lang = 'en', sessionId = null) => {
    return await axios.post('/ai/admin/chat', { message, lang, sessionId });
  },

  adminRevenueSummary: async (lang = 'en') => {
    return await axios.post('/ai/admin/revenue-summary', { lang });
  },

  getAdminHistory: async (sessionId = null) => {
    const url = sessionId ? `/ai/admin/chat/history?sessionId=${sessionId}` : '/ai/admin/chat/history';
    return await axios.get(url);
  },

  clearAdminHistory: async (sessionId = null) => {
    const url = sessionId ? `/ai/admin/chat/history?sessionId=${sessionId}` : '/ai/admin/chat/history';
    return await axios.delete(url);
  }
};
