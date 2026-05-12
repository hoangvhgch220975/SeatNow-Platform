import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CommissionConfigCard from '../components/CommissionConfigCard';
import ServiceHealthCard from '../components/ServiceHealthCard';
import { LucideSettings, LucideInfo } from 'lucide-react';

const AdminSettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
            {t('admin.settings.title')}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            {t('admin.settings.subtitle')}
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Commission Configuration */}
        <div className="xl:col-span-12 xxl:col-span-4 xl:order-2 xxl:order-1">
          <CommissionConfigCard />
        </div>

        {/* Right Column: Health Monitoring (Priority) */}
        <div className="xl:col-span-12 xxl:col-span-8 xl:order-1 xxl:order-2">
          <ServiceHealthCard />
        </div>

      </div>

      {/* Footer Decoration */}
      <div className="pt-8 border-t border-slate-100 flex justify-center opacity-30">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">
          SeatNow Management OS • v1.2-Stable
        </p>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
