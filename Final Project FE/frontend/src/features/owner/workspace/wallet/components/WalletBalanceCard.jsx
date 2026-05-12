import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Wallet, Clock, History, CreditCard, ArrowUpRight, PlusCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/formatCurrency';

/**
 * @file WalletBalanceCard.jsx
 * @description Component hiển thị các thẻ KPI tài chính cho ví nhà hàng kèm các nút hành động.
 */

const WalletBalanceCard = ({ data, isLoading }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-2xl shadow-sm border border-slate-50"></div>
        ))}
      </div>
    );
  }

  const {
    balance = 0,
    lockedAmount = 0,
    pendingWithdrawal = 0,
    totalWithdrawnSuccess = 0
  } = data || {};

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Lưới các thẻ KPI số dư */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Số dư hiện tại (Main Balance) */}
        <motion.div 
          variants={itemVariants}
          className="bg-primary text-white p-6 rounded-2xl relative overflow-hidden group shadow-lg shadow-primary/20 flex flex-col h-48"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">{t('wallet.balance')}</h3>
            </div>
            <p className="text-4xl font-black mt-auto tracking-tight">{formatCurrency(balance)}</p>
            <p className="text-[10px] text-white/60 mt-4 font-bold uppercase tracking-widest">{t('wallet.available_funds')}</p>
          </div>
        </motion.div>

        {/* Tiền chờ duyệt (Pending) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:border-primary/20 transition-colors h-48"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('wallet.pending')}</h3>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 mt-auto">{formatCurrency(pendingWithdrawal)}</p>
          <p className="text-[10px] text-slate-400 mt-4 font-bold flex items-center gap-1 uppercase">
            <History className="w-3 h-3" /> {t('wallet.release_period')}
          </p>
        </motion.div>

        {/* Tiền hoa hồng tạm giữ (Locked) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:border-primary/20 transition-colors h-48"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('wallet.locked')}</h3>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 mt-auto">{formatCurrency(lockedAmount)}</p>
          <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase">{t('wallet.service_fees')}</p>
        </motion.div>

        {/* Tổng đã rút (Total Success) */}
        <motion.div 
          variants={itemVariants}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col group hover:border-primary/20 transition-colors h-48"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{t('wallet.total_withdrawn')}</h3>
          </div>
          <p className="text-3xl font-extrabold tracking-tight text-slate-900 mt-auto">{formatCurrency(totalWithdrawnSuccess)}</p>
          <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase">{t('wallet.lifetime_earnings')}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WalletBalanceCard;
