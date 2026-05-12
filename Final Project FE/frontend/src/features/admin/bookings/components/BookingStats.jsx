import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ClipboardList, 
  Clock, 
  CalendarCheck, 
  CheckCircle2, 
  XOctagon 
} from 'lucide-react';

/**
 * @file BookingStats.jsx
 * @description Statistic cards for Admin Booking Management
 */
const BookingStats = ({ stats, loading }) => {
  const { t } = useTranslation();

  const statItems = [
    {
      label: t('admin.bookings.stats.total'),
      value: stats?.totalBookings || 0,
      icon: <ClipboardList size={20} />,
      color: 'bg-slate-50 text-slate-600',
      borderColor: 'border-slate-100'
    },
    {
      label: t('admin.bookings.stats.pending'),
      value: stats?.pendingBookings || 0,
      icon: <Clock size={20} />,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100'
    },
    {
      label: t('admin.bookings.stats.confirmed'),
      value: stats?.confirmedBookings || 0,
      icon: <CalendarCheck size={20} />,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      label: t('admin.bookings.stats.completed'),
      value: stats?.completedBookings || 0,
      icon: <CheckCircle2 size={20} />,
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      label: t('admin.bookings.stats.cancelled'),
      value: stats?.cancelledBookings || 0,
      icon: <XOctagon size={20} />,
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className={`px-5 py-4 bg-white border ${item.borderColor} rounded-3xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-default`}
        >
          <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {loading ? (
               <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : item.icon}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">
              {item.label}
            </p>
            <p className={`text-2xl font-black ${loading ? 'opacity-20 animate-pulse' : 'text-slate-900'} leading-none tracking-tight`}>
              {item.value.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingStats;
