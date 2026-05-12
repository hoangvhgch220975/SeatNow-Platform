import React, { useState, useMemo, useEffect } from 'react';
import { usePortfolioDashboard } from '../hooks.js';
import VenueFilters from '../components/VenueFilters';
import VenueList from '../components/VenueList';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next'; // Áp dụng hook ngôn ngữ (Vietnamese comment)

/**
 * @file OwnerRestaurantsPage.jsx
 * @description Trang hiển thị danh sách toàn bộ nhà hàng (All Venues) với bộ lọc trạng thái và tìm kiếm.
 */
const OwnerRestaurantsPage = () => {
  const { t } = useTranslation(); // Lấy hàm dịch i18n (Vietnamese comment)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'table' ? 10 : 6;

  // Lấy dữ liệu từ hook Portfolio (Đảm bảo lấy tất cả trạng thái từ Backend)
  const { myRestaurants, isLoading } = usePortfolioDashboard({ status: 'all' });

  // Reset về trang 1 khi thay đổi bộ lọc hoặc chế độ xem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeStatus, viewMode]);

  // Logic lọc và tính toán số lượng
  const filteredVenues = useMemo(() => {
    if (!myRestaurants) return [];

    return myRestaurants.filter((venue) => {
      // 1. Lọc theo tên hoặc địa chỉ
      const matchesSearch = 
        venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address?.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Lọc theo trạng thái
      const matchesStatus = 
        activeStatus === 'all' || 
        venue.status?.toLowerCase() === activeStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [myRestaurants, searchTerm, activeStatus]);

  // Tính toán số lượng cho các Tabs
  const counts = useMemo(() => {
    if (!myRestaurants) return { all: 0, active: 0, pending: 0, suspended: 0 };

    return {
      all: myRestaurants.length,
      active: myRestaurants.filter(v => v.status?.toLowerCase() === 'active').length,
      pending: myRestaurants.filter(v => v.status?.toLowerCase() === 'pending').length,
      suspended: myRestaurants.filter(v => v.status?.toLowerCase() === 'suspended').length,
    };
  }, [myRestaurants]);

  // Logic cắt dữ liệu cho trang hiện tại
  const paginatedVenues = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVenues.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVenues, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-2">
      {/* Tiêu đề trang (Page Header) */}
      <div className="mb-8 space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          <Trans i18nKey="owner_portal.venues_page.all_venues">
            All <span className="text-violet-600">Venues</span>
          </Trans>
        </h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
           {t('owner_portal.venues_page.portfolio_asset_management')}
           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
           {t('owner_portal.venues_page.total_units', { count: counts.all })}
        </p>
      </div>

      {/* Phần bộ lọc (Filter Section) */}
      <VenueFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        counts={counts}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Danh sách hiển thị dạng Lưới/Bảng (Grid/Table List Section) */}
      <VenueList 
        restaurants={paginatedVenues}
        isLoading={isLoading}
        viewMode={viewMode}
      />

      {/* BỘ PHÂN TRANG (Pagination Section) */}
      {!isLoading && filteredVenues.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6 px-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 mt-8">
           <div className="space-y-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                 {t('owner_portal.home.operational_inventory')}
              </div>
              <div className="text-xs font-bold text-slate-600 italic">
                 <Trans 
                   i18nKey="owner_portal.home.showing_entities"
                   values={{
                     start: (currentPage - 1) * itemsPerPage + 1,
                     end: Math.min(currentPage * itemsPerPage, filteredVenues.length),
                     total: filteredVenues.length
                   }}
                 >
                   Đang hiển thị <span className="text-violet-600 font-black not-italic">{"{{start}}"} - {"{{end}}"}</span> trên <span className="text-slate-900 font-black not-italic">{"{{total}}"}</span> cơ sở
                 </Trans>
              </div>
           </div>
           
           <div className="flex items-center gap-3 bg-white p-1.5 rounded-[2rem] shadow-sm border border-slate-100">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, idx) => {
                  const p = idx + 1;
                  return (
                    <button 
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-11 h-11 rounded-full text-[11px] font-black transition-all ${
                        currentPage === p 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 disabled:opacity-20 disabled:cursor-not-allowed hover:bg-violet-50 hover:text-violet-600 transition-all border border-transparent hover:border-violet-100"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
           </div>
        </div>
      )}

      {/* Ghi chú tối ưu hóa danh mục (Optimization Note) */}
      <div className="mt-10 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-violet-600 shadow-sm border border-slate-100">
               <span className="material-symbols-outlined text-3xl">insights</span>
            </div>
            <div>
               <h4 className="font-black text-slate-900 text-sm">{t('owner_portal.venues_page.portfolio_insights')}</h4>
               <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  {t('owner_portal.venues_page.portfolio_insights_desc')}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OwnerRestaurantsPage;
