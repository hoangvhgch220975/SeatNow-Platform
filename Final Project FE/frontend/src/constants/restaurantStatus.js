/**
 * Trạng thái hồ sơ của một nhà hàng trên nền tảng
 */
export const RESTAURANT_STATUS = {
  PENDING: 'pending',     // Mới đăng ký, chờ Admin duyệt
  ACTIVE: 'active',       // Đã được duyệt, Hoạt động hiển thị public
  SUSPENDED: 'suspended', // Bị tạm đình chỉ do vi phạm quy định
};
