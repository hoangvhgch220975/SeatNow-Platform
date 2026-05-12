import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircle2, 
  MapPin, 
  Info, 
  XCircle, 
  History 
} from 'lucide-react';
import { format } from 'date-fns';

const ActionCommandCenter = ({ 
  booking, 
  actions, 
  refetch, 
  onOpenCancelModal 
}) => {
  const { t } = useTranslation();

  return (
    <section className="bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 shadow-sm p-8 h-full relative overflow-hidden group">
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-200/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/50 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative flex items-center gap-3 mb-10 pb-6 border-b border-indigo-100">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200/50 shadow-inner">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.1em]">
          {t('workspace_booking_detail.actions.title')}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-5 relative">
        {/* Confirm - Orange (Pending) */}
        {booking.status === 'PENDING' && (
          <button 
            disabled={actions.isLoading}
            onClick={() => actions.confirmBooking(booking.id).then(refetch)}
            className="w-full relative overflow-hidden flex items-center justify-between p-5 bg-white hover:bg-orange-50 text-orange-600 rounded-3xl transition-all duration-300 font-black text-sm active:scale-[0.98] border border-orange-100 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-left">
                <span className="block">{t('owner_bookings.actions.confirm')}</span>
                <p className="text-[9px] font-bold text-orange-400/60 uppercase tracking-widest mt-0.5">{t('workspace_booking_detail.actions.confirm_desc')}</p>
              </div>
            </div>
          </button>
        )}

        {/* Arrived - Green (Confirmed) */}
        {booking.status === 'CONFIRMED' && (
          <button 
            disabled={actions.isLoading}
            onClick={() => actions.arriveBooking(booking.id).then(refetch)}
            className="w-full relative overflow-hidden flex items-center justify-between p-5 bg-white hover:bg-emerald-50 text-emerald-600 rounded-3xl transition-all duration-300 font-black text-sm active:scale-[0.98] border border-emerald-100 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-left">
                <span className="block">{t('owner_bookings.actions.check_in')}</span>
                <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest mt-0.5">{t('workspace_booking_detail.actions.arrive_desc')}</p>
              </div>
            </div>
          </button>
        )}

        {/* Complete - Blue (Arrived) */}
        {booking.status === 'ARRIVED' && (
          <button 
            disabled={actions.isLoading}
            onClick={() => actions.completeBooking(booking.id).then(refetch)}
            className="w-full relative overflow-hidden flex items-center justify-between p-5 bg-white hover:bg-blue-50 text-blue-600 rounded-3xl transition-all duration-300 font-black text-sm active:scale-[0.98] border border-blue-100 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-left">
                <span className="block">{t('owner_bookings.actions.complete')}</span>
                <p className="text-[9px] font-bold text-blue-400/60 uppercase tracking-widest mt-0.5">{t('workspace_booking_detail.actions.complete_desc')}</p>
              </div>
            </div>
          </button>
        )}

        {/* Secondary Actions Row */}
        <div className="grid grid-cols-2 gap-4">
          {['CONFIRMED', 'ARRIVED'].includes(booking.status) && (
            <button 
              disabled={actions.isLoading}
              onClick={() => actions.noShowBooking(booking.id).then(refetch)}
              className="flex flex-col items-center justify-center gap-2 p-5 bg-white/80 hover:bg-white text-slate-500 rounded-3xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 border border-slate-100 shadow-sm"
            >
              <Info className="w-5 h-5 opacity-40 shrink-0" />
              {t('owner_bookings.actions.no_show')}
            </button>
          )}

          {['PENDING', 'CONFIRMED'].includes(booking.status) && (
            <button 
              disabled={actions.isLoading}
              onClick={onOpenCancelModal}
              className="flex flex-col items-center justify-center gap-2 p-5 bg-rose-50/30 hover:bg-rose-50 text-rose-500 rounded-3xl transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 border border-rose-100 shadow-sm"
            >
              <XCircle className="w-5 h-5 opacity-40 shrink-0" />
              {t('owner_bookings.actions.cancel')}
            </button>
          )}
        </div>

        {/* Audit Log */}
        <div className="mt-8 pt-8 border-t border-indigo-100 flex flex-col gap-4">
          <div className="flex items-center justify-between text-indigo-400">
            <div className="flex items-center gap-2">
              <History className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] leading-none opacity-60">
                {t('workspace_booking_detail.booking.created_at')}
              </span>
            </div>
            <span className="text-[11px] font-black tabular-nums leading-none tracking-tight">
              {booking.createdAt && format(new Date(booking.createdAt), 'HH:mm - dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionCommandCenter;
