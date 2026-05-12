/**
 * Trạng thái của một đơn đặt bàn (Booking)
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',     // Chờ thanh toán cọc hoặc xác nhận
  CONFIRMED: 'confirmed', // Đã thanh toán cọc / Đã xác nhận giữ chỗ
  ARRIVED: 'arrived',     // Khách đã đến nhà hàng (Check-in quét mã QR)
  COMPLETED: 'completed', // Bữa ăn kết thúc, hoàn tất thanh toán
  CANCELLED: 'cancelled', // Bị hủy (bởi khách hoặc chủ nhà hàng)
  NO_SHOW: 'no_show',     // Khách không đến
};
