import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserPlus } from 'lucide-react';

// Module-scoped Components & Hooks
import OwnerAccountTable from '../components/OwnerAccountTable';
import PartnerDialog from '../components/PartnerDialog';
import { useActiveOwners, usePartnerActions } from '../hooks';

// Admin Shared Components
import AdminActionDialog from '../../components/AdminActionDialog';

/**
 * @file PartnerManagementPage.jsx
 * @description Trang quản lý danh sách các Chủ nhà hàng hiện có (Partners) với CRUD và Phân trang.
 */
const PartnerManagementPage = () => {
  const { t } = useTranslation();
  
  // State quản lý Filters & Pagination
  const [params, setParams] = useState({
    keyword: '',
    page: 1,
    limit: 5
  });

  // Scoped Data Fetching
  const { data = { data: [], pagination: {} }, isLoading } = useActiveOwners(params);
  
  // Scoped Actions
  const { 
    createOwner, isCreating,
    updateOwner, isUpdating,
    deleteOwner, isDeleting,
    resetPassword, isResettingPassword 
  } = usePartnerActions();

  // Modal states
  const [dialog, setDialog] = useState({ isOpen: false, partner: null });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', partner: null });

  // Handlers
  const handleSearch = (val) => {
    let normalizedVal = val;
    // Nếu người dùng nhập số điện thoại bắt đầu bằng 0 (dài từ 10-11 số)
    if (/^0[0-9]{9,10}$/.test(val.trim())) {
      normalizedVal = '+84' + val.trim().slice(1);
    }
    setParams({ ...params, keyword: normalizedVal, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setParams({ ...params, page: newPage });
  };

  const handleOpenDialog = (partner = null) => {
    setDialog({ isOpen: true, partner });
  };

  const handleSavePartner = async (formData) => {
    try {
      if (dialog.partner) {
        // Mode: Edit
        await updateOwner({ id: dialog.partner._id || dialog.partner.id, data: formData });
      } else {
        // Mode: Create
        await createOwner(formData);
      }
      setDialog({ isOpen: false, partner: null });
    } catch (err) {
      // Error handled by mutation toast
    }
  };

  const handleOpenConfirm = (partner, type) => {
    setConfirmModal({ isOpen: true, type, partner });
  };

  const handleConfirmAction = async (extraData = null) => {
    const id = confirmModal.partner._id || confirmModal.partner.id;
    const name = confirmModal.partner.name || confirmModal.partner.fullName;

    if (confirmModal.type === 'delete') {
      await deleteOwner({ id, name });
    } else if (confirmModal.type === 'reset') {
      await resetPassword({ 
        id, 
        name,
        data: extraData ? { newPassword: extraData } : {} 
      });
    }
    setConfirmModal({ isOpen: false, type: '', partner: null });
  };

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
            {t('admin.partners.title')}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t('admin.partners.subtitle')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={params.keyword}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t('admin.partners.search_placeholder')}
              className="block w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm"
            />
          </div>

          <button
            onClick={() => handleOpenDialog()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95"
          >
            <UserPlus size={16} />
            {t('admin.partners.actions.add')}
          </button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
        <OwnerAccountTable 
          owners={data.data} 
          loading={isLoading} 
          pagination={data.pagination}
          onPageChange={handlePageChange}
          onEdit={handleOpenDialog}
          onDelete={(p) => handleOpenConfirm(p, 'delete')}
          onResetPassword={(p) => handleOpenConfirm(p, 'reset')} 
        />
      </div>

      {/* Popups */}
      <PartnerDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, partner: null })}
        onSave={handleSavePartner}
        partner={dialog.partner}
        loading={isCreating || isUpdating}
      />

      {confirmModal.isOpen && (
        <AdminActionDialog
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ isOpen: false, type: '', partner: null })}
          onConfirm={handleConfirmAction}
          data={confirmModal.partner}
          type={confirmModal.type} 
          loading={isDeleting || isResettingPassword}
        />
      )}
    </div>
  );
};

export default PartnerManagementPage;
