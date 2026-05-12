/**
 * Hàm hỗ trợ định dạng số tiền VNĐ hiển thị chuẩn (Ví dụ: 120.000 ₫)
 * @param {number} amount Số tiền
 * @returns {string} Chuỗi hiển thị định dạng chuẩn
 */
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '0 VND';
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
