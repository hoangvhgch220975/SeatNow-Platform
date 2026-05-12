import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file TableSelector.jsx
 * @description Hiển thị sơ đồ bàn ăn dưới dạng lưới (Cinema-style grid).
 * Phân biệt trạng thái bằng màu sắc và hiệu ứng hover.
 */
const TableSelector = ({ tables, selectedTableId, onSelectTable }) => {
  const { t } = useTranslation();

  // Định nghĩa màu sắc theo loại bàn (Type) và trạng thái
  // Định nghĩa màu sắc và hiệu ứng theo loại bàn (Type) và trạng thái
  const getTableTypeStyles = (type, isSelected, isOccupied, isHeld) => {
    // 1. Độ ưu tiên cao nhất: Bàn đã có người ngồi hoặc đã đặt thành công (Đỏ - Rose)
    if (isOccupied) return 'bg-rose-50 text-rose-300 border-rose-100 cursor-not-allowed opacity-60';
    
    // 2. Bàn đang được người khác giữ - Realtime Hold (Cam Vàng)
    if (isHeld) {
        return 'bg-amber-100/50 text-amber-600 border-amber-400 cursor-not-allowed shadow-[0_0_20px_rgba(251,191,36,0.3)] animate-pulse';
    }
    
    // 3. Bàn chính người dùng hiện tại đang chọn (Tím) - Luôn ưu tiên màu tím regardless of type
    if (isSelected) {
        return 'bg-primary text-white shadow-[0_20px_50px_rgba(99,14,212,0.4)] ring-4 ring-primary/30 scale-110 z-30 rounded-xl';
    }
    
    // 4. Bàn rảnh (Available) - Hiển thị theo loại bàn
    const isVIP = type?.toLowerCase() === 'vip';
    const isOutdoor = type?.toLowerCase() === 'outdoor';

    if (isVIP) {
      return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:scale-105 rounded-full';
    }

    if (isOutdoor) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:scale-105 rounded-lg rotate-45';
    }

    // Standard Available
    return 'bg-white text-table-number border-slate-200 hover:border-primary/40 hover:scale-105 rounded-xl';
  };

  // Lấy Visual Markers tùy theo Category
  const areaCategory = tables[0]?.category || 'FLOOR';
  
  const getMarkers = () => {
    switch(areaCategory) {
      case 'ROOFTOP': return { label: t('booking.table_status.markers.rooftop'), icon: 'location_city' };
      case 'OUTDOOR': return { label: t('booking.table_status.markers.outdoor'), icon: 'park' };
      case 'TERRACE': return { label: t('booking.table_status.markers.terrace'), icon: 'streetview' };
      default: return { label: t('booking.table_status.markers.default'), icon: 'theater_comedy' };
    }
  };

  const markers = getMarkers();

  return (
    <div className="space-y-10">
      {/* Visual Map Content - Flat Premium View */}
      <div className="relative group">
        <div className="max-w-5xl mx-auto p-12 lg:p-20 bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-white/60 relative overflow-hidden transition-all duration-700">
          
          {/* Floor Texture Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#630ed4 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

          {/* Visual Landmark: Stage/Fountain/View */}
          <div className="mb-20 text-center relative z-20">
              <div className="inline-flex flex-col items-center gap-4">
                  <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                  <div className="flex items-center gap-4 px-10 py-3 bg-white/80 border border-primary/10 rounded-2xl shadow-xl shadow-primary/5">
                      <span className="material-symbols-outlined text-primary text-xl animate-bounce">{markers.icon}</span>
                      <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary/80">
                          {markers.label}
                      </span>
                  </div>
              </div>
          </div>

          {/* Table Grid or Empty State */}
          {tables.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-7 gap-x-12 gap-y-16 justify-items-center relative z-10 preserve-3d">
              {tables.map((table) => {
                const isSelected = selectedTableId === table.id;
                const isOccupied = table.status === 'occupied';
                const isHeld = table.status === 'held';
                const styleClass = getTableTypeStyles(table.type, isSelected, isOccupied, isHeld);
                const isOutdoorUser = table.type === 'outdoor';

                return (
                  <div key={table.id} className="relative group/table preserve-3d">
                    <button
                      disabled={isOccupied || isHeld}
                      onClick={(isOccupied || isHeld) ? undefined : () => onSelectTable(table)}
                      className={`
                        w-16 h-16 flex flex-col items-center justify-center border-2 transition-all duration-500 relative
                        ${styleClass}
                        ${!isOccupied && !isHeld && !isSelected ? 'hover:shadow-xl hover:-translate-y-2' : ''}
                      `}
                    >
                      <div className={`flex flex-col items-center justify-center ${isOutdoorUser && !isSelected ? '-rotate-45' : ''}`}>
                        {/* Tên bàn - To và Đậm */}
                        <span className="text-sm font-black tracking-tight leading-none mb-1">
                          {table.tableNumber || table.number}
                        </span>
                        
                        {/* Sức chứa - Badge nhỏ gọn */}
                        <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'bg-white/20' : 'bg-slate-500/5 text-slate-500'}`}>
                          {table.capacity} {t('booking.table_status.guests')}
                        </div>
                      </div>

                      {/* Occupational Overlay (Đỏ) */}
                      {isOccupied && (
                        <div className="absolute inset-0 flex items-center justify-center bg-rose-50/40 backdrop-blur-[1px] rounded-inherit">
                          <span className="material-symbols-outlined text-lg text-rose-300/60">block</span>
                        </div>
                      )}

                      {/* Held Overlay */}
                      {isHeld && (
                        <div className="absolute inset-0 flex items-center justify-center bg-orange-100/20 backdrop-blur-[1px] rounded-inherit">
                          <span className="material-symbols-outlined text-lg text-orange-400 animate-spin-slow">hourglass_empty</span>
                        </div>
                      )}

                      {/* Selection Glow & Ring */}
                      {isSelected && (
                        <>
                          <div className="absolute -inset-1 rounded-inherit border border-white/50 pointer-events-none"></div>
                          <div className="absolute -inset-3 rounded-inherit border-2 border-primary/20 animate-pulse pointer-events-none"></div>
                        </>
                      )}
                    </button>
                    
                    {/* Perspective Shadow */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/10 blur-md rounded-full -z-10 group-hover/table:w-14 group-hover/table:bg-black/20 transition-all duration-500"></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                <span className="material-symbols-outlined text-4xl text-slate-200">grid_off</span>
              </div>
              <div className="text-center">
                <h4 className="text-base font-black text-slate-400 uppercase tracking-widest mb-1">{t('booking.table_status.empty_title')}</h4>
                <p className="text-[11px] font-medium text-slate-300">{t('booking.table_status.empty_desc')}</p>
              </div>
            </div>
          )}

          {/* Visual Cues - Entrance Marker (Flat) */}
          <div className="mt-20 flex justify-center">
              <div className="px-14 py-4 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em] ml-2">{t('booking.table_status.main_entrance')}</span>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
          </div>
        </div>
      </div>

      {/* Legend - Chú thích trạng thái & Loại bàn */}
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 px-10 py-8 bg-white border border-outline-variant/10 rounded-[2rem] shadow-sm">
        {/* Statuses */}
        <div className="flex items-center gap-8 pr-12 border-r border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{t('booking.table_status.available')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{t('booking.table_status.selected')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-400 animate-pulse ring-2 ring-amber-400/20"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">{t('booking.table_status.being_selected')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-rose-100 border border-rose-300 opacity-60"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">{t('booking.table_status.occupied')}</span>
          </div>
        </div>

        {/* Types */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('booking.table_status.standard')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-amber-100 border border-amber-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('booking.table_status.vip_table')}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-200"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('booking.table_status.outdoor_seating')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableSelector;
