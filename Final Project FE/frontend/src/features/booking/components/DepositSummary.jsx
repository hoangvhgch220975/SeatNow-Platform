import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../../shared/utils/formatCurrency';

/**
 * Helper: Tính toán tiền cọc dựa trên chính sách nhà hàng (API Reference 4.2)
 * @param {Object} restaurant - Thông tin nhà hàng.
 * @param {number} partySize - Số lượng khách.
 * @returns {number} Số tiền cọc cần đóng.
 */
export const calculateDepositAmount = (restaurant, partySize) => {
  // 1. Nếu không bật đặt cọc, trả về 0
  if (restaurant?.depositEnabled === false) return 0;

  const policyJson = restaurant?.depositPolicyJson || restaurant?.DepositPolicyJson;
  if (!policyJson) return 0;

  try {
    const policy = typeof policyJson === 'string' ? JSON.parse(policyJson) : policyJson;
    const { minGuests = 0, minAmount = 0, type = 'fixed' } = policy;

    // 2. Kiểm tra xem số lượng khách có đạt mức tối thiểu để yêu cầu cọc không
    if (partySize < minGuests) return 0;

    // 3. Tính toán theo loại chính sách (per_person hoặc fixed)
    if (type === 'per_person') {
      return minAmount * partySize;
    }
    
    // Mặc định là fixed
    return minAmount;
  } catch (e) {
    return 0;
  }
};

/**
 * @component DepositSummary
 * @description Hiển thị tóm tắt chi phí đặt cọc và tổng tiền.
 */
const DepositSummary = ({ restaurant, partySize }) => {
  const { t } = useTranslation();
  const totalDeposit = calculateDepositAmount(restaurant, partySize);

  return (
    <div className="pt-8 border-t border-dashed border-outline-variant/30 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-[0.2em]">{t('booking.deposit.reservation_deposit')}</span>
        <span className="text-emerald-500 font-black tracking-widest text-xs">
          {totalDeposit > 0 ? formatCurrency(totalDeposit) : t('booking.deposit.free')}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-black text-on-surface text-sm uppercase">{t('booking.deposit.total_amount')}</span>
        <span className="font-black text-3xl text-primary">
          {formatCurrency(totalDeposit)}
        </span>
      </div>
    </div>
  );
};

export default DepositSummary;
