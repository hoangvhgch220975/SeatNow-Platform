import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateAdminProfile } from '../hooks.js';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  RefreshCcw,
  ShieldCheck,
  Ban
} from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * @file AdminProfileSettings.jsx
 * @description Form for updating Admin profile details.
 * Prevents editing sensitive fields like email and phone.
 * Follows the "Code English, Comment Vietnamese" rule.
 */
const AdminProfileSettings = ({ user, onTabChange }) => {
  const { t } = useTranslation();
  const updateMutation = useUpdateAdminProfile();
  
  // Local state for name and avatar (Vietnamese: State nội bộ cho tên và ảnh đại diện)
  const [formData, setFormData] = useState({
    name: user.fullName || user.name || '',
    avatar: user.avatar || ''
  });

  // Handle input changes (Vietnamese: Xử lý thay đổi input)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit profile updates (Vietnamese: Gửi yêu cầu cập nhật hồ sơ)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name length (Vietnamese: Kiểm tra độ dài tên)
    if (formData.name.trim().length < 2) {
      toast.error(t('admin.profile.toasts.name_short'), {
        icon: '⚠️',
        style: {
          borderRadius: '1rem',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(244, 63, 94, 0.2)'
        },
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        name: formData.name,
        avatar: formData.avatar
      });
      toast.success(t('admin.profile.toasts.update_success'), {
        icon: '✨',
        style: {
          borderRadius: '1rem',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        },
      });
    } catch (error) {
      toast.error(t('admin.profile.toasts.update_error'), {
        icon: '⚠️',
        style: {
          borderRadius: '1rem',
          background: '#ffffff',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(244, 63, 94, 0.2)'
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Form Header (Vietnamese: Tiêu đề Form) */}
      <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div>
           <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
             {t('admin.profile.personal_settings')}
           </h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
             {t('admin.profile.manage_data')}
           </p>
        </div>
        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600">
           <User size={20} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-10">
        
        {/* Important Security Notice (Vietnamese: Thông báo bảo mật quan trọng) */}
        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start">
           <ShieldCheck size={20} className="text-amber-600 mt-0.5" />
           <div>
              <p className="text-xs font-black text-amber-900 uppercase tracking-tight mb-1">{t('admin.profile.settings.strict_proto')}</p>
              <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                {t('admin.profile.settings.locked_notice')}
              </p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Identity Name (Vietnamese: Tên định danh) */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 block">
               {t('admin.profile.settings.full_name_label')}
             </label>
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('admin.profile.settings.full_name_placeholder')}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all placeholder:text-slate-300"
                />
             </div>
          </div>

          {/* Profile Avatar String (Vietnamese: Đường dẫn ảnh đại diện) */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 block">
               {t('admin.profile.settings.avatar_label')}
             </label>
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                   <RefreshCcw size={16} />
                </div>
                <input 
                  type="text" 
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder={t('admin.profile.settings.avatar_placeholder')}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all placeholder:text-slate-300"
                />
             </div>
             <p className="text-[9px] font-bold text-slate-400 px-1 italic">
                {t('admin.profile.settings.avatar_hint')}
             </p>
          </div>

          {/* Locked Email (Vietnamese: Email đã bị khóa) */}
          <div className="space-y-3 opacity-60 grayscale-[50%]">
             <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                  {t('admin.profile.settings.email_label')}
                </label>
                <Ban size={10} className="text-rose-500" />
             </div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  value={user.email || ''}
                  disabled
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-400 cursor-not-allowed italic"
                />
             </div>
          </div>

          {/* Locked Phone (Vietnamese: Số điện thoại đã bị khóa) */}
          <div className="space-y-3 opacity-60 grayscale-[50%]">
             <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                  {t('admin.profile.settings.phone_label')}
                </label>
                <Ban size={10} className="text-rose-500" />
             </div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                   <Phone size={16} />
                </div>
                <input 
                  type="text" 
                  value={user.phone || ''}
                  disabled
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-400 cursor-not-allowed italic"
                />
             </div>
          </div>
        </div>

        {/* Action Buttons (Vietnamese: Các nút hành động) */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-slate-50">
           <button
             type="button"
             onClick={() => onTabChange('security')}
             className="flex items-center gap-2 text-slate-400 hover:text-violet-600 transition-colors text-xs font-black uppercase tracking-widest px-4 py-2"
           >
              {t('admin.profile.settings.btn_security')}
              <ArrowRight size={14} />
           </button>

           <button 
             type="submit"
             disabled={updateMutation.isPending}
             className="flex items-center gap-3 px-10 py-5 bg-violet-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none group"
           >
             {updateMutation.isPending ? (
               <>
                 <RefreshCcw size={16} className="animate-spin" />
                 {t('admin.profile.settings.btn_syncing')}
               </>
             ) : (
               <>
                 {t('admin.profile.settings.btn_confirm')}
                 <CheckCircle2 size={16} className="transition-transform group-hover:scale-110" />
               </>
             )}
           </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfileSettings;
