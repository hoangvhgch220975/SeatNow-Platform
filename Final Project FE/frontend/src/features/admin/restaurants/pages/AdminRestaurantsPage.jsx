import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Download, Store, ShieldCheck, ShieldAlert, Lock } from 'lucide-react';
import RestaurantFilters from '../components/RestaurantFilters';
import RestaurantTable from '../components/RestaurantTable';
import ApproveRestaurantDialog from '../components/ApproveRestaurantDialog';
import RestaurantDetailDialog from '../components/RestaurantDetailDialog';
import { useAdminRestaurants, useRestaurantActions } from '../hooks';
import Pagination from '../../../../shared/ui/Pagination';

/**
 * @file AdminRestaurantsPage.jsx
 * @description Trang quản lý danh sách tất cả nhà hàng dành cho Admin.
 */
const AdminRestaurantsPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ q: '', status: 'all', page: 1, limit: 10 });
  
  // Dialog State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    restaurant: null,
    type: 'approve' // approve, suspend, activate
  });

  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    restaurant: null
  });

  const { data, isLoading } = useAdminRestaurants(filters);
  const { approve, suspend, activate, isApproving, isSuspending, isActivating } = useRestaurantActions();

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const openActionModal = (type, restaurant) => {
    setActionModal({
      isOpen: true,
      restaurant,
      type
    });
  };

  const closeActionModal = () => {
    setActionModal(prev => ({ ...prev, isOpen: false }));
  };

  const openDetailModal = (restaurant) => {
    setDetailModal({
      isOpen: true,
      restaurant
    });
  };

  const handleConfirmAction = () => {
    const { type, restaurant } = actionModal;
    if (!restaurant) return;

    if (type === 'approve') approve(restaurant.id);
    else if (type === 'suspend') suspend(restaurant.id);
    else if (type === 'activate') activate(restaurant.id);
    
    closeActionModal();
  };

  // Extract pagination from data (BE response)
  const restaurants = data?.data || data || [];
  const pagination = data?.pagination || { total: restaurants.length, page: filters.page, limit: filters.limit };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
            {t('admin.restaurants.title')}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t('admin.restaurants.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-2xl hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 active:scale-95">
            <Plus size={18} />
            Add Restaurant
          </button>
        </div>
      </div>

      {/* Stats Bento (Optional but looks premium) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Store, color: 'text-blue-500 bg-blue-50', label: t('admin.restaurants.stats.total'), value: pagination.total },
          { icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50', label: t('admin.restaurants.stats.active'), value: '84' }, // Mock stat
          { icon: ShieldAlert, color: 'text-orange-500 bg-orange-50', label: t('admin.restaurants.stats.pending'), value: '12' }, // Mock stat
          { icon: Lock, color: 'text-rose-500 bg-rose-50', label: t('admin.restaurants.stats.suspended'), value: '3' }, // Mock stat
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{stat.label}</div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter & Table Area */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        
        <RestaurantFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        
        <RestaurantTable 
          restaurants={restaurants} 
          loading={isLoading} 
          onAction={openActionModal}
          onViewDetail={openDetailModal}
        />

        {/* Pagination */}
        {pagination.total > filters.limit && (
          <div className="mt-8 flex justify-center">
            <Pagination 
              currentPage={filters.page}
              totalItems={pagination.total}
              itemsPerPage={filters.limit}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <ApproveRestaurantDialog
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
        restaurant={actionModal.restaurant}
        actionType={actionModal.type}
        loading={isApproving || isSuspending || isActivating}
      />

      {/* Detail Dialog */}
      <RestaurantDetailDialog 
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, restaurant: null })}
        restaurant={detailModal.restaurant}
      />
    </div>
  );
};

export default AdminRestaurantsPage;
