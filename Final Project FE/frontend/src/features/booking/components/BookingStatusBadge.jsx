import { useTranslation } from 'react-i18next';

/**
 * @file BookingStatusBadge.jsx
 * @description Badge hiển thị trạng thái của đơn đặt bàn với màu sắc tương ứng. Hỗ trợ đa ngôn ngữ.
 */
const BookingStatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const getStatusClasses = (s) => {
    const statusLower = String(s || '').toLowerCase();
    switch (statusLower) {
      case 'confirmed':
      case 'arrived':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending':
      case 'upcoming':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'completed':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'cancelled':
      case 'no-show':
      case 'canceled':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  // Map status string to i18n key
  const statusKey = String(status || '').toLowerCase().replace('-', '_');

  return (
    <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit shadow-sm border ${getStatusClasses(status)}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
        ['confirmed', 'arrived'].includes(status?.toLowerCase()) ? 'bg-emerald-500' : 
        ['pending', 'upcoming'].includes(status?.toLowerCase()) ? 'bg-orange-500' :
        status?.toLowerCase() === 'completed' ? 'bg-blue-500' : 'bg-rose-500'
      }`}></span>
      {t(`profile.status.${statusKey}`, { defaultValue: status })}
    </div>
  );
};

export default BookingStatusBadge;
