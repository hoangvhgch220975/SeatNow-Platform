import { apiClient as api } from '../../lib/axios';

/**
 * Lấy thông tin booking bằng Code và SĐT (cho khách vãng lai)
 * @param {string} bookingCode 
 * @param {string} guestPhone 
 * @returns {Promise<Object>}
 */
export const lookupGuestBooking = async ({ bookingCode, guestPhone }) => {
  const response = await api.get('/bookings/guest/lookup', {
    params: { bookingCode, guestPhone }
  });
  return response; // Axios interceptor already extracts .data
};
