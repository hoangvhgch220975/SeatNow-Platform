import { apiClient } from '../../lib/axios.js';
import { normalizePhone } from '../../shared/utils/normalizePhone.js'; // Sử dụng hàm chuẩn hóa chung

/**
 * @file api.js
 * @description Các hàm gọi API cho phân hệ Auth.
 */

export const authApi = {
  /**
   * Đăng nhập người dùng
   * @param {Object} credentials - { identifier, password }
   * @returns {Promise} - { accessToken, refreshToken, user }
   */
  login: async (credentials) => {
    let identifier = credentials.identifier?.trim();
    
    // Nếu là số điện thoại (không chứa @), thực hiện chuẩn hóa sang +84
    if (identifier && !identifier.includes('@')) {
      identifier = normalizePhone(identifier);
    }

    const payload = {
      password: credentials.password,
      identifier: identifier, // Sử dụng identifier đã chuẩn hóa
    };

    // Một số backend mong đợi email/phone riêng biệt
    if (identifier.includes('@')) {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }

    return apiClient.post('/auth/login', payload);
  },

  /**
   * Đăng ký người dùng mới + kích hoạt gửi OTP
   * @param {Object} data - { email, password, phone, fullName }
   */
  register: async (data) => {
    const payload = {
      email: data.email,
      password: data.password,
      phone: normalizePhone(data.phone), // Chuẩn hóa số điện thoại sang +84
      name: data.name, // Thêm trường 'name' theo yêu cầu của SQL Server
      fullName: data.name, // Giữ 'fullName' để đảm bảo tính tương thích
      otp: data.otp, // Thêm trường 'otp' mới theo tài liệu cập nhật
      role: 'CUSTOMER', // Mặc định đăng ký tài khoản khách hàng
    };

    // Gửi yêu cầu đăng ký lên Auth Service (:3001) qua Gateway (:7000)
    return apiClient.post('/auth/register', payload);
  },

  /**
   * Gửi mã OTP tới email hoặc SĐT
   * @param {Object} payload - { email } hoặc { phone }
   */
  sendOtp: async (payload) => {
    // Chuẩn hóa phone để làm Redis Key
    if (payload.phone) {
      payload.phone = normalizePhone(payload.phone);
    }
    return apiClient.post('/auth/send-otp', payload);
  },

  /**
   * Xác thực mã OTP đã nhập
   * @param {Object} payload - { email, otp } hoặc { phone, otp }
   */
  verifyOtp: async (payload) => {
    // Chuẩn hóa phone để so khớp Redis Key
    if (payload.phone) {
      payload.phone = normalizePhone(payload.phone);
    }
    return apiClient.post('/auth/verify-otp', payload);
  },

  /**
   * Đăng nhập Google
   * @param {string} idToken - Token từ Firebase/Google
   */
  googleSignIn: async (idToken) => {
    return apiClient.post('/auth/google-signin', { idToken });
  },

  /**
   * Đăng xuất
   */
  logout: async (refreshToken) => {
    return apiClient.post('/auth/logout', { refreshToken });
  },

  /**
   * Quên mật khẩu (Khách hàng) - Bước 1: Gửi yêu cầu OTP
   * @param {Object} payload - { email } hoặc { phone }
   */
  forgotPasswordRequest: async (payload) => {
    const data = { ...payload };
    if (data.phone) data.phone = normalizePhone(data.phone);
    return apiClient.post('/auth/forgot-password/request', data);
  },

  /**
   * Quên mật khẩu (Khách hàng) - Bước 2: Xác thực & Đổi mật khẩu
   * @param {Object} payload - { email, otp, newPassword } hoặc { phone, otp, newPassword }
   */
  forgotPasswordReset: async (payload) => {
    const data = { ...payload };
    if (data.phone) data.phone = normalizePhone(data.phone);
    return apiClient.post('/auth/forgot-password/verify-and-reset', data);
  },

  /**
   * Gửi yêu cầu trở thành đối tác (Owner)
   * @param {Object} data - Form dữ liệu đăng ký quán
   */
  partnerRequest: async (data) => {
    const payload = { ...data };
    if (payload.phone) payload.phone = normalizePhone(payload.phone);
    return apiClient.post('/auth/partner-request', payload);
  },

  /**
   * Đổi mật khẩu người dùng
   * @param {Object} data - { oldPassword, newPassword, confirmPassword }
   */
  changePassword: async (data) => {
    return apiClient.put('/auth/change-password', data);
  },

  /**
   * Làm mới Access Token bằng Refresh Token
   * @param {string} refreshToken 
   */
  refreshToken: async (refreshToken) => {
    return apiClient.post('/auth/refresh-token', { refreshToken });
  },

  /**
   * Kiểm tra xem Email hoặc Số điện thoại đã tồn tại chưa (Dùng cho validation)
   * @param {Object} params - { email, phone }
   */
  checkAvailability: async (params) => {
    const p = { ...params };
    if (p.phone) p.phone = normalizePhone(p.phone);
    return apiClient.get('/auth/exists', { params: p });
  },
};

