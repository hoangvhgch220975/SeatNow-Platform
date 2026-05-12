import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * Biểu đồ phân bổ giờ cao điểm - Hiển thị theo mốc 2 tiếng dựa trên giờ mở cửa
 */
const PeakHoursChart = ({ data, openingHours }) => {
  const { t } = useTranslation();

  // 1. Xử lý dữ liệu để nhóm theo mốc 2 tiếng (aggregate 2h per slot)
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // 1. Bộ giải mã thông minh (Smart Parser) tương tự OpeningHoursForm để lấy giờ thực tế
    const getTodayHours = () => {
      if (!openingHours) return null;
      
      let hoursObj = openingHours;
      if (typeof hoursObj === 'string') {
        try { hoursObj = JSON.parse(hoursObj); } catch (e) { return hoursObj; }
      }
      if (typeof hoursObj !== 'object' || hoursObj === null) return null;

      const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayIdx = new Date().getDay();
      const todayName = daysOrder[todayIdx];
      const todayLower = todayName.toLowerCase();

      // Duyệt qua các phím để tìm giờ khớp với hôm nay
      let foundHours = null;
      Object.entries(hoursObj).forEach(([key, value]) => {
        const k = key.toLowerCase();
        if (k.includes('monday-sunday') || k.includes('mon-sun') || k.includes('everyday')) {
          foundHours = value;
        } else if ((k.includes('weekday') || k.includes('mon-fri')) && todayIdx >= 1 && todayIdx <= 5) {
          foundHours = value;
        } else if ((k.includes('weekend') || k.includes('sat-sun')) && (todayIdx === 0 || todayIdx === 6)) {
          foundHours = value;
        } else if (k.includes(todayLower) || k.includes(todayLower.substring(0, 3))) {
          foundHours = value;
        }
      });

      return foundHours;
    };

    const hoursStr = getTodayHours(); 
    const [openStr, closeStr] = hoursStr.split('-');
    const openHour = parseInt(openStr?.split(':')[0], 10) || 10;
    const closeHour = parseInt(closeStr?.split(':')[0], 10) || 23;

    // Tự động chọn bước nhảy (Step): nếu khung giờ mở cửa dài (>=12h), dùng 4h/slot cho thoáng theo yêu cầu
    const duration = closeHour - openHour;
    const step = duration >= 12 ? 4 : 2;

    const intervals = [];
    for (let h = openHour; h < closeHour; h += step) {
      const startH = h;
      const endH = Math.min(h + step, closeHour);
      
      const hourLabel = `${startH}-${endH}h`;
      
      // Cộng dồn dữ liệu cho toàn bộ khoảng thời gian trong Slot (step tiếng)
      let totalCount = 0;
      for (let offset = 0; offset < step; offset++) {
        const currentH = h + offset;
        if (currentH >= 24) break; // Giới hạn ngày
        const hStr = currentH < 10 ? `0${currentH}:00` : `${currentH}:00`;
        totalCount += data.find(d => d.hour === hStr)?.count || 0;
      }

      intervals.push({
        hour: hourLabel,
        count: totalCount,
        label: hourLabel
      });
    }
    return intervals;
  }, [data, openingHours]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-xl text-xs font-bold ring-1 ring-slate-700">
          {label}: {payload[0].value} {t('workspace_revenue.common.bookings').toLowerCase()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="mb-6">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          {t('workspace_revenue.charts.peak_hours')}
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          {t('workspace_revenue.charts.peak_hours_desc')}
        </p>
      </div>

      <div className="h-[220px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData}>
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
              interval={0} // Hiển thị tất cả các mốc 2h
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: '#f1f5f9', radius: 8 }} 
            />
            <Bar 
              dataKey="count" 
              radius={[6, 6, 0, 0]}
              barSize={32}
              animationDuration={1500}
            >
              {processedData.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={entry.count > 0 ? '#6366f1' : '#e0e7ff'} 
                   className="hover:fill-indigo-400 transition-colors duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakHoursChart;
