import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';

/**
 * @file BookingVolumeChart.jsx
 * @description Biểu đồ cột thể hiện lượng đặt bàn theo thời gian.
 */
const BookingVolumeChart = ({ data, isLoading, restaurant, selectedDate, onDateChange }) => {
  const { t } = useTranslation();

  const handleDateChange = (e) => {
    if (onDateChange) {
      onDateChange(e.target.value);
    }
  };

  // 1. Ánh xạ dữ liệu từ API sang định dạng Recharts (Vietnamese comment)
  const chartData = React.useMemo(() => {
    // 1.1 Xác định khung giờ mở cửa (Hỗ trợ Smart Parsing tương tự public side) (Vietnamese comment)
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
    
    // Đồng bộ với DB: Database đang gom nhóm theo bucket chẵn (00, 02, 04... 16, 18)
    // Cần làm tròn startHour xuống số chẵn và endHour lên số chẵn
    let rawStart = parseInt(startStr.split(':')[0]);
    let startHour = rawStart % 2 !== 0 ? rawStart - 1 : rawStart;
    
    const endParts = endStr.split(':');
    let rawEnd = parseInt(endParts[0]) + (parseInt(endParts[1] || 0) / 60);
    let endHourVal = Math.ceil(rawEnd);
    if (endHourVal % 2 !== 0) endHourVal += 1;

    // 1.2 Tạo dải giờ đầy đủ (Full hourly slots - 2-hour buckets) (Vietnamese comment)
    const hourlyData = [];
    for (let h = startHour; h <= endHourVal; h += 2) {
      const hourLabel = `${h.toString().padStart(2, '0')}:00`;
      
      let bucketCount = 0;
        if (Array.isArray(data)) {
          data.forEach(item => {
            let itemTime = item.timePeriod || item.time_period || item.hour || item.label || '';
            if (itemTime === undefined || itemTime === null || itemTime === '') return;

            let dbHour = -1;
            const timeStr = String(itemTime);
            
            // Xử lý đa dạng định dạng: "2026-04-10 19:00", "19:00", ISO, hoặc số 19 (Vietnamese comment)
            if (timeStr.includes(' ')) {
              dbHour = parseInt(timeStr.split(' ')[1].split(':')[0], 10);
            } else if (timeStr.includes('T')) {
              dbHour = parseInt(timeStr.split('T')[1].split(':')[0], 10);
            } else if (timeStr.includes(':')) {
              dbHour = parseInt(timeStr.split(':')[0], 10);
            } else {
              dbHour = parseInt(timeStr, 10);
            }

            // Kiểm tra xem dữ liệu có nằm trong dải 2 tiếng của bucket không [h, h+2) (Vietnamese comment)
            if (dbHour >= 0 && dbHour < 24 && dbHour >= h && dbHour < h + 2) {
              bucketCount += Number(item.totalBookings || item.count || item.total_bookings || 0);
            }
          });
        }

      hourlyData.push({
        hour: hourLabel,
        count: bucketCount
      });
    }

    return hourlyData;
  }, [data, restaurant, selectedDate]);

  // 2. Tìm giờ cao điểm (Peak Hour) từ dữ liệu thực (Vietnamese comment)
  const peak = React.useMemo(() => {
    return [...chartData].sort((a, b) => b.count - a.count)[0];
  }, [chartData]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_40px_rgba(99,14,212,0.02)] border border-slate-50 flex flex-col h-full">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            {t('workspace.dashboard.booking_volume')}
          </h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
            {t('charts.computing_data')}
          </p>
        </div>
        {onDateChange && (
          <input 
            type="date"
            value={selectedDate || ''}
            onChange={handleDateChange}
            className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          />
        )}
      </div>

      <div className="h-[400px] w-full mt-10 relative z-10">
        {isLoading ? (
          <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="hour" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fontWeight: 800, fill: '#64748b', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '1.25rem', 
                  border: 'none', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  padding: '1rem',
                  fontFamily: '"Plus Jakarta Sans", sans-serif'
                }}
                itemStyle={{ color: '#7c3aed', fontWeight: 900, fontSize: '14px', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                labelStyle={{ fontWeight: 900, color: '#1e293b', marginBottom: '0.4rem', fontSize: '9px', textTransform: 'uppercase', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              />
              <Bar 
                dataKey="count" 
                name={t('analytics.total_bookings')}
                radius={[8, 8, 0, 0]} 
                barSize={24}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.hour === peak?.hour ? '#7c3aed' : '#e2e8f0'} 
                    className="hover:fill-primary/60 transition-colors duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {t('workspace.dashboard.peak_hours', { time: peak?.hour ? `${peak.hour} - ${parseInt(peak.hour)+2}:00` : '19:00 - 21:00' })}
        </p>
      </div>
    </div>
  );
};

export default BookingVolumeChart;
