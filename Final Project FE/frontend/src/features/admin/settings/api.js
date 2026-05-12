import { apiClient } from '../../../lib/axios';

/**
 * Lấy cấu hình thu phí hoa hồng hiện tại
 */
export const getCommissionConfig = async () => {
  return apiClient.get('admin/configs/commission');
};

/**
 * Cập nhật cấu hình thu phí hoa hồng
 * @param {Object} data { autoEnabled, interval }
 */
export const updateCommissionConfig = async (data) => {
  return apiClient.post('admin/configs/commission', data);
};

/**
 * Kiểm tra sức khỏe của một service cụ thể
 * @param {string} servicePath Path của service (vd: 'auth', 'users', 'restaurants',...)
 */
export const getServiceHealth = async (servicePath) => {
  let path = `${servicePath}/health`;
  
  // Xử lý đặc biệt cho Gateway (Ocelot) - Thử gọi trực tiếp hoặc path health chung
  if (servicePath === 'gateway') {
    path = 'health'; // Sẽ gọi /api/v1/health (Nếu Ocelot expose ở đây)
  }

  return apiClient.get(path, { 
    timeout: 5000,
    _retry: true 
  });
};
