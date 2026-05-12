import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { auth, googleProvider } from '../../lib/firebase.js';
import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
import { authApi } from './api.js';
import { useAuthStore } from './store.js';
import { toast } from 'react-hot-toast';
import { parseApiError, parseApiSuccess } from '../../shared/utils/parseApiError.js';
import i18n from '../../lib/i18n.js';

import { ROLES } from '../../config/roles.js';
import { ROUTES } from '../../config/routes.js';

/**
 * @file hooks.js
 * @description Hook quản lý logic xác thực, tích hợp React Query. Hỗ trợ đa ngôn ngữ cho thông báo Toast.
 */

/**
 * @description Trả về đường dẫn điều hướng dựa trên vai trò của người dùng.
 */
const getRedirectPath = (user) => {
  const role = user?.role?.toUpperCase();
  if (role === ROLES.ADMIN) return ROUTES.ADMIN_DASHBOARD || '/admin';
  if (role === ROLES.OWNER) return ROUTES.OWNER_HOME;
  return '/';
};

/**
 * @description Trích xuất Token và User từ API response.
 */
const extractTokenAndUser = (response) => {
  const root = response.data || response;
  const tokenCandidates = [
    root.accessToken, root.token, root.access_token,
    root.data?.accessToken, root.data?.token, root.data?.access_token,
    root.userData?.token, root.userData?.accessToken
  ];
  
  let rawToken = tokenCandidates.find(t => !!t);

  const unwrap = (val) => {
    if (!val) return val;
    if (typeof val === 'object') {
        return val.token || val.accessToken || val.access_token || JSON.stringify(val);
    }
    if (typeof val === 'string' && val.trim().startsWith('{')) {
        try {
            const p = JSON.parse(val);
            return p.token || p.accessToken || p.access_token || p.refreshToken || p.refresh_token || val;
        } catch(e) { return val; }
    }
    return val;
  };

  rawToken = unwrap(rawToken);
  if (typeof rawToken === 'string') {
    rawToken = rawToken.replace(/^Bearer\s+/i, '').trim();
  }
  
  const userCandidates = [
    root.user, root.data?.user, root.profile, root.data?.profile, root.userData?.user
  ];

  const refreshCandidates = [
    root.refreshToken, root.refresh_token, root.data?.refreshToken, root.data?.refresh_token
  ];

  let rawRefreshToken = unwrap(refreshCandidates.find(r => !!r));

  return {
    user: userCandidates.find(u => !!u) || root,
    token: typeof rawToken === 'string' ? rawToken : null,
    refreshToken: typeof rawRefreshToken === 'string' ? rawRefreshToken : null
  };
};

// ============================================================
// ĐĂNG NHẬP (Vietnamese comment) *)
// ============================================================
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onSuccess: (response) => {
      const { user, token, refreshToken } = extractTokenAndUser(response);
      if (token) setAuth(user, token, refreshToken);
      
      setTimeout(() => {
        const displayName = user?.fullName || user?.name || 'User';
        toast.success(response.message || i18n.t('auth.toast.welcome', { name: displayName }), { duration: 1000 });
        navigate(getRedirectPath(user));
      }, 1500);
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.login_failed'));
    },
  });
};

// ============================================================
// ĐĂNG NHẬP GOOGLE (Vietnamese comment) *)
// ============================================================
export const useGoogleLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: (idToken) => authApi.googleSignIn(idToken),
    onSuccess: (response) => {
      const { user, token, refreshToken } = extractTokenAndUser(response);
      if (token) setAuth(user, token, refreshToken);
      
      setTimeout(() => {
        const displayName = user?.fullName || user?.name || 'User';
        toast.success(response.message || i18n.t('auth.toast.welcome', { name: displayName }), { duration: 1000 });
        navigate(getRedirectPath(user));
      }, 1500);
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.google_auth_failed'));
    },
  });

  const loginWithGoogle = async (method = 'popup', options = {}) => {
    try {
      if (method === 'redirect') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        mutation.mutate(idToken, options);
      }
    } catch (error) {
      toast.error(i18n.t('auth.toast.google_connect_error', { error: error.message }));
    }
  };

  return { ...mutation, loginWithGoogle };
};

// ============================================================
// LẮNG NGHE KẾT QUẢ REDIRECT GOOGLE (Vietnamese comment) *)
// ============================================================
export const useHandleGoogleRedirect = () => {
  const gMutation = useGoogleLoginMutation();
  const handleRedirect = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        const idToken = await result.user.getIdToken();
        gMutation.mutate(idToken);
      }
    } catch (error) {
      console.error('Redirect Error:', error);
    }
  };
  return { handleRedirect, isPending: gMutation.isPending };
};

