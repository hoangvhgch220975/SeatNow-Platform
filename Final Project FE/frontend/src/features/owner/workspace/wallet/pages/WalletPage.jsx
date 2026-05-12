import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useWalletBalance, useWalletHistory } from '../hooks';
import WalletBalanceCard from '../components/WalletBalanceCard';
import WithdrawalDialog from '../components/WithdrawalDialog';
import TopUpDialog from '../components/TopUpDialog';
import TransactionTable from '../components/TransactionTable';
import { motion } from 'framer-motion';
import { PlusCircle, ArrowDownCircle } from 'lucide-react';

/**
 * @file WalletPage.jsx
 * @description Trang quản trị Ví & Thanh toán chính cho nhà hàng.
 * Đã được nâng cấp để hỗ trợ nạp tiền và tách biệt các hành động vào dialog.
 */
const WalletPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();

  // State quản lý việc đóng/mở các Dialog tài chính
  // Vietnamese comment: Trạng thái điều khiển việc hiển thị các hộp thoại nạp tiền và rút tiền
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Lấy dữ liệu số dư ví
  const { data: balanceData, isLoading: isBalanceLoading } = useWalletBalance(idOrSlug);
  
  // Lấy lịch sử rút tiền (Backend đã lọc sẵn)
  const { data: payoutData, isLoading: isPayoutLoading } = useWalletHistory(idOrSlug, 'WITHDRAWAL');
  
  // Lấy toàn bộ lịch sử giao dịch gần đây
  const { data: historyData, isLoading: isHistoryLoading } = useWalletHistory(idOrSlug);

  return (
    <div className="space-y-8 pb-12">
      {/* Phần Header của trang */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('wallet.title')}</h1>
          <p className="text-slate-500 mt-1">{t('wallet.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsWithdrawOpen(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
          >
            <ArrowDownCircle size={18} className="text-slate-400" />
            {t('wallet.withdraw_funds')}
          </button>
          
          <button 
            onClick={() => setIsTopUpOpen(true)}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95"
          >
            <PlusCircle size={18} />
            {t('wallet.topup')}
          </button>
        </div>
      </motion.div>

      {/* Phần thẻ KPI Số dư kèm nút hành động */}
      <WalletBalanceCard 
        data={balanceData?.data} 
        isLoading={isBalanceLoading} 
      />

      {/* Grid nội dung chính - Giờ đây sử dụng toàn bộ chiều rộng (12 cột) */}
      <div className="flex flex-col gap-8">
        {/* Lịch sử rút tiền - Chiếm toàn bộ chiều rộng */}
        <TransactionTable 
          title={t('wallet.payout_history')}
          subtitle={t('wallet.withdraw_history_subtitle')}
          transactions={payoutData?.data?.slice(0, 5)} 
          isLoading={isPayoutLoading}
          showViewAll={true}
        />
        
        {/* Lịch sử giao dịch gần đây - Chiếm toàn bộ chiều rộng */}
        <TransactionTable 
          title={t('wallet.recent_transactions')}
          subtitle={t('wallet.transaction_history_subtitle')}
          transactions={historyData?.data?.slice(0, 5)} 
          isLoading={isHistoryLoading}
          showViewAll={true}
        />
      </div>

      {/* Dialog Nạp tiền */}
      {/* Vietnamese comment: Hộp thoại nạp tiền qua MoMo/VNPAY */}
      <TopUpDialog 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        restaurantId={idOrSlug}
      />

      {/* Dialog Rút tiền */}
      {/* Vietnamese comment: Hộp thoại xử lý yêu cầu rút tiền */}
      <WithdrawalDialog 
        isOpen={isWithdrawOpen} 
        onClose={() => setIsWithdrawOpen(false)} 
        availableBalance={balanceData?.data?.balance || 0}
      />
    </div>
  );
};

export default WalletPage;
