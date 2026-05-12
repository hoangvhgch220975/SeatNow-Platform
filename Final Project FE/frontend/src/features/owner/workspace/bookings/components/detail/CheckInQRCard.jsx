import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { QrCode, ScanLine } from 'lucide-react';
import { ROUTES } from '@/config/routes';

/**
 * @file CheckInQRCard.jsx
 * @description Card hiển thị nút mở trình quét QR để check-in cho khách.
 */

const CheckInQRCard = ({ booking }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idOrSlug } = useParams();

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center text-center gap-8 group relative overflow-hidden h-fit">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:w-40 group-hover:h-40" />
      
      <div className="relative">
        <div className="w-48 h-48 bg-indigo-50/50 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner group-hover:scale-105 transition-transform duration-500">
           <div className="w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center relative overflow-hidden">
              <ScanLine className="w-16 h-16 text-indigo-600 animate-pulse" />
              <div className="absolute inset-0 border-2 border-indigo-100 rounded-3xl" />
           </div>
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl ring-4 ring-white">
          <QrCode className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {t('workspace_booking_detail.qr.title')}
        </h3>
        <p className="text-xs font-bold text-slate-400 px-6 leading-relaxed">
          {t('workspace_booking_detail.qr.scan_desc')}
        </p>
      </div>

      <button
        onClick={() => navigate(ROUTES.WORKSPACE_SCAN_QR(idOrSlug))}
        className="w-full py-4 bg-indigo-600 text-white text-sm font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        <ScanLine size={18} />
        {t('workspace_booking_detail.qr.scan_btn')}
      </button>
    </section>
  );
};

export default CheckInQRCard;
