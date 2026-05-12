/**
 * Parse từ Object có chứa null / undefined -> Query String hợp chuẩn 
 * Ví dụ: { page: 1, keyword: null } => "?page=1"
 */
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';

  const query = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    // Chỉ parse các field có record thực sự (bỏ qua khoảng trắng vô hại)
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, value);
    }
  }

  const result = query.toString();
  return result ? `?${result}` : '';
};
