import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  Terminal, 
  Database, 
  Globe, 
  Lock,
  CalendarDays,
  Stamp,
  Activity
} from 'lucide-react';

/**
 * @file AdminProfileOverview.jsx
 * @description Summary view for Admin system identity.
 * Follows the "Code English, Comment Vietnamese" rule.
 */
const AdminProfileOverview = ({ user }) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  // Helper to format date (Vietnamese: Helper để định dạng ngày tháng)
  const formatJoinedDate = (date) => {
    if (!date) return '---';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', options);
    } catch (e) {
      return '---';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Identity Summary Card (Vietnamese: Thẻ tóm tắt định danh) */}
      <div className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
        <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-100">
            <Stamp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
              {t('admin.profile.system_identity')}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {t('admin.profile.verified_node')}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-5 bg-slate-50/80 rounded-[1.5rem] border border-slate-100">
            <div className="flex items-center gap-4">
              <Terminal size={18} className="text-violet-500" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.profile.overview.sig_id')}</p>
                <p className="text-xs font-mono font-black text-slate-900 mt-0.5">{user.id || 'N/A'}</p>
              </div>
            </div>
            <div className="px-2.5 py-1 bg-emerald-100/50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              {t('admin.profile.overview.active')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-slate-50 bg-white shadow-sm">
               <Database size={18} className="text-blue-500" />
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.profile.overview.proto_ver')}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5 whitespace-nowrap">v4.2.2 {t('admin.profile.overview.optimized')}</p>
               </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-slate-50 bg-white shadow-sm">
               <Globe size={18} className="text-indigo-500" />
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.profile.overview.region')}</p>
                  <p className="text-sm font-black text-slate-900 mt-0.5 whitespace-nowrap">{t('admin.profile.overview.region_vn_south')}</p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 bg-violet-50/50 rounded-[1.5rem] border border-violet-100/50">
             <CalendarDays size={18} className="text-violet-600" />
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('admin.profile.overview.reg_date')}</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">{formatJoinedDate(user.createdAt)}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Security Status Card (Vietnamese: Thẻ trạng thái bảo mật) */}
      <div className="p-10 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 text-white flex flex-col justify-between relative overflow-hidden">
        {/* Abstract Background (Vietnamese: Nền họa tiết trừu tượng) */}
        <div className="absolute top-0 right-0 p-10 opacity-10"><ShieldCheck size={200} /></div>

        <div className="relative z-10 space-y-6">
           <div className="flex items-center gap-3">
              <Lock size={20} className="text-violet-400" />
              <h3 className="text-xl font-black tracking-tight uppercase">{t('admin.profile.overview.integrity')}</h3>
           </div>
           
           <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-xs">
              {t('admin.profile.overview.integrity_desc')}
           </p>

           <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>{t('admin.profile.overview.enc_level')}</span>
                 <span className="text-emerald-400">{t('admin.profile.overview.aes_256')}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                 <div className="w-[100%] h-full bg-emerald-500"></div>
              </div>
           </div>
        </div>

        <div className="relative z-10 mt-12 p-6 bg-white/5 backdrop-blur-md rounded-[1.5rem] border border-white/10 flex items-center gap-5">
           <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 shadow-inner">
              <Activity size={20} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('admin.profile.overview.uptime')}</p>
              <p className="text-xl font-black text-white leading-none mt-1">99.99%</p>
           </div>
           <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
        </div>
      </div>

    </div>
  );
};

export default AdminProfileOverview;
