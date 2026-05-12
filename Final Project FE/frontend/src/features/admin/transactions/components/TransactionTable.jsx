import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  ExternalLink,
  Wallet,
  Receipt,
  PlusCircle,
  Banknote
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';
import TransactionDetailDialog from './TransactionDetailDialog';

/**
 * @file TransactionTable.jsx
 * @description Data table for system transactions with color coding and link to bookings.
 */
const TransactionTable = ({ transactions = [], loading = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State quản lý xem chi tiết giao dịch
  const [selectedTx, setSelectedTx] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleRowClick = (tx) => {
    setSelectedTx(tx);
    setIsDetailOpen(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'DEPOSIT_PAYMENT':
        return { 
            bg: 'bg-green-100', 
            text: 'text-green-700', 
            icon: Wallet, 
            label: t('admin.transactions.filters.type_deposit')
        };
      case 'SETTLEMENT':
        return { 
            bg: 'bg-blue-100', 
            text: 'text-blue-700', 
            icon: Banknote, 
            label: t('admin.transactions.filters.type_settlement')
        };
      case 'COMMISSION':
        return { 
            bg: 'bg-purple-100', 
            text: 'text-purple-700', 
            icon: ArrowUpRight, 
            label: t('admin.transactions.filters.type_commission')
        };
      case 'WITHDRAWAL':
        return { 
            bg: 'bg-red-100', 
            text: 'text-red-700', 
            icon: ArrowDownLeft, 
            label: t('admin.transactions.filters.type_withdrawal')
        };
      case 'TOP_UP':
        return { 
            bg: 'bg-teal-100', 
            text: 'text-teal-700', 
            icon: PlusCircle, 
            label: t('admin.transactions.filters.type_topup')
        };
      case 'REFUND':
        return { 
            bg: 'bg-amber-100', 
            text: 'text-amber-700', 
            icon: History, 
            label: t('admin.transactions.filters.type_refund')
        };
      default:
        return { 
            bg: 'bg-slate-100', 
            text: 'text-slate-700', 
            icon: Receipt, 
            label: type
        };
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return {
          pill: 'bg-green-100 text-green-700 border-green-200',
          dot: 'bg-green-500',
          label: t('admin.transactions.filters.status_completed')
        };
      case 'PENDING':
        return {
          pill: 'bg-amber-100 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 animate-pulse',
          label: t('admin.transactions.filters.status_pending')
        };
      case 'FAILED':
      case 'CANCELLED':
        return {
          pill: 'bg-red-100 text-red-700 border-red-200',
          dot: 'bg-red-500',
          label: t('admin.transactions.filters.status_failed')
        };
      default:
        return {
          pill: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <History size={40} className="text-slate-200" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{t('admin.transactions.table.no_data')}</h3>
        <p className="text-slate-400 text-sm max-w-xs mt-1">
          {t('common.no_data_desc') || 'Try adjusting your filters to find what you are looking for.'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="px-6 pb-2">{t('admin.transactions.table.id')}</th>
            <th className="px-6 pb-2">{t('admin.transactions.table.date')}</th>
            <th className="px-6 pb-2">{t('admin.transactions.table.restaurant')}</th>
            <th className="px-6 pb-2">{t('admin.transactions.table.type')}</th>
            <th className="px-6 pb-2">{t('admin.transactions.table.amount')}</th>
            <th className="px-6 pb-2">{t('admin.transactions.table.status')}</th>
            <th className="px-6 pb-2 text-center">{t('admin.transactions.table.action')}</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const style = getTypeStyle(tx.type);
            const Icon = style.icon;
            
            return (
              <tr 
                key={tx.id} 
                onClick={() => handleRowClick(tx)}
                className="group transition-all hover:translate-x-1 cursor-pointer hover:bg-slate-50/50"
              >
                <td className="px-6 py-4 bg-white border-y border-l border-slate-100 rounded-l-[20px] shadow-sm">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {tx.id?.length > 10 
                      ? `#${tx.id.substring(0, 3)}...${tx.id.substring(tx.id.length - 3)}` 
                      : `#${tx.id}`}
                  </span>
                </td>
                <td className="px-6 py-4 bg-white border-y border-slate-100 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{formatDate(tx.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 bg-white border-y border-slate-100 shadow-sm">
                  <span className="text-sm font-medium text-slate-600">{tx.restaurantName || 'System'}</span>
                </td>
                <td className="px-6 py-4 bg-white border-y border-slate-100 shadow-sm">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${style.bg} ${style.text} text-[10px] font-black uppercase tracking-tight`}>
                    <Icon size={12} strokeWidth={3} />
                    {style.label}
                  </div>
                </td>
                <td className="px-6 py-4 bg-white border-y border-slate-100 shadow-sm">
                  <div className="flex flex-col">
                    {(() => {
                      const displayAmount = (tx.type === 'SETTLEMENT' && tx.netAmount < 0) ? 0 : tx.amount;
                      const isNegative = ['WITHDRAWAL', 'REFUND'].includes(tx.type);
                      const finalValue = isNegative ? -displayAmount : displayAmount;
                      
                      let colorClass = 'text-slate-400';
                      let prefix = '';
                      
                      if (finalValue > 0) {
                        colorClass = 'text-green-600 font-bold';
                        prefix = '+';
                      } else if (finalValue < 0) {
                        colorClass = 'text-red-600 font-bold';
                        prefix = '';
                      }

                      return (
                        <span className={`text-sm ${colorClass}`}>
                          {prefix}{formatCurrency(finalValue)}
                        </span>
                      );
                    })()}
                    
                    {/* Bóc tách dòng tiền cho giao dịch SETTLEMENT (Giải ngân) */}
                    {tx.type === 'SETTLEMENT' && (tx.netAmount !== undefined || tx.commissionAmount !== undefined) && (
                      <div className="mt-2 pt-2 border-t border-slate-50 flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                            {t('admin.transactions.table.commission_amount')}:
                          </span>
                          <span className="text-[10px] font-bold text-rose-500 whitespace-nowrap">
                            -{formatCurrency(tx.commissionAmount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                            {t('admin.transactions.table.net_amount')}:
                          </span>
                          <span className="text-[10px] font-bold text-green-600 whitespace-nowrap">
                            {tx.netAmount > 0 ? '+' : ''}{formatCurrency(Math.max(0, tx.netAmount || 0))}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 bg-white border-y border-slate-100 shadow-sm">
                  {(() => {
                    const statusStyle = getStatusStyle(tx.status);
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${statusStyle.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </div>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 bg-white border-y border-r border-slate-100 rounded-r-[20px] shadow-sm text-center">
                  <div className="flex items-center justify-center gap-2">
                    {tx.bookingId && (
                      <button 
                         onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/bookings?search=${tx.bookingId}`);
                         }}
                         className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                         title={t('admin.transactions.table.view_booking')}
                      >
                         <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Modal chi tiết giao dịch */}
      <TransactionDetailDialog 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        transaction={selectedTx}
        getTypeStyle={getTypeStyle}
        getStatusStyle={getStatusStyle}
      />
    </div>
  );
};

export default TransactionTable;
