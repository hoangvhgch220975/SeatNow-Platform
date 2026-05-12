import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/config/routes';

/**
 * @file DashboardAuditSection.jsx
 * @description Khu vực kiểm soát bao gồm danh sách các yêu cầu đối tác mới và các yêu cầu rút tiền đang chờ xử lý.
 */

// Component con hiển thị danh sách dạng bảng rút gọn (VI: Simple list component)
const AuditList = ({ title, items, loading, renderItem, emptyLabel, onViewAll }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-[10px] font-bold text-violet-600 hover:text-violet-700 transition-colors uppercase tracking-widest"
          >
            {t('admin.dashboard.audit.view_all')}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items?.length > 0 ? (
          <div className="divide-y divide-slate-50">
            {items.map(renderItem)}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
             <span className="material-symbols-outlined text-4xl mb-2 opacity-20">inventory_2</span>
             <p className="text-xs font-bold">{emptyLabel || 'No data available'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardAuditSection = ({ partnerRequests, withdrawals, loadingRequests, loadingWithdrawals }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleViewAllLeads = () => navigate(ROUTES.ADMIN_RESTAURANTS_PENDING);
  const handleViewAllWithdrawals = () => navigate(ROUTES.ADMIN_RESTAURANTS_PENDING); // Placeholder


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[400px]">
      {/* Recent Partner Leads */}
      <AuditList 
        title={t('admin.dashboard.audit.recent_requests')}
        items={partnerRequests}
        loading={loadingRequests}
        emptyLabel={t('admin.dashboard.audit.empty_requests')}
        onViewAll={handleViewAllLeads}
        renderItem={(req) => (
          <div key={req?._id || Math.random()} className="px-6 py-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
            <div>
              <p className="text-sm font-bold text-slate-800">{req.restaurantName || req.name}</p>
              <p className="text-[10px] text-slate-400 font-bold">{req.email} • {req.phone}</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 text-[9px] font-black uppercase">
                {t('admin.dashboard.audit.status_new_lead')}
              </span>
              <p className="text-[9px] text-slate-300 mt-1 font-bold">
                {req.createdAt ? format(new Date(req.createdAt), 'dd/MM/yyyy') : '--'}
              </p>
            </div>
          </div>
        )}
      />

      {/* Pending Withdrawals */}
      <AuditList 
        title={t('admin.dashboard.audit.pending_withdrawals')}
        items={withdrawals}
        loading={loadingWithdrawals}
        emptyLabel={t('admin.dashboard.audit.empty_withdrawals')}
        onViewAll={handleViewAllWithdrawals}
        renderItem={(wd) => (
          <div key={wd?._id || Math.random()} className="px-6 py-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-slate-800">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wd?.amount || 0)}
              </p>
              <p className="text-[10px] text-slate-400 font-bold">Ref: {wd?._id?.slice(-8).toUpperCase() || 'N/A'}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[9px] font-black uppercase">
                {t('admin.dashboard.audit.status_pending')}
              </span>
              <button className="mt-1 text-[9px] font-black text-violet-600 hover:underline uppercase">
                {t('admin.dashboard.audit.btn_approve')}
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default DashboardAuditSection;
