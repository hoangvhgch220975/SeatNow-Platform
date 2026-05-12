import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, Store, Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

// Module-scoped Hooks & Components
import { useAuditLeads, useAuditVenues, useAuditActions } from '../hooks';
import PartnerLeadTable from '../components/PartnerLeadTable';
import PendingRestaurantTable from '../../restaurants/components/PendingRestaurantTable';
import PartnerRequestDetailDialog from '../components/PartnerRequestDetailDialog';

// Admin Shared Components
import AdminActionDialog from '../../components/AdminActionDialog';

/**
 * @file AuditRequestsPage.jsx
 * @description Trung tâm kiểm duyệt hồ sơ tập trung.
 */
const AuditRequestsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'venues' ? 'venues' : 'leads';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [params, setParams] = useState({ page: 1, limit: 10 });

  // Data Fetching - BE trả về cấu trúc khác nhau cho từng endpoint
  const { data: leadsData, isLoading: loadingLeads } = useAuditLeads(params);
  const { data: venuesData, isLoading: loadingVenues } = useAuditVenues(params);

  // Leads: BE trả về object { 0: {...}, 1: {...}, success: true }
  const leads = leadsData
    ? Object.values(leadsData).filter(item => typeof item === 'object' && item !== null && item.id)
    : [];

  // Venues: BE trả về { success: true, data: [...] }
  const venues = Array.isArray(venuesData?.data)
    ? venuesData.data
    : Array.isArray(venuesData)
    ? venuesData
    : [];

  // Actions (Scoped to Audit Module)
  const { 
    approveLead, isApprovingLead, 
    rejectLead, isRejectingLead, 
    approveVenue, isApprovingVenue,
    rejectVenue, isRejectingVenue 
  } = useAuditActions();

  // Dialog State
  const [modal, setModal] = useState({ isOpen: false, data: null, type: 'approve_lead' });
  const [detailModal, setDetailModal] = useState({ isOpen: false, lead: null });

  const openApproveLeadModal = (lead) => {
    setModal({ isOpen: true, data: lead, type: 'approve_lead' });
  };

  const openRejectLeadModal = (lead) => {
    setModal({ isOpen: true, data: lead, type: 'reject' });
  };

  const openApproveVenueModal = (venue) => {
    setModal({ isOpen: true, data: venue, type: 'approve_restaurant' });
  };

  const openRejectVenueModal = (venue) => {
    setModal({ isOpen: true, data: venue, type: 'reject_restaurant' });
  };

  const openDetailModal = (lead) => {
    setDetailModal({ isOpen: true, lead });
  };

  const closeDetailModal = () => {
    setDetailModal({ isOpen: false, lead: null });
  };

  const handleConfirmAction = async (extraData) => {
    const id = modal.data?._id || modal.data?.id;
    try {
      if (modal.type === 'approve_lead') {
        await approveLead({ id, lead: modal.data });
      } else if (modal.type === 'reject') {
        await rejectLead(id);
      } else if (modal.type === 'reject_restaurant') {
        await rejectVenue(id);
      } else {
        await approveVenue(id);
      }
      setModal({ ...modal, isOpen: false });
    } catch (err) {
      console.warn('Action failed, keeping modal open.', err);
    }
  };

  const handlePageChange = (newPage) => {
    setParams({ ...params, page: newPage });
  };

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
          {t('admin.audit.title')}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {t('admin.audit.subtitle')}
        </p>
      </div>

      {/* Tabs Control */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 shadow-inner">
        <button
          onClick={() => {
            setActiveTab('leads');
            setSearchParams({ tab: 'leads' });
          }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'leads' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <UserPlus size={16} />
          {t('admin.audit.tabs.leads')} ({leads.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('venues');
            setSearchParams({ tab: 'venues' });
          }}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'venues' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Store size={16} />
          {t('admin.audit.tabs.venues')} ({venues.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        {activeTab === 'leads' ? (
          <PartnerLeadTable 
            leads={leads} 
            loading={loadingLeads} 
            pagination={null}
            onPageChange={handlePageChange}
            onApprove={openApproveLeadModal}
            onReject={openRejectLeadModal}
            onView={openDetailModal}
          />
        ) : (
          <PendingRestaurantTable 
            restaurants={venues} 
            loading={loadingVenues} 
            pagination={null}
            onPageChange={handlePageChange}
            onApprove={openApproveVenueModal}
            onReject={openRejectVenueModal}
          />
        )}
      </div>

      {/* Action Info Warning */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-6 flex gap-4">
        <div className="bg-blue-100 p-2 rounded-2xl text-blue-600 h-fit">
          <Info size={20} />
        </div>
        <div className="text-xs leading-relaxed text-blue-800 font-medium">
          <p className="font-bold mb-1 uppercase tracking-tight">{t('admin.audit.info.rules_title')}</p>
          <ul className="list-disc pl-4 space-y-1 opacity-80">
            <li>{t('admin.audit.info.rule_lead')}</li>
            <li>{t('admin.audit.info.rule_venue')}</li>
          </ul>
        </div>
      </div>

      {/* Action Dialog */}
      <AdminActionDialog
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleConfirmAction}
        data={modal.data}
        type={modal.type}
        loading={isApprovingLead || isRejectingLead || isApprovingVenue || isRejectingVenue}
      />

      {/* Detail Dialog */}
      <PartnerRequestDetailDialog
        isOpen={detailModal.isOpen}
        onClose={closeDetailModal}
        lead={detailModal.lead}
        onApprove={(lead) => {
          closeDetailModal();
          openApproveLeadModal(lead);
        }}
        onReject={(lead) => {
          closeDetailModal();
          openRejectLeadModal(lead);
        }}
        isApproving={isApprovingLead}
        isRejecting={isRejectingLead}
      />
    </div>
  );
};

export default AuditRequestsPage;
