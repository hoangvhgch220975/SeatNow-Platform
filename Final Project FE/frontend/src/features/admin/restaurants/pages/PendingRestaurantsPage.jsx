import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Info, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../config/routes';
import PendingRestaurantTable from '../components/PendingRestaurantTable';
import AdminActionDialog from '../../components/AdminActionDialog';
import { useAdminPendingRestaurants, useRestaurantActions } from '../hooks';

/**
 * @file PendingRestaurantsPage.jsx
 * @description Trang quản lý các nhà hàng đang chờ duyệt.
 */
const PendingRestaurantsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Dialog State
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    restaurant: null,
    type: 'approve_restaurant'
  });

  const { data, isLoading, refetch, isRefetching } = useAdminPendingRestaurants();
  const restaurants = data?.data || data || [];
  const { approve, isApproving } = useRestaurantActions();

  const openApproveModal = (restaurant) => {
    setActionModal({
      isOpen: true,
      restaurant,
      type: 'approve_restaurant'
    });
  };

  const closeActionModal = () => {
    setActionModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleConfirmAction = () => {
    const { restaurant } = actionModal;
    if (!restaurant) return;
    
    // Mutation calls
    approve({ id: restaurant.id, name: restaurant.name });
    closeActionModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-4 duration-700">
      {/* Navigation & Header */}
      <div className="mb-10">
        <button 
          onClick={() => navigate(ROUTES.ADMIN_RESTAURANTS)}
          className="flex items-center gap-2 text-slate-400 hover:text-violet-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          {t('admin.restaurants.title')}
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                {t('admin.restaurants.pending_title')}
              </h1>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-black rounded-full border border-orange-200 shadow-sm animate-pulse">
                {restaurants.length} {t('admin.restaurants.filters.pending')}
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {t('admin.restaurants.pending_subtitle')}
            </p>
          </div>

          <button 
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isRefetching ? 'animate-spin' : ''} />
            {isRefetching ? t('common.reloading') : t('common.refresh')}
          </button>
        </div>
      </div>

      {/* Info Warning Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 mb-8 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
          <Info size={24} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-tight">{t('admin.restaurants.protocol_check')}</h4>
          <p className="text-amber-800/80 text-xs leading-relaxed max-w-3xl">
            {t('admin.restaurants.protocol_desc')}
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="relative">
        <PendingRestaurantTable 
          restaurants={restaurants} 
          loading={isLoading} 
          onApprove={openApproveModal}
          onReject={(res) => alert('Feature coming soon: Reject with reason')}
        />
      </div>

      {/* Approve Dialog */}
      <AdminActionDialog
        isOpen={actionModal.isOpen}
        onClose={closeActionModal}
        onConfirm={handleConfirmAction}
        data={actionModal.restaurant}
        type={actionModal.type}
        loading={isApproving}
      />
    </div>
  );
};

export default PendingRestaurantsPage;
