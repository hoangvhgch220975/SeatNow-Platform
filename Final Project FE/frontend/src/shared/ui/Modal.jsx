import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * @file Modal.jsx
 * @description Component Modal dùng chung toàn ứng dụng.
 * Hiển thị với backdrop mờ và hiệu ứng scale-in mượt mà.
 * @param {boolean} isOpen - Trạng thái mở/đóng modal
 * @param {function} onClose - Hàm đóng modal
 * @param {React.ReactNode} children - Nội dung bên trong modal
 * @param {string} [title] - Tiêu đề modal (tuỳ chọn)
 * @param {boolean} [closable=true] - Cho phép đóng modal hay không
 */
const Modal = ({ isOpen, onClose, children, title, closable = true }) => {
  // Chặn scroll body khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Đóng khi bấm phím Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && closable) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, closable]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closable ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl
                   animate-[scaleIn_0.2s_ease-out]"
        style={{
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {/* Header (nếu có title hoặc nút đóng) */}
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            {title && (
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            )}
            {closable && (
              <button
                onClick={onClose}
                className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600
                           hover:bg-slate-100 transition-all"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default Modal;
