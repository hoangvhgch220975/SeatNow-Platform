import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import logo from '../../../assets/logos/logo.png';
import { useLoginMutation, useGoogleLoginMutation } from '../hooks.js';
import LoginForm from '../components/LoginForm.jsx';

/**
 * @file LoginPage.jsx
 * @description Trang Đăng nhập cao cấp của SeatNow.
 */
const LoginPage = () => {
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = React.useState(false);
  const loginMutation = useLoginMutation();
  const { loginWithGoogle, isPending: isGooglePending } = useGoogleLoginMutation();

  const handleLogin = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => setIsRedirecting(true),
    });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle('popup', {
      onSuccess: () => setIsRedirecting(true),
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="w-full max-w-[480px] bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-white/60 relative overflow-hidden"
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 pointer-events-none rounded-[3.5rem] ring-1 ring-inset ring-white/20" />
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-on-surface mb-3 headline tracking-tight">
          {t('auth.login.welcome_back')}
        </h2>
        <p className="text-[13px] text-on-surface-variant/60 font-medium">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <LoginForm 
        onSubmit={handleLogin} 
        isLoading={loginMutation.isPending || isRedirecting}
        onGoogleLogin={handleGoogleLogin}
        isGooglePending={isGooglePending}
      />

      <div className="mt-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/30">
          {t('auth.login.no_account_text')} 
          <Link to={ROUTES.REGISTER} className="text-primary font-bold hover:text-primary/70 transition-colors ml-3 underline underline-offset-8 decoration-primary/10">
            {t('auth.login.signup_link')}
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
