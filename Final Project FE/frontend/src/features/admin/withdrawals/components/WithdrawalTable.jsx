import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, 
  ChevronRight, 
  Wallet, 
  Clock, 
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ChevronLeft
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import { formatDateTime } from '../../../../shared/utils/formatDateTime';

/**
 * @file WithdrawalTable.jsx
 * @description Bảng hiển thị danh sách các yêu cầu rút tiền của Admin.
 * Được nâng cấp để hiển thị Risk Signals từ Backend.
 */
const WithdrawalTable = ({ 
  requests = [], 
  loading = false, 
  onSelectRequest,
  pagination = {},
  onPageChange 
}) => {
  const { t } = useTranslation();
  const { page = 1, totalPages = 1, total = 0 } = pagination;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
        <div className="w-12 h-12 border-4 border-violet-100 border-t-violet-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium text-sm">{t('common.loading') || 'Loading requests...'}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <Wallet size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">{t('admin.withdrawals.table.no_data')}</h3>
        <p className="text-slate-400 text-sm max-w-xs">
          {t('admin.withdrawals.table.no_data_desc') || "All clear! There are no pending payout requests at this moment."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {t('admin.withdrawals.table.restaurant')}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {t('admin.withdrawals.table.balance')}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {t('admin.withdrawals.table.requested')}
              </th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {t('admin.withdrawals.table.status')}
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((request) => (
              <tr 
                key={request.id} 
                className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                onClick={() => onSelectRequest(request)}
              >
                <td className="px-6 py-5">
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      {request.restaurantName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatDateTime(request.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div>
                    <p className="font-bold text-slate-700">
                      {formatCurrency(request.currentWalletBalance || request.restaurantBalance || 0)}
                    </p>
                    <p className="text-[10px] font-black text-violet-400 uppercase tracking-tighter">
                      {t('admin.withdrawals.details.verified_revenue')}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div>
                    <p className="text-lg font-black text-violet-600">
                      {formatCurrency(request.amount)}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {request.bankDetails?.method === 'QR' 
                          ? (t('admin.withdrawals.table.qr_label') || 'QR Payout') 
                          : (request.bankDetails?.bankName || t('admin.withdrawals.table.default_method') || 'Default Method')}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border 
                    ${request.status === 'pending' || request.status === 'PENDING'
                        ? 'bg-amber-50 text-amber-600 border-amber-100' 
                        : 'bg-green-50 text-green-600 border-green-100'}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-all transform group-hover:translate-x-1 shadow-sm">
                    <ChevronRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - Admin Prime Style */}
      {!loading && total > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <span>{t('common.showing') || 'Showing'}</span>
            <span className="text-slate-900">{requests.length}</span>
            <span>{t('common.of') || 'of'}</span>
            <span className="text-slate-900">{total}</span>
            <span>{t('admin.withdrawals.table.request_plural') || 'Requests'}</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button 
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      page === (i + 1) 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                        : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WithdrawalTable;
