/**
 * Các quyền của người dùng trong hệ thống (Mapping với DB enum Role)
 */
export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',         // Khách hàng vãng lai / có tài khoản
  RESTAURANT_OWNER: 'OWNER',    // Chủ nhà hàng quản lý dashboard
  ADMIN: 'ADMIN',               // Quản trị viên hệ thống (Master)
};
