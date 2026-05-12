import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';

const BookingInfoCard = ({ booking }) => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'vi' ? vi : enUS;

  const parseSafeDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      if (typeof dateStr === 'string' && dateStr.includes('-') && dateStr.length === 10) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      }
      return new Date(dateStr);
    } catch {
      return null;
    }
  };

  const formatTime = (rawTime) => {
    if (!rawTime) return '—';
    // Xử lý trường hợp chuỗi ISO: 1970-01-01T12:00:00
    if (typeof rawTime === 'string' && rawTime.includes('T')) {
      return rawTime.split('T')[1].slice(0, 5);
    }
    return String(rawTime).slice(0, 5);
  };

  const safeDate = parseSafeDate(booking.bookingDate);
  const displayTime = formatTime(booking.bookingTime);

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-full">
      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-300" />
          {t('workspace_booking_detail.booking.title')}
        </h3>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.booking.time')}</label>
            <p className="text-base font-black text-slate-800 leading-tight capitalize">
              {safeDate ? format(safeDate, 'EEEE, dd/MM/yyyy', { locale: dateLocale }) : '—'}
              <br />
              <span className="text-2xl text-indigo-600">{displayTime}</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.booking.guests')}</label>
            <p className="text-xl font-black text-slate-800">{booking.numGuests} {t('workspace_booking_detail.booking.unit_guests')}</p>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('workspace_booking_detail.booking.table')}</label>
            <p className="text-xl font-black text-slate-800">
              {booking.tableNumber || '—'}
              {booking.tableLocation && (
                <span className="text-sm font-bold text-slate-400 ml-2 italic">({booking.tableLocation})</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingInfoCard;
