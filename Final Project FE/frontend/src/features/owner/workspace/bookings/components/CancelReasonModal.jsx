import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '@/shared/ui/Modal';
import Button from '@/shared/ui/Button';

/**
 * @file CancelReasonModal.jsx
 * @description Modal yêu cầu nhập lý do khi Chủ nhà hàng thực hiện hủy đơn đặt bàn.
 * 
 * @param {boolean} isOpen - Trạng thái đóng/mở modal
 * @param {function} onClose - Hàm đóng modal
 * @param {function} onConfirm - Hàm xử lý khi xác nhận hủy (truyền vào lý do)
 * @param {boolean} isLoading - Trạng thái đang xử lý API
 */
const CancelReasonModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  // Xử lý khi xác nhận (Vietnamese comment)
  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason(''); // Reset sau khi gửi
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('owner_bookings.cancel_modal.title')}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">
            {t('owner_bookings.cancel_modal.label')}
          </label>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-red-400 
                       focus:ring-4 focus:ring-red-500/10 outline-none transition-all 
                       resize-none text-slate-600 bg-slate-50"
            rows={4}
            placeholder={t('owner_bookings.cancel_modal.placeholder')}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('owner_bookings.cancel_modal.cancel_btn')}
          </Button>
          <Button
            variant="danger"
            className="flex-2"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!reason.trim()}
          >
            {t('owner_bookings.cancel_modal.confirm_btn')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelReasonModal;
