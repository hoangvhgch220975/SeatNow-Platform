import { apiClient as axios } from '../../../lib/axios.js';

/**
 * @file api.js
 * @description API chuyên biệt cho phân hệ Kiểm duyệt (Audit) Admin.
 */
export const auditAdminApi = {
  // --- Leads (Đối tác mới) ---
  getLeads: () => axios.get('/admin/partner-requests'),
  // body: { payload: { name, email, phone } } - Bắt buộc
  approveLead: (id, data) => axios.post(`/admin/partner-requests/${id}/approve`, data),
  rejectLead: (id) => axios.post(`/admin/partner-requests/${id}/reject`),

  // --- Venues (Hồ sơ nhà hàng mới) ---
  getPendingVenues: () => axios.get('/admin/restaurants/pending'),
  approveVenue: (id) => axios.put(`/admin/restaurants/${id}/approve`),
  rejectVenue: (id) => axios.post(`/admin/restaurants/${id}/reject`),
};
