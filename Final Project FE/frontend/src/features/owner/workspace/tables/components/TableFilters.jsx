import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TableFilters Component
 * Quản lý các bộ lọc khu vực, tìm kiếm và điều khiển chế độ hiển thị.
 * Tích hợp đầy đủ các khu vực từ Table structure.md.
 */
const TableFilters = ({ 
  currentFloor, 
  onFloorChange, 
  onSearch, 
  viewMode, 
  onViewModeChange,
  onAddTable 
}) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Danh sách các khu vực/tầng chuẩn của hệ thống
  const floors = [
    { id: 'all', label: t('tables.all_floors', { defaultValue: 'All Floors' }), icon: 'layers' },
    { id: '1st Floor', label: '1st Floor', icon: 'floor' },
    { id: '2nd Floor', label: '2nd Floor', icon: 'floor' },
    { id: '3rd Floor', label: '3rd Floor', icon: 'floor' },
    { id: '4th Floor', label: '4th Floor', icon: 'floor' },
    { id: '5th Floor', label: '5th Floor', icon: 'floor' },
    { id: 'Rooftop', label: 'Rooftop', icon: 'roofing' },
    { id: 'Terrace', label: 'Terrace', icon: 'deck' },
    { id: 'Outdoor', label: 'Outdoor', icon: 'wb_sunny' }
  ];

  const currentFloorLabel = floors.find(f => f.id === currentFloor)?.label || 'Select Floor';

  return (
    <div className="flex flex-col gap-8 mb-10">
      {/* Hàng 1: Dropdown Khu vực & Nút Thêm bàn */}
      <div className="flex items-center justify-between gap-6">
        <div className="relative">
          {/* Dropdown Button tùy chỉnh */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-slate-700 min-w-[220px] justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-violet-500 group-hover:scale-110 transition-transform">
                {floors.find(f => f.id === currentFloor)?.icon || 'location_on'}
              </span>
              <span className="text-sm">{currentFloorLabel}</span>
            </div>
            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Danh sách lựa chọn (Menu) */}
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* Lớp phủ để đóng dropdown khi click ngoài */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 top-full mt-3 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-3 z-50 overflow-hidden"
                >
                  <div className="max-h-80 overflow-y-auto scrollbar-thin">
                    {floors.map((floor) => (
                      <button
                        key={floor.id}
                        onClick={() => {
                          onFloorChange(floor.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1
                          ${currentFloor === floor.id 
                            ? 'bg-violet-50 text-violet-700' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
                        `}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {floor.icon}
                        </span>
                        {floor.label}
                        {currentFloor === floor.id && (
                          <span className="material-symbols-outlined text-sm ml-auto">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Nút Thêm bàn mới phong cách đồng bộ code.md */}
        <button
          onClick={onAddTable}
          className="flex items-center gap-3 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-0.5 active:scale-95 font-black whitespace-nowrap text-sm"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          {t('tables.add_table', { defaultValue: 'Add New Table' })}
        </button>
      </div>

      {/* Hàng 2: Tìm kiếm & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="relative flex-grow max-w-lg group">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors">
            search
          </span>
          <input
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t('tables.form.table_number', { defaultValue: 'Search by table number...' })}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all shadow-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => onViewModeChange('grid')}
            title={t('tables.view.grid', { defaultValue: 'Grid View' })}
            className={`p-3 rounded-xl flex items-center transition-all ${viewMode === 'grid' ? 'bg-violet-50 text-violet-600 shadow-inner' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-2xl">grid_view</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            title={t('tables.view.list', { defaultValue: 'List View' })}
            className={`p-3 rounded-xl flex items-center transition-all ${viewMode === 'list' ? 'bg-violet-50 text-violet-600 shadow-inner' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50'}`}
          >
            <span className="material-symbols-outlined text-2xl">view_list</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableFilters;
