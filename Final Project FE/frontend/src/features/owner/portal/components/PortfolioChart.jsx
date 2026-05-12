import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * @file PortfolioChart.jsx
 * @description Thành phần hiển thị biểu đồ phân tích (Area/Bar) sử dụng Recharts.
 */
const PortfolioChart = ({ 
  activeTab, 
  data, 
  isStatsLoading, 
  displayRange, 
  period, 
  setPeriod, 
  setActiveTab,
  totalBookings,
  totalCancelled,
  grossRevenue,
  totalRevenue,
  busyHour
}) => {
  const { t } = useTranslation();
  // Chuẩn bị dữ liệu cho Recharts
  const chartData = data.map(item => ({
    name: item.label,
    value: item.val,
    cancelled: item.cancelledVal || 0
  }));

  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  const color = activeTab === 'revenue' ? '#10b981' : '#8b5cf6'; // Emerald vs Violet

  // Custom Tooltip cho Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }} className="bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md min-w-[200px] space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/10 pb-2">{label}</p>
          
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
                   <span className="text-[11px] font-bold text-slate-300">{entry.name}</span>
                </div>
                <span className="text-sm font-black">
                  {activeTab === 'revenue' 
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(entry.value).replace('₫', '₫')
                    : `${entry.value} ${t('owner_portal.overview.units')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_40px_-15px_rgba(99,14,212,0.04)] border border-slate-100/50 space-y-12 overflow-hidden">
      {/* Header biểu đồ */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className={`h-8 w-1.5 rounded-full ${activeTab === 'revenue' ? 'bg-emerald-500' : 'bg-violet-500'}`}></div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight italic">{t('owner_portal.overview.portfolio_analytics_title')}</h3>
          </div>
          <p className="text-slate-500 font-bold ml-4 uppercase tracking-[0.3em] text-[10px] bg-slate-50 w-fit px-3 py-1 rounded-lg border border-slate-200/50">
            {displayRange}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100/50 p-1.5 rounded-[2.5rem] border border-slate-200/60 backdrop-blur-sm shadow-inner">
          {/* Section 1: Metric Switcher */}
          <div className="flex p-0.5 bg-white/80 rounded-[2rem] shadow-sm border border-slate-100">
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center gap-2 px-5 py-2 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'revenue' 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              {t('owner_portal.overview.metric_revenue')}
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-5 py-2 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === 'bookings' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">event_available</span>
              {t('owner_portal.overview.metric_bookings')}
            </button>
          </div>

          <div className="w-px h-6 bg-slate-200/80 mx-1"></div>

          {/* Section 2: Period Pills */}
          <div className="flex gap-1">
            {['day', 'week', 'month'].map((p) => (
              <button 
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-300 ${
                  period === p 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' 
                    : 'text-slate-400 hover:bg-white hover:text-slate-600'
                }`}
              >
                {t(`analytics.${p}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative h-[400px] w-full pt-4">
        {isStatsLoading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-3xl">
             <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'revenue' || (activeTab === 'bookings' && period !== 'day') ? (
            /* Area Chart cho Revenue/Long-period Bookings */
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 'auto']}
                width={50}
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                tickFormatter={(val) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(val)}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Layer đơn Hợp lệ (Confirmed) */}
              <Area 
                name={activeTab === 'revenue' ? t('owner_portal.overview.realized_net_revenue') : t('owner_portal.overview.chart_confirmed')}
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorVal)" 
                connectNulls={true}
                animationDuration={1500}
              />

              {/* Layer đơn Hủy (Cancelled) - Chỉ hiện khi ở tab Bookings */}
              {activeTab === 'bookings' && (
                <Area 
                  name={t('owner_portal.overview.chart_cancelled')}
                  type="monotone" 
                  dataKey="cancelled" 
                  stroke="#f43f5e" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={0.05} 
                  fill="#f43f5e" 
                  connectNulls={true}
                  animationDuration={1500}
                />
              )}
            </AreaChart>
          ) : (
            /* Bar Chart cho Bookings by Day/Hour */
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                width={50}
                tick={{ fill: '#475569', fontSize: 10, fontWeight: 800, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              />
              <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
              
              {/* Stacked Bar for Bookings (Valid + Cancelled) */}
              <Bar name={t('owner_portal.overview.chart_confirmed')} dataKey="value" radius={[10, 10, 0, 0]} animationDuration={1200} barSize={20} fill="#818cf8" />
              {activeTab === 'bookings' && (
                <Bar name={t('owner_portal.overview.chart_cancelled')} dataKey="cancelled" radius={[10, 10, 0, 0]} animationDuration={1200} barSize={20} fill="#fda4af" />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info Cards: Phân tích hiệu suất dựa trên Tag đang chọn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-slate-50">
        {activeTab === 'revenue' ? (
          <>
            {/* Thẻ Doanh thu thực nhận (Net Revenue) - Bên TRÁI */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-white flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-emerald-100/20 transition-all duration-500">
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('owner_portal.overview.realized_net_revenue')}</span>
                 <span className="text-3xl font-black text-emerald-600 tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(totalRevenue || 0).replace('₫', '₫')}
                 </span>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{t('owner_portal.overview.after_commissions')}</p>
              </div>
              <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined">payments</span>
              </div>
            </div>

            {/* Thẻ Tiền cọc đã thu (Gross Deposits) - Bên PHẢI */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-white flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-emerald-100/20 transition-all duration-500">
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('owner_portal.overview.gross_deposits')}</span>
                 <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(grossRevenue || 0).replace('₫', '₫')}
                 </span>
                 <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{t('owner_portal.overview.gross_deposits_desc')}</p>
              </div>
              <div className="flex flex-col items-end">
                 <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">point_of_sale</span>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Thẻ Lượt đặt hợp lệ */}
            <div className="p-8 rounded-[2rem] bg-slate-50 border border-white flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-indigo-100/20 transition-all duration-500">
              <div className="space-y-1">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('owner_portal.overview.valid_bookings')}</span>
                 <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {new Intl.NumberFormat('en-US').format(totalBookings || 0)} <span className="text-sm font-bold text-violet-500">{t('owner_portal.overview.units')}</span>
                 </span>
              </div>
              <div className="h-14 w-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500 shadow-inner group-hover:scale-110 transition-transform">
                 <span className="material-symbols-outlined">verified</span>
              </div>
            </div>

            {/* Thẻ bên phải: Ưu tiên hiển thị Giờ cao điểm (Day) hoặc Tỷ lệ Thành công (Week/Month) */}
            {(period === 'day' && busyHour) ? (
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-white flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-amber-100/20 transition-all duration-500">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('owner_portal.overview.peak_hour')}</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tight lowercase">
                      {busyHour} <span className="text-sm font-bold text-amber-500 uppercase">{t('owner_portal.overview.busy')}</span>
                   </span>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{t('owner_portal.overview.active_window')}</p>
                </div>
                <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 shadow-inner group-hover:scale-110 transition-transform">
                   <span className="material-symbols-outlined">schedule</span>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-[2rem] bg-slate-50 border border-white flex justify-between items-center group hover:bg-white hover:shadow-xl hover:shadow-emerald-100/20 transition-all duration-500">
                <div className="space-y-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{t('owner_portal.overview.success_rate')}</span>
                   <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {new Intl.NumberFormat('en-US').format(totalBookings || 0)} <span className="text-sm font-bold text-slate-300">/</span> {new Intl.NumberFormat('en-US').format((totalBookings || 0) + (totalCancelled || 0))}
                   </span>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{t('owner_portal.overview.intent_desc')}</p>
                </div>
                <div className="flex flex-col items-end">
                   <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner mb-2 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">task_alt</span>
                   </div>
                   <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-tighter">
                      {(((totalBookings || 0) / ((totalBookings || 1) + (totalCancelled || 0))) * 100).toFixed(1)}% {t('owner_portal.overview.success')}
                   </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PortfolioChart;
