import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { ROUTES } from '@/config/routes';

/**
 * @file UpcomingArrivalsTable.jsx
 * @description Danh sách các lượt đặt bàn sắp diễn ra (Upcoming Arrivals).
 */
const UpcomingArrivalsTable = ({ bookings, isLoading }) => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();

  // Mapping status classes (Vietnamese comment)
  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'ARRIVED':
      case 'SEATED':
        return 'bg-purple-100 text-purple-700'; // Đã tới
      case 'CONFIRMED':
        return 'bg-emerald-100 text-emerald-700'; // Đã xác nhận
      case 'PENDING':
        return 'bg-amber-100 text-amber-700'; // Chờ duyệt
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700'; // Xong
      case 'CANCELLED':
        return 'bg-red-100 text-red-600'; // Đã huỷ
      case 'NO-SHOW':
        return 'bg-slate-200 text-slate-600'; // Vắng mặt
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(99,14,212,0.02)] border border-slate-50 flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            {t('workspace.dashboard.recent_bookings', { defaultValue: 'RECENT BOOKINGS' })}
          </h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
            {t('workspace.dashboard.recent_activity', { defaultValue: 'Latest Reservation Activity' })}
          </p>
        </div>
        <Link 
          to={ROUTES.WORKSPACE_BOOKINGS(idOrSlug)}
          className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
        >
          {t('workspace.arrivals.view_all')}
        </Link>
      </div>

      <div className="overflow-hidden flex-1">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (() => {
          const arr = Array.isArray(bookings) ? bookings 
                   : (bookings?.items || bookings?.data || bookings?.content || bookings?.bookings || []);
          return arr?.length > 0;
        })() ? (
          <table className="w-full text-left">
            <thead className="border-b border-slate-50">
              <tr>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {t('workspace.arrivals.guest')}
                </th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  {t('workspace.arrivals.date', { defaultValue: 'DATE' })}
                </th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  {t('workspace.arrivals.time')}
                </th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  {t('workspace.arrivals.party')}
                </th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  {t('workspace.arrivals.table', { defaultValue: 'TABLE' })}
                </th>
                <th className="pb-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">
                  {t('workspace.arrivals.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/50">
              {(() => {
                const arr = Array.isArray(bookings) ? bookings 
                         : (bookings?.items || bookings?.data || bookings?.content || bookings?.bookings || []);
                return arr.slice(0, 9).map((booking) => {
                  // 1. TÊN KHÁCH: Ưu tiên lấy tên của User (khách đăng ký) -> Nếu ko có lấy tên khách vãng lai
                  const displayName = booking.customerName || booking.customer?.name || booking.guestName || booking.guest_name || 'GUEST';
                  
                  // 2. GHI CHÚ (NOTE): Lấy từ trường specialRequests của BE
                  const specificNote = booking.specialRequests || booking.special_requests || 'NO NOTE';
                  
                  // 3. XỬ LÝ LỖI GIỜ 1970-: Nếu BE lỡ ném ISO Date thì format lại, ko thì cắt 5 ký tự đầu
                  let rawTime = booking.bookingTime || booking.booking_time || '';
                  let displayTime = 'N/A';
                  if (rawTime.includes('T')) {
                      // VD: 1970-01-01T17:00:00.000Z -> Lấy 17:00
                      displayTime = rawTime.split('T')[1].slice(0, 5);
                  } else if (rawTime.includes('Z')) {
                      displayTime = rawTime.replace('Z', '').slice(0, 5);
                  } else if (rawTime) {
                      displayTime = rawTime.slice(0, 5); // Dạng 14:00:00 -> 14:00
                  }
                  
                  // 4. FORMAT NGÀY THEO CHUẨN
                  const displayDate = booking.bookingDate || booking.booking_date 
                      ? new Date(booking.bookingDate || booking.booking_date).toLocaleDateString('vi-VN') 
                      : 'N/A';
                      
                  return (
                    <tr key={booking.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                      {/* CỘT 1: GUEST & NOTE */}
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px] border border-slate-200/50 group-hover:bg-white group-hover:text-primary transition-all overflow-hidden">
                            {booking.customerAvatar ? (
                              <img 
                                src={booking.customerAvatar} 
                                alt={displayName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = getInitials(displayName);
                                }}
                              />
                            ) : (
                              getInitials(displayName)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 tracking-tight">
                              {displayName}
                            </p>
                            {/* Ghi chú cụ thể thay vì cái LUNCH hardcode cũ */}
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate max-w-[150px]" title={specificNote}>
                              {specificNote === 'NO NOTE' ? t('workspace.arrivals.no_special_requests', { defaultValue: 'No Note' }) : specificNote}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* CỘT 2: DATE (Cột mới yêu cầu thêm) */}
                      <td className="py-5 text-center text-sm font-bold text-slate-700 tabular-nums">
                        {displayDate}
                      </td>
                      {/* CỘT 3: TIME (Đã fix lỗi 1970) */}
                      <td className="py-5 text-center text-sm font-black text-slate-700 tabular-nums">
                        {displayTime}
                      </td>
                      {/* CỘT 4: PARTY (Số khách đi kèm) */}
                      <td className="py-5 text-center text-sm font-black text-slate-700 tabular-nums">
                        {booking.numGuests || booking.num_guests || 0}
                      </td>
                      <td className="py-5 text-center text-sm font-black text-slate-800">
                        {booking.tableNumber || '—'}
                      </td>
                      {/* CỘT 5: STATUS */}
                      <td className="py-5 text-right">
                        <span className={`px-3 py-1.5 ${getStatusStyles(booking.status)} text-[9px] font-black rounded-xl uppercase tracking-widest shadow-sm`}>
                          {t(`profile.status.${booking.status?.toLowerCase() || 'pending'}`)}
                        </span>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 py-8">
            <span className="material-symbols-outlined text-4xl">event_busy</span>
            <p className="text-[10px] font-black uppercase tracking-widest">{t('workspace.arrivals.no_data', { defaultValue: 'No recent bookings' })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingArrivalsTable;
