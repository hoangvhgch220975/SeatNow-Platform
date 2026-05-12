import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file FloorFilter.jsx
 * @description Bộ lọc tầng (Location) cho sơ đồ bàn.
 */
const FloorFilter = ({ floors, activeFloor, onSelectFloor }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/50 ml-1">
        {t('booking.table_status.select_area')}
      </label>
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/10">
        {floors.map((floor) => {
          const isActive = activeFloor === floor.id;
          return (
            <button
              key={floor.id}
              onClick={() => onSelectFloor(floor.id)}
              className={`
                flex-1 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${isActive 
                  ? 'bg-white text-primary shadow-lg shadow-primary/10' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {isActive && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>}
                {floor.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FloorFilter;
