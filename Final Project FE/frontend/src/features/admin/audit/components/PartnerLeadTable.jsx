import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Mail, Phone, Clock } from 'lucide-react';
import { formatDateTime } from '../../../../shared/utils/formatDateTime';
import AdminEmptyState from '../../components/AdminEmptyState';

/**
 * @file PartnerLeadTable.jsx
 * @description Bảng danh sách các yêu cầu đăng ký đối tác (Leads).
 * Cột: Tên | SĐT | Email | Requested At | Actions
 */
const PartnerLeadTable = ({ 
  leads = [], 
  loading, 
  onApprove,
  onReject,
  onView,
  pagination,
  onPageChange
}) => {
  const { t } = useTranslation();
  const { page = 1, total = 0, limit = 10 } = pagination ?? {};
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <AdminEmptyState 
        icon={UserPlus}
        title={t('admin.audit.table.empty_leads') || 'No pending partner requests'}
        subtitle={t('admin.audit.subtitle') || 'New requests will appear here'}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <UserPlus size={11} />
                  {t('admin.audit.table.lead_info') || 'Full Name'}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Phone size={11} />
                  Phone
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} />
                  Email
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {t('admin.audit.table.request_date') || 'Requested At'}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                {t('admin.panel.table.actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr
                key={lead._id || lead.id}
                onClick={() => onView(lead)}
                className="hover:bg-violet-50/50 transition-colors duration-150 group cursor-pointer"
              >
                {/* Tên */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-sm flex-shrink-0">
                      {(lead.name || '?')[0].toUpperCase()}
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">
                      {lead.name || '—'}
                    </span>
                  </div>
                </td>

                {/* SĐT */}
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-600 font-mono tracking-tight">
                    {lead.phone || '—'}
                  </span>
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500 font-medium">
                    {lead.email || '—'}
                  </span>
                </td>

                {/* Requested At */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {lead.createdAt ? (
                      <>
                        <span className="text-xs font-bold text-slate-700">
                          {new Date(lead.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(lead.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onReject(lead)}
                      className="px-4 py-2 border border-rose-200 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-md hover:shadow-rose-100 transition-all duration-200 active:scale-95"
                    >
                      {t('common.reject') || 'Reject'}
                    </button>
                    <button
                      onClick={() => onApprove(lead)}
                      className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                    >
                      {t('common.approve') || 'Approve'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {leads.length} / {total} requests
          </span>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  page === i + 1
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerLeadTable;
