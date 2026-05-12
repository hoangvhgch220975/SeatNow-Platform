import React from 'react';

/**
 * @component CapacityChecker
 * @description Kiểm tra sức chứa bàn so với số lượng khách (partySize).
 * @param {Object} props
 * @param {number} props.partySize - Số lượng khách thực tế.
 * @param {Object} props.table - Thông tin bàn (id, capacity, tableNumber).
 */
const CapacityChecker = ({ partySize, table }) => {
  if (!table) return null;

  const isOverloaded = partySize > table.capacity;
  const isPerfectFit = partySize === table.capacity;
  const isUnderCapacity = partySize < table.capacity;

  return (
    <div className={`mt-2 flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${isOverloaded ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isOverloaded ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}>
        <span className="material-symbols-outlined text-[16px] font-black">
          {isOverloaded ? 'warning' : 'check_circle'}
        </span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isOverloaded ? 'text-rose-600' : 'text-emerald-700'}`}>
            {isOverloaded ? 'Capacity Alert' : 'Capacity Status'}
          </span>
          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isOverloaded ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'}`}>
            Max {table.capacity}
          </span>
        </div>
        
        <p className={`text-[11px] font-semibold tracking-tight truncate ${isOverloaded ? 'text-rose-500' : 'text-emerald-600'}`}>
          {isOverloaded 
            ? `Table is overcrowded for ${partySize} guests.` 
            : isPerfectFit 
                ? 'Perfect fit for your party size.' 
                : `Spacious choice for ${partySize} guests.`}
        </p>
      </div>
    </div>
  );
};

export default CapacityChecker;
