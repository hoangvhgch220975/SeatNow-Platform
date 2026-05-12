/**
 * @file normalizePhone.js
 * @description Hàm tiện ích chuẩn hóa số điện thoại Việt Nam sang định dạng E.164 (+84).
 */

/**
 * Chuẩn hóa số điện thoại sang định dạng +84 (Vietnam)
 * @param {string} phone - Số điện thoại người dùng nhập (nội địa hoặc quốc tế)
 * @returns {string} - Số điện thoại chuẩn hóa (+84...)
 */
export const normalizePhone = (phone) => {
  if (!phone) return phone;
  
  // Loại bỏ tất cả ký tự không phải số
  const cleaned = phone.toString().replace(/\D/g, ''); 
  
  // Trường hợp 1: Bắt đầu bằng 0 (VD: 0912345678 -> +84912345678)
  if (cleaned.startsWith('0')) {
    return `+84${cleaned.slice(1)}`;
  }
  
  // Trường hợp 2: Đã có 84 nhưng thiếu dấu + (VD: 84912345678 -> +84912345678)
  if (cleaned.startsWith('84') && !phone.toString().startsWith('+')) {
    return `+${cleaned}`;
  }
  
  // Trường hợp 3: Đã có dấu + (VD: +8491... -> giữ nguyên)
  if (phone.toString().startsWith('+')) {
    return phone;
  }
  
  // Trường hợp mặc định: Thêm dấu + (VD: 8491... -> +8491...)
  return `+${cleaned}`;
};
