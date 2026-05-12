import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file TimeSlotPicker.jsx
 * @description Giao diện Lịch (Monthly Calendar) và khung giờ đặt bàn động (Dynamic 2h Slots).
 */
const TimeSlotPicker = ({ 
  selectedDate, 
  onSelectDate, 
  selectedTimeSlot, 
  onSelectSlot,
  openingHours // Nhận từ CreateBookingPage
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'vi';

  // 1. Quản lý tháng đang xem (View Date)
  const [viewDate, setViewDate] = useState(new Date(selectedDate || new Date()));

  // 2. Logic Lịch (Calendar Logic)
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Ngày đầu tiên của tháng
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Tổng số ngày trong tháng
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Mảng các ngày để render
    const days = [];
    
    // Thêm các ô trống của tháng trước
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ type: 'empty', id: `empty-${i}` });
    }
    
    // Thêm các ngày trong tháng hiện tại
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      // Định dạng YYYY-MM-DD theo giờ địa phương
      const fullDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      const isPast = dateObj < today;
      
      days.push({
        type: 'day',
        dayNumber: d,
        fullDate: fullDateStr,
        isPast,
        isToday: dateObj.getTime() === today.getTime()
      });
    }
    
    return { 
      days, 
      monthName: viewDate.toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { month: 'long' }), 
      year 
    };
  }, [viewDate, currentLang]);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !openingHours) return [];
    
    const date = new Date(selectedDate);
    // Luôn dùng en-US cho logic để khớp với keys trong database
    const dayName = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const isWeekend = [0, 6].includes(date.getDay()); // 0: Sun, 6: Sat

    // Hàm tìm kiếm range phù hợp với định dạng dữ liệu đa dạng
    const getRange = () => {
      const keys = Object.keys(openingHours);
      const lowKeys = keys.map(k => ({ original: k, low: k.toLowerCase() }));
      
      // 1. Khớp chính xác ngày (Ví dụ: "monday")
      const exact = lowKeys.find(k => k.low === dayName);
      if (exact) return openingHours[exact.original];

      // 2. Ưu tiên khớp theo nhóm Weekend/Weekday để tránh nhận nhầm dải gộp
      if (isWeekend) {
        // Tìm dải dành cho cuối tuần
        const weekendRange = lowKeys.find(k => 
          k.low.includes('weekend') || 
          k.low.includes('sat-sun') || 
          (k.low.includes('sat') && k.low.includes('-')) || 
          (k.low.includes('sun') && k.low.includes('-'))
        );
        if (weekendRange) return openingHours[weekendRange.original];
      } else {
        // Tìm dải dành cho ngày thường
        const weekdayRange = lowKeys.find(k => 
          k.low.includes('weekday') || 
          k.low.includes('mon-fri') || 
          k.low.includes('workday') ||
          k.low.includes(dayName.slice(0, 3)) // Tìm "tue" trong các dải như "mon-wed"
        );
        if (weekdayRange) return openingHours[weekdayRange.original];
      }

      // 3. Khớp dải bao quát toàn bộ (Ví dụ: "Monday-Sunday")
      const globalRange = lowKeys.find(k => 
        k.low.includes('mon-sun') || 
        k.low.includes('monday-sunday') ||
        k.low.includes('everyday')
      );
      if (globalRange) return openingHours[globalRange.original];

      return null;
    };

    let rawRange = getRange();
    if (!rawRange || rawRange === 'Closed') return [];

    // Chuẩn hóa: "10:00 - 23:00" -> "10:00-23:00"
    const range = rawRange.replace(/\s+/g, '');

    // Parse dải giờ
    try {
      const [startStr, endStr] = range.split('-');
      const [startHour, startMin] = startStr.split(':').map(Number);
      const [endHour, endMin] = endStr.split(':').map(Number);

      const slots = [];
      let currentHour = startHour;

      const now = new Date();
      const isToday = 
        date.getDate() === now.getDate() && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear();
      const currentRealHour = now.getHours();
      const currentRealMin = now.getMinutes();

      // Tạo slot mỗi 2 tiếng
      while (currentHour <= endHour - 2) {
        const slotTime = `${String(currentHour).padStart(2, '0')}:00`;
        const nextTime = `${String(currentHour + 2).padStart(2, '0')}:00`;
        
        let isPast = false;
        if (isToday) {
          if (currentRealHour > currentHour || (currentRealHour === currentHour && currentRealMin > 0)) {
            isPast = true;
          }
        }

        slots.push({
          id: slotTime,
          label: `${slotTime} - ${nextTime}`,
          status: 'available',
          isPast
        });
        currentHour += 2;
      }

      return slots;
    } catch (err) {
      return [];
    }
  }, [selectedDate, openingHours]);

  // Chuyển tháng
  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const dayLabels = currentLang === 'vi' 
    ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] 
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="flex flex-col xl:flex-row gap-10">
      
      {/* CỘT TRÁI: LỊCH (Monthly Calendar) */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center justify-between px-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">
            {t('booking.time_picker.select_date')}
          </label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-primary/5 rounded-xl transition-all duration-300 ease-out-expo"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface min-w-[120px] text-center">
              {calendarData.monthName} {calendarData.year}
            </span>
            <button 
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-primary/5 rounded-xl transition-all duration-300 ease-out-expo"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Lưới lịch */}
        <div className="bg-surface p-6 rounded-3xl border border-outline/5 shadow-inner shadow-black/[0.01]">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayLabels.map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-outline/40 py-2 tracking-widest">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2.5">
            {calendarData.days.map((day, idx) => {
              if (day.type === 'empty') return <div key={day.id} className="aspect-square"></div>;
              
              const isSelected = selectedDate === day.fullDate;
              return (
                <button
                  key={day.fullDate}
                  disabled={day.isPast}
                  onClick={() => onSelectDate(day.fullDate)}
                  className={`
                    aspect-square rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-500 ease-out-expo relative
                    ${day.isPast ? 'text-outline/10 cursor-not-allowed' : 'hover:scale-110'}
                    ${isSelected 
                      ? 'bg-primary text-white shadow-xl shadow-primary/30 z-10' 
                      : !day.isPast ? 'bg-white text-on-surface hover:bg-primary/5 hover:text-primary border border-outline/5' : ''}
                  `}
                >
                  {day.dayNumber}
                  {day.isToday && !isSelected && (
                    <div className="absolute bottom-2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: KHUNG GIỜ (Time Slots) */}
      <div className="w-full xl:w-[320px] space-y-5">
        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60 px-2 block">
          {t('booking.time_picker.preferred_slot')}
        </label>
        
        <div className="bg-surface p-6 rounded-3xl border border-outline/5 min-h-[300px] shadow-inner shadow-black/[0.01]">
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.id;
                return (
                  <button
                    key={slot.id}
                    disabled={slot.isPast}
                    onClick={() => onSelectSlot(slot.id)}
                    className={`
                      py-4.5 px-6 rounded-2xl text-center transition-all duration-500 flex items-center justify-between group
                      ${slot.isPast 
                        ? 'opacity-40 cursor-not-allowed bg-transparent border border-outline/5' 
                        : isSelected 
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                          : 'bg-white text-on-surface hover:bg-primary/5 hover:scale-[1.01] border border-outline/5 ease-out-expo'}
                    `}
                  >
                    <span className="text-[11px] font-bold tracking-[0.1em] uppercase">{slot.label}</span>
                    <span className={`material-symbols-outlined text-lg ${
                      slot.isPast ? 'text-outline/50' : 
                      isSelected ? 'text-white' : 'text-primary/30 group-hover:text-primary transition-all duration-300'}`}>
                      {slot.isPast ? 'block' : isSelected ? 'check_circle' : 'schedule'}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-40">
              <div className="w-12 h-12 rounded-full bg-outline/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-outline/30">event_busy</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline/50">
                {t('booking.time_picker.closed_no_slots')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
