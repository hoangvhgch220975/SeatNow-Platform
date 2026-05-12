import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import TableCard from './TableCard';

/**
 * TableGrid Component
 * Lưới chứa các thẻ bàn với hiệu ứng Animate (Vietnamese comment)
 */
const TableGrid = ({ tables, onEdit, onDelete, isLoading }) => {
  const { t } = useTranslation();

  // Skeleton Loading State (Vietnamese comment)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {[1, 2, 4, 8].map(i => (
          <div key={i} className="h-64 rounded-[2rem] bg-white border border-slate-100 shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  // Empty State khi không có dữ liệu (Vietnamese comment)
  if (tables?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
        <span className="material-symbols-outlined text-7xl text-slate-200 mb-6 scale-125">table_bar</span>
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
          {t('common.no_data', { defaultValue: 'No tables found in this area' })}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
      <AnimatePresence mode="popLayout">
        {tables?.map((table) => (
          <TableCard 
            key={table.id} 
            table={table} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TableGrid;
