import { apiClient as axios } from '../../../lib/axios.js';

/**
 * @file api.js
 * @description API quản lý nhà hàng dành cho Admin (Operational management).
 */
export const restaurantAdminApi = {
  // --- Quản trị Vận hành ---
  getAll: (params = {}) => axios.get('/admin/restaurants', { params }),

  suspend: (id) => axios.put(`/admin/restaurants/${id}/suspend`),
  activate: (id) => axios.put(`/admin/restaurants/${id}/activate`),
  update: (id, data) => axios.put(`/admin/restaurants/${id}`, data),
  create: (data) => axios.post('/admin/restaurants', data),
  approve: (id) => axios.put(`/admin/restaurants/${id}/approve`),
  getPending: () => axios.get('/admin/restaurants/pending'),
};
