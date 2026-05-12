import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * @file AdminNotificationToast.jsx
 * @description Redesigned Admin Toast: Light Glassmorphism style, synchronized with System Theme.
 * Updated: Restored and improved navigation logic.
 */
const AdminNotificationToast = ({ t, payload }) => {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();

  const handleNav = (e) => {
    // Ngăn chặn sự kiện lan tỏa nếu cần
    e?.stopPropagation();
    
    // Đóng toast
    toast.dismiss(t.id);
    
    const type = payload.type || payload.event;
    let targetPath = '';

    // 1. Ưu tiên ánh xạ theo Type để đảm bảo độ chính xác
    switch (type) {
      case 'PARTNER_REQUEST_SUBMITTED':
      case 'RESTAURANT_CREATED':
        targetPath = '/admin/partner-requests';
        break;
      case 'WITHDRAWAL_REQUESTED':
        targetPath = '/admin/withdrawals';
        break;
      case 'TRANSACTION_TOPUP':
      case 'COMMISSION_SETTLED':
        targetPath = '/admin/transactions';
        break;
      default:
        // 2. Dự phòng: Sử dụng link trực tiếp từ payload nếu có
        const rawLink = payload.link || payload.data?.link || payload.metadata?.link;
        if (rawLink) {
          targetPath = rawLink.includes('/audit-requests') || rawLink.includes('/partner-requests')
            ? '/admin/partner-requests'
            : rawLink;
        } else {
          targetPath = '/admin';
        }
    }

    if (targetPath) {
      navigate(targetPath);
    }
  };

  const getConfigs = () => {
    switch (payload.type) {
      case 'PARTNER_REQUEST_SUBMITTED':
        return {
          icon: 'person_add',
          iconColor: 'text-indigo-600',
          iconBg: 'bg-indigo-50',
          badge: 'NEW LEAD',
        };
      case 'RESTAURANT_CREATED':
        return {
          icon: 'storefront',
          iconColor: 'text-amber-600',
          iconBg: 'bg-amber-50',
          badge: 'NEW VENUE',
        };
      case 'WITHDRAWAL_REQUESTED':
        return {
          icon: 'payments',
          iconColor: 'text-emerald-600',
          iconBg: 'bg-emerald-50',
          badge: 'PAYOUT',
        };
      default:
        return {
          icon: 'admin_panel_settings',
          iconColor: 'text-slate-600',
          iconBg: 'bg-slate-50',
          badge: 'SYSTEM',
        };
    }
  };

  const config = getConfigs();
  const metadata = payload.metadata || payload.data || {};

  // Sử dụng tiêu đề từ bản dịch nếu có, nếu không thì dùng payload.title
  const displayTitle = translate(`notifications.types.${payload.type}`) !== `notifications.types.${payload.type}`
    ? translate(`notifications.types.${payload.type}`)
    : payload.title;

  return (
    <div
      onClick={handleNav}
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-sm w-full bg-white/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] pointer-events-auto flex ring-1 ring-slate-900/5 overflow-hidden border border-white/40 cursor-pointer group hover:bg-white transition-all duration-300`}
    >
      <div className="flex-1 w-0 p-5">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={`h-12 w-12 rounded-2xl ${config.iconBg} flex items-center justify-center ${config.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
              <span className="material-symbols-outlined font-black text-2xl">
                {config.icon}
              </span>
            </div>
          </div>
          
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-[0.15em] ${config.iconColor} opacity-80`}>
                {config.badge}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Secure Alert</span>
            </div>
            
            <h3 className="mt-1 text-sm font-black text-slate-900 leading-tight tracking-tight">
              {displayTitle}
            </h3>

            {/* Metadata Area */}
            {(metadata.name || metadata.fullName) ? (
              <div className="mt-2.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[14px] ${config.iconColor}`}>person</span>
                  <p className="text-[12px] text-slate-700 font-bold">
                    {metadata.name || metadata.fullName}
                  </p>
                </div>
                {metadata.email && (
                  <div className="flex items-center gap-1.5 ml-0.5">
                    <p className="text-[11px] text-slate-400 font-medium truncate max-w-[180px] ml-5">
                      {metadata.email}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                {payload.message}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase tracking-wider ${config.iconColor} flex items-center gap-1 group-hover:translate-x-1 transition-all`}>
                {translate('common.view_details') || 'View Details'} <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 font-bold uppercase tracking-tighter">
                Admin Console
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-l border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t.id);
          }}
          className="w-12 border border-transparent rounded-none rounded-r-2xl flex items-center justify-center text-slate-300 hover:text-slate-900 transition-colors duration-300"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNotificationToast;
