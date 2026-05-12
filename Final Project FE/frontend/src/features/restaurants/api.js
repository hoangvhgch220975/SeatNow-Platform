import { apiClient } from '../../lib/axios.js';

/**
 * @file api.js (Restaurant Feature)
 * @description Logic gọi API chuẩn cho Restaurant Service (SQL) dùng limit & offset.
 */

/**
 * Lọc danh sách nhà hàng với Phân trang chuẩn (Restaurant Service dùng limit/offset)
 * @param {Object} params - { q, cuisine, priceRange, sort, lat, lng, radiusKm, page, limit }
 */
export const getRestaurants = async (params = {}) => {
  const { page = 1, limit = 10, ...rest } = params;

  // Restaurant Service yêu cầu offset (vị trí bắt đầu) thay vị page index
  const offset = (page - 1) * limit;

  // Chuẩn bị tham số gửi lên API
  const searchParams = {
    // Kết hợp từ khóa tìm kiếm và địa điểm thành một chuỗi query thông minh
    q: [rest.q, rest.location].filter(Boolean).join(' ').trim(),
    limit,
    offset,
    sort: rest.sort || 'rating',
    cuisine: rest.cuisine,
    priceRange: rest.priceRange,
    lat: rest.lat ? parseFloat(rest.lat) : undefined,
    lng: rest.lng ? parseFloat(rest.lng) : undefined,
    // Trả về mức 20km chuẩn sau khi đã debug xong
    radiusKm: rest.radiusKm ? parseFloat(rest.radiusKm) : (rest.sort === 'distance' ? 20 : undefined)
  };

  // Làm sạch tham số cực kỳ nghiêm ngặt
  const cleanParams = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && key !== 'page' && key !== 'location') {
      cleanParams[key] = value;
    }
  });

  const response = await apiClient.get('/restaurants', {
    params: cleanParams
  });

  // Robust extraction: Hỗ trợ linh hoạt các cấu trúc { data, total }, { rows, total }, hoặc mảng phẳng
  const items = response.data?.rows || response.rows || response.data?.data || response.data || response || [];
  const total = response.data?.total || response.total || response.totalCount || items.length;


  return { 
    data: items, 
    total: total,
    meta: response.meta || {}
  };
};










/**
 * Lấy chi tiết 1 nhà hàng
 */
export const getRestaurantById = async (id) => {
  const response = await apiClient.get(`/restaurants/${id}`);
  return response?.data || response;
};

/**
 * Lấy danh sách thực đơn (Menu) của nhà hàng từ MongoDB
 */
export const getRestaurantMenu = async (id) => {
  const response = await apiClient.get(`/restaurants/${id}/menu`);
  return response?.data || response;
};
/**
 * Lấy danh sách bàn ăn của nhà hàng (Sơ đồ tầng)
 */
export const getRestaurantTables = async (id, location) => {
  const params = location ? { location } : {};
  const response = await apiClient.get(`/restaurants/${id}/tables`, { params });
  return response?.data || response;
};
