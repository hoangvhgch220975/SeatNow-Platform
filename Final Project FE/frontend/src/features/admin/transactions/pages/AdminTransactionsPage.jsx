import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useAdminTransactions } from '../hooks.js';
import TransactionStats from '../components/TransactionStats';
import TransactionFilters from '../components/TransactionFilters';
import TransactionTable from '../components/TransactionTable';

/**
 * @file AdminTransactionsPage.jsx
 * @description Central ledger management for SeatNow system administrators.
 */
const AdminTransactionsPage = () => {
  const { t } = useTranslation();

  // Quản lý trạng thái bộ lọc và phân trang
  const [params, setParams] = useState({
    restaurantId: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    limit: 5 // Mặc định 5 bản ghi mỗi trang theo yêu cầu
  });

  // Lấy dữ liệu giao dịch (bao gồm cả data, summary và pagination)
  const { data: txData, isLoading: isTxLoading } = useAdminTransactions(params);

  const handleFilterChange = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  // Tính toán tổng số trang từ dữ liệu pagination của Backend
  const totalPages = txData?.pagination?.totalPages || 0;

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Khu vực Tiêu đề */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
            {t('admin.transactions.title')}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t('admin.transactions.subtitle')}
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:text-violet-600 hover:border-violet-200 transition-all shadow-sm active:scale-95 group">
          <Download size={16} className="group-hover:bounce" />
          {t('common.export_analysis') || 'Export Data'}
        </button>
      </div>

      {/* Các thẻ Chỉ số Tài chính (Lấy từ txData.summary) */}
      <TransactionStats 
        stats={txData?.summary} 
        loading={isTxLoading} 
      />

      {/* Advanced Filters */}
      <TransactionFilters 
        filters={params} 
        onFilterChange={handleFilterChange} 
      />

      {/* Transaction Ledger Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[500px]">
        <TransactionTable 
          transactions={txData?.data || []}
          loading={isTxLoading}
        />

        {/* Admin Prime Pagination Toolbar */}
        {!isTxLoading && txData?.pagination?.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              <span>{t('common.showing')}</span>
              <span className="text-slate-900 mx-1">
                {(params.page - 1) * params.limit + 1} - {Math.min(params.page * params.limit, txData?.pagination?.total)}
              </span>
              <span>{t('common.of')}</span>
              <span className="text-slate-900 mx-1">{txData?.pagination?.total || 0}</span>
              <span>{t('admin.transactions.table.title') || 'Records'}</span>
            </div>

            {txData.pagination.total > params.limit && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(params.page - 1)}
                  disabled={params.page <= 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 min-w-[36px] rounded-xl text-xs font-black transition-all ${
                        params.page === i + 1 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-100' 
                          : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(params.page + 1)}
                  disabled={params.page >= totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
