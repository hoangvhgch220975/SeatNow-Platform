import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import BookingStatusActions from './BookingStatusActions';

/**
 * @file BookingTable.jsx
 * @description Bảng danh sách đặt bàn dành cho Chủ nhà hàng.
 * Hiển thị thông tin chi tiết từng đơn và các tác vụ thay đổi trạng thái.
 */

// Định nghĩa màu sắc và icon cho từng trạng thái (Vietnamese comment)
const getStatusConfig = (status, t) => {
  const configs = {
    PENDING:   { bg: 'bg-amber-50 text-amber-700 border border-amber-200',   icon: 'pending', label: t('owner_bookings.filters.status_pending') },
    CONFIRMED: { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'check_circle', label: t('owner_bookings.filters.status_confirmed') },
    ARRIVED:   { bg: 'bg-purple-50 text-purple-700 border border-purple-200',  icon: 'how_to_reg', label: t('owner_bookings.filters.status_arrived') },
    COMPLETED: { bg: 'bg-blue-50 text-blue-700 border border-blue-200',      icon: 'done_all', label: t('owner_bookings.filters.status_completed') },
    CANCELLED: { bg: 'bg-rose-50 text-rose-700 border border-rose-200',      icon: 'cancel', label: t('owner_bookings.filters.status_cancelled') },
    NO_SHOW:   { bg: 'bg-slate-100 text-slate-500 border border-slate-200',  icon: 'person_off', label: t('owner_bookings.filters.status_no_show') },
  };
  return configs[status?.toUpperCase()] || configs.PENDING;
};

// Định dạng giờ hẹn (Vietnamese comment)
const formatTime = (rawTime) => {
  if (!rawTime) return '—';
  if (typeof rawTime === 'string' && rawTime.includes('T')) return rawTime.split('T')[1].slice(0, 5);
  return String(rawTime).slice(0, 5);
};

// Tạo Avatar viết tắt (Initials)
const getInitials = (name) =>
  name ? name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '??';

// Định dạng tiền tệ VND
const formatMoney = (amount) =>
  amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : null;

const PAGE_SIZE = 10;

const BookingTable = ({ bookings, totalCount, currentPage, onPageChange, onAction, isLoading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idOrSlug } = useParams();

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const fromRecord = Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount);
  const toRecord = Math.min(currentPage * PAGE_SIZE, totalCount);

  // --- HIỂN THỊ TRẠNG THÁI ĐANG TẢI (Skeleton) ---
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // --- HIỂN THỊ KHI KHÔNG CÓ DỮ LIỆU ---
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 flex flex-col items-center text-center gap-5">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-slate-300">event_busy</span>
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{t('owner_bookings.table.no_data')}</h3>
          <p className="text-sm font-medium text-slate-400 mt-1 max-w-sm">
            {t('owner_bookings.table.no_data_desc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {t('owner_bookings.table.col_guest')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {t('owner_bookings.table.col_code')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                {t('owner_bookings.table.col_time')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                {t('owner_bookings.table.col_guests')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                {t('owner_bookings.table.col_table')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                {t('owner_bookings.table.col_deposit')}
              </th>
              <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-center">
                {t('owner_bookings.table.col_status')}
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">
                {t('owner_bookings.table.col_actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bookings.map((booking) => {
              // Xử lý logic tên hiển thị
              const displayName =
                booking.customerName ||
                booking.customer?.name ||
                booking.guestName ||
                t('owner_bookings.table.guest_fallback');

              const isGuest = !booking.customerId;
              const displayTime = formatTime(booking.bookingTime);
              const status = getStatusConfig(booking.status, t);
              const depositLabel = formatMoney(booking.depositAmount);
              const hasPaid = booking.depositPaid === 1 || booking.depositPaid === true;

              return (
                <tr 
                  key={booking.id} 
                  onClick={() => navigate(ROUTES.WORKSPACE_BOOKING_DETAIL(idOrSlug, booking.id))}
                  className="group hover:bg-slate-50/50 transition-all duration-200 cursor-pointer active:bg-slate-100/50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black shrink-0 transition-transform group-hover:scale-105 overflow-hidden
                        ${isGuest ? 'bg-amber-100 text-amber-700' : 'bg-primary/10 text-primary'}
                      `}>
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
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 truncate max-w-[140px]" title={displayName}>
                          {displayName}
                        </p>
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${isGuest ? 'text-amber-500' : 'text-primary'}`}>
                          {isGuest ? 'Walk-in' : 'Member'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-[11px] font-mono font-black text-slate-500 bg-slate-100/80 px-2 py-1 rounded-lg">
                      {booking.bookingCode || '—'}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <span className="text-sm font-black text-slate-800 tabular-nums">{displayTime}</span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 rounded-lg">
                      <span className="material-symbols-outlined text-sm text-slate-400">group</span>
                      <span className="text-sm font-black text-slate-700">{booking.numGuests || 0}</span>
                    </div>
                  </td>

                  <td className="px-4 py-5 text-center">
                    <span className="text-sm font-black text-slate-800">
                      {booking.tableNumber || (
                        <span className="text-xs font-medium text-slate-300 italic">
                          {t('owner_bookings.table.no_table')}
                        </span>
                      )}
                    </span>
                  </td>

                  <td className="px-4 py-5 text-center">
                    {booking.depositRequired ? (
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-black text-slate-700">{depositLabel}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${hasPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {hasPaid ? t('owner_bookings.table.deposit_paid') : t('owner_bookings.table.deposit_unpaid')}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-200">—</span>
                    )}
                  </td>

                  <td className="px-4 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black rounded-2xl uppercase tracking-widest ${status.bg}`}>
                      <span className="material-symbols-outlined text-[14px] leading-none">{status.icon}</span>
                      {status.label}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <BookingStatusActions booking={booking} onAction={onAction} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PHÂN TRANG (PAGINATION) */}
      {totalCount > 0 && (
        <div className="px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {t('owner_bookings.pagination.showing', {
              from: fromRecord,
              to: toRecord,
              total: totalCount,
            })}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => (
                  p === '...' ? (
                    <span key={idx} className="px-1 text-slate-300">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`
                        min-w-[36px] h-9 text-xs font-black rounded-xl transition-all
                        ${currentPage === p 
                          ? 'bg-slate-900 text-white shadow-lg' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'}
                      `}
                    >
                      {p}
                    </button>
                  )
                ))
              }
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;
