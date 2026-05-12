import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

const SpecialRequestsCard = ({ requests }) => {
  const { t } = useTranslation();

  return (
    <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center gap-3">
        <MessageSquare className="w-4 h-4 text-slate-300" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          {t('workspace_booking_detail.booking.special_requests')}
        </h3>
      </div>
      <div className="p-8">
        {requests ? (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 italic font-medium leading-relaxed">
            "{requests}"
          </div>
        ) : (
          <p className="text-slate-300 italic text-sm">{t('workspace_booking_detail.booking.no_requests')}</p>
        )}
      </div>
    </section>
  );
};

export default SpecialRequestsCard;
