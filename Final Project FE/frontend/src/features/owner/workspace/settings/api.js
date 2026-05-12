import { apiClient } from '@/lib/axios';

/**
 * Cập nhật thông tin chung nhà hàng: Name, Description, Cuisine, Price Range, Images, Contact (Phone, Email, Address, Coordinates)
 */
export const updateRestaurant = async (restaurantId, updateData) => {
  return await apiClient.put(`/restaurants/${restaurantId}`, updateData);
};

/**
 * Cập nhật chính sách đặt cọc (Deposit Policy)
 */
export const updateDepositPolicy = async (restaurantId, policyData) => {
  return await apiClient.put(`/restaurants/${restaurantId}/deposit-policy`, policyData);
};
