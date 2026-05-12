import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../shared/ui/Modal';
import { 
  Hash, 
  Calendar, 
  Store, 
  Tag, 
  Wallet, 
  Banknote, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  History, 
  Receipt,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatDateTime } from '../../../../shared/utils/formatDateTime';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

/**
 * @file TransactionDetailDialog.jsx
 * @description Dialog hiển thị chi tiết đầy đủ thông tin một giao dịch Admin.
 */
const TransactionDetailDialog = ({ isOpen, onClose, transaction, getTypeStyle, getStatusStyle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!transaction) return null;

  const style = getTypeStyle(transaction.type);
  const statusStyle = getStatusStyle(transaction.status);
  const TypeIcon = style.icon;

  const InfoRow = ({ icon: Icon, label, value, valueClass = "text-slate-900" }) => (
    <div className="flex flex-col py-3 border-b border-slate-50 last:border-0 group">
      <div className="flex items-center gap-3 mb-1.5">
        <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-500 transition-colors shadow-sm">
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-sm font-bold pl-10 ${valueClass}`}>
        {value}
      </div>
    </div>
  );

  const FinancialRow = ({ label, amount, type = 'neutral' }) => {
    let colorClass = 'text-slate-900';
    let prefix = '';

    if (type === 'positive') {
      colorClass = 'text-green-600';
      prefix = '+';
    } else if (type === 'negative') {
      colorClass = 'text-red-600';
      prefix = '';
    }

    return (
      <div className="flex items-center justify-between py-2.5">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className={`text-sm font-black ${colorClass}`}>
          {prefix}{formatCurrency(amount)}
        </span>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('admin.transactions.table.title') || "Chi tiết Giao dịch"}
    >
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex flex-col items-center justify-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div className={`p-4 rounded-full ${style.bg} ${style.text} mb-3 shadow-sm`}>
            <TypeIcon size={32} />
          </div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${style.text} mb-1`}>
            {style.label}
          </h4>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyle.pill}`}>
              {statusStyle.label}
            </span>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="space-y-1">
          <InfoRow 
            icon={Hash} 
            label={t('admin.transactions.table.id')} 
            value={transaction.id} 
            valueClass="font-mono text-[11px] text-slate-500 break-all max-w-[180px]"
          />
          <InfoRow 
            icon={Store} 
            label={t('admin.transactions.table.restaurant')} 
            value={transaction.restaurantName} 
          />
          <InfoRow 
            icon={Calendar} 
            label={t('admin.transactions.table.date')} 
            value={formatDateTime(transaction.createdAt)} 
          />
        </div>

        {/* Financial Breakdown */}
        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-3 bg-violet-500 rounded-full" />
            <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              {t('admin.transactions.table.financial_breakdown')}
            </h5>
          </div>
          
          <FinancialRow 
            label={t('admin.transactions.table.total_amount')} 
            amount={transaction.amount} 
            type={['WITHDRAWAL', 'REFUND'].includes(transaction.type) ? 'negative' : 'positive'}
          />

          {transaction.type === 'SETTLEMENT' && (
            <>
              <div className="h-px bg-slate-50 my-1" />
              <FinancialRow 
                label={t('admin.transactions.table.commission_amount')} 
                amount={transaction.commissionAmount} 
                type="negative"
              />
              <FinancialRow 
                label={t('admin.transactions.table.net_amount')} 
                amount={Math.max(0, transaction.netAmount || 0)} 
                type="positive"
              />
            </>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center gap-2 justify-center text-slate-400">
            <div className="p-1 px-2 rounded bg-slate-100 flex items-center gap-1.5">
              <Info size={12} />
              <span className="text-[10px] font-medium uppercase tracking-widest opacity-80">
                {t('admin.transactions.table.footer_hint') || "SeatNow Financial Secure"}
              </span>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionDetailDialog;
