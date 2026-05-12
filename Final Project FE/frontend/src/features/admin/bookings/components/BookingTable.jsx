import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Hash, 
  User, 
  Store, 
  Calendar, 
  Users, 
  CreditCard, 
  BadgeCheck,
  Eye,
  MoreVertical,
  XOctagon
} from 'lucide-react';
import Badge from '@/shared/ui/Badge';

/**
 * @file BookingTable.jsx
 * @description Main table for displaying booking records
 */
const BookingTable = ({ bookings, loading }) => {
  const { t } = useTranslation();

  // Helper function to map status to badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'primary';
      case 'ARRIVED': return 'info';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      case 'NO_SHOW': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    return t(`admin.bookings.filters.status_${status.toLowerCase()}`) || status;
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full bg-slate-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-violet-500/10 blur-3xl rounded-full scale-150" />
          <div className="relative w-24 h-24 bg-white border border-slate-100 rounded-[32px] shadow-xl shadow-violet-500/5 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <Calendar size={32} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-slate-100 rounded-xl shadow-lg flex items-center justify-center text-rose-500">
              <XOctagon size={20} />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
          {t('admin.bookings.empty')}
        </h3>
        <p className="text-slate-400 text-sm font-medium max-w-[280px] text-center leading-relaxed">
          {t('admin.bookings.subtitle')}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <table className="w-full border-collapse">
        <thead className="border-b border-slate-100">
          <tr>
            <th className="px-4 py-4 text-left w-32">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} /> {t('admin.bookings.table.code')}
              </span>
            </th>
            <th className="px-4 py-4 text-left min-w-[150px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} /> {t('admin.bookings.table.customer')}
              </span>
            </th>
            <th className="px-4 py-4 text-left min-w-[200px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Store size={14} /> {t('admin.bookings.table.restaurant')}
              </span>
            </th>
            <th className="px-4 py-4 text-left w-40">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> {t('admin.bookings.table.date_time')}
              </span>
            </th>
            <th className="px-4 py-4 text-center w-24">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Users size={14} /> {t('admin.bookings.table.guests')}
              </span>
            </th>
            <th className="px-4 py-4 text-right w-36">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2">
                <CreditCard size={14} /> {t('admin.bookings.table.deposit')}
              </span>
            </th>
            <th className="px-4 py-4 text-right w-40">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-end gap-2">
                <BadgeCheck size={14} /> {t('admin.bookings.table.status')}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr 
              key={booking.id}
              className="group border-b border-slate-50 last:border-none cursor-default transition-all duration-200 border-l-4 border-l-transparent hover:border-l-violet-600 hover:bg-violet-50/80 hover:scale-[1.015] hover:shadow-xl hover:shadow-violet-500/10 relative hover:z-10 transform"
            >
              {/* Booking Code */}
              <td className="px-4 py-5">
                <span className="text-sm font-black text-slate-900 font-mono tracking-tighter uppercase whitespace-nowrap">
                  {booking.bookingCode}
                </span>
              </td>

              {/* Customer */}
              <td className="px-4 py-5">
                <span className="text-sm font-bold text-slate-900 truncate max-w-[200px]" title={booking.guestName || booking.customerName || booking.CustomerName}>
                  {booking.guestName || booking.customerName || booking.CustomerName || 'N/A'}
                </span>
              </td>

              {/* Restaurant */}
              <td className="px-4 py-5">
                <span className="text-sm font-bold text-slate-800 truncate block max-w-[300px]" title={booking.restaurantName}>
                  {booking.restaurantName || 'N/A'}
                </span>
              </td>

              {/* Date & Time */}
              <td className="px-4 py-5">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-black text-slate-900 leading-none tracking-tight whitespace-nowrap">
                    {booking.bookingTime?.length > 8 ? booking.bookingTime.substring(11, 16) : booking.bookingTime}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 leading-none whitespace-nowrap">
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </div>
              </td>

              {/* Guests */}
              <td className="px-4 py-5 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 text-slate-900 text-xs font-black">
                  {booking.numGuests}
                </div>
              </td>

              {/* Deposit */}
              <td className="px-4 py-5 text-right font-mono text-sm font-black text-slate-900 tracking-tighter whitespace-nowrap">
                {(booking.depositAmount || 0).toLocaleString()} <span className="text-[10px] text-slate-400">VND</span>
              </td>

              {/* Status */}
              <td className="px-4 py-5 text-right">
                <div className="flex justify-end">
                  <Badge variant={getStatusVariant(booking.status)} dot>
                    {getStatusLabel(booking.status)}
                  </Badge>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
