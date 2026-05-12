import React from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

/**
 * @file BookingDistributionChart.jsx
 * @description Biểu đồ hình tròn (Pie Chart) hiển thị phân bổ các trạng thái đặt chỗ (Confirmed, Completed, Canceled).
 */
const BookingDistributionChart = ({ stats, loading }) => {
  const { t } = useTranslation();

  // Trạng thái Loading (VI: Loading state)
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] animate-pulse">
        <div className="h-4 w-40 bg-slate-100 rounded mb-8" />
        <div className="w-full h-[250px] bg-slate-50 rounded-full mx-auto" />
      </div>
    );
  }

  // Chuẩn hóa dữ liệu cho Pie Chart (VI: Map data for Pie Chart)
  const data = [
    { name: t('admin.dashboard.charts.status.confirmed', 'Confirmed'), value: stats?.confirmedBookings || 0, color: '#8b5cf6' }, // Violet
    { name: t('admin.dashboard.charts.status.completed', 'Completed'), value: stats?.completedBookings || 0, color: '#10b981' }, // Emerald
    { name: t('admin.dashboard.charts.status.cancelled', 'Canceled'), value: stats?.cancelledBookings || 0, color: '#ef4444' },  // Rose
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">
        {t('admin.dashboard.charts.booking_dist')}
      </h3>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              formatter={(value) => <span className="text-xs font-bold text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingDistributionChart;
