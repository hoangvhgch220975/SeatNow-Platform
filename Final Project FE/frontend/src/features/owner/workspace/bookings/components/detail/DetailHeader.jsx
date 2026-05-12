import React from 'react';
import { ChevronLeft, Hash } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

const DetailHeader = ({ booking, statusCfg, idOrSlug }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const StatusIcon = statusCfg.icon;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(ROUTES.WORKSPACE_BOOKINGS(idOrSlug))}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {t('workspace_booking_detail.title')}
          </h1>
          <p className="text-slate-400 font-bold text-sm tracking-wide flex items-center gap-2">
            <Hash className="w-3.5 h-3.5" />
            {booking.bookingCode}
          </p>
        </div>
      </div>

      <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} font-black text-xs uppercase tracking-widest`}>
        <StatusIcon className="w-4 h-4" />
        {statusCfg.label}
      </div>
    </div>
  );
};

export default DetailHeader;
