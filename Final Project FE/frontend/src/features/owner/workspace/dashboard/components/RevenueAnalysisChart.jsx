import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

/**
 * @file RevenueAnalysisChart.jsx
 * @description Biểu đồ phân tích doanh thu sử dụng Recharts.
 */
const RevenueAnalysisChart = ({ data, isLoading, period, onPeriodChange, restaurant, selectedDate }) => {
  const { t, i18n } = useTranslation();

  // 1. Ánh xạ dữ liệu từ API sang định dạng Recharts (Vietnamese comment)
  const chartData = React.useMemo(() => {
    if (!data) return [];

    // Unwrap dữ liệu: API /bookings trả về object { items: [...] } hoặc { data: [...] }
    // còn API /revenue-stats trả về mảng trực tiếp (Vietnamese comment)
    let normalizedData = data;
    if (!Array.isArray(normalizedData)) {
      normalizedData = data.items || data.data || data.content || data.bookings || [];
    }
    if (!Array.isArray(normalizedData) || normalizedData.length === 0) return [];

    const isEnglish = t('i18next_code') === 'en-US' || i18n.language.startsWith('en');

    // 1.1 Xử lý cho chế độ xem theo Ngày (HOURLY) (Vietnamese comment)
    if (period === 'day' || period === 'hour') {
      const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      
      // Xử lý ngày an toàn (Vietnamese comment)
      let today = daysOrder[new Date().getDay()];
      if (selectedDate) {
        const [y, m, d] = selectedDate.split('-').map(Number);
        today = daysOrder[new Date(y, m - 1, d).getDay()];
      }

      // Smart Parser Extreme: Hỗ trợ nhiều cấp độ, định dạng, mảng và bọc mảng (Vietnamese comment)
      const possibleSources = [
        restaurant,
        Array.isArray(restaurant) ? restaurant[0] : null,
        restaurant?.data,
        Array.isArray(restaurant?.data) ? restaurant.data[0] : null,
        restaurant?.restaurant,
        restaurant?.details
      ].filter(Boolean);
      
      let rawObj = null;
      for (const src of possibleSources) {
        rawObj = src.openingHours || src.opening_hours || src.openingHoursJson || src.operatingHours || src.operating_hours;
        if (rawObj) break;
      }

      let hoursObj = rawObj || {};
      let isPlainString = false;
      if (typeof hoursObj === 'string') {
        try { 
          const parsed = JSON.parse(hoursObj); 
          if (parsed && typeof parsed === 'object') {
            hoursObj = parsed;
          } else {
            isPlainString = true;
          }
        } catch (e) { 
          isPlainString = true; 
        }
      }

      // Bộ Mapper Chuẩn hóa toàn diện (Vietnamese comment)
      const normalizedHours = {};
      const daysOrderNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      daysOrderNames.forEach(d => normalizedHours[d] = '09:00-22:00'); // Fallback base
      
      if (isPlainString && typeof rawObj === 'string' && rawObj.includes('-')) {
        daysOrderNames.forEach(d => normalizedHours[d] = rawObj);
      } else if (Array.isArray(hoursObj)) {
        hoursObj.forEach(item => {
          const k = (item.day || item.label || '').toLowerCase();
          const val = item.hours || item.time || '09:00-22:00';
          const match = daysOrderNames.find(d => k.includes(d) || k.includes(d.substring(0, 3)));
          if (match) normalizedHours[match] = val;
        });
      } else if (hoursObj && typeof hoursObj === 'object') {
        Object.entries(hoursObj).forEach(([k, v]) => {
          const keyLow = k.toLowerCase();
          const val = typeof v === 'string' ? v : (v.hours || v.time || '09:00-22:00');
          
          if (keyLow.includes('everyday') || keyLow.includes('mon-sun') || keyLow.includes('monday-sunday')) {
            daysOrderNames.forEach(d => normalizedHours[d] = val);
          } else if (keyLow.includes('weekday') || keyLow.includes('mon-fri') || keyLow.includes('monday-friday')) {
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(d => normalizedHours[d] = val);
          } else if (keyLow.includes('weekend') || keyLow.includes('sat-sun') || keyLow.includes('saturday-sunday')) {
            ['saturday', 'sunday'].forEach(d => normalizedHours[d] = val);
          } else {
            const match = daysOrderNames.find(d => keyLow.includes(d) || keyLow.includes(d.substring(0, 3)));
            if (match) normalizedHours[match] = val;
          }
        });
      }
      let hoursConfig = normalizedHours[today] || '09:00-22:00';
      const [startStr, endStr] = hoursConfig.split('-');

      // Smart Bucketing: Database thường gom nhóm theo số chẵn (0, 2, 4...). (Vietnamese comment)
      let rawStart = parseInt(startStr.split(':')[0]);
      let startHour = rawStart % 2 !== 0 ? rawStart - 1 : rawStart;
      
      let rawEnd = parseInt(endStr.split(':')[0]) + (parseInt(endStr.split(':')[1] || 0) / 60);
      let endHourVal = Math.ceil(rawEnd);
      if (endHourVal % 2 !== 0) endHourVal += 1;

      const hourlyData = [];
      for (let h = startHour; h <= endHourVal; h += 2) {
        const hourLabel = `${h.toString().padStart(2, '0')}:00`;
        
        let netRevenue = 0;
        let grossRevenue = 0;

        if (Array.isArray(normalizedData)) {
          normalizedData.forEach(item => {
            // Trích xuất thời gian: hỗ trợ cả analytics (timePeriod) và booking (bookingTime) (Vietnamese comment)
            let itemTime = item.timePeriod || item.time_period || item.label || item.hour || item.bookingTime || item.booking_time || '';
            if (!itemTime) return;

            // 1.1.1 Trích xuất giờ (dbHour) linh hoạt (Vietnamese comment)
            let dbHour = -1;
            const timeStr = String(itemTime);
            
            // Nếu là đối tượng Booking (có id và bookingTime) (Vietnamese comment)
            const isBooking = !!(item.id && (item.bookingTime || item.booking_time));
            if (isBooking) {
              const status = (item.status || '').toUpperCase();
              const isRefunded = item.depositRefunded === true || item.deposit_refunded === true;
              
              // KHÔNG TÍNH DOANH THU KHI:
              // 1. Booking bị từ chối trước khi quán nhận (REJECTED)
              // 2. Booking bị hủy hợp lệ & được hoàn tiền cọc (CANCELLED + depositRefunded = true)
              if (status === 'REJECTED' || (status === 'CANCELLED' && isRefunded)) return;

              itemTime = item.bookingTime || item.booking_time || '';
            }

            if (String(itemTime).includes(' ')) {
              dbHour = parseInt(String(itemTime).split(' ')[1].split(':')[0], 10);
            } else if (String(itemTime).includes('T')) {
              dbHour = parseInt(String(itemTime).split('T')[1].split(':')[0], 10);
            } else if (String(itemTime).includes(':')) {
              dbHour = parseInt(String(itemTime).split(':')[0], 10);
            } else {
              dbHour = parseInt(String(itemTime), 10);
            }

            // 1.1.2 Kiểm tra và cộng dồn vào bucket [h, h+2) (Vietnamese comment)
            if (dbHour >= 0 && dbHour < 24 && dbHour >= h && dbHour < h + 2) {
              if (isBooking) {
                // Đối với đơn hàng thô: depositAmount là số tiền cọc, totalPrice là tổng giá (Vietnamese comment)
                const deposit = Number(item.depositAmount || item.deposit_amount || 0);
                const gross = Number(item.grossRevenue || item.gross_revenue || item.totalPrice || item.total_price || deposit);
                const net = Number(item.netRevenue || item.net_revenue || deposit);
                netRevenue += net;
                grossRevenue += gross;
              } else {
                // Đối với dữ liệu thống kê từ API (Vietnamese comment)
                netRevenue += Number(item.totalRevenue || item.total_revenue || item.revenue || item.amount || 0);
                grossRevenue += Number(item.totalGrossRevenue || item.total_gross_revenue || item.gross_revenue || item.gross_amount || 0);
              }
            }
          });
        }

        hourlyData.push({
          name: hourLabel,
          netRevenue: netRevenue,
          grossRevenue: grossRevenue
        });
      }
      return hourlyData;
    }

    // 1.2 Xử lý cho chế độ xem theo Tuần (WEEK) - Trải đều 7 ngày (Vietnamese comment)
    if (period === 'week') {
      const weekData = [];
      // selectedDate (tức revenueParams.from) là ngày bắt đầu của mốc 7 ngày (Vietnamese comment)
      const startDate = selectedDate ? new Date(selectedDate) : new Date(new Date().setDate(new Date().getDate() - 6));
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        
        const fullDate = `${yyyy}-${mm}-${dd}`;
        const label = `${dd}-${mm}`; // Định dạng mm-dd theo yêu cầu (Vietnamese comment)
        
        const match = normalizedData.find(item => {
          const itemTime = item.timePeriod || item.time_period || item.label || item.date || '';
          return itemTime.includes(fullDate) || itemTime.includes(label);
        });

        weekData.push({
          name: label,
          netRevenue: Number(match?.totalRevenue || match?.total_revenue || 0),
          grossRevenue: Number(match?.totalGrossRevenue || match?.total_gross_revenue || 0)
        });
      }
      return weekData;
    }

    // 1.3 Xử lý cho các chế độ khác (MONTH, YEAR) (Vietnamese comment)
    if (normalizedData.length === 0) {
      return [{ name: '...', netRevenue: 0, grossRevenue: 0 }];
    }

    // Hàm format nhãn linh hoạt theo ngôn ngữ (Vietnamese comment)
    const formatLabel = (rawName) => {
      if (!rawName) return '---';
      
      const monthMap = { 'một': '1', 'hai': '2', 'ba': '3', 'tư': '4', 'năm': '5', 'sáu': '6', 'bảy': '7', 'tám': '8', 'chín': '9', 'mười': '10', 'mười một': '11', 'mười hai': '12' };
      const monthEN = { '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December' };

      if (rawName.match(/^\d{4}-\d{2}$/)) {
        const [y, m] = rawName.split('-');
        return `${parseInt(m)}-${y}`;
      }

      if (rawName.includes('-')) {
        return rawName.split('-').map(p => {
          const part = p.trim().toLowerCase();
          if (part.includes('tháng') || part.includes('month')) {
            let m = part.match(/\d+/)?.[0] || part.split(' ').pop();
            if (monthMap[m]) m = monthMap[m];
            return isEnglish ? monthEN[m] || m : `${t('analytics.month', { defaultValue: 'Tháng' })} ${m}`;
          }
          if (part.includes('tuần') || part.includes('week') || part.includes('?')) {
            return `${t('analytics.week', { defaultValue: 'Week' })} ${part.match(/\d+/)?.[0] || ''}`;
          }
          return p.trim();
        }).join(' - ');
      }

      return rawName;
    };

    return normalizedData.map(item => {
      const label = item.timePeriod || item.time_period || item.label || item.date || '---';
      return {
        name: formatLabel(label),
        netRevenue: Number(item.totalRevenue || item.total_revenue || 0),
        grossRevenue: Number(item.totalGrossRevenue || item.total_gross_revenue || 0)
      };
    });
  }, [data, t, i18n.language, period, restaurant, selectedDate]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0 
    }).format(val || 0).replace('₫', '₫');
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(99,14,212,0.02)] border border-slate-50 flex flex-col h-full relative overflow-hidden">
      {/* Background Decorative Gradient (Vietnamese comment) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex justify-between items-center mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {t(`workspace.dashboard.revenue_by_${period === 'day' ? 'hour' : period}`, { defaultValue: t('workspace.dashboard.revenue_analysis') })}
            </h4>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {t('charts.performance_statistics')}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    {t('analytics.net_revenue')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    {t('analytics.revenue')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <select 
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="bg-slate-50 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer outline-none shadow-sm"
        >
          <option value="day">{t('analytics.day')}</option>
          <option value="week">{t('analytics.week')}</option>
          <option value="month">{t('analytics.month')}</option>
          <option value="year">{t('analytics.year')}</option>
        </select>
      </div>

      <div className="h-[400px] w-full relative z-10">
        {isLoading ? (
          <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
        ) : chartData.length > 0 && chartData[0].name !== '...' ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                dy={15}
              />
              <YAxis 
                width={80}
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 800, fill: '#475569', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                tickFormatter={(val) => 
                  val >= 1000000 ? `${(val / 1000000).toFixed(1)}M ₫` : 
                  val >= 1000 ? `${(val / 1000).toFixed(0)}K ₫` : 
                  `${val} ₫`
                }
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  padding: '1.25rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
                itemStyle={{ fontWeight: 900, fontSize: '13px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '0.5rem', fontSize: '10px', textTransform: 'uppercase', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                formatter={(val) => formatCurrency(val)}
              />
              {/* Gross Revenue Area (Behind) (Vietnamese comment) */}
              <Area 
                type="monotone" 
                dataKey="grossRevenue" 
                name={t('analytics.revenue')}
                stroke="#94a3b8" 
                strokeWidth={3}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorGross)" 
                animationDuration={2000}
              />
              {/* Net Revenue Area (Front) (Vietnamese comment) */}
              <Area 
                type="monotone" 
                dataKey="netRevenue" 
                name={t('analytics.net_revenue')}
                stroke="#7c3aed" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorNet)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
             <span className="material-symbols-outlined text-4xl">analytics</span>
             <p className="text-[10px] font-black uppercase tracking-widest">{t('common.no_data_available', { defaultValue: 'No data available for this period' })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevenueAnalysisChart;
