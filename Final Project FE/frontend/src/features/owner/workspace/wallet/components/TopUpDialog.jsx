import React from 'react';
import Modal from '@/shared/ui/Modal';
import TopUpForm from './TopUpForm';
import { useTranslation } from 'react-i18next';

/**
 * @file TopUpDialog.jsx
 * @description Dialog bọc ngoài biểu mẫu nạp tiền vào ví nhà hàng.
 */
const TopUpDialog = ({ isOpen, onClose, restaurantId }) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('wallet.topup_funds')}
    >
      <div className="mt-2">
        {/* Truyền các props cần thiết cho TopUpForm */}
        {/* Vietnamese comment: Sử dụng TopUpForm đã tách riêng để xử lý logic nạp tiền */}
        <TopUpForm 
          restaurantId={restaurantId} 
          onSuccess={(payUrl) => {
            // Callback này có thể được dùng để thực hiện hành động bổ sung sau khi tạo yêu cầu nạp tiền
          }} 
        />
      </div>
    </Modal>
  );
};

export default TopUpDialog;
