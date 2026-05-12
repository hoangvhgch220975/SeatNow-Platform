import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file BookingStatusActions.jsx
 * @description Tập hợp các nút hành động để thay đổi trạng thái của đơn đặt bàn.
 * Các hành động bao gồm: Xác nhận, Check-in, Hoàn thành, Vắng mặt, Hủy đơn.
 */

// Cấu hình các nút hành động khả dụng cho từng trạng thái hiện tại (Vietnamese comment)
const ACTION_MAP = {
  PENDING: [
    {
      action: 'confirm',
      labelKey: 'actions.confirm',
      icon: 'check_circle',
      className: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200',
    },
    {
      action: 'cancel',
      labelKey: 'actions.cancel',
      icon: 'close',
      className: 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 hover:border-rose-200',
    },
  ],
  CONFIRMED: [
    {
      action: 'arrive',
      labelKey: 'actions.check_in',
      icon: 'how_to_reg',
      className: 'bg-primary hover:bg-primary-container text-white shadow-primary/20',
    },
    {
      action: 'no_show',
      labelKey: 'actions.no_show',
      icon: 'person_off',
      className: 'bg-slate-100 hover:bg-slate-200 text-slate-600',
    },
    {
      action: 'cancel',
      labelKey: 'actions.cancel',
      icon: 'close',
      className: 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-100 hover:border-rose-200',
    },
  ],
  ARRIVED: [
    {
      action: 'complete',
      labelKey: 'actions.complete',
      icon: 'done_all',
      className: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
    },
    {
      action: 'no_show',
      labelKey: 'actions.no_show',
      icon: 'person_off',
      className: 'bg-slate-100 hover:bg-slate-200 text-slate-600',
    },
  ],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
};

const BookingStatusActions = ({ booking, onAction }) => {
  const { t } = useTranslation();
  const [loadingAction, setLoadingAction] = useState(null);

  const status = booking?.status?.toUpperCase() || 'PENDING';
  const actions = ACTION_MAP[status] || [];

  // Nếu không có hành động nào khả dụng, không hiển thị gì
  if (actions.length === 0) return null;

  const handleClick = async (action) => {
    if (loadingAction) return; 
    setLoadingAction(action);
    try {
      await onAction(action, booking.id);
    } finally {
      // Chỉ reset loading nếu action không phải là 'cancel' (vì cancel đã đóng modal/trang fetch lại)
      if (action !== 'cancel') {
        setLoadingAction(null);
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {actions.map(({ action, labelKey, icon, className }) => {
        const isLoading = loadingAction === action;
        return (
          <button
            key={action}
            id={`booking-action-${action}-${booking.id}`}
            onClick={() => handleClick(action)}
            disabled={!!loadingAction}
            title={t(`owner_bookings.${labelKey}`)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-black rounded-xl 
              transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
              uppercase tracking-wider shadow-sm active:scale-95
              ${className}
            `}
          >
            {isLoading ? (
              <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <span className="material-symbols-outlined text-[16px] leading-none">{icon}</span>
            )}
            <span className="hidden lg:inline">{t(`owner_bookings.${labelKey}`)}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BookingStatusActions;
