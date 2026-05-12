import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Phone, Mail } from 'lucide-react';

const CustomerCard = ({ booking }) => {
  const { t } = useTranslation();
  const isGuest = !booking.customerId;

  const getV = (obj, ...keys) => {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return null;
  };

  const userData = booking.User || booking.user || booking.Customer || booking.customer || {};
  const displayName = getV(booking, 'customerName', 'guestName', 'GuestName') || getV(userData, 'fullName', 'fullName', 'name', 'Name') || '—';
  const phone = getV(booking, 'customerPhone', 'guestPhone', 'phone', 'Phone') || getV(userData, 'phone', 'PhoneNumber') || '—';
  const email = getV(booking, 'customerEmail', 'guestEmail', 'email', 'Email') || getV(userData, 'email', 'Email') || '—';

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-300" />
          {t('workspace_booking_detail.customer.title')}
        </h3>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isGuest ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
          {isGuest ? t('workspace_booking_detail.customer.guest') : t('workspace_booking_detail.customer.member')}
        </span>
      </div>
      
      <div className="p-8 flex flex-col sm:flex-row items-center gap-8">
        <div className={`
          w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-3xl font-black shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500
          ${isGuest ? 'bg-amber-50 text-amber-200' : 'bg-indigo-50 text-indigo-200'}
        `}>
          {booking.customerAvatar ? (
            <img src={booking.customerAvatar} className="w-full h-full object-cover rounded-[2.5rem]" alt="" />
          ) : (
            (displayName?.[0] || '?').toUpperCase()
          )}
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 w-full">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('workspace_booking_detail.customer.name')}</label>
            <p className="text-xl font-black text-slate-800 tracking-tight">{displayName}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('workspace_booking_detail.customer.phone')}</label>
            <p className="text-lg font-bold text-slate-600 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-300" />
              {phone}
            </p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('workspace_booking_detail.customer.email')}</label>
            <p className="text-lg font-bold text-slate-600 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-300" />
              {email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerCard;
