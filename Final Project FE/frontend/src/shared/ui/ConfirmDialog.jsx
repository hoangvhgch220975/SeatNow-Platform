import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import Button from './Button';

/**
 * @file ConfirmDialog.jsx
 * @description Action confirmation dialog component (Delete, Cancel, etc.) supporting multi-language
 * Hợp thoại xác nhận hành động (Xóa, Hủy, v.v.) hỗ trợ đa ngôn ngữ
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText,
  cancelText,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  // Thiết lập các chuỗi mặc định bằng tiếng Anh nếu không được truyền vào prop (Vietnamese comment)
  const finalTitle = title || t('common.confirm_title', { defaultValue: 'Confirmation' });
  const finalMessage = message || t('common.confirm_message', { defaultValue: 'Are you sure you want to perform this action?' });
  const finalCancelText = cancelText || t('common.cancel', { defaultValue: 'Cancel' });
  
  let finalConfirmText = confirmText;
  if (!finalConfirmText) {
    // Luôn mặc định là "Confirm" theo yêu cầu người dùng (Vietnamese comment)
    finalConfirmText = t('common.confirm', { defaultValue: 'Confirm' });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={finalTitle}>
      {/* Nội dung thông báo (Vietnamese comment) */}
      <div className="text-slate-600 mb-6">
        {finalMessage}
      </div>
      
      {/* Các nút hành động (Vietnamese comment) */}
      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          onClick={onClose}
          disabled={isLoading}
        >
          {finalCancelText}
        </button>
        <button
          className={`px-4 py-2 font-bold text-white rounded-lg transition-colors ${
            type === 'danger' 
              ? 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-100' 
              : 'bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary/20'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              {t('common.processing', { defaultValue: 'Processing...' })}
            </span>
          ) : (
            finalConfirmText
          )}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
