import { apiClient as axiosInstance } from '@/lib/axios.js';

/**
 * @file api.js (Payment Feature)
 * @description Các lời gọi API quản lý thanh toán theo tài liệu chuẩn mới (Redirect & Webhook).
 */

/**
 * Tạo link thanh toán cọc (Deposit).
 * @param {string} bookingId - ID của đơn đặt bàn (UUID).
 * @param {string} provider - Nhà cung cấp: "MOMO" hoặc "VNPAY".
 */
export const generateDepositPayment = async (bookingId, provider) => {
  const response = await axiosInstance.post('/payment/deposit/generate-qr', {
    bookingId,
    provider: provider.toUpperCase()
  });
  // Trả về: { success: true, data: { paymentUrl, qrCodeUrl, transactionId, ... } }
  return response?.data || response;
};

/**
 * Tra cứu trạng thái giao dịch thanh toán.
 * @param {string} transactionId - ID giao dịch (TXN_...).
 */
export const getTransactionStatus = async (transactionId) => {
  const response = await axiosInstance.get(`/payment/transaction/${transactionId}`);
  // Trả về: { success: true, data: { status: 'PAID' | 'PENDING' | 'FAILED', ... } }
  return response?.data || response;
};

/**
 * Tạo link nạp tiền vào ví (Wallet Top-up).
 */
export const createWalletTopup = async (restaurantId, provider, amount) => {
  const response = await axiosInstance.post('/payment/wallet/topup/create', {
    restaurantId,
    provider: provider.toUpperCase(),
    amount
  });
  return response?.data || response;
};
