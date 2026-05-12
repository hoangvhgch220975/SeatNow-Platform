import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Header của trang Revenue với bộ chọn Chu kỳ
 */
const RevenueHeader = ({ period, setPeriod, onRefresh }) => {
  const { t } = useTranslation();

  const periods = [
    { id: 'day', label: t('analytics.day') },
    { id: 'week', label: t('analytics.week') },
    { id: 'month', label: t('analytics.month') },
    { id: 'quarter', label: t('analytics.quarter') },
    { id: 'year', label: t('analytics.year') },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
          {t('workspace_revenue.title')}
        </h2>
        <p className="text-slate-500 font-medium">
          {t('workspace_revenue.subtitle')}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Period Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={clsx(
                "px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
                period === p.id 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
            title={t('common.refresh')}
          >
            <RefreshCcw size={20} />
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default RevenueHeader;
