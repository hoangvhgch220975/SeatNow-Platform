import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

/**
 * Bảng lịch sử giao dịch gần đây
 */
const TransactionHistory = ({ transactions }) => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();

  const getStatusStyles = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ARRIVED':   return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CONFIRMED': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default:          return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val ?? 0);

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {t('workspace_revenue.transactions.title')}
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            {t('workspace_revenue.transactions.subtitle')}
          </p>
        </div>
        <Link
          to={ROUTES.WORKSPACE_BOOKINGS(idOrSlug)}
          className="flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all duration-200 group"
        >
          <span>{t('workspace_revenue.transactions.view_all')}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('workspace_revenue.transactions.col_date')}
              </th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('workspace_revenue.transactions.col_customer')}
              </th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                {t('workspace_revenue.transactions.col_status')}
              </th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                {t('workspace_revenue.transactions.col_amount')}
              </th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                {t('workspace_revenue.transactions.col_net')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions?.length > 0 ? (
              transactions.map((tx, idx) => (
                <tr key={tx.id ?? idx} className="hover:bg-slate-50/50 transition-colors">
                  {/* Date + Booking Code */}
                  <td className="px-4 py-3">
                    <div className="text-sm font-bold text-slate-700">
                      {tx.createdAt ? format(new Date(tx.createdAt), 'dd MMM yyyy') : '-'}
                    </div>
                    {tx.bookingCode && (
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider mt-0.5">
                        #{tx.bookingCode}
                      </div>
                    )}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {tx.customerAvatar ? (
                        <img
                          src={tx.customerAvatar}
                          alt=""
                          className="w-8 h-8 rounded-full border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-100 shrink-0">
                          {tx.customerName?.charAt(0)?.toUpperCase() ?? 'G'}
                        </div>
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        {tx.customerName ?? 'Guest'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(tx.status)}`}>
                      {tx.status ?? '-'}
                    </span>
                  </td>

                  {/* Gross Amount + Commission */}
                  <td className="px-8 py-5 text-right">
                    <div className="text-sm font-black text-slate-900">
                      {formatCurrency(tx.amount)}
                    </div>
                    {tx.commissionFee > 0 && (
                      <div className="text-[10px] text-rose-400 font-bold mt-0.5">
                        -{formatCurrency(tx.commissionFee)}
                      </div>
                    )}
                  </td>

                  {/* Net Received */}
                  <td className="px-8 py-5 text-right">
                    <div className="text-sm font-black text-emerald-600">
                      {tx.netAmount != null ? formatCurrency(tx.netAmount) : formatCurrency(tx.amount)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-14 text-center text-slate-400 font-medium italic">
                  {t('workspace_revenue.transactions.no_transactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
