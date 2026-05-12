import { useTranslation } from 'react-i18next';

/**
 * @file RestaurantStatusBadge.jsx
 * @description Badge hiển thị trạng thái của nhà hàng (Active, Pending, Suspended) 
 * phục vụ quản trị hệ thống Admin.
 */
const RestaurantStatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const getStatusConfig = (s) => {
    const statusLower = String(s || '').toLowerCase();
    switch (statusLower) {
      case 'active':
        return {
          classes: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          dot: 'bg-emerald-500',
          label: t('admin.restaurants.filters.active')
        };
      case 'pending':
        return {
          classes: 'bg-orange-50 text-orange-600 border-orange-100',
          dot: 'bg-orange-500',
          label: t('admin.restaurants.filters.pending')
        };
      case 'suspended':
        return {
          classes: 'bg-rose-50 text-rose-600 border-rose-100',
          dot: 'bg-rose-500',
          label: t('admin.restaurants.filters.suspended')
        };
      default:
        return {
          classes: 'bg-slate-50 text-slate-400 border-slate-100',
          dot: 'bg-slate-300',
          label: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-xs border ${config.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${config.dot}`}></span>
      {config.label}
    </div>
  );
};

export default RestaurantStatusBadge;
