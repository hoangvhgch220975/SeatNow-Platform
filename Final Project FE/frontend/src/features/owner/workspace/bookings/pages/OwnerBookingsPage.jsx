import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

import { bookingOwnerApi } from '../api';
import { bookingSocket } from '@/lib/socket';
import BookingStats from '../components/BookingStats';
import BookingFilters from '../components/BookingFilters';
import BookingTable from '../components/BookingTable';
import CancelReasonModal from '../components/CancelReasonModal';

/**
 * @file OwnerBookingsPage.jsx
 * @description Trang quản lý booking trung tâm dành cho Chủ nhà hàng.
 * Tích hợp Socket.io để tự động cập nhật khi có biến động dữ liệu từ hệ thống.
 */

const PAGE_SIZE = 10;

const OwnerBookingsPage = () => {
  const { t } = useTranslation();
  // Lấy đối tượng restaurant (có UUID) từ context của layout chung
  const { restaurant } = useOutletContext();
  const restaurantId = restaurant?.id;

  // --- TRẠNG THÁI (STATE) ---
  const [selectedDate, setSelectedDate] = useState(null); // Mặc định là null để lấy toàn bộ đơn
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [bookings, setBookings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [summary, setSummary] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Quản lý Modal hủy đơn
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  /**
   * Truy vấn danh sách đặt bàn và thống kê (Summary) từ Backend.
   * Sử dụng gộp để giảm thiểu số lượng Request.
   */
  const fetchData = useCallback(async () => {
    if (!restaurantId) return;
    setIsLoading(true);
    try {
      const params = {
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
      };

      // Chỉ thêm filter ngày nếnu người dùng chọn một ngày cụ thể
      if (selectedDate) {
        params.from = selectedDate;
        params.to = selectedDate;
      }

      // Lọc theo trạng thái đơn
      if (selectedStatus !== 'ALL') {
        params.status = selectedStatus;
      }

      const res = await bookingOwnerApi.getBookings(restaurantId, params);
      
      // BE trả về items (danh sách), total (phân trang), và summary (KPI)
      // Lưu ý: axios interceptor đã giải nén trường 'data' nên ta truy cập trực tiếp
      setBookings(res.items || []);
      setTotalCount(res.total || 0);
      setSummary(res.summary || null);
    } catch (err) {
      console.error('[OwnerBookingsPage] Lỗi tải dữ liệu:', err);
      toast.error(t('owner_bookings.toast.load_error'));
    } finally {
      setIsLoading(false);
    }
  // ✅ Bỏ `t` khỏi deps vì không ảnh hưởng logic fetch, tránh tạo fetchData mới vô ích
  }, [restaurantId, selectedDate, selectedStatus, currentPage]);

  // --- TỰ ĐỘNG CẬP NHẬT KHI CÓ THAY ĐỔI FILTER ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- TÍCH HỢP SOCKET.IO ĐỂ CẬP NHẬT THỜI GIAN THỰC ---
  useEffect(() => {
    if (!restaurantId) return;

    // Lắng nghe sự kiện bookingChanged từ Server
    const handleBookingUpdate = (data) => {
      // Nếu sự kiện thuộc về nhà hàng này, thực hiện tải lại dữ liệu mới nhất
      if (data.restaurantId === restaurantId) {
        console.log('[Socket] Nhận thông báo cập nhật booking, đang làm mới dữ liệu...');
        fetchData();
      }
    };

    bookingSocket.on('bookingChanged', handleBookingUpdate);

    // Cleanup khi component bị hủy (unmount)
    return () => {
      bookingSocket.off('bookingChanged', handleBookingUpdate);
    };
  }, [restaurantId, fetchData]);

  // --- XỬ LÝ SỰ KIỆN FILTER ---
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setCurrentPage(1);
  };

  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
    setCurrentPage(1);
  };

  // --- XỬ LÝ CÁC TÁC VỤ TRẠNG THÁI ---
  const handleAction = async (action, bookingId, reason = null) => {
    // Nếu là lệnh hủy và chưa có lý do, mở Modal nhập lý do
    if (action === 'cancel' && !reason) {
      setPendingCancelId(bookingId);
      setCancelModalOpen(true);
      return;
    }

    setIsActionLoading(true);
    try {
      switch (action) {
        case 'confirm':
          await bookingOwnerApi.confirmBooking(bookingId);
          toast.success(t('owner_bookings.toast.confirm_success'));
          break;
        case 'arrive':
          await bookingOwnerApi.arriveBooking(bookingId);
          toast.success(t('owner_bookings.toast.arrive_success'));
          break;
        case 'complete':
          await bookingOwnerApi.completeBooking(bookingId);
          toast.success(t('owner_bookings.toast.complete_success'));
          break;
        case 'no_show':
          await bookingOwnerApi.noShowBooking(bookingId);
          toast.success(t('owner_bookings.toast.no_show_success'));
          break;
        case 'cancel':
          await bookingOwnerApi.cancelBooking(bookingId, reason);
          toast.success(t('owner_bookings.toast.cancel_success'));
          setCancelModalOpen(false);
          setPendingCancelId(null);
          break;
        default:
          break;
      }
      // Sau khi gọi API thành công, danh sách sẽ tự cập nhật qua Socket hoặc gọi fetch thủ công
      // Ở đây ta chủ động fetch để đảm bảo UI mượt nhất
      fetchData();
    } catch (err) {
      console.error(`[OwnerBookingsPage] Error in action ${action}:`, err);
      toast.error(t('owner_bookings.toast.action_error'));
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Render Header phụ để hiển thị ngày đang xem (nếu có chọn lọc)
   */
  const renderDateBadge = () => {
    if (!selectedDate) return (
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm border-dashed">
        <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          {t('owner_bookings.stats.all_time')}
        </span>
      </div>
    );

    return (
      <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <span className="material-symbols-outlined text-[16px] text-violet-600">event</span>
        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString(t('i18next_code'), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            {t('owner_bookings.page_title')}
          </h2>
          <p className="text-slate-500 font-bold text-lg">
            {t('owner_bookings.page_subtitle')}
          </p>
        </div>

        {renderDateBadge()}
      </div>

      {/* === KPI THỐNG KÊ (Dựa trên summary từ API) === */}
      <BookingStats
        summary={summary}
        isLoading={isLoading}
        selectedDate={selectedDate}
      />

      {/* === BỘ LỌC (Ngày & Trạng thái) === */}
      <BookingFilters
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
      />

      {/* === BẢNG DỮ LIỆU ĐẶT BÀN === */}
      <BookingTable
        bookings={bookings}
        totalCount={totalCount}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onAction={handleAction}
        isLoading={isLoading}
      />

      {/* === MODAL HỦY ĐƠN (Yêu cầu nhập lý do) === */}
      <CancelReasonModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setPendingCancelId(null);
        }}
        onConfirm={(reason) => handleAction('cancel', pendingCancelId, reason)}
        isLoading={isActionLoading}
      />
    </div>
  );
};

export default OwnerBookingsPage;
