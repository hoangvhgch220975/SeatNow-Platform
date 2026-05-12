import React from 'react';
import Modal from '@/shared/ui/Modal';
import WithdrawalForm from './WithdrawalForm';
import { useTranslation } from 'react-i18next';

/**
 * @file WithdrawalDialog.jsx
 * @description Dialog bọc ngoài biểu mẫu rút tiền.
 */
const WithdrawalDialog = ({ isOpen, onClose, availableBalance }) => {
  const { t } = useTranslation();

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('wallet.withdraw_funds')}
    >
      <div className="mt-2">
        {/* Truyền các props cần thiết cho WithdrawalForm */}
        <WithdrawalForm 
          availableBalance={availableBalance} 
          onSuccess={onClose} 
          hideHeader={true} 
        />
      </div>
    </Modal>
  );
};

export default WithdrawalDialog;
