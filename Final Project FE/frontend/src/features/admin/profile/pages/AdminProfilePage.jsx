import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminProfile } from '../hooks.js';
import { 
  User, 
  Settings, 
  ShieldCheck, 
  Activity,
  Fingerprint,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';

// Import sub-components (will be created in next steps)
import AdminProfileOverview from '../components/AdminProfileOverview';
import AdminProfileSettings from '../components/AdminProfileSettings';
import AdminSecuritySettings from '../components/AdminSecuritySettings';

/**
 * @file AdminProfilePage.jsx
 * @description High-fidelity Admin Profile Page with Bento Grid layout.
 * Follows the "Code English, Comment Vietnamese" rule.
 */
const AdminProfilePage = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useAdminProfile();
  const [activeTab, setActiveTab] = useState('overview'); // overview | settings | security

  // Loading state with Admin Prime skeleton (Vietnamese: Trạng thái tải với hiệu ứng skeleton cao cấp)
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-40 bg-white rounded-3xl border border-slate-100 shadow-sm" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-64 bg-white rounded-3xl border border-slate-100 shadow-sm" />
          <div className="col-span-2 h-64 bg-white rounded-3xl border border-slate-100 shadow-sm" />
        </div>
      </div>
    );
  }

  const user = profile || {};

  // Tab configuration for dynamic rendering (Vietnamese: Cấu hình tab để hiển thị động)
  const tabs = [
    { id: 'overview', label: 'admin.profile.tabs.overview', icon: Activity },
    { id: 'settings', label: 'admin.profile.tabs.settings', icon: Settings },
    { id: 'security', label: 'admin.profile.tabs.security', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Bento Card (Vietnamese: Thẻ Header kiểu Bento) */}
      <div className="relative p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group">
        {/* Abstract Background Flourish (Vietnamese: Họa tiết trang trí nền) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar with Ring (Vietnamese: Ảnh đại diện với viền hiệu ứng) */}
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-violet-50 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-105">
              <img 
                src={user.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.email || 'admin'}`} 
                alt="Admin Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center justify-center text-violet-600">
              <ShieldCheck size={20} strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
              <Fingerprint size={12} className="text-amber-600" />
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">
                {t('admin.profile.role_super_admin')}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {user.fullName || user.name || t('admin.profile.default_name')}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail size={14} />
                <span className="text-xs font-bold">{user.email || 'n/a'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone size={14} />
                <span className="text-xs font-bold">{user.phone || 'n/a'}</span>
              </div>
            </div>
          </div>

          {/* Activity Status Widget (Vietnamese: Widget trạng thái hoạt động) */}
          <div className="hidden lg:flex flex-col items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 min-w-[200px]">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('admin.profile.system_status')}</p>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-black text-emerald-600 uppercase tracking-tight">{t('admin.profile.security_level')}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Vietnamese: Tab điều hướng) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl w-fit border border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${
                isActive 
                  ? 'bg-white text-violet-600 shadow-md shadow-violet-500/5 border border-slate-100' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <Icon size={14} />
              {t(tab.label)}
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering (Vietnamese: Hiển thị nội dung theo tab) */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <AdminProfileOverview user={user} />}
        {activeTab === 'settings' && <AdminProfileSettings user={user} onTabChange={setActiveTab} />}
        {activeTab === 'security' && <AdminSecuritySettings />}
      </div>
      
    </div>
  );
};

export default AdminProfilePage;
