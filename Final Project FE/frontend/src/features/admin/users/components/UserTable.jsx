import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Calendar, Shield, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../../../../shared/ui/Badge';
import AdminEmptyState from '../../components/AdminEmptyState';

/**
 * @file UserTable.jsx
 * @description Bảng hiển thị danh sách người dùng dành cho Admin.
 */

const UserTable = ({ 
  users = [], 
  loading, 
  onDelete,
  pagination
}) => {
  const { t } = useTranslation();
  const { page = 1, total = 0, limit = 20 } = pagination ?? {};
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

  if (users.length === 0) {
    return (
      <AdminEmptyState 
        icon={User}
        title={t('admin.users.empty') || 'No users found'}
        subtitle={t('admin.users.subtitle') || 'Registered users will appear here'}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User size={11} />
                  {t('admin.users.table.user')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Shield size={11} />
                  {t('admin.users.table.role')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} />
                  {t('admin.users.table.email')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Phone size={11} />
                  {t('admin.users.table.phone')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  {t('admin.users.table.joined')}
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-100">
                {t('admin.users.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-violet-50/30 transition-colors duration-150 group"
              >
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-black text-sm shadow-sm flex-shrink-0 group-hover:from-violet-500 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300 overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.fullName} 
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <span className={user.avatar ? 'hidden' : 'flex'}>
                        {(user.fullName || user.email || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 tracking-tight group-hover:text-violet-700 transition-colors">
                      {user.fullName || 'Unnamed User'}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  {user.role === 'RESTAURANT_OWNER' ? (
                    <Badge variant="primary" dot>
                      {t('admin.users.filters.role_owner')}
                    </Badge>
                  ) : user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
                    <Badge variant="warning" dot>
                      {t('admin.role_super_admin') || 'Admin'}
                    </Badge>
                  ) : (
                    <Badge variant="info" dot>
                      {t('admin.users.filters.role_customer')}
                    </Badge>
                  )}
                </td>

                {/* Email */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500 font-semibold font-mono">
                    {user.email}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 font-bold font-mono tracking-tighter">
                    {(() => {
                      const p = user.phone || user.phoneNumber;
                      if (!p) return '—';
                      return p.startsWith('+84') ? '0' + p.slice(3) : p;
                    })()}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    {user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => onDelete(user)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 active:scale-90"
                        title="Delete account"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserTable;