// ============================================================
// ĐĂNG KÝ - BƯỚC 1: GỬI FORM & KÍCH HOẠT OTP (Vietnamese comment) *)
// ============================================================
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (formData) => authApi.register(formData),
    onSuccess: (response) => {
      const { user, token, refreshToken } = extractTokenAndUser(response);
      if (user && token) {
        setAuth(user, token, refreshToken);
        setTimeout(() => {
          const displayName = user?.fullName || user?.name || 'User';
          toast.success(i18n.t('auth.toast.welcome_new', { name: displayName }), { duration: 1000 });
          navigate(getRedirectPath(user));
        }, 1500);
      } else {
        setTimeout(() => {
          toast.success(i18n.t('auth.toast.registration_success_login'), { duration: 1000 });
          navigate('/login');
        }, 1500);
      }
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.registration_failed'));
    },
  });
};

// ============================================================
// ĐĂNG KÝ - BƯỚC 2: XÁC THỰC OTP (Vietnamese comment) *)
// ============================================================
export const useVerifyOtpMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (payload) => authApi.verifyOtp(payload),
    onSuccess: (response) => {
      const { user, token, refreshToken } = extractTokenAndUser(response);
      if (user && token) {
        setAuth(user, token, refreshToken);
        setTimeout(() => {
          const displayName = user?.fullName || user?.name || 'User';
          toast.success(i18n.t('auth.toast.welcome_new', { name: displayName }), { duration: 1000 });
          navigate(getRedirectPath(user));
        }, 1500);
      } else {
        setTimeout(() => {
          toast.success(i18n.t('auth.toast.otp_verify_success'), { duration: 1000 });
          navigate('/login');
        }, 1500);
      }
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.otp_invalid'));
    },
  });
};

// ============================================================
// GỬI LẠI OTP (Vietnamese comment) *)
// ============================================================
export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.sendOtp(payload),
    onSuccess: () => {
      toast.success(i18n.t('auth.toast.otp_resend_success'));
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.otp_resend_error'));
    },
  });
};

// ============================================================
// QUÊN MẬT KHẨU - BƯỚC 1: GỬI YÊU CẦU OTP (Vietnamese comment) *)
// ============================================================
export const useForgotPasswordRequestMutation = () => {
  return useMutation({
    mutationFn: (payload) => authApi.forgotPasswordRequest(payload),
    onSuccess: (response) => {
      const msg = parseApiSuccess(response);
      toast.success(msg || i18n.t('auth.toast.forgot_request_success'));
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.forgot_request_error'));
    },
  });
};

// ============================================================
// QUÊN MẬT KHẨU - BƯỚC 2: XÁC THỰC OTP & ĐẶT LẠI MẬT KHẨU (Vietnamese comment) *)
// ============================================================
export const useForgotPasswordResetMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (payload) => authApi.forgotPasswordReset(payload),
    onSuccess: (response) => {
      const msg = parseApiSuccess(response);
      toast.success(msg || i18n.t('auth.toast.forgot_reset_success'), { duration: 5000 });
      setTimeout(() => navigate('/login'), 2500);
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.forgot_reset_error'));
    },
  });
};

// ============================================================
// ĐỔI MẬT KHẨU (Vietnamese comment) *)
// ============================================================
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data) => authApi.changePassword(data),
  });
};

// ============================================================
// GỬI YÊU CẦU HỢP TÁC (PARTNER REQUEST) (Vietnamese comment) *)
// ============================================================
export const useSubmitPartnerRequestMutation = () => {
  return useMutation({
    mutationFn: (data) => authApi.partnerRequest(data),
    onSuccess: (response) => {
      const msg = parseApiSuccess(response);
      toast.success(msg || i18n.t('auth.toast.partner_request_success'), { icon: '🚀', duration: 4000 });
    },
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.partner_request_error'));
    },
  });
};

// ============================================================
// KIỂM TRA TỒN TẠI (Dùng cho Register/Forgot Password) (Vietnamese comment) *)
// ============================================================
export const useCheckExistsMutation = () => {
  return useMutation({
    mutationFn: (params) => authApi.checkAvailability(params),
    onError: (error) => {
      const { message: msg } = parseApiError(error);
      toast.error(msg || i18n.t('auth.toast.check_exists_error'));
    }
  });
};
