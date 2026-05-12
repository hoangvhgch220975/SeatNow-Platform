import { apiClient } from '@/lib/axios';

/**
 * @file api.js
 * @description API ví, lịch sử giao dịch, rút tiền cho nhà hàng cụ thể.
 */
export const walletApi = {
  /**
   * Lấy số dư và thống kê ví
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   */
  getWalletBalance: (restaurantId) => 
    apiClient.get(`/payment/wallet/balance`, { params: { restaurantId } }),

  /**
   * Gửi yêu cầu rút tiền
   * @param {Object} payload - Thông tin rút tiền (amount, withdrawMethod, bankInfo/qrCodeUrl)
   */
  withdrawFunds: (payload) => 
    apiClient.post(`/payment/wallet/withdraw`, payload),

  /**
   * Lấy lịch sử giao dịch (History)
   * @param {string} restaurantId - ID hoặc Slug của nhà hàng
   * @param {string} type - Loại lọc (Ví dụ: WITHDRAWAL)
   * @param {number} limit - Số lượng bản ghi
   */
  getWalletHistory: (restaurantId, type = '', limit = 10) => 
    apiClient.get(`/payment/wallet/history`, { params: { restaurantId, type, limit } }),

  /**
   * Tạo yêu cầu nạp tiền (Top-up)
   * @param {Object} payload - { restaurantId, provider, amount }
   */
  topupWallet: (payload) => 
    apiClient.post(`/payment/wallet/topup/create`, payload),

  /**
   * Kiểm tra trạng thái giao dịch
   * @param {string} transactionId - ID giao dịch
   */
  getTransactionStatus: (transactionId) => 
    apiClient.get(`/payment/transaction/${transactionId}`),
};

