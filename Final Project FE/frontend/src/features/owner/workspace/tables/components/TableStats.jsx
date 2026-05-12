import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * TableStats Component
 * Hiển thị các thẻ thông số nhanh về tình trạng bàn trong nhà hàng. (Vietnamese comment)
 * Thiết kế theo phong cách Premium Light với hiệu ứng bóng đổ và bo góc lớn. (Vietnamese comment)
 * 
 * @param {object} stats - Dữ liệu thống kê từ API (total, available, occupied, maintenance)
 */
const TableStats = ({ stats, isLoading }) => {
  const { t } = useTranslation();

  // Danh sách các thẻ thống kê với màu sắc và icon tương ứng (Vietnamese comment)
  const statCards = [
    {
      key: 'total',
      label: t('tables.stats.total'),
      value: stats?.total || 0,
      icon: 'grid_view',
      color: 'violet',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-100'
    },
    {
      key: 'available',
      label: t('tables.stats.available'),
      value: stats?.available || 0,
      icon: 'check_circle',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      key: 'occupied',
      label: t('tables.stats.occupied'),
      value: stats?.occupied || 0,
      icon: 'event_seat',
      color: 'rose',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-100'
    },
    {
      key: 'maintenance',
      label: t('tables.stats.maintenance'),
      value: stats?.maintenance || 0,
      icon: 'build',
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100'
    }
  ];

  // Trạng thái Skeleton khi đang tải dữ liệu (Vietnamese comment)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-[2rem] bg-white animate-pulse border border-slate-100 shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Hiệu ứng trang trí nền (Vietnamese comment) */}
          <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full ${card.bgColor} opacity-40 blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          
          <div className="flex items-center gap-5 relative z-10">
            {/* Biểu tượng với nền màu đặc trưng (Vietnamese comment) */}
            <div className={`w-14 h-14 rounded-2xl ${card.bgColor} ${card.textColor} flex items-center justify-center border ${card.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {card.icon}
              </span>
            </div>
            
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {card.label}
              </p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                {card.value}
              </h4>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TableStats;
