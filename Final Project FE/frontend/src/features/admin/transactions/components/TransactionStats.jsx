import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  History
} from 'lucide-react';

/**
 * @file TransactionStats.jsx
 * @description Financial KPI cards for Admin Transactions view.
 */
const TransactionStats = ({ stats, loading }) => {
  const { t } = useTranslation();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(val || 0);
  };

  // Mapping dữ liệu từ object summary của Backend
  const cards = [
    {
      label: t('admin.transactions.stats.total_commission'),
      value: formatCurrency(stats?.totalAdminProfit),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
    },
    {
      label: t('admin.transactions.stats.uncollected_commission'),
      value: formatCurrency(stats?.totalUncollectedCommission),
      icon: History,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
    },
    {
      label: t('admin.transactions.stats.total_transactions'),
      value: stats?.totalTransactions || 0,
      icon: Activity,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
    },
    // Chỉ hiển thị số dư ví khi lọc theo nhà hàng cụ thể (BE trả về null nếu không lọc)
    {
      label: t('admin.transactions.stats.total_wallet_balance'),
      value: stats?.walletBalance !== null ? formatCurrency(stats?.walletBalance) : '--',
      icon: Wallet,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
      hidden: stats?.walletBalance === null
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm" />
        ))}
      </div>
    );
  }

  // Lọc bỏ các thẻ bị ẩn (ví dụ walletBalance khi xem tất cả)
  const visibleCards = cards.filter(card => !card.hidden);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${visibleCards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 animate-in slide-in-from-top-4 duration-500`}>
      {visibleCards.map((card, idx) => (
        <div 
          key={idx}
          className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
        >
          {/* Subtle Background Icon Decoration */}
          <card.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-50 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className={`w-12 h-12 ${card.bgColor} ${card.color} rounded-2xl flex items-center justify-center mb-4 border ${card.borderColor} shadow-sm group-hover:scale-110 transition-transform`}>
              <card.icon size={22} strokeWidth={2.5} />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{card.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionStats;
