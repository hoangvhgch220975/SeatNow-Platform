import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Receipt, 
  Calendar, 
  Wallet,
  ReceiptText,
  User,
  Info,
  Hash
} from 'lucide-react';
import { format } from 'date-fns';
import { useTransactionDetail } from '../hooks';
import { useBookingDetail } from '../../bookings/hooks';
import { ROUTES } from '@/config/routes';
import { formatCurrency } from '@/shared/utils/formatCurrency';

/**
 * @file TransactionDetailPage.jsx
 * @description Trang hiển thị chi tiết một giao dịch cụ thể với thiết kế Bento Grid và Glassmorphism.
 */

const TransactionDetailPage = () => {
  const { t } = useTranslation();
  const { idOrSlug, transactionId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useTransactionDetail(transactionId);
  const transaction = data?.data;

  // Lấy chi tiết booking nếu có bookingId
  const { data: booking, isLoading: isBookingLoading } = useBookingDetail(transaction?.bookingId);

  // Render trạng thái loading
  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-64 bg-slate-100 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-50 animate-pulse rounded-2xl"></div>
          <div className="h-96 bg-slate-50 animate-pulse rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Render trạng thái lỗi hoặc không tìm thấy
  if (error || !transaction) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{t('common.error')}</h2>
        <p className="text-slate-500 max-w-md">Transaction not found or an error occurred while fetching details.</p>
        <button 
          onClick={() => navigate(ROUTES.WORKSPACE_WALLET(idOrSlug))}
          className="px-6 py-2 bg-primary text-white rounded-full font-bold transition-all hover:shadow-lg active:scale-95"
        >
          {t('wallet.transaction_detail.back_to_list')}
        </button>
      </div>
    );
  }

  const isIncome = ['TOP_UP', 'DEPOSIT_PAYMENT', 'SETTLEMENT'].includes(transaction.type);
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700'
  };

  const statusIcons = {
    completed: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    pending: <Clock className="w-5 h-5 text-amber-600" />,
    failed: <XCircle className="w-5 h-5 text-red-600" />
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(ROUTES.WORKSPACE_TRANSACTIONS(idOrSlug))}
            className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-90 group"
          >
            <ArrowLeft size={18} className="text-slate-500 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('wallet.transaction_detail.title')}
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
              {t(`wallet.transaction_detail.types.${transaction.type}`)}
            </p>
          </div>
        </div>
        
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-xs uppercase tracking-widest ${statusColors[transaction.status]}`}>
          {statusIcons[transaction.status]}
          {t(`wallet.status.${transaction.status}`)}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Main Info Card - Bento Item */}
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isIncome ? 'bg-green-50' : 'bg-red-50'}`}>
                {isIncome ? <ArrowDownLeft className="text-green-600" /> : <ArrowUpRight className="text-red-600" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Amount</p>
                {(() => {
                  // Logic tính toán phí thông minh đa nguồn
                  const getCalculatedFee = () => {
                    // 1. Tìm trong Transaction (Các trường phổ biến)
                    let f = transaction.commissionAmount || transaction.commissionFee || transaction.fee || transaction.commission || 0;
                    
                    // 2. Tìm trong Booking liên quan (Nhiều khi tiền phí nằm ở đây)
                    if (f === 0 && booking) {
                      f = booking.commissionAmount || booking.commissionFee || booking.fee || booking.commission || 0;
                    }
                    
                    // 3. Kiểm tra chênh lệch Amount vs netAmount từ API
                    if (f === 0 && transaction.netAmount !== undefined && Math.abs(transaction.amount - transaction.netAmount) > 0) {
                      f = Math.abs(transaction.amount - transaction.netAmount);
                    }

                    // 4. Case đặc biệt: Nợ hoa hồng từ ghi chú
                    if (f === 0 && transaction.type === 'SETTLEMENT' && transaction.description?.toLowerCase().includes('commission debt')) {
                      f = transaction.amount;
                    }
                    
                    return f;
                  };

                  const fee = getCalculatedFee();
                  const netRevenue = transaction.type === 'SETTLEMENT' ? (transaction.amount - fee) : transaction.amount;
                  const isZero = netRevenue === 0;
                  
                  return (
                    <p className={`text-3xl font-black ${isZero ? 'text-slate-400' : (isIncome ? 'text-green-600' : 'text-red-600')}`}>
                      {isZero ? '' : (isIncome ? '+' : '-')}{formatCurrency(Math.abs(netRevenue))}
                    </p>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Hash size={12} /> {t('wallet.transaction_detail.transaction_id')}
              </p>
              <p className="text-sm font-bold text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                {transactionId}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} /> {t('wallet.transaction_detail.created_at')}
              </p>
              <p className="text-sm font-bold text-slate-700">
                {format(new Date(transaction.createdAt), 'PPPP p')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CreditCard size={12} /> {t('wallet.transaction_detail.method')}
              </p>
              <p className="text-sm font-bold text-slate-700">
                {transaction.withdrawMethod || transaction.provider || 'System Wallet'}
              </p>
            </div>

            {transaction.referenceCode && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Hash size={12} /> {t('wallet.transaction_detail.reference_code')}
                </p>
                <p className="text-sm font-bold text-slate-700">{transaction.referenceCode}</p>
              </div>
            )}

            {transaction.providerTxnId && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Hash size={12} /> {t('wallet.transaction_detail.provider_txn_id')}
                </p>
                <p className="text-sm font-bold text-slate-700">{transaction.providerTxnId}</p>
              </div>
            )}

            <div className="space-y-1 sm:col-span-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <ReceiptText size={12} /> {t('wallet.transaction_detail.description')}
              </p>
              <p className="text-sm font-bold text-slate-700 leading-relaxed">
                {transaction.description || 'No additional information.'}
              </p>
            </div>
          </div>

          {/* Timeline - Bento Item Detail */}
          <div className="mt-auto p-8 bg-slate-50/50 border-t border-slate-50">
             <div className="flex items-center justify-between gap-2 max-w-md overflow-x-auto pb-2">
                <div className="flex flex-col items-center gap-2 relative">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center z-10">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{t('wallet.transaction_detail.timeline.created')}</span>
                  <div className="absolute top-4 left-8 w-full h-[2px] bg-green-500"></div>
                </div>
                
                <div className="flex flex-col items-center gap-2 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${transaction.status !== 'pending' ? 'bg-green-500 text-white' : 'bg-amber-100 text-amber-600 ring-4 ring-amber-50'}`}>
                    {transaction.status === 'pending' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{t('wallet.transaction_detail.timeline.processing')}</span>
                  <div className={`absolute top-4 left-8 w-full h-[2px] ${transaction.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    transaction.status === 'completed' ? 'bg-green-500 text-white' : 
                    transaction.status === 'failed' ? 'bg-red-500 text-white' : 
                    'bg-slate-100 text-slate-300'
                  }`}>
                    {transaction.status === 'completed' ? <CheckCircle2 size={16} /> : transaction.status === 'failed' ? <XCircle size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">
                    {transaction.status === 'failed' ? t('wallet.transaction_detail.timeline.failed') : t('wallet.transaction_detail.timeline.completed')}
                  </span>
                  {(transaction.completedAt || transaction.failedAt) && (
                    <span className="text-[8px] font-bold text-slate-400">
                      {format(new Date(transaction.completedAt || transaction.failedAt), 'HH:mm dd/MM/yy')}
                    </span>
                  )}
                </div>
             </div>
          </div>
        </motion.div>

        {/* Sidebar Info - Related Data */}
        <div className="space-y-6">
          {/* Breakdown Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4"
          >
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Info size={16} className="text-primary" /> {t('wallet.transaction_detail.breakdown_title', 'Flow Breakdown')}
            </h3>
            <div className="space-y-3">
              {(() => {
                // Sử dụng cùng logic tính phí đa nguồn
                const getCalculatedFee = () => {
                  let f = transaction.commissionAmount || transaction.commissionFee || transaction.fee || transaction.commission || 0;
                  if (f === 0 && booking) {
                    f = booking.commissionAmount || booking.commissionFee || booking.fee || booking.commission || 0;
                  }
                  if (f === 0 && transaction.netAmount !== undefined && Math.abs(transaction.amount - transaction.netAmount) > 0) {
                    f = Math.abs(transaction.amount - transaction.netAmount);
                  }
                  if (f === 0 && transaction.type === 'SETTLEMENT' && transaction.description?.toLowerCase().includes('commission debt')) {
                    f = transaction.amount;
                  }
                  return f;
                };

                const fee = getCalculatedFee();
                const netRevenue = transaction.type === 'SETTLEMENT' ? (transaction.amount - fee) : (transaction.netAmount !== undefined ? transaction.netAmount : transaction.amount);
                const isZeroNet = netRevenue === 0;

                return (
                  <>
                    <div className="flex justify-between items-center text-xs font-bold py-2 border-b border-slate-50">
                      <span className="text-slate-400">{t('wallet.transaction_detail.total_gross')}</span>
                      <span className="text-slate-900">{formatCurrency(transaction.amount)}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold py-2 border-b border-slate-50">
                      <span className="text-slate-400">{t('wallet.transaction_detail.system_fee')}</span>
                      <span className="text-red-500">-{formatCurrency(fee)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-black py-2 mt-2">
                      <span className="text-slate-900">{t('wallet.transaction_detail.net_revenue')}</span>
                      <span className={isZeroNet ? 'text-slate-400' : (isIncome ? 'text-green-600' : 'text-red-600')}>
                        {isZeroNet ? '' : (isIncome ? '+' : '-')}{formatCurrency(Math.abs(netRevenue))}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>

          {/* Related Booking - If exists */}
          {transaction.bookingId && (
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-violet-600 via-indigo-700 to-indigo-900 rounded-3xl p-6 shadow-xl shadow-violet-200/50 text-white space-y-4 relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl"></div>

              <h3 className="text-sm font-black flex items-center gap-2 relative z-10">
                <Receipt className="text-violet-200" size={16} /> {t('wallet.transaction_detail.booking_info')}
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 p-0.5 ring-2 ring-white/10 flex items-center justify-center overflow-hidden">
                    {booking?.customerAvatar || transaction.customerAvatar ? (
                      <img 
                        src={booking?.customerAvatar || transaction.customerAvatar} 
                        alt={booking?.customerName || transaction.customerName} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-violet-400/30">
                        <User size={20} className="text-violet-100" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-violet-200/80 font-bold uppercase tracking-tighter">{t('wallet.transaction_detail.customer')}</p>
                    <p className="text-base font-black truncate max-w-[150px]">
                      {isBookingLoading ? 'Loading...' : (booking?.customerName || transaction.customerName || 'N/A')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-[9px] text-violet-200/70 font-bold uppercase mb-1">{t('wallet.transaction_detail.booking_code')}</p>
                    <p className="text-xs font-black text-white uppercase tracking-wider">
                      {isBookingLoading ? '...' : (booking?.bookingCode || transaction.bookingCode || 'N/A')}
                    </p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                    <p className="text-[9px] text-violet-200/70 font-bold uppercase mb-1">{t('wallet.transaction_detail.table')}</p>
                    <p className="text-xs font-black text-white">
                      {isBookingLoading ? '...' : `${booking?.tableNumber || transaction.tableNumber || 'N/A'} (${booking?.tableLocation || transaction.tableLocation || 'Main'})`}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => navigate(ROUTES.WORKSPACE_BOOKING_DETAIL(idOrSlug, transaction.bookingId))}
                  className="w-full py-3.5 bg-white text-violet-700 hover:bg-violet-50 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('wallet.transaction_detail.view_booking_details', 'View Booking Details')}
                </button>
              </div>
            </motion.div>
          )}

          {/* View Receipt Fake Button */}
          <button className="w-full bg-slate-50 border border-slate-100 text-slate-600 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
            <ReceiptText size={18} />
            {t('wallet.transaction_detail.view_receipt')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionDetailPage;
