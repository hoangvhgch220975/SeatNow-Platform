import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordMutation } from '@/features/auth/hooks.js';
import { getChangePasswordSchema } from '@/features/auth/schemas.js';
import { 
  Lock, 
  ShieldAlert, 
  Save, 
  Loader2, 
  KeyRound, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

/**
 * @file AdminSecuritySettings.jsx
 * @description Admin-specific password update form.
 * Uses the same business logic as the customer password form but with Admin Prime aesthetics.
 * Follows the "Code English, Comment Vietnamese" rule.
 */
const AdminSecuritySettings = () => {
  const { t } = useTranslation();
  const changePasswordMutation = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getChangePasswordSchema(t)),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle password change submission (Vietnamese: Xử lý gửi yêu cầu đổi mật khẩu)
  const onSubmit = async (data) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success(t('admin.profile.toasts.security_success'), {
        icon: '🔐',
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
      reset(); 
    } catch (error) {
      const { message, rawMessage } = parseApiError(error);
      let errorMsg = t('admin.profile.toasts.security_error');
      
      // Handle known error codes (Vietnamese: Xử lý các mã lỗi đã biết)
      if (rawMessage === 'INVALID_OLD_PASSWORD' || rawMessage === 'OLD_PASSWORD_INCORRECT') {
        errorMsg = t('admin.profile.toasts.invalid_old_password');
      } else if (message) {
        errorMsg = message;
      }

      toast.error(errorMsg, {
        icon: '🚫',
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
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header (Vietnamese: Tiêu đề) */}
      <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
        <div>
           <h3 className="text-xl font-black tracking-tight uppercase">
             {t('admin.profile.security.title')}
           </h3>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
             {t('admin.profile.security.subtitle')}
           </p>
        </div>
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-violet-400 border border-white/10">
           <KeyRound size={20} />
        </div>
      </div>

      <div className="p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-10">
          
          {/* Current Password Field (Vietnamese: Trường mật khẩu hiện tại) */}
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 block">
               {t('admin.profile.security.curr_key_label')}
             </label>
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <ShieldAlert size={18} />
                </div>
                <input 
                  {...register('oldPassword')}
                  type="password" 
                  placeholder={t('admin.profile.security.curr_key_placeholder')}
                  className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 outline-none transition-all placeholder:text-slate-300 ${
                    errors.oldPassword ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500' : 'border-slate-100 focus:ring-violet-500/5 focus:border-violet-600'
                  }`}
                />
             </div>
             {errors.oldPassword && (
               <p className="text-rose-500 text-[10px] font-bold px-2">{errors.oldPassword.message}</p>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* New Password (Vietnamese: Mật khẩu mới) */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 block">
                 {t('admin.profile.security.new_string_label')}
               </label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    {...register('newPassword')}
                    type="password" 
                    placeholder={t('admin.profile.security.new_string_placeholder')}
                    className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 outline-none transition-all placeholder:text-slate-300 ${
                      errors.newPassword ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500' : 'border-slate-100 focus:ring-violet-500/5 focus:border-violet-600'
                    }`}
                  />
               </div>
               {errors.newPassword && (
                 <p className="text-rose-500 text-[10px] font-bold px-2">{errors.newPassword.message}</p>
               )}
            </div>

            {/* Confirm Password (Vietnamese: Xác nhận mật khẩu) */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 block">
                 {t('admin.profile.security.confirm_key_label')}
               </label>
               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <ShieldCheck size={18} />
                  </div>
                  <input 
                    {...register('confirmPassword')}
                    type="password" 
                    placeholder={t('admin.profile.security.confirm_key_placeholder')}
                    className={`w-full bg-slate-50 border rounded-2xl pl-12 pr-4 py-4 text-sm font-black text-slate-900 outline-none transition-all placeholder:text-slate-300 ${
                      errors.confirmPassword ? 'border-rose-300 focus:ring-rose-500/5 focus:border-rose-500' : 'border-slate-100 focus:ring-violet-500/5 focus:border-violet-600'
                    }`}
                  />
               </div>
               {errors.confirmPassword && (
                 <p className="text-rose-500 text-[10px] font-bold px-2">{errors.confirmPassword.message}</p>
               )}
            </div>
          </div>

          {/* Action Button (Vietnamese: Nút hành động) */}
          <div className="pt-6">
             <button 
               type="submit"
               disabled={changePasswordMutation.isPending}
               className="flex items-center gap-3 px-10 py-5 bg-violet-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-violet-500/20 hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
             >
               {changePasswordMutation.isPending ? (
                 <>
                   <Loader2 size={16} className="animate-spin" />
                   {t('admin.profile.security.btn_updating')}
                 </>
               ) : (
                 <>
                   {t('admin.profile.security.btn_update_proto')}
                   <Save size={16} />
                 </>
               )}
             </button>
          </div>
        </form>

        {/* Security Warning Notice (Vietnamese: Thông báo cảnh báo bảo mật) */}
        <div className="mt-16 p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-start gap-4">
           <AlertTriangle size={24} className="text-amber-500 shrink-0" />
           <div className="space-y-2">
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{t('admin.profile.security.warning_title')}</p>
              <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-xl">
                {t('admin.profile.security.warning_desc')}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSecuritySettings;
