import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import logo from '../../../assets/logos/logo.png';
import {
  useForgotPasswordRequestMutation,
  useForgotPasswordResetMutation,
} from '../hooks.js';

/**
 * @file ForgotPasswordPage.jsx
 * @description Trang Quên mật khẩu - 2 bước:
 *   Bước 1: POST /auth/forgot-password/request { phone }
 *   Bước 2: POST /auth/forgot-password/verify-and-reset { phone, otp }
 *   → Hệ thống tự sinh mật khẩu mới và gửi về Email. Hỗ trợ đa ngôn ngữ.
 */

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');

  const requestMutation = useForgotPasswordRequestMutation();
  const resetMutation = useForgotPasswordResetMutation();

  /* ── Bước 1: Gửi OTP (Vietnamese comment) ── */
  const handleRequestOtp = (e) => {
    e?.preventDefault();
    setPhoneError('');
    const cleaned = phone.replace(/\s/g, '');
    if (!cleaned) { 
      setPhoneError(t('auth.validation.phone_required')); 
      return; 
    }
    if (!/^(0|\+84)[0-9]{9}$/.test(cleaned)) {
      setPhoneError(t('auth.validation.phone_invalid'));
      return;
    }
    requestMutation.mutate({ phone: cleaned }, {
      onSuccess: () => { setDirection(1); setStep(2); },
    });
  };

  /* ── Bước 2: Xác thực OTP (Vietnamese comment) ── */
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');
    if (!otp.trim() || !/^\d{6}$/.test(otp.trim())) {
      setOtpError(t('auth.validation.otp_invalid'));
      return;
    }
    resetMutation.mutate({ phone: phone.replace(/\s/g, ''), otp: otp.trim() });
  };

  const goBack = () => {
    setDirection(-1);
    setStep(1);
    setOtp('');
    setOtpError('');
    resetMutation.reset();
  };

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/40 shadow-2xl">

      {/* Brand (Nhãn hiệu) */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-5">
          <div className="bg-primary p-2 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg shadow-primary/20 mr-4">
            <img src={logo} alt="SeatNow" className="w-7 h-7 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tighter">SeatNow</h1>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{t('auth.forgot_password.title')}</h2>
        <p className="text-slate-400 text-sm font-medium">
          {step === 1
            ? t('auth.forgot_password.step1_desc')
            : t('auth.forgot_password.step2_desc', { phone })}
        </p>
      </div>

      {/* Step indicator (Chỉ báo bước) */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all duration-300 ${
              step >= s ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-slate-100 text-slate-300'
            }`}>
              {step > s ? <span className="material-symbols-outlined text-sm">check</span> : s}
            </div>
            {s < 2 && (
              <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Forms (Các biểu mẫu) */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>

          {step === 1 ? (
            <motion.form
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="space-y-5"
              onSubmit={handleRequestOtp}
            >
              {/* Phone input (Nhập số điện thoại) */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  {t('auth.forgot_password.phone_label')}
                </label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-300 group-focus-within:text-primary transition-colors text-xl">
                    phone
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                    placeholder="0901 234 567"
                    autoComplete="tel"
                    className={`w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 transition-all text-slate-900 placeholder:text-slate-300 font-bold outline-none text-sm ${
                      phoneError ? 'focus:ring-red-500/20 bg-red-50/30' : 'focus:ring-primary/20'
                    }`}
                  />
                </div>
                {phoneError && <p className="text-red-500 text-[10px] font-bold px-2">{phoneError}</p>}
              </div>

              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="w-full bg-primary text-white font-bold py-4 rounded-full transition-all hover:bg-primary/90 active:scale-95 shadow-xl shadow-primary/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {requestMutation.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.forgot_password.sending')}</>
                ) : (
                  <><span className="material-symbols-outlined text-base">send</span> {t('auth.forgot_password.send_code')}</>
                )}
              </button>
            </motion.form>

          ) : (
            <motion.form
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="space-y-5"
              onSubmit={handleVerifyOtp}
            >
              {/* OTP input (Nhập mã OTP) */}
              <div className="space-y-1.5">
                <label htmlFor="otp" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                  {t('auth.forgot_password.otp_label')}
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError(''); }}
                  placeholder="• • • • • •"
                  autoFocus
                  className={`w-full text-center text-2xl font-black tracking-[0.6em] py-4 bg-slate-50 rounded-xl focus:ring-2 outline-none transition-all text-slate-900 border-none placeholder:text-slate-200 placeholder:tracking-[0.4em] ${
                    otpError ? 'focus:ring-red-500/20 bg-red-50/30' : 'focus:ring-primary/20'
                  }`}
                />
                {otpError && <p className="text-red-500 text-[10px] font-bold px-2">{otpError}</p>}
              </div>

              {/* Info note (Ghi chú hệ thống) */}
              <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-blue-400 text-base mt-0.5 flex-shrink-0">info</span>
                <p className="text-blue-600 text-xs font-medium leading-relaxed">
                  {t('auth.forgot_password.info_note')}
                </p>
              </div>

              <button
                type="submit"
                disabled={resetMutation.isPending}
                className="w-full bg-primary text-white font-bold py-4 rounded-full transition-all hover:bg-primary/90 active:scale-95 shadow-xl shadow-primary/20 text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resetMutation.isPending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.forgot_password.resetting_btn')}</>
                ) : (
                  <><span className="material-symbols-outlined text-base">lock_reset</span> {t('auth.forgot_password.reset_btn')}</>
                )}
              </button>

              {/* Back + Resend (Quay lại & Gửi lại) */}
              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={goBack}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-[11px] font-bold uppercase tracking-wider transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  {t('auth.forgot_password.change_number')}
                </button>
                <button type="button"
                  disabled={requestMutation.isPending}
                  onClick={() => requestMutation.mutate({ phone: phone.replace(/\s/g, '') })}
                  className="text-primary hover:underline underline-offset-4 text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 transition-all"
                >
                  {requestMutation.isPending ? t('auth.otp.resending') : t('auth.forgot_password.resend_otp') || t('auth.otp.resend_button')}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Back to login (Quay lại đăng nhập) */}
      <div className="mt-8 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-primary text-[10px] font-bold uppercase tracking-wider transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {t('auth.forgot_password.back_to_login')}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
