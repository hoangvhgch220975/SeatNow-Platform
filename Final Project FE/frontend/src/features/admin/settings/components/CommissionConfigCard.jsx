import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCommissionConfig, useUpdateCommissionConfig } from '../hooks';
import { LucideSettings, LucideRefreshCcw, LucideCheckCircle2, LucideShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomSwitch = ({ checked, onChange }) => {
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus:outline-none ${
        checked ? 'bg-violet-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-slate-200'
      }`}
    >
      <motion.span
        animate={{ x: checked ? 28 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0"
      />
    </div>
  );
};

const CommissionConfigCard = () => {
  const { t } = useTranslation();
  const { data: config, isLoading } = useCommissionConfig();
  const updateConfig = useUpdateCommissionConfig();

  const [autoEnabled, setAutoEnabled] = useState(false);
  const [interval, setInterval] = useState('MONTH');

  // Sync local state when config is fetched
  useEffect(() => {
    if (config) {
      setAutoEnabled(config.autoEnabled || false);
      setInterval(config.interval || 'MONTH');
    }
  }, [config]);

  const handleToggle = (val) => {
    setAutoEnabled(val);
    updateConfig.mutate({ autoEnabled: val, interval });
  };

  const handleIntervalChange = (newVal) => {
    setInterval(newVal);
    updateConfig.mutate({ autoEnabled, interval: newVal });
  };

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-full animate-pulse flex flex-col gap-4">
        <div className="h-8 w-1/3 bg-slate-100 rounded-lg"></div>
        <div className="h-32 bg-slate-50 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-8 border-2 border-violet-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300 relative overflow-hidden"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-40" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
              <LucideSettings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                {t('admin.settings.commission.title')}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {t('admin.settings.commission.description')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Main Toggle Cell */}
          <div className="p-6 bg-violet-50/50 rounded-2xl border-2 border-violet-100 flex items-center justify-between group hover:border-violet-300 transition-colors">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-slate-900">
                {t('admin.settings.commission.auto_enabled')}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${autoEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                  {autoEnabled ? 'Autonomous Protocol' : 'Manual Control'}
                </span>
              </div>
            </div>
            <CustomSwitch
              checked={autoEnabled}
              onChange={handleToggle}
            />
          </div>

          {/* Interval Selection */}
          <div className={`transition-all duration-500 ${
            autoEnabled 
              ? 'opacity-100' 
              : 'opacity-50 grayscale pointer-events-none'
          }`}>
            <label className="block text-[11px] font-black text-violet-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <LucideRefreshCcw className={`w-3.5 h-3.5 ${autoEnabled ? 'animate-spin-slow' : ''}`} />
              {t('admin.settings.commission.interval')}
            </label>
            
            <div className="flex flex-wrap gap-2">
              {['DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleIntervalChange(opt)}
                  disabled={!autoEnabled}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                    interval === opt
                      ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200'
                      : 'bg-white border-violet-100 text-violet-400 hover:border-violet-300 hover:bg-violet-50'
                  }`}
                >
                  {t(`admin.settings.commission.intervals.${opt}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {updateConfig.isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-[2rem] z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-violet-600 text-[10px] font-black uppercase tracking-widest">Syncing Config...</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommissionConfigCard;
