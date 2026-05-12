import React from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { 
  UserPlus, 
  Store, 
  Wallet, 
  CheckCircle, 
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import clsx from 'clsx';
import useAdminNotificationStore from '../../hooks/useAdminNotificationStore';

/**
 * @file AdminNotificationItem.jsx
 * @description Component hiển thị từng mục thông báo Admin trong dropdown.
 */
const AdminNotificationItem = ({ notification, onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const markAsRead = useAdminNotificationStore((state) => state.markAsRead);

  const { type, title, message, createdAt, isRead } = notification;

  // Cấu hình Icon và Màu sắc (Vietnamese: Cấu hình phong cách biểu tượng)
  const getConfig = () => {
    switch (type) {
      case 'PARTNER_REQUEST_SUBMITTED':
        return { icon: UserPlus, color: 'text-violet-500', bgColor: 'bg-violet-50' };
      case 'RESTAURANT_CREATED':
        return { icon: Store, color: 'text-blue-500', bgColor: 'bg-blue-50' };
      case 'WITHDRAWAL_REQUESTED':
        return { icon: Wallet, color: 'text-amber-500', bgColor: 'bg-amber-50' };
      case 'TRANSACTION_TOPUP':
        return { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
      case 'COMMISSION_SETTLED':
        return { icon: ShieldAlert, color: 'text-blue-500', bgColor: 'bg-blue-50' };
      default:
        return { icon: ShieldAlert, color: 'text-slate-500', bgColor: 'bg-slate-50' };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const handleClick = () => {
    markAsRead(notification.id);
    
    // Logic điều hướng (Vietnamese: Điều hướng khi click)
    // Ưu tiên ánh xạ Type để tránh bị Backend ghi đè bằng link chung chung
    let targetPath = '';

    switch (type) {
      case 'PARTNER_REQUEST_SUBMITTED':
      case 'RESTAURANT_CREATED':
        // Dẫn tới trang phê duyệt đối tác và nhà hàng (Audit)
        targetPath = '/admin/partner-requests';
        break;
      case 'WITHDRAWAL_REQUESTED':
        // Dẫn tới trang quản lý rút tiền (Payout)
        targetPath = '/admin/withdrawals';
        break;
      case 'TRANSACTION_TOPUP':
      case 'COMMISSION_SETTLED':
        // Dẫn tới trang quản lý giao dịch (Transactions)
        targetPath = '/admin/transactions';
        break;
      default:
        // Nếu không khớp các loại trên, sử dụng link từ BE nếu có
        const rawLink = notification.link || notification.metadata?.link;
        if (rawLink) {
          targetPath = rawLink === '/audit-requests' ? '/admin/partner-requests' : rawLink;
        } else {
          targetPath = '/admin';
        }
    }

    if (targetPath) {
      navigate(targetPath);
    }

    if (onClose) onClose();
  };

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: i18n.language === 'vi' ? vi : enUS
  });

  return (
    <div 
      onClick={handleClick}
      className={clsx(
        "group relative flex gap-4 p-5 transition-all cursor-pointer border-b border-slate-50/50 last:border-0 hover:bg-slate-50",
        !isRead && "bg-violet-50/10"
      )}
    >
      <div className={clsx(
        "flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-transparent transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-current/5",
        config.bgColor,
        config.color
      )}>
        <Icon size={22} className="group-hover:rotate-12 transition-transform" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h4 className={clsx(
            "text-sm tracking-tight truncate transition-colors",
            !isRead ? "font-black text-slate-900" : "font-bold text-slate-500"
          )}>
            {title}
          </h4>
          {!isRead && (
            <div className="flex-shrink-0 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-violet-600 ring-4 ring-violet-50"></span>
            </div>
          )}
        </div>
        
        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
          <Clock size={12} />
          <span>{timeAgo}</span>
        </div>
      </div>

      <div className="absolute right-4 bottom-5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
           <ArrowRight size={16} className="text-violet-600" />
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationItem;
