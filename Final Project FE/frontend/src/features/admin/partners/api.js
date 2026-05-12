import { apiClient as axios } from '../../../lib/axios.js';

/**
 * @file api.js
 * @description API quản lý đối tác (Owners) dành cho Admin.
 */
export const partnerAdminApi = {
  // --- Quản lý Leads (Yêu cầu đăng ký mới) ---
  getLeads: () => axios.get('/admin/partner-requests'),
  approveLead: (id) => axios.post(`/admin/partner-requests/${id}/approve`),
  rejectLead: (id) => axios.post(`/admin/partner-requests/${id}/reject`),

  // --- Quản lý Tài khoản Owners hiện có ---
  getOwners: (params = {}) => {
    // Chỉ gửi các tham số có giá trị thực tế và chuẩn hóa SĐT
    const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
      let finalValue = value;

      // Logic chuẩn hóa SĐT: Nếu keyword bắt đầu bằng '0' và là chuỗi số (9-11 số)
      if (key === 'keyword' && typeof value === 'string') {
        const trimmed = value.trim();
        if (/^0[0-9]{9,10}$/.test(trimmed)) {
          finalValue = '+84' + trimmed.slice(1);
        }
      }

      if (finalValue !== '' && finalValue !== null && finalValue !== undefined) {
        acc[key] = finalValue;
      }
      return acc;
    }, { role: 'RESTAURANT_OWNER' });

    return axios.get('/admin/users', { params: cleanParams });
  },

  createOwner: (data) => axios.post('/admin/users/restaurant-owner', data),
  
  updateOwner: (id, data) => axios.put(`/admin/users/${id}`, data),
  
  deleteOwner: (id) => axios.delete(`/admin/users/${id}`),

  resetPassword: (id, data = {}) => axios.post(`/admin/users/owner/${id}/reset-password`, data),
};
