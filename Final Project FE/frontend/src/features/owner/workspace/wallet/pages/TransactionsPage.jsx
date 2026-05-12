import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useWalletHistory } from '../hooks';
import TransactionTable from '../components/TransactionTable';
import TransactionTypeFilter, { TRANSACTION_TYPES } from '../components/TransactionTypeFilter';
import TransactionPagination from '../components/TransactionPagination';
import { motion } from 'framer-motion';
import { ChevronLeft, Download } from 'lucide-react';
import { ROUTES } from '@/config/routes';

/**
 * @file TransactionsPage.jsx
 * @description Trang hiển thị toàn bộ lịch sử giao dịch của ví nhà hàng.
 * Hỗ trợ phân trang (10 dòng/trang) và bộ lọc theo loại giao dịch.
 * Logic lọc và phân trang xử lý ở đây, UI tách ra thành các component riêng.
 */

const PAGE_SIZE = 10;

const TransactionsPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate     = useNavigate();

  // State: trang hiện tại, bộ lọc type, trạng thái dropdown (Vietnamese comment)
  const [currentPage,  setCurrentPage]  = useState(1);
  const [activeType,   setActiveType]   = useState('ALL');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Lấy toàn bộ giao dịch (limit lớn, lọc phía client) (Vietnamese comment)
  const { data: historyData, isLoading } = useWalletHistory(idOrSlug, '', 1000);
  const allTransactions = historyData?.data || [];

  // Lọc theo type đang active (Vietnamese comment)
  const filteredTransactions = useMemo(() => {
    if (activeType === 'ALL') return allTransactions;
    return allTransactions.filter((tx) => tx.type === activeType);
  }, [allTransactions, activeType]);

  const totalItems = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  // Cắt dữ liệu theo trang hiện tại (Vietnamese comment)
  const pagedTransactions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredTransactions.slice(start, start + PAGE_SIZE);
  }, [filteredTransactions, currentPage]);

  // Reset về trang 1 khi đổi filter (Vietnamese comment)
  const handleTypeChange = (type) => {
    setActiveType(type);
    setCurrentPage(1);
    setDropdownOpen(false);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => navigate(ROUTES.WORKSPACE_WALLET(idOrSlug));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('wallet.all_transactions')}
            </h1>
            <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">
              {t('wallet.transaction_history_full')} • {t('common.page')} {currentPage} / {totalPages}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Bộ lọc theo loại giao dịch */}
          <TransactionTypeFilter
            activeType={activeType}
            onTypeChange={handleTypeChange}
            allTransactions={allTransactions}
            open={dropdownOpen}
            onToggle={() => setDropdownOpen((o) => !o)}
          />

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            <Download size={16} />
            Export Data
          </button>
        </div>
      </motion.div>

      {/* Bảng giao dịch theo trang */}
      <TransactionTable
        transactions={pagedTransactions}
        isLoading={isLoading}
        showViewAll={false}
        hideHeader={true}
      />

      {/* Thanh phân trang */}
      <TransactionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TransactionsPage;
