import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getRegisterSchema } from '../schemas.js';

/**
 * @file RegisterForm.jsx
 * @description Thành phần form đăng ký người dùng (Customer). Hỗ trợ đa ngôn ngữ.
 */
const RegisterForm = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(getRegisterSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name (Vietnamese comment) */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2" htmlFor="name">
            {t('auth.register.name_label')}
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
              person
            </span>
            <input 
              {...register('name')}
              className={`w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl focus:ring-4 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
                errors.name ? 'focus:ring-red-500/10 bg-red-50/30 border-red-200' : 'focus:ring-primary/5 bg-white'
              }`} 
              id="name" 
              placeholder={t('auth.register.name_placeholder')} 
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-[10px] font-bold px-2">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number (Vietnamese comment) */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2" htmlFor="phone">
            {t('auth.register.phone_label')}
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
              call
            </span>
            <input 
              {...register('phone')}
              className={`w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl focus:ring-4 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
                errors.phone ? 'focus:ring-red-500/10 bg-red-50/30 border-red-200' : 'focus:ring-primary/5 bg-white'
              }`} 
              id="phone" 
              placeholder={t('auth.register.phone_placeholder')} 
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-[10px] font-bold px-2">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Email Address (Vietnamese comment) */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2" htmlFor="email">
          {t('auth.register.email_label')}
        </label>
        <div className="relative group">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
            mail
          </span>
          <input 
            {...register('email')}
            className={`w-full pl-12 pr-6 py-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl focus:ring-4 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
              errors.email ? 'focus:ring-red-500/10 bg-red-50/30 border-red-200' : 'focus:ring-primary/5 bg-white'
            }`} 
            id="email" 
            placeholder={t('auth.register.email_placeholder')} 
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-[10px] font-bold px-2">{errors.email.message}</p>
        )}
      </div>

      {/* Password Grid (Vietnamese comment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password (Vietnamese comment) */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2" htmlFor="password">
            {t('auth.register.password_label')}
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
              lock
            </span>
            <input 
              {...register('password')}
              className={`w-full pl-11 pr-10 py-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl focus:ring-4 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
                errors.password ? 'focus:ring-red-500/10 bg-red-50/30 border-red-200' : 'focus:ring-primary/5 bg-white'
              }`} 
              id="password" 
              placeholder={t('auth.register.password_placeholder')} 
              type={showPassword ? "text" : "password"}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] font-bold px-2 line-clamp-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password (Vietnamese comment) */}
        <div className="space-y-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2" htmlFor="confirmPassword">
            {t('auth.register.confirm_label')}
          </label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
              lock_reset
            </span>
            <input 
              {...register('confirmPassword')}
              className={`w-full pl-11 pr-10 py-4 bg-slate-50/50 border border-slate-100/50 rounded-2xl focus:ring-4 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
                errors.confirmPassword ? 'focus:ring-red-500/10 bg-red-50/30 border-red-200' : 'focus:ring-primary/5 bg-white'
              }`} 
              id="confirmPassword" 
              placeholder={t('auth.register.confirm_placeholder')} 
              type={showConfirmPassword ? "text" : "password"}
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                {showConfirmPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-[10px] font-bold px-2 line-clamp-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button (Vietnamese comment) */}
      <button 
        className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-[0_8px_20px_-6px_rgba(0,0,0,0.2)] hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            <span>{t('auth.register.processing')}</span>
          </>
        ) : (
          t('auth.register.submit_button')
        )}
      </button>
    </form>
  );
};

export default RegisterForm;

