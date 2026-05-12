import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Filter, Check, X } from 'lucide-react';

/**
 * @file TransactionTypeFilter.jsx
 * @description Dropdown filter theo loại giao dịch (Transaction type).
 * Hiển thị số lượng giao dịch của từng loại và hỗ trợ xóa filter nhanh.
 */

// Danh sách loại giao dịch dựa theo DB constraint Transactions.type (Vietnamese comment)
export const TRANSACTION_TYPES = [
  { value: 'ALL',             labelKey: 'all',                color: 'bg-slate-100 text-slate-600'  },
  { value: 'DEPOSIT_PAYMENT', labelKey: 'DEPOSIT_PAYMENT',    color: 'bg-green-100 text-green-700'  },
  { value: 'SETTLEMENT',      labelKey: 'SETTLEMENT',         color: 'bg-blue-100 text-blue-700'    },
  { value: 'COMMISSION',      labelKey: 'COMMISSION',         color: 'bg-purple-100 text-purple-700'},
  { value: 'WITHDRAWAL',      labelKey: 'WITHDRAWAL',         color: 'bg-red-100 text-red-700'      },
  { value: 'REFUND',          labelKey: 'REFUND',             color: 'bg-amber-100 text-amber-700'  },
  { value: 'TOP_UP',          labelKey: 'TOP_UP',             color: 'bg-teal-100 text-teal-700'    },
];

/**
 * @param {string}   activeType     - Giá trị type đang được chọn ('ALL' hoặc tên type)
 * @param {Function} onTypeChange   - Callback khi người dùng chọn type mới
 * @param {Array}    allTransactions - Toàn bộ dữ liệu để đếm số lượng mỗi type
 * @param {boolean}  open           - Trạng thái mở/đóng dropdown
 * @param {Function} onToggle       - Callback bật/tắt dropdown
 */
const TransactionTypeFilter = ({
  activeType,
  onTypeChange,
  allTransactions = [],
  open,
  onToggle,
}) => {
  const { t } = useTranslation();
  // Đóng dropdown khi click ra ngoài (Vietnamese comment)
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        if (open) onToggle();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onToggle]);

  const activeInfo   = TRANSACTION_TYPES.find((t) => t.value === activeType);
  const isFiltered   = activeType !== 'ALL';

  return (
    <div className="relative" ref={ref}>
      {/* Nút trigger */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border ${
          isFiltered
            ? 'bg-primary text-white border-primary shadow-primary/20'
            : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Filter size={15} />
        {isFiltered ? t(`wallet.transaction_detail.types.${activeInfo?.labelKey}`) : t('wallet.filter_type')}

        {/* Nút xóa filter nhanh (Vietnamese comment) */}
        {isFiltered && (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onTypeChange('ALL'); }}
            className="ml-1 w-4 h-4 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center transition-colors"
          >
            <X size={10} />
          </span>
        )}
      </button>

      {/* Dropdown danh sách type */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden"
          >
            <div className="p-2 space-y-0.5">
              {TRANSACTION_TYPES.map((type) => {
                const isActive = activeType === type.value;
                // Đếm số giao dịch của từng loại để hiện badge (Vietnamese comment)
                const count =
                  type.value === 'ALL'
                    ? allTransactions.length
                    : allTransactions.filter((tx) => tx.type === type.value).length;

                return (
                  <button
                    key={type.value}
                    onClick={() => onTypeChange(type.value)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-primary/5 text-primary'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-slate-300'}`} />
                      {t(`wallet.transaction_detail.types.${type.labelKey}`)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${type.color}`}>
                        {count}
                      </span>
                      {isActive && <Check size={14} className="text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionTypeFilter;
