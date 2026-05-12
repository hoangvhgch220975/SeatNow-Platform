import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @file TransactionPagination.jsx
 * @description Thanh điều hướng phân trang cho danh sách giao dịch.
 * Hiển thị thông tin "Showing X–Y of Z" và các nút chuyển trang có ellipsis.
 */

/**
 * @param {number}   currentPage - Trang hiện tại (bắt đầu từ 1)
 * @param {number}   totalPages  - Tổng số trang
 * @param {number}   totalItems  - Tổng số bản ghi sau khi lọc
 * @param {number}   pageSize    - Số dòng mỗi trang
 * @param {Function} onPageChange - Callback khi chuyển trang
 */
const TransactionPagination = ({ currentPage, totalPages, totalItems, pageSize, onPageChange }) => {
  // Không hiển thị nếu chỉ có 1 trang (Vietnamese comment)
  if (totalPages <= 1) return null;

  // Tạo mảng số trang với dấu "..." khi cần (Vietnamese comment)
  const buildPageNumbers = () => {
    const pages  = [];
    const delta  = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      }
    }
    const result = [];
    let prev = null;
    for (const page of pages) {
      if (prev !== null && page - prev > 1) result.push('...');
      result.push(page);
      prev = page;
    }
    return result;
  };

  const pageNumbers = buildPageNumbers();
  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, totalItems);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between bg-white border border-slate-100 rounded-2xl px-6 py-4 shadow-sm"
    >
      {/* Thông tin dòng hiện tại */}
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Showing{' '}
        <span className="text-slate-700">{from}–{to}</span>{' '}
        of{' '}
        <span className="text-slate-700">{totalItems}</span> transactions
      </p>

      {/* Nút điều hướng trang */}
      <div className="flex items-center gap-1">
        {/* Trang trước */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Số trang và ellipsis */}
        {pageNumbers.map((item, idx) =>
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-slate-300 text-xs font-bold">
              ···
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              className={`w-8 h-8 rounded-lg text-xs font-extrabold transition-all ${
                item === currentPage
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
            >
              {item}
            </button>
          )
        )}

        {/* Trang sau */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionPagination;
