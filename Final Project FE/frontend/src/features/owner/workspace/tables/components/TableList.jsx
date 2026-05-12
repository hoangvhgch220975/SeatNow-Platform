import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { TABLE_STATUS } from '@/constants/tableStatus';

/**
 * TableList Component
 * Hiển thị danh sách bàn dưới dạng bảng cổ điển nhưng được cách điệu cao cấp.
 */
/**
 * TableList Component
 * Hiển thị danh sách bàn dưới dạng bảng (Table) với phong cách Premium Light. (Vietnamese comment)
 * Cấu trúc tinh gọn, đồng bộ với thiết kế tổng thể của hệ thống. (Vietnamese comment)
 */
const TableList = ({ tables, onEdit, onDelete, isLoading }) => {
  const { t } = useTranslation();

  /**
   * Xác định màu sắc Badge dựa trên trạng thái (Vietnamese comment)
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case TABLE_STATUS.AVAILABLE:
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case TABLE_STATUS.UNAVAILABLE:
        return 'text-rose-600 bg-rose-50 border-rose-100';
      case TABLE_STATUS.MAINTENANCE:
        return 'text-amber-600 bg-amber-50 border-amber-100';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  // Skeleton Loading State (Vietnamese comment)
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse h-96" />
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
      <div className="overflow-x-auto overflow-y-hidden pb-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                {t('tables.form.table_number', { defaultValue: 'Table' })}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                {t('tables.form.type', { defaultValue: 'Category' })}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                {t('tables.form.capacity', { defaultValue: 'Guests' })}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                {t('tables.form.location', { defaultValue: 'Location' })}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                {t('tables.form.status', { defaultValue: 'Status' })}
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 text-right">
                {t('tables.view.actions', { defaultValue: 'Actions' })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <AnimatePresence mode="popLayout">
              {tables?.map((table, index) => (
                <motion.tr
                  key={table.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group hover:bg-slate-50/30 transition-all duration-300"
                >
                  <td className="px-8 py-5">
                    <span className="text-slate-900 font-black tracking-tight">{table.tableNumber}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                       {t(`tables.types.${table.type}`, { defaultValue: table.type.toUpperCase() })}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2.5 text-slate-600 text-sm font-bold">
                      <span className="material-symbols-outlined text-lg text-violet-400" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                      {table.capacity}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-slate-500 text-sm font-medium">{table.location}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getStatusBadge(table.status)}`}>
                      {t(`tables.stats.${table.status}`, { defaultValue: table.status.toUpperCase() })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                       <button 
                        onClick={() => onEdit(table)}
                        className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-violet-700 hover:text-white transition-all shadow-sm border border-slate-100 hover:scale-110 active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button 
                        onClick={() => onDelete(table.id)}
                        className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100 hover:scale-110 active:scale-90"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {tables?.length === 0 && (
        <div className="py-24 text-center bg-slate-50/30">
           <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
           <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
             {t('tables.view.no_records', { defaultValue: 'No records found' })}
           </p>
        </div>
      )}
    </div>
  );
};

export default TableList;
