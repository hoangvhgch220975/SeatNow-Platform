import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  CheckCircle2, 
  Coins,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

/**
 * @file WithdrawalStats.jsx
 * @description KPI cards cho module Quản lý Rút tiền của Admin.
 * Được thiết kế đồng bộ với chuẩn Admin Prime.
 */
const WithdrawalStats = ({ stats = {}, loading = false }) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: t('admin.withdrawals.stats.pending'),
      value: stats?.pendingCount || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
    },
    {
      label: t('admin.withdrawals.stats.total_processed'),
      value: formatCurrency(stats?.totalProcessed || 0),
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      label: t('admin.withdrawals.stats.system_liquidity'),
      value: formatCurrency(stats?.systemLiquidity || 0),
      icon: Coins,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-[32px] border border-slate-100 animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
      {cards.map((card, idx) => (
        <div 
          key={idx}
          className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
          {/* Background Icon Decoration */}
          <card.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          
          <div className="relative z-10 flex items-center gap-5">
            <div className={`w-14 h-14 ${card.bgColor} ${card.color} rounded-2xl flex items-center justify-center border ${card.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
              <card.icon size={26} strokeWidth={2.5} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            </div>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <ArrowUpRight size={14} className="text-slate-300" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WithdrawalStats;
