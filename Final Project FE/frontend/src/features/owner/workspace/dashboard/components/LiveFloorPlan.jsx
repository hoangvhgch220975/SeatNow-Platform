import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '@/config/routes';

/**
 * @file LiveFloorPlan.jsx
 * @description Sơ đồ bàn trực tiếp (Live Floor Plan) hiển thị trạng thái các bàn.
 */
const LiveFloorPlan = ({ tables, bookings, restaurant, isLoading }) => {
  const { idOrSlug } = useParams();
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = React.useState('all');
  const [selectedSlot, setSelectedSlot] = React.useState('now');

  // Luôn lấy ngày hiện tại (Today) theo đúng yêu cầu (Vietnamese comment)
  const todayDate = React.useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  // 1. Logic tạo Khung giờ đồng bộ 100% với trang Booking (Vietnamese comment)
  const timeSlots = React.useMemo(() => {
    if (!restaurant) return [];
    
    // Sử dụng todayDate thay vì selectedDate (Vietnamese comment)
    const date = new Date(todayDate);
    const dayName = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const isWeekend = [0, 6].includes(date.getDay());

    let openingHoursRaw = restaurant.openingHours || restaurant.openingHoursJson || {};
    
    // Đảm bảo dữ liệu được parse nếu là chuỗi JSON (Vietnamese comment)
    let openingHours = openingHoursRaw;
    if (typeof openingHoursRaw === 'string') {
      try { openingHours = JSON.parse(openingHoursRaw); } catch (e) { openingHours = {}; }
    }
    
    // Hàm tìm kiếm range phù hợp (Đồng bộ logic 100% với TimeSlotPicker.jsx) (Vietnamese comment)
    const getRange = () => {
      if (!openingHours || typeof openingHours !== 'object') return '11:00-22:00';

      const keys = Object.keys(openingHours);
      const lowKeys = keys.map(k => ({ original: k, low: k.toLowerCase() }));
      
      const exact = lowKeys.find(k => k.low === dayName);
      if (exact) return openingHours[exact.original];

      if (isWeekend) {
        const weekendRange = lowKeys.find(k => k.low.includes('weekend') || k.low.includes('sat-sun'));
        if (weekendRange) return openingHours[weekendRange.original];
      } else {
        const weekdayRange = lowKeys.find(k => k.low.includes('weekday') || k.low.includes('mon-fri') || k.low.includes('workday'));
        if (weekdayRange) return openingHours[weekdayRange.original];
      }

      const globalRange = lowKeys.find(k => k.low.includes('mon-sun') || k.low.includes('everyday'));
      if (globalRange) return openingHours[globalRange.original];

      return '11:00-22:00';
    };

    let rawRange = getRange();
    if (!rawRange || rawRange === 'Closed') return [];

    const range = rawRange.toString().replace(/\s+/g, '');

    try {
      const [startStr, endStr] = range.split('-');
      const startHour = parseInt(startStr.split(':')[0]) || 9;
      const endHour = parseInt(endStr.split(':')[0]) || 22;

      const slots = [];
      let currentHour = startHour;

      // Tạo slot mỗi 2 tiếng (Đồng bộ với logic Booking) (Vietnamese comment)
      while (currentHour <= endHour - 2) {
        const slotTime = `${String(currentHour).padStart(2, '0')}:00`;
        const nextTime = `${String(currentHour + 2).padStart(2, '0')}:00`;
        
        slots.push({
          id: slotTime,
          hour: currentHour,
          label: `${slotTime} - ${nextTime}`
        });
        currentHour += 2;
      }

      return slots;
    } catch (err) {
      return [];
    }
  }, [restaurant, todayDate]);

  // 2. Xác định danh sách khu vực - Luôn hiện tất cả các tầng (Vietnamese comment)
  const locations = React.useMemo(() => [
    { id: '1st Floor', label: t('workspace.floor_plan.floors.1st', { defaultValue: '1st Floor' }) },
    { id: '2nd Floor', label: t('workspace.floor_plan.floors.2nd', { defaultValue: '2nd Floor' }) },
    { id: '3rd Floor', label: t('workspace.floor_plan.floors.3rd', { defaultValue: '3rd Floor' }) },
    { id: '4th Floor', label: t('workspace.floor_plan.floors.4th', { defaultValue: '4th Floor' }) },
    { id: '5th Floor', label: t('workspace.floor_plan.floors.5th', { defaultValue: '5th Floor' }) },
    { id: 'Rooftop', label: t('workspace.floor_plan.floors.rooftop', { defaultValue: 'Rooftop' }) },
    { id: 'Terrace', label: t('workspace.floor_plan.floors.terrace', { defaultValue: 'Terrace' }) },
    { id: 'Outdoor', label: t('workspace.floor_plan.floors.outdoor', { defaultValue: 'Outdoor' }) }
  ], [t]);

  // Tự động tìm Slot khớp với thời gian thực tế (Real-time sync) (Vietnamese comment)
  React.useEffect(() => {
    if (selectedSlot === 'now' && timeSlots.length > 0) {
      const currentHour = new Date().getHours();
      
      // Tìm slot mà currentHour nằm trong khoảng [hour, hour + 2] (Vietnamese comment)
      const currentSlot = timeSlots.find(s => currentHour >= s.hour && currentHour < s.hour + 2) 
                       || timeSlots[0]; // Mặc định là slot đầu nếu nằm ngoài dải giờ (Vietnamese comment)
      
      setSelectedSlot(currentSlot.id);
    }
  }, [timeSlots, selectedSlot]);

  // 3. Logic kiểm tra trạng thái bàn (Vietnamese comment)
  const getTableStatusForSlot = (table) => {
    if (table.status?.toLowerCase() === 'unavailable' || table.status?.toLowerCase() === 'maintenance') {
      return 'unavailable';
    }

    // Trích xuất dữ liệu booking cực kỳ mãnh liệt (Đồng bộ với UpcomingArrivalsTable) (Vietnamese comment)
    const bookingsArray = Array.isArray(bookings) ? bookings 
                       : (bookings?.items || bookings?.data || bookings?.content || bookings?.bookings || []);
    
    // Tính toán giờ kết thúc của slot (selectedSlot + 2h) (Vietnamese comment)
    const slotStartHour = parseInt(selectedSlot.split(':')[0]);
    const slotEndHour = slotStartHour + 2;

    const hasBooking = bookingsArray.some(b => {
      const isSameTable = String(b.tableId) === String(table.id);

      // Bàn chỉ hiện là 'Occupied' nếu lịch đặt không bị Hủy hoặc No-show (Vietnamese comment)
      const statusRaw = b.status?.toUpperCase();
      const isInvalidStatus = statusRaw === 'CANCELLED' || 
                              statusRaw === 'REJECTED' || 
                              statusRaw === 'NO-SHOW' || 
                              statusRaw === 'NO_SHOW';
      const isNotCancelled = !isInvalidStatus;
      
      // Xử lý bookingTime linh hoạt (ISO, UTC, hoặc raw) (Vietnamese comment)
      let rawTime = b.bookingTime || b.booking_time || '';
      let bookingHour = NaN;

      if (rawTime.includes('T')) {
          // ISO: 2026-04-10T11:00:00Z -> 11
          bookingHour = parseInt(rawTime.split('T')[1].split(':')[0]);
      } else if (rawTime) {
          // Raw: 11:30:00 -> 11
          bookingHour = parseInt(rawTime.split(':')[0]);
      }

      const isInTimeRange = !isNaN(bookingHour) && bookingHour >= slotStartHour && bookingHour < slotEndHour;

      return isSameTable && isNotCancelled && isInTimeRange;
    });

    return hasBooking ? 'occupied' : 'available';
  };

  const filteredTables = React.useMemo(() => {
    if (selectedLocation === 'all') return tables;
    return tables?.filter(t => t.location === selectedLocation);
  }, [tables, selectedLocation]);

  // Ánh xạ màu sắc theo 2 trạng thái tối giản (Vietnamese comment)
  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied':
      case 'reserved':
        return 'bg-primary text-white border-primary shadow-emerald-100';
      case 'unavailable':
      case 'maintenance':
        return 'bg-slate-100 text-slate-400 border-slate-200 grayscale';
      default:
        // 'available' (Vietnamese comment)
        return 'bg-white text-slate-400 border-slate-200 border-dashed border-2 hover:border-primary/40 hover:bg-slate-50';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-[0_20px_40px_rgba(99,14,212,0.02)] border border-slate-50 flex flex-col h-full">
      <div className="flex flex-col gap-5 mb-5">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {t('workspace.dashboard.live_floor_plan', { defaultValue: 'Floor Plan' })}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t('workspace.floor_plan.live_syncing', { defaultValue: 'Live Syncing' })}
              </p>
            </div>
          </div>

          <Link 
            to={ROUTES.WORKSPACE_TABLES(idOrSlug)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-[10px] font-black uppercase text-slate-500 rounded-lg transition-colors border border-slate-100"
          >
            <span className="material-symbols-outlined text-[14px]">settings</span>
            {t('common.manage', { defaultValue: 'Manage' })}
          </Link>
        </div>

        {/* Cấu trúc bộ lọc Dropdown kép (Vietnamese comment) */}
        {!isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {/* Area Filter */}
            <div className="relative">
              <select 
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
              >
                <option value="all">{t('workspace.floor_plan.all_areas', { defaultValue: 'All Areas' })}</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">expand_more</span>
            </div>

            {/* Time Slot Filter */}
            <div className="relative">
              <select 
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl px-3 py-2.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer appearance-none"
              >
                {timeSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>{slot.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">schedule</span>
            </div>
          </div>
        )}
      </div>

      {/* Lưới hiển thị các bàn (Vietnamese comment) */}
      <div className="grid grid-cols-4 gap-3 bg-slate-50/50 p-5 flex-1 rounded-[1.5rem] border border-slate-100 aspect-square relative overflow-auto content-start min-h-[300px]">
        {isLoading ? (
          Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white animate-pulse rounded-2xl border border-slate-100" />
          ))
        ) : filteredTables?.length > 0 ? (
          filteredTables.map((table) => {
            const currentStatus = getTableStatusForSlot(table);
            return (
              <motion.div 
                key={table.id}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm border ${getStatusColor(currentStatus)}`}
                title={`${t('tables.form.table_number')}: ${table.tableNumber} - ${t(`workspace.floor_plan.${currentStatus}`)}`}
              >
                <span className="text-[10px] font-black leading-tight">{table.tableNumber}</span>
                <div className="flex items-center gap-0.5 mt-0.5 opacity-60">
                  <span className="material-symbols-outlined text-[10px]">group</span>
                  <span className="text-[8px] font-black">{table.capacity}</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-4 h-full flex items-center justify-center text-slate-300 text-[10px] font-black uppercase tracking-widest text-center px-4">
            {t('workspace.floor_plan.no_tables_area', { defaultValue: 'No tables in this area' })}
          </div>
        )}
      </div>

      {/* Chú thích trạng thái tối giản (Chỉ còn 2 loại) (Vietnamese comment) */}
      <div className="mt-5 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-dashed border-slate-200"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('workspace.floor_plan.available', { defaultValue: 'Available' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/20"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('workspace.floor_plan.occupied', { defaultValue: 'Occupied' })}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveFloorPlan;
