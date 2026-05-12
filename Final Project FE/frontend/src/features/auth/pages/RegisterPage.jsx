import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import logo from '../../../assets/logos/logo.png';
import { normalizePhone } from '../../../shared/utils/normalizePhone.js';
import RegisterForm from '../components/RegisterForm.jsx';
import OtpForm from '../components/OtpForm.jsx';
import Modal from '../../../shared/ui/Modal.jsx';
import { useRegisterMutation, useSendOtpMutation, useCheckExistsMutation } from '../hooks.js';
import toast from 'react-hot-toast';

/**
 * @file RegisterPage.jsx
 * @description Trang Đăng ký người dùng cao cấp.
 */
const RegisterPage = () => {
  const { t } = useTranslation();
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingRegister, setPendingRegister] = useState(null); 
  const [isRedirecting, setIsRedirecting] = useState(false);

  const registerMutation = useRegisterMutation();
  const sendOtpMutation = useSendOtpMutation();
  const checkExistsMutation = useCheckExistsMutation();

  const handleRegister = async (formData) => {
    const normalizedPhone = normalizePhone(formData.phone);
    const normalizedData = {
      ...formData,
      phone: normalizedPhone
    };
    
    // Bước 1: Kiểm tra xem Email hoặc SĐT đã tồn tại chưa
    checkExistsMutation.mutate(
      { email: formData.email, phone: normalizedPhone },
      {
        onSuccess: (response) => {
          const { exists, details } = response.data || response;
          
          if (exists) {
            if (details?.email) {
              toast.error(t('auth.toast.email_already_exists'));
            } else if (details?.phone) {
              toast.error(t('auth.toast.phone_already_exists'));
            } else {
              toast.error(t('auth.toast.account_already_exists'));
            }
            return;
          }

          // Bước 2: Nếu chưa tồn tại, tiến hành gửi OTP
          setPendingRegister(normalizedData);
          sendOtpMutation.mutate(
            { email: formData.email },
            {
              onSuccess: () => {
                setIsOtpOpen(true);
              }
            }
          );
        }
      }
    );
  };

  const handleVerifyOtp = async (otpCode) => {
    if (!pendingRegister) return;

    registerMutation.mutate(
      {
        ...pendingRegister,
        otp: otpCode,
      },
      {
        onSuccess: () => {
          setIsRedirecting(true);
          setIsOtpOpen(false);
        }
      }
    );
  };

  const handleResendOtp = () => {
    if (!pendingRegister) return;
    sendOtpMutation.mutate({ email: pendingRegister.email });
  };

  const handleCloseOtp = () => {
    if (registerMutation.isPending || sendOtpMutation.isPending) return;
    setIsOtpOpen(false);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-[540px] bg-white/70 backdrop-blur-3xl rounded-[3.5rem] p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-white/60 my-10 relative overflow-hidden"
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 pointer-events-none rounded-[3.5rem] ring-1 ring-inset ring-white/20" />
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-on-surface mb-3 headline tracking-tight">
            {t('auth.register.create_account')}
          </h2>
          <p className="text-[13px] text-on-surface-variant/60 font-medium">
            {t('auth.register.subtitle')}
          </p>
        </div>

        <RegisterForm 
          onSubmit={handleRegister} 
          isLoading={sendOtpMutation.isPending || registerMutation.isPending || isRedirecting || checkExistsMutation.isPending} 
        />

        <div className="mt-10 text-center pt-8 border-t border-outline/5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/30">
            {t('auth.register.already_account')}{' '}
            <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:text-primary/70 transition-colors ml-3 underline underline-offset-8 decoration-primary/10">
              {t('auth.register.signin_link')}
            </Link>
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOtpOpen && (
          <Modal 
            isOpen={isOtpOpen} 
            onClose={handleCloseOtp} 
            closable={!registerMutation.isPending && !sendOtpMutation.isPending}
          >
            <div className="p-10 space-y-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/5 rounded-[2rem] mb-2 shadow-inner">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface headline">{t('auth.otp.verify_email_title')}</h3>
                <p className="text-[13px] text-on-surface-variant/60 font-medium">
                  {t('auth.otp.verify_email_hint')}<br/>
                  <span className="font-bold text-on-surface break-all">{pendingRegister?.email}</span>
                </p>
              </div>

              <OtpForm
                onSubmit={handleVerifyOtp}
                onResend={handleResendOtp}
                isLoading={registerMutation.isPending || isRedirecting}
                isResending={sendOtpMutation.isPending}
              />
              
              <p className="text-center text-on-surface-variant/30 text-[10px] font-medium uppercase tracking-[0.1em]">
                {t('auth.otp.disclaimer')}
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisterPage;
