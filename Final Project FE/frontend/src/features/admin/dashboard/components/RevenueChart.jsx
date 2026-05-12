import React from 'react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * @file RevenueChart.jsx
 * @description Biểu đồ vùng (Area Chart) hiển thị xu hướng thu nhập hoa hồng của hệ thống.
 * Tích hợp Recharts và hiệu ứng Glassmorphism.
 */
const RevenueChart = ({ data, loading, period }) => {
  const { t } = useTranslation();

  // Hàm chuẩn hóa dữ liệu để đảm bảo biểu đồ luôn trải dài đúng chu kỳ (VI: Normalize data for consistent periods)
  const chartData = React.useMemo(() => {
    if (loading) return [];
    const rawData = data || [];
    const now = new Date();
    const currentYear = now.getFullYear();

    if (period === 'year') {
      // Tạo mảng 12 tháng cố định của năm hiện tại (VI: Fixed 12 months for current year)
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(currentYear, i, 1);
        return {
          name: d.toISOString(),
          revenue: 0,
          label: t(`common.months.${['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][i]}`),
        };
      });

      // Gộp dữ liệu từ API vào các tháng tương ứng (VI: Aggregate API data into months)
      rawData.forEach(item => {
        const itemDate = new Date(item.timePeriod);
        if (itemDate.getFullYear() === currentYear) {
          const monthIdx = itemDate.getMonth();
          months[monthIdx].revenue += (item.totalCommission || item.totalAdminCommission || 0);
        }
      });
      return months;
    }

    if (period === 'quarter') {
      // Xác định quý hiện tại và tạo 3 tháng của quý đó (VI: Current quarter's 3 months)
      const currentMonth = now.getMonth();
      const startMonth = Math.floor(currentMonth / 3) * 3;
      const months = Array.from({ length: 3 }, (_, i) => {
        const d = new Date(currentYear, startMonth + i, 1);
        return {
          name: d.toISOString(),
          revenue: 0,
          label: t(`common.months.${['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][startMonth + i]}`),
        };
      });

      rawData.forEach(item => {
        const itemDate = new Date(item.timePeriod);
        if (itemDate.getFullYear() === currentYear) {
          const monthIdx = itemDate.getMonth();
          if (monthIdx >= startMonth && monthIdx < startMonth + 3) {
            months[monthIdx - startMonth].revenue += (item.totalCommission || item.totalAdminCommission || 0);
          }
        }
      });
      return months;
    }

    if (period === 'month' || period === 'week') {
      // Tạo mảng X ngày gần nhất (30 cho tháng, 7 cho tuần) - (VI: Last X days for month/week)
      const dayCount = period === 'month' ? 30 : 7;
      const days = Array.from({ length: dayCount }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (dayCount - 1 - i));
        d.setHours(0, 0, 0, 0);
        return {
          name: d.toISOString(),
          revenue: 0,
        };
      });

      rawData.forEach(item => {
        const itemDate = new Date(item.timePeriod);
        itemDate.setHours(0, 0, 0, 0);
        const dayIdx = days.findIndex(d => new Date(d.name).getTime() === itemDate.getTime());
        if (dayIdx !== -1) {
          days[dayIdx].revenue += (item.totalCommission || item.totalAdminCommission || 0);
        }
      });
      return days;
    }

    // Đối với Day: Giữ nguyên dữ liệu từ Backend đã được Zero-filling (VI: Keep backend data for day view)
    return rawData.map(item => ({
      name: item.timePeriod,
      revenue: item.totalCommission || item.totalAdminCommission || 0,
    }));
  }, [data, loading, period, t]);

  // Tính toán khoảng cách nhãn (VI: Adaptive tick spacing)
  const computedInterval = React.useMemo(() => {
    if (!chartData.length) return 0;
    if (period === 'year' || period === 'quarter') return 0; // Luôn hiện đủ các tháng
    if (period === 'day') return Math.floor(chartData.length / 6);
    
    const targetLabels = 8;
    return Math.max(0, Math.floor(chartData.length / targetLabels));
  }, [chartData.length, period]);

  // Hàm định dạng nhãn trục X dựa trên chu kỳ (VI: Format X-axis labels based on period)
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    
    try {
      const date = new Date(tickItem);
      if (isNaN(date.getTime())) return tickItem;

      const day = date.getDate();
      const month = date.getMonth();

      if (period === 'day') return `${date.getHours()}:00`;
      if (period === 'year' || period === 'quarter') {
        const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        return t(`common.months.${monthKeys[month]}`, monthKeys[month].toUpperCase());
      }
      return `${day}/${month + 1}`;
    } catch {
      return tickItem;
    }
  };

  // Trạng thái Skeleton (VI: Loading state)
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] animate-pulse">
        <div className="h-4 w-40 bg-slate-100 rounded mb-8" />
        <div className="w-full h-[300px] bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-[400px] relative group overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
          {t('admin.dashboard.charts.revenue_trend')}
        </h3>
        
        {/* Nhãn bổ sung cho chu kỳ (VI: Period context label) */}
        <span className="text-[10px] font-black uppercase text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
          {period === 'day' ? t('admin.dashboard.charts.tags.day', '6 Slots / 24h') : 
           period === 'week' ? t('admin.dashboard.charts.tags.week', 'Last 7 Days') : 
           period === 'month' ? t('admin.dashboard.charts.tags.month', 'Daily / Month') : 
           period === 'quarter' ? t('admin.dashboard.charts.tags.quarter', 'Monthly / Quarter') :
           period === 'year' ? t('admin.dashboard.charts.tags.year', 'Monthly / Year') : ''}
        </span>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              tickFormatter={formatXAxis}
              interval={computedInterval}
              minTickGap={20}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              labelFormatter={(label) => {
                try {
                  const date = new Date(label);
                  if (isNaN(date.getTime())) return label;
                  if (period === 'day') return `${date.getHours()}:00 - ${date.toLocaleDateString('vi-VN')}`;
                  if (period === 'year' || period === 'quarter') {
                    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    return t(`common.months.${monthKeys[date.getMonth()]}`) + ` ${date.getFullYear()}`;
                  }
                  return date.toLocaleDateString('vi-VN');
                } catch {
                  return label;
                }
              }}
              formatter={(value) => [
                new Intl.NumberFormat('vi-VN', { 
                  style: 'currency', 
                  currency: 'VND' 
                }).format(value), 
                t('admin.dashboard.charts.revenue_label', 'Revenue')
              ]}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: '700'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={1500}
              name={t('admin.dashboard.charts.revenue_label', 'Revenue')}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
