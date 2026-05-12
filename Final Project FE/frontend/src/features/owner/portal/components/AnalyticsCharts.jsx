import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, ComposedChart, Legend, Cell 
} from 'recharts';
import { motion } from 'framer-motion';

/**
 * @file AnalyticsCharts.jsx
 * @description Biểu đồ phân tích doanh thu và lượt đặt chuyên sâu. Hỗ trợ đa ngôn ngữ.
 */
const AnalyticsCharts = ({ data, isLoading, period }) => {
  const { t } = useTranslation();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(val || 0).replace('₫', '₫');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }} className="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl space-y-3 min-w-[200px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2 text-xs font-bold text-white/60">
                 <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_#8b5cf6]" />
                 {t('common.revenue')}
              </span>
              <span className="text-sm font-black text-white">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center justify-between gap-6">
               <span className="flex items-center gap-2 text-xs font-bold text-white/60">
                 <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                 {t('common.bookings')}
              </span>
              <span className="text-sm font-black text-white">{payload[1]?.value || 0} {t('charts.units')}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm h-[500px] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto shadow-inner"></div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest animate-pulse">
            {t('charts.computing_data')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      duration={0.7}
      className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm mb-16 relative overflow-hidden"
    >
      {/* Background Decorative Gradient (Vietnamese comment) */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-violet-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 relative z-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('charts.performance_statistics')}
          </h3>
          <p className="text-sm text-slate-400 font-bold tracking-tight">
            {t('charts.performance_description')}
          </p>
        </div>
        
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <div className="flex items-center gap-6 px-4">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-violet-600" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {t('common.revenue')}
                 </span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-400" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {t('common.bookings')}
                 </span>
              </div>
           </div>
        </div>
      </div>

      <div className="h-[400px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              dy={15}
            />
            {/* Left YAxis for Revenue (Vietnamese comment) */}
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              dx={-10}
              tickFormatter={(val) => {
                if (val >= 1000000) return `${(val / 1000000).toFixed(1).replace('.0', '')}M ₫`;
                if (val >= 1000) return `${(val / 1000).toFixed(0)}K ₫`;
                return `${val} ₫`;
              }}
            />
            {/* Right YAxis for Bookings (Vietnamese comment) */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#34d399', fontSize: 10, fontWeight: 900, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              dx={10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
            
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="totalRevenue" 
              stroke="#8b5cf6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRev)" 
              animationDuration={2000}
            />
            
            <Bar 
              yAxisId="right"
              dataKey="totalBookings" 
              barSize={24} 
              radius={[6, 6, 0, 0]}
              animationDuration={2500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#34d399" fillOpacity={0.4} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsCharts;
