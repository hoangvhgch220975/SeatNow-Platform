/**
 * @file slugify.js
 * @description Hàm tiện ích chuyển đổi chuỗi có dấu thành slug không dấu (SEO-friendly).
 * Hỗ trợ tốt tiếng Việt.
 */

export const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .normalize('NFD') // Tách dấu
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng -
    .replace(/[^\w-]+/g, '') // Xóa các ký tự đặc biệt
    .replace(/--+/g, '-'); // Thay các dấu gạch ngang liên tiếp
};
