import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Users, DollarSign, CalendarCheck, HelpCircle } from 'lucide-react';

/**
 * Hiển thị các thẻ KPI tài chính
 */
const RevenueKPIs = ({ summary }) => {
  const { t } = useTranslation();

  const kpis = [
    {
      id: 'net-revenue',
      label: t('workspace_revenue.kpi.total_revenue'),
      value: summary?.totalRevenue || 0,
      isMoney: true,
      explainer: t('workspace_revenue.kpi.net_explainer'),
      icon: <DollarSign className="text-emerald-500" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      id: 'gross-revenue',
      label: t('workspace_revenue.kpi.gross_revenue'),
      value: summary?.totalGrossRevenue || 0,
      isMoney: true,
      explainer: t('workspace_revenue.kpi.gross_explainer'),
      icon: <TrendingUp className="text-blue-500" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      id: 'bookings',
      label: t('workspace_revenue.kpi.total_bookings'),
      value: summary?.totalBookings || 0,
      isMoney: false,
      explainer: t('workspace_revenue.kpi.bookings_explainer'),
      icon: <CalendarCheck className="text-indigo-500" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
    {
      id: 'cancel-rate',
      label: t('workspace_revenue.kpi.cancel_rate'),
      value: (((summary?.cancellationRate ?? 0) * 100).toFixed(1)) + '%',
      isMoney: false,
      explainer: t('workspace_revenue.kpi.cancel_explainer'),
      icon: <Users className="text-rose-500" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    }
  ];

  const formatMoney = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi) => (
        <div 
          key={kpi.id}
          className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Background Pattern */}
          <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${kpi.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${kpi.bg} ${kpi.border} border rounded-2xl`}>
                {React.cloneElement(kpi.icon, { size: 24 })}
              </div>
              <div className="group/help relative">
                <HelpCircle size={16} className="text-slate-300 cursor-help hover:text-indigo-400" />
                <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/help:opacity-100 group-hover/help:visible transition-all z-50 shadow-xl">
                  {kpi.explainer}
                </div>
              </div>
            </div>

            <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">
              {kpi.label}
            </h3>
            
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {typeof kpi.value === 'number' ? (kpi.isMoney ? formatMoney(kpi.value) : kpi.value) : kpi.value}
            </div>
            
            {/* Trend Indicator (Placeholder for now) */}
            <div className="mt-4 flex items-center gap-1.5">
               <span className="text-[10px] font-bold text-slate-400">{t('workspace_revenue.kpi.data_synced')}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueKPIs;
