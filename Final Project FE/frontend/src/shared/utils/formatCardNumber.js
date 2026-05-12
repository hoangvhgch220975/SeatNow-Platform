/**
 * Định dạng số thẻ ngân hàng thành nhóm 4 số (ví dụ: 1234 5678 9012 3456).
 * @param {string|number} cardNumber - Số thẻ cần định dạng.
 * @returns {string} - Chuỗi số thẻ đã được định dạng.
 */
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  // Xóa tất cả khoảng trắng hiện có và thêm khoảng trắng sau mỗi 4 chữ số
  return cardNumber.toString().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};
