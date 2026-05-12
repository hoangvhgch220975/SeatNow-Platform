/**
 * Trạng thái giao dịch thanh toán (Thường dùng cho tiền cọc)
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',     // Đang chờ thanh toán
  COMPLETED: 'completed', // Thanh toán thành công qua ví điện tử
  FAILED: 'failed',       // Thanh toán thất bại hoặc quá hạn
};
