import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TABLE_STATUS } from '@/constants/tableStatus';

/**
 * TableCard Component
 * Hiển thị một thẻ bàn cụ thể với phong cách Premium Light. (Vietnamese comment)
 * Tích hợp các nút hành động đồng bộ với tính năng Menu. (Vietnamese comment)
 */
const TableCard = ({ table, onEdit, onDelete }) => {
  const { t } = useTranslation();

  // Xác định màu sắc và nhãn của trạng thái (Vietnamese comment)
  const getStatusConfig = (status) => {
    switch (status) {
      case TABLE_STATUS.AVAILABLE:
        return { 
          color: 'emerald', 
          label: t('tables.stats.available', { defaultValue: 'Available' }), 
          icon: 'check_circle' 
        };
      case TABLE_STATUS.UNAVAILABLE:
        return { 
          color: 'rose', 
          label: t('tables.stats.occupied', { defaultValue: 'Occupied' }), 
          icon: 'event_seat' 
        };
      case TABLE_STATUS.MAINTENANCE:
        return { 
          color: 'amber', 
          label: t('tables.stats.maintenance', { defaultValue: 'Maintenance' }), 
          icon: 'build' 
        };
      default:
        return { color: 'slate', label: status, icon: 'help' };
    }
  };

  const statusConfig = getStatusConfig(table.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      className="group bg-white rounded-[2rem] p-6 flex flex-col gap-6 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden"
    >
      {/* Hiệu ứng trang trí nền (Vietnamese comment) */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-${statusConfig.color}-50/50 blur-3xl group-hover:scale-150 transition-transform duration-1000`} />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Số bàn và Badge trạng thái (Vietnamese comment) */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 group-hover:text-violet-700 transition-colors tracking-tight">
               {table.tableNumber}
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 block">
              {t(`tables.types.${table.type}`, { defaultValue: table.type.toUpperCase() })}
            </span>
          </div>
          <span className={`px-4 py-1.5 bg-${statusConfig.color}-50 text-${statusConfig.color}-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-${statusConfig.color}-100 shadow-sm`}>
            {statusConfig.label}
          </span>
        </div>

        {/* Thông tin chi tiết: Sức chứa và Loại bàn (Vietnamese comment) */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
            <span className="material-symbols-outlined text-violet-400" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <span className="text-[11px] font-bold text-slate-600">{table.capacity} {t('tables.form.guests', { defaultValue: 'Guests' })}</span>
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border border-slate-100/50 group-hover:bg-white transition-colors duration-500">
            <span className="material-symbols-outlined text-violet-400" style={{ fontVariationSettings: "'FILL' 1" }}>
              {table.type === 'outdoor' ? 'deck' : table.type === 'vip' ? 'stars' : 'chair'}
            </span>
            <span className="text-[11px] font-bold text-slate-600 truncate max-w-full uppercase">{table.type}</span>
          </div>
        </div>

        {/* Footer: Vị trí và Các nút hành động (Vietnamese comment) */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-lg">location_on</span>
            <span className="text-xs font-bold truncate max-w-[100px]">{table.location}</span>
          </div>
          
          {/* Nút Edit/Delete đồng bộ style trang Menu (Vietnamese comment) */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(table);
              }}
              className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-violet-700 hover:text-white transition-all shadow-sm border border-slate-100 hover:scale-110 active:scale-90"
              title={t('common.edit', { defaultValue: 'Edit Table' })}
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(table.id);
              }}
              className="p-2.5 bg-white text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-slate-100 hover:scale-110 active:scale-90"
              title={t('common.delete', { defaultValue: 'Delete Table' })}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TableCard;
