import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Download, Store, ShieldCheck, ShieldAlert, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import RestaurantFilters from '../components/RestaurantFilters';
import RestaurantTable from '../components/RestaurantTable';
import AdminActionDialog from '../../components/AdminActionDialog';
import EditRestaurantDialog from '../components/EditRestaurantDialog';
import CreateRestaurantDialog from '../components/CreateRestaurantDialog';
import RestaurantDetailDialog from '../components/RestaurantDetailDialog';
import { useAdminRestaurants, useRestaurantActions } from '../hooks';
import { useDashboardStats } from '../../dashboard/hooks';

/**
 * @file ActiveVenuesPage.jsx
 * @description Trang quản trị vận hành danh sách nhà hàng.
 */
const ActiveVenuesPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ q: '', status: 'all', page: 1, limit: 5 });
  
  // Dialog State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    data: null,
    type: 'suspend'
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    data: null
  });

  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    restaurant: null
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data, isLoading } = useAdminRestaurants(filters);
  const { data: statsData } = useDashboardStats();
  const { suspend, activate, update, create, isSuspending, isActivating, isUpdating, isCreating } = useRestaurantActions();

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const openActionModal = (type, restaurant) => {
    switch (type) {
      case 'suspend':
        setActionModal({ isOpen: true, data: restaurant, type: 'suspend' });
        break;
      case 'activate':
        setActionModal({ isOpen: true, data: restaurant, type: 'activate' });
        break;
      case 'edit':
        setEditModal({ isOpen: true, data: restaurant });
        break;
      case 'view':
        setDetailModal({ isOpen: true, restaurant });
        break;
      default:
        break;
    }
  };

  const closeActionModal = () => {
    setActionModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmAction = () => {
    const { type, data: restaurant } = actionModal;
    if (!restaurant) return;

    const payload = { id: restaurant.id, name: restaurant.name };

    if (type === 'suspend') suspend(payload);
    else if (type === 'activate') activate(payload);
    
    closeActionModal();
  };

  const handleEditConfirm = async (id, updatedData) => {
    try {
      await update({ id, data: updatedData });
      setEditModal({ isOpen: false, data: null });
    } catch (err) {
      // toast handled in hook
    }
  };

  const handleCreateConfirm = async (newData) => {
    try {
      await create(newData);
      setCreateModalOpen(false);
    } catch (err) {
      // toast handled in hook
    }
  };

  const restaurants = data?.data || data || [];
  const pagination = data?.pagination || { total: restaurants.length, page: filters.page, limit: filters.limit };
  
  // Thống kê tổng quan (Admin Stats)
  const stats = {
    totalRestaurants: statsData?.totalRestaurants || pagination.total || 0,
    active: statsData?.activeRestaurants ?? (filters.status === 'active' ? pagination.total : restaurants.filter(r => r.status === 'active').length),
    suspended: statsData?.suspendedRestaurants ?? (filters.status === 'suspended' ? pagination.total : restaurants.filter(r => r.status === 'suspended').length),
    pending: statsData?.pendingRestaurants || 0
  };

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
            {t('admin.restaurants.title')}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t('admin.restaurants.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="group relative flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl shadow-lg shadow-violet-200 transition-all font-bold active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500" />
          <Plus className="w-5 h-5 relative z-10" />
          <span className="relative z-10">{t('admin.restaurants.edit_form.create_title')}</span>
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { 
            icon: Store, 
            color: 'text-blue-500 bg-blue-50', 
            label: t('admin.restaurants.stats.total'), 
            value: stats.totalRestaurants 
          },
          { 
            icon: ShieldCheck, 
            color: 'text-emerald-500 bg-emerald-50', 
            label: t('admin.restaurants.stats.active'), 
            value: stats.active 
          },
          { 
            icon: Lock, 
            color: 'text-rose-500 bg-rose-50', 
            label: t('admin.restaurants.stats.suspended'), 
            value: stats.suspended 
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md hover:border-violet-200 group">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={22} />
            </div>
            <div className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden">
        <RestaurantFilters onFilterChange={handleFilterChange} initialFilters={filters} />
        
        <RestaurantTable 
          restaurants={restaurants} 
          loading={isLoading} 
          onAction={openActionModal}
          onViewDetail={(res) => openActionModal('view', res)}
        />

        {/* Pagination Section */}
        {!isLoading && pagination.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t('common.showing')} <span className="text-slate-700">{restaurants.length}</span> {t('common.of')} <span className="text-slate-700">{pagination.total}</span> {t('admin.restaurants.table.restaurant')}
            </div>
            
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1 text-sm font-bold">
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 rounded-xl transition-all ${
                        filters.page === i + 1 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= pagination.totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditRestaurantDialog 
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, data: null })}
        onConfirm={handleEditConfirm}
        data={editModal.data}
        loading={isUpdating}
      />

      {/* Create Dialog */}
      <CreateRestaurantDialog
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onConfirm={handleCreateConfirm}
        isLoading={isCreating}
      />

      <AdminActionDialog
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
        data={actionModal.data}
        type={actionModal.type}
        loading={isSuspending || isActivating}
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

export default ActiveVenuesPage;
