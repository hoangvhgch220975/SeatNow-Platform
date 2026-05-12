import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file SystemStatusGrid.jsx
 * @description Hiển thị trạng thái vận hành của các dịch vụ lõi (AI, User, Booking, Notification).
 */
const SystemStatusGrid = () => {
  const { t } = useTranslation();

  // Danh sách trạng thái giả lập cho hệ thống (VI: Mocked system status)
  // Thực tế có thể kết nối với endpoint /health của từng service (Vietnamese: In reality, connect to /health of each service)
  const services = [
    { id: 'ai', name: 'AI Service', status: 'online', latency: '45ms' },
    { id: 'booking', name: 'Booking API', status: 'online', latency: '12ms' },
    { id: 'user', name: 'User Management', status: 'online', latency: '8ms' },
    { id: 'notify', name: 'Notification Hub', status: 'online', latency: '24ms' },
    { id: 'admin', name: 'Admin Core', status: 'online', latency: '15ms' },
    { id: 'search', name: 'Search Engine', status: 'online', latency: '110ms' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">
        {t('admin.dashboard.system.health')}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {services.map((svc) => (
          <div key={svc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1 hover:bg-white hover:shadow-sm transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{svc.name}</span>
              <span className={`h-1.5 w-1.5 rounded-full ${svc.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[9px] font-bold text-slate-400 capitalize">{svc.status === 'online' ? t('admin.dashboard.system.online') : t('admin.dashboard.system.offline')}</span>
              <span className="text-[9px] font-black text-slate-800">{svc.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatusGrid;
