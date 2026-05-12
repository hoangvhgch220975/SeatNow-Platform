import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Search, History } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { formatCurrency } from '@/shared/utils/formatCurrency';
import { TRANSACTION_TYPES } from './TransactionTypeFilter';

/**
 * @file TransactionTable.jsx
 * @description Bảng hiển thị lịch sử giao dịch ví của nhà hàng với đầy đủ các cột.
 * Hỗ trợ cả dạng tóm tắt (giới hạn số dòng) và dạng đầy đủ (trang All Transactions).
 */

const TransactionTable = ({
  transactions,
  isLoading,
  title,
  subtitle = 'Real-time activity ledger',
  showViewAll = true,
  hideHeader = false,
  className = ''
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idOrSlug } = useParams();

  // Điều hướng sang trang lịch sử giao dịch đầy đủ (Vietnamese comment)
  const handleViewAll = () => {
    navigate(ROUTES.WORKSPACE_TRANSACTIONS(idOrSlug));
  };

  // Skeleton loading state (Vietnamese comment)
  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 p-8 space-y-4 ${className}`}>
        <div className="h-6 w-48 bg-slate-100 rounded animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { y: 8, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col ${className}`}>
      {/* Header */}
      {!hideHeader && (
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title || t('wallet.recent_transactions')}</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">{subtitle}</p>
          </div>
          <button
            onClick={handleViewAll}
            className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors hover:bg-primary/5"
          >
            <Search size={18} />
          </button>
        </div>
      )}

      {/* Table body */}
      <div className="overflow-x-auto">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="min-w-0">
          {transactions?.length > 0 ? (
            <table className="w-full text-sm">
              {/* Hàng tiêu đề cột */}
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction</th>
                  <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                  <th className="px-3 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-3 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-3 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>

                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => {
                  // Xác định giao dịch là dòng tiền ra (rút tiền, hoa hồng, hoàn tiền) (Vietnamese comment)
                  const isOutflow = ['WITHDRAWAL', 'COMMISSION', 'REFUND'].includes(tx.type);
                  const isIncome = !isOutflow;

                  const isDeposit = tx.type === 'DEPOSIT_PAYMENT';
                  const hasAvatar = isDeposit && tx.customerAvatar;

                  return (
                    <motion.tr
                      key={tx.id}
                      variants={itemVariants}
                      onClick={() => navigate(ROUTES.WORKSPACE_TRANSACTION_DETAIL(idOrSlug, tx.id))}
                      className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    >
                      {/* Cột mô tả giao dịch + tên khách */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${isIncome ? 'bg-green-50' : 'bg-red-50'}`}>
                            {hasAvatar ? (
                              <img src={tx.customerAvatar} alt={tx.customerName} className="w-full h-full object-cover" />
                            ) : isIncome ? (
                              <ArrowDownLeft className="w-5 h-5 text-green-600" />
                            ) : (
                              <ArrowUpRight className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[160px]">
                              {tx.description || t(`wallet.transaction_detail.types.${tx.type}`)}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              {tx.bookingCode && (
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                                  {tx.bookingCode}
                                </span>
                              )}
                              {isDeposit && tx.customerName && (
                                <p className="text-[10px] text-slate-400 font-medium">{tx.customerName}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột ngày & giờ */}
                      <td className="px-3 py-4 whitespace-nowrap">
                        <p className={`text-[11px] font-bold text-slate-700`}>
                          {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {format(new Date(tx.createdAt), 'HH:mm')}
                        </p>
                      </td>

                      {/* Cột loại giao dịch — màu theo loại */}
                      <td className="px-3 py-4">
                        {(() => {
                          const typeInfo = TRANSACTION_TYPES.find((t) => t.value === tx.type);
                          return (
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap ${typeInfo?.color || 'bg-slate-100 text-slate-500'}`}>
                              {t(`wallet.transaction_detail.types.${tx.type}`)}
                            </span>
                          );
                        })()}
                      </td>

                      {/* Cột trạng thái */}
                      <td className="px-3 py-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                          tx.status === 'pending'   ? 'bg-amber-100 text-amber-700' :
                                                      'bg-red-100 text-red-700'
                        }`}>
                          {t(`wallet.status.${tx.status}`)}
                        </span>
                      </td>

                      {/* Cột số tiền biến động */}
                      <td className="px-3 py-4 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end">
                          {(() => {
                            const fee = tx.commissionAmount || tx.commissionFee || tx.fee || tx.commission || 0;
                            const headlineAmount = tx.type === 'SETTLEMENT' ? (tx.amount - fee) : tx.amount;
                            const isZero = headlineAmount === 0;
                            return (
                              <p className={`font-extrabold tracking-tight ${isZero ? 'text-slate-400' : (isIncome ? 'text-green-600' : 'text-red-600')}`}>
                                {isZero ? '' : (isIncome ? '+' : '-')}{formatCurrency(Math.abs(headlineAmount))}
                              </p>
                            );
                          })()}
                          
                          {/* Bóc tách phí cho loại SETTLEMENT (Giải ngân tiền cọc) */}
                          {tx.type === 'SETTLEMENT' && (
                            <div className="mt-1 space-y-0.5 border-t border-slate-50 pt-1">
                              <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold">
                                <span className="text-slate-400 capitalize">{t('wallet.commission_fee')}:</span>
                                <span className="text-red-500">
                                  -{formatCurrency(tx.commissionAmount || tx.commissionFee || tx.fee || tx.commission || 0)}
                                </span>
                              </div>
                              <div className="flex items-center justify-end gap-1.5 text-[9px] font-black">
                                <span className="text-slate-400 capitalize">{t('wallet.net_amount')}:</span>
                                {(() => {
                                  const fee = tx.commissionAmount || tx.commissionFee || tx.fee || tx.commission || 0;
                                  const netAmountCalculated = tx.type === 'SETTLEMENT' ? (tx.amount - fee) : tx.amount;
                                  const isZeroNet = netAmountCalculated === 0;
                                  return (
                                    <span className={isZeroNet ? 'text-slate-400' : 'text-green-600'}>
                                      {isZeroNet ? '' : (netAmountCalculated > 0 ? '+' : '')}{formatCurrency(Math.abs(netAmountCalculated))}
                                    </span>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>


                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            // Trạng thái rỗng khi không có dữ liệu (Vietnamese comment)
            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <History className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">{t('activity.no_activity')}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer: View All button */}
      {showViewAll && (
        <div className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
          <button
            onClick={handleViewAll}
            className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
          >
            {t('common.view_all')}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
