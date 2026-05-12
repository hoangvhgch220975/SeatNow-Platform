import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Mail, Phone, Calendar, Key, UserMinus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime } from '../../../../shared/utils/formatDateTime';

/**
 * @file OwnerAccountTable.jsx
 * @description Bảng quản trị danh sách tài khoản Chủ nhà hàng với Phân trang.
 */
const OwnerAccountTable = ({ 
  owners = [], 
  loading, 
  pagination = {}, 
  onPageChange,
  onResetPassword,
  onEdit,
  onDelete 
}) => {
  const { t } = useTranslation();
  const { page = 1, total = 0, limit = 5 } = pagination;
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (owners.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Users size={48} className="mx-auto mb-2 opacity-20" />
        <p className="text-sm font-bold uppercase tracking-widest">{t('admin.partners.empty')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.partners.table.owner')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.partners.table.contact')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.partners.table.joined_date')}</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">{t('admin.partners.table.actions.label')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {owners.map((owner) => (
              <tr key={owner._id || owner.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar with Image or Initial */}
                    <div className="relative flex-shrink-0">
                      {owner.avatar ? (
                        <img 
                          src={owner.avatar} 
                          alt={owner.name} 
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-violet-100">
                          {owner.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full title='Active'"></div>
                    </div>
                    
                    <div>
                      <div className="font-black text-slate-900 group-hover:text-violet-600 transition-colors tracking-tight text-base leading-none">
                        {owner.name || owner.fullName || owner.email?.split('@')[0]}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1.5 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        ID: {(owner._id || owner.id)?.slice(-8).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Mail size={12} />
                      </div>
                      {owner.email}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Phone size={12} />
                      </div>
                      {owner.phone || '--'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Calendar size={14} className="text-violet-500" />
                      {owner.createdAt ? formatDateTime(owner.createdAt) : '--'}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter pl-6">Registered Member</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(owner)}
                      className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                      title={t('common.edit')}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onResetPassword(owner)}
                      className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                      title="Reset Password"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(owner)}
                      className="w-9 h-9 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 rounded-xl transition-all shadow-sm hover:shadow-md"
                      title={t('common.delete')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total > limit && (
        <div className="mt-auto px-6 py-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t('common.showing')} <span className="text-slate-700">{owners.length}</span> {t('common.of')} <span className="text-slate-700">{total}</span> {t('admin.partners.title')}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            
            {/* Page numbers (Simplified) */}
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

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-violet-600 hover:border-violet-200 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:border-slate-200 transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAccountTable;
