import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordMutation } from '../../auth/hooks.js';
import { getChangePasswordSchema } from '../../auth/schemas.js';

/**
 * @file PasswordForm.jsx
 * @description Form thay đổi mật khẩu cao cấp.
 */
const PasswordForm = () => {
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

  const onSubmit = async (data) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success(t('profile.password.success_toast'));
      reset();
    } catch (error) {
      const errorMsg = error.response?.data?.message || t('profile.password.error_prefix');
      toast.error(errorMsg);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-12 rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] h-full"
    >
      <header className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary">
           <span className="material-symbols-outlined text-3xl">security</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            {t('profile.password.title')}
          </h2>
          <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em] mt-2">
            {t('profile.password.subtitle')}
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] ml-8">
            {t('profile.password.current_label')}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant/20 group-focus-within:text-primary transition-colors">lock_open</span>
            <input 
              {...register('oldPassword')}
              type="password"
              placeholder={t('profile.password.current_placeholder')}
              className={`w-full h-20 pl-20 pr-10 rounded-[2rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-on-surface font-bold placeholder:text-outline/20 outline-none transition-all duration-300 ${
                errors.oldPassword ? 'border-rose-500/20 focus:border-rose-500/40' : ''
              }`}
            />
          </div>
          {errors.oldPassword && (
            <p className="text-rose-500 text-[10px] font-bold px-8 uppercase tracking-wider">{errors.oldPassword.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] ml-8">
                {t('profile.password.new_label')}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant/20 group-focus-within:text-primary transition-colors">lock</span>
                <input 
                  {...register('newPassword')}
                  type="password"
                  placeholder={t('profile.password.new_placeholder')}
                  className={`w-full h-20 pl-20 pr-10 rounded-[2rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-on-surface font-bold placeholder:text-outline/20 outline-none transition-all duration-300 ${
                    errors.newPassword ? 'border-rose-500/20 focus:border-rose-500/40' : ''
                  }`}
                />
              </div>
              {errors.newPassword && (
                <p className="text-rose-500 text-[10px] font-bold px-8 uppercase tracking-wider leading-tight">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-[0.3em] ml-8">
                {t('profile.password.confirm_label')}
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant/20 group-focus-within:text-primary transition-colors">verified_user</span>
                <input 
                  {...register('confirmPassword')}
                  type="password"
                  placeholder={t('profile.password.confirm_placeholder')}
                  className={`w-full h-20 pl-20 pr-10 rounded-[2rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-on-surface font-bold placeholder:text-outline/20 outline-none transition-all duration-300 ${
                    errors.confirmPassword ? 'border-rose-500/20 focus:border-rose-500/40' : ''
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-[10px] font-bold px-8 uppercase tracking-wider leading-tight">{errors.confirmPassword.message}</p>
              )}
            </div>
        </div>

        <div className="pt-6">
          <motion.button 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="w-full md:w-fit px-16 py-6 bg-primary text-white font-bold rounded-[2rem] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.3em] disabled:opacity-70"
          >
            {changePasswordMutation.isPending ? (
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-2xl">save</span>
            )}
            {changePasswordMutation.isPending ? t('profile.password.updating') : t('profile.password.submit_button')}
          </motion.button>
        </div>
      </form>

      <div className="mt-16 p-8 rounded-[2.5rem] bg-surface border border-outline/5 flex items-start gap-6">
         <span className="material-symbols-outlined text-amber-500 text-3xl">info</span>
         <div className="text-[11px] text-on-surface-variant/60 font-bold leading-relaxed italic uppercase tracking-wider">
          <Trans i18nKey="profile.password.safety_notice">
            To ensure the highest security, you should use a password with at least 8 characters, including letters, numbers, and special symbols. 
            <br/>
            Avoid using common passwords or information related to your date of birth.
          </Trans>
         </div>
      </div>
    </motion.div>
  );
};

export default PasswordForm;
