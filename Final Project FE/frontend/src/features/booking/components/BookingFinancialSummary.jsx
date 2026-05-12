import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @component BookingFinancialSummary
 * @description Hiển thị tóm tắt tài chính và các ghi chú đặc biệt từ khách hàng. Hỗ trợ đa ngôn ngữ.
 * @param {object} booking - Dữ liệu đặt bàn
 */
const BookingFinancialSummary = ({ booking }) => {
  const { t } = useTranslation();
  const { notes, financial, status, cancellationReason } = booking;

  return (
    <div className="space-y-8">
      {/* Special Requests & Notes */}
      {notes && notes.trim() !== '' && (
        <div className="bg-surface/50 p-10 rounded-[2.5rem] border border-outline/5 italic transition-all hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] hover:border-primary/10">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-primary/60">edit_note</span>
            {t('booking.detail.sections.special_requests')}
          </h4>
          <p className="text-on-surface-variant font-medium leading-relaxed text-[15px]">
            "{notes}"
          </p>
        </div>
      )}

      {/* Financial Summary */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-outline/10 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.1)] transition-all duration-500">
        <h3 className="text-2xl font-black text-on-surface mb-8 headline tracking-tight">
          {t('booking.detail.sections.financial_summary')}
        </h3>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center group">
            <span className="text-[13px] font-bold text-on-surface-variant/60 uppercase tracking-widest">{t('booking.detail.labels.deposit')}</span>
            <span className="text-[15px] font-black text-on-surface group-hover:text-primary transition-colors">{financial.deposit}</span>
          </div>
          
          <div className="pt-8 border-t border-outline/5 flex justify-between items-center group">
            <span className="text-lg font-black text-on-surface uppercase tracking-widest">{t('booking.detail.labels.total_charged')}</span>
            <span className="text-3xl font-black text-primary">{financial.total}</span>
          </div>
          
          <div className="flex items-start gap-4 mt-6 text-[12px] text-on-surface-variant/50 font-bold bg-surface p-5 rounded-[1.5rem] border border-outline/5">
            <span className="material-symbols-outlined text-[18px] text-primary/60 mt-0.5">info</span>
            <p className="leading-relaxed">
              {t('booking.detail.fallbacks.deposit_deduction_notice')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFinancialSummary;
