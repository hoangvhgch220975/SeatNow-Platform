import { apiClient } from '../../../lib/axios';

/**
 * @file api.js
 * @description API quản lý người dùng dành cho Admin
 */

/**
 * Lấy danh sách người dùng với phân trang và bộ lọc
 * @param {Object} params - Tham số truy vấn (keyword, role, page, limit)
 * @returns {Promise}
 */
export const getUsers = (params) => {
  return apiClient.get('/admin/users', { params });
};

/**
 * Xóa vĩnh viễn tài khoản người dùng
 * @param {string} id - ID của người dùng cần xóa
 * @returns {Promise}
 */
export const deleteUser = (id) => {
  return apiClient.delete(`/admin/users/${id}`);
};

/**
 * Lấy dữ liệu thống kê tổng quan cho Dashboard
 * @returns {Promise}
 */
export const getAdminStats = () => {
  return apiClient.get('/admin/dashboard/stats');
};
