import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * Phân tích nhóm khách hàng
 */
const GuestGroupAnalysis = ({ data }) => {
  const { t } = useTranslation();

  const chartData = [
    { name: t('workspace_revenue.guest_types.couple'), value: data?.couple || 0, color: '#6366f1' },
    { name: t('workspace_revenue.guest_types.small_group'), value: data?.smallGroup || 0, color: '#10b981' },
    { name: t('workspace_revenue.guest_types.party'), value: data?.party || 0, color: '#f59e0b' },
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {t('workspace_revenue.charts.guest_analysis')}
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          {t('workspace_revenue.charts.guest_analysis_desc')}
        </p>
      </div>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
              animationBegin={200}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total Center Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-2xl font-black text-slate-900">{total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {t('workspace_revenue.common.bookings')}
            </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-bold text-slate-600">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-black text-slate-900">{item.value}</span>
                <span className="text-xs font-bold text-slate-400">
                    {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuestGroupAnalysis;
