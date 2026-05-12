import axios from '../../../../lib/axios';

/**
 * @file api.js
 * @description API cập nhật profile nhà hàng chuyên biệt cho Workspace.
 */

/**
 * Cập nhật thông tin cơ bản, liên hệ, giờ mở cửa của nhà hàng.
 * @param {string} id - ID hoặc Slug của nhà hàng.
 * @param {object} data - Dữ liệu cập nhật.
 */
export const updateRestaurantInfo = async (id, data) => {
  const response = await axios.put(`/api/v1/restaurants/${id}`, data);
  return response.data;
};

/**
 * Cập nhật riêng chính sách đặt cọc.
 * @param {string} id - ID nhà hàng.
 * @param {object} data - Dữ liệu chính sách cọc.
 */
export const updateDepositPolicy = async (id, data) => {
  const response = await axios.put(`/api/v1/restaurants/${id}/deposit-policy`, data);
  return response.data;
};
