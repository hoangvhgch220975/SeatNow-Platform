import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file RestaurantStatusBadge.jsx
 * @description Thành phần hiển thị trạng thái của nhà hàng (Pending, Active, Suspended) với màu sắc tương ứng.
 * Hỗ trợ đa ngôn ngữ với react-i18next.
 */
const RestaurantStatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const getStatusConfig = (s) => {
    switch (s?.toLowerCase()) {
      case 'active':
        return {
          label: t('owner_portal.badge.active', { defaultValue: 'Active' }),
          color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          dot: 'bg-emerald-500'
        };
      case 'suspended':
        return {
          label: t('owner_portal.badge.suspended', { defaultValue: 'Suspended' }),
          color: 'bg-rose-50 text-rose-600 border-rose-100',
          dot: 'bg-rose-500'
        };
      case 'pending':
      default:
        return {
          label: t('owner_portal.badge.pending', { defaultValue: 'Pending Approval' }),
          color: 'bg-amber-50 text-amber-600 border-amber-100',
          dot: 'bg-amber-500 animate-pulse'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`px-3 py-1 rounded-full border ${config.color} flex items-center gap-2 w-fit shadow-sm`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></div>
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">
        {config.label}
      </span>
    </div>
  );
};

export default RestaurantStatusBadge;
