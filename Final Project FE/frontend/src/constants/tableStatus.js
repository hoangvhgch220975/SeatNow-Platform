/**
 * Trạng thái của bàn trong nhà hàng tại một thời điểm
 */
export const TABLE_STATUS = {
  AVAILABLE: 'available',     // Trống, có thể được gán hoặc đặt
  UNAVAILABLE: 'unavailable', // Đang được sử dụng / có khách ngồi
  MAINTENANCE: 'maintenance', // Đang bảo trì, dọn dẹp không thể sử dụng
};
