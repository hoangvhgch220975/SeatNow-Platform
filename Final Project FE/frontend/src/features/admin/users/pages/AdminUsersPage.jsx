import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Filter, Info, UserCheck, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUsersList, useUserActions, useAdminUserStats } from '../hooks';
import UserTable from '../components/UserTable';
import UserStats from '../components/UserStats';
import AdminActionDialog from '../../components/AdminActionDialog';

/**
 * @file AdminUsersPage.jsx
 * @description Trang quản lý người dùng tập trung dành cho Admin.
 */
const AdminUsersPage = () => {
  const { t } = useTranslation();
  
  // State quản lý bộ lọc và phân trang
  const [params, setParams] = useState({
    keyword: '',
    role: '',
    page: 1,
    limit: 5
  });

  // Debounced keyword (optional, but good for UX)
  const [searchTerm, setSearchTerm] = useState('');

  // Data fetching
  const { data, isLoading } = useUsersList(params);
  const { deleteUser, isDeleting } = useUserActions();
  const { data: statsData, isLoading: isStatsLoading } = useAdminUserStats();

  // Dialog state
  const [modal, setModal] = useState({ isOpen: false, data: null });

  // Xử lý tìm kiếm với chuẩn hóa số điện thoại
  useEffect(() => {
    const timer = setTimeout(() => {
      let normalizedKeyword = searchTerm.trim();
      
      // Nếu người dùng nhập số điện thoại bắt đầu bằng 0 (dài từ 10-11 số)
      if (/^0[0-9]{9,10}$/.test(normalizedKeyword)) {
        normalizedKeyword = '+84' + normalizedKeyword.slice(1);
      }
      
      setParams(prev => ({ ...prev, keyword: normalizedKeyword, page: 1 }));
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleRoleChange = (role) => {
    setParams(prev => ({ ...prev, role, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const openDeleteModal = (user) => {
    setModal({ isOpen: true, data: user });
  };

  const handleConfirmDelete = async () => {
    if (!modal.data) return;
    try {
      await deleteUser(modal.data.id);
      setModal({ isOpen: false, data: null });
    } catch (err) {
      // Error is handled in hook toast
    }
  };

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
          {t('admin.users.title')}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {t('admin.users.subtitle')}
        </p>
      </div>

      {/* Statistics Section */}
      <UserStats 
        stats={statsData?.data} 
        loading={isStatsLoading} 
      />

      {/* Controls: Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('admin.users.filters.search_placeholder')}
            className="block w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 shadow-sm placeholder:text-slate-400"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 w-full md:w-auto bg-slate-100/80 rounded-2xl overflow-x-auto no-scrollbar">
          <button 
            onClick={() => handleRoleChange('')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              params.role === '' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('admin.users.filters.role_all')}
          </button>
          <button 
            onClick={() => handleRoleChange('CUSTOMER')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
              params.role === 'CUSTOMER' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck size={14} />
            {t('admin.users.filters.role_customer')}
          </button>
          <button 
            onClick={() => handleRoleChange('RESTAURANT_OWNER')}
            className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
              params.role === 'RESTAURANT_OWNER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Shield size={14} />
            {t('admin.users.filters.role_owner')}
          </button>
        </div>
      </div>

      {/* Main Content: Table Wrapper */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[500px]">
        <UserTable 
          users={data?.data || []}
          loading={isLoading}
          onDelete={openDeleteModal}
          pagination={{
            page: params.page,
            total: data?.pagination?.total || 0,
            limit: params.limit
          }}
        />

        {/* Pagination Toolbar (Admin Prime Style) */}
        {!isLoading && data?.pagination?.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>{t('common.showing')}</span>
              <span className="text-slate-900 mx-1">{data?.data?.length || 0}</span>
              <span>{t('common.of')}</span>
              <span className="text-slate-900 mx-1">{data?.pagination?.total || 0}</span>
              <span>{t('admin.users.table.user_plural')}</span>
            </div>

            {data?.pagination?.total > params.limit && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(params.page - 1)}
                  disabled={params.page <= 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5">
                  {[...Array(Math.ceil((data?.pagination?.total || 0) / params.limit))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        params.page === i + 1 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                          : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(params.page + 1)}
                  disabled={params.page >= Math.ceil((data?.pagination?.total || 0) / params.limit)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Action Dialog */}
      <AdminActionDialog 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        data={modal.data}
        type="delete_user"
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminUsersPage;
