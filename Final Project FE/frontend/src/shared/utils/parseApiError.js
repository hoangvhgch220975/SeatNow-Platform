import i18n from '../../lib/i18n.js';

/**
 * @file parseApiError.js
 * @description Chuẩn hoá Error và Success response từ API thành thông báo đa ngôn ngữ thân thiện.
 */

/* ─────────────────────────────────────────────────────────
   TỪ ĐIỂN THÔNG BÁO — Error & Success Codes
   Ánh xạ các mã từ Backend sang các key i18n trong file json.
   Các key nằm trong mục "api.messages".
 ───────────────────────────────────────────────────────── */
const MESSAGE_MAP = {
  // ── Auth ──
  'USER_NOT_FOUND':                   "api.messages.USER_NOT_FOUND",
  'INVALID_PASSWORD':                 "api.messages.INVALID_PASSWORD",
  'INVALID_CREDENTIALS':              "api.messages.INVALID_CREDENTIALS",
  'EMAIL_ALREADY_EXISTS':             "api.messages.EMAIL_ALREADY_EXISTS",
  'PHONE_ALREADY_EXISTS':             "api.messages.PHONE_ALREADY_EXISTS",
  'ACCOUNT_SUSPENDED':                "api.messages.ACCOUNT_SUSPENDED",
  'ACCOUNT_NOT_FOUND':                "api.messages.ACCOUNT_NOT_FOUND",

  // ── OTP ──
  'OTP_INVALID':                      "api.messages.OTP_INVALID",
  'OTP_INCORRECT':                    "api.messages.OTP_INCORRECT",
  'OTP_EXPIRED':                      "api.messages.OTP_EXPIRED",
  'OTP_SENT':                         "api.messages.OTP_SENT",
  'OTP_VERIFIED':                     "api.messages.OTP_VERIFIED",

  // ── Forgot Password ──
  'OTP_SENT_TO_EMAIL':                "api.messages.OTP_SENT_TO_EMAIL",
  'NEW_PASSWORD_SENT_TO_EMAIL':       "api.messages.NEW_PASSWORD_SENT_TO_EMAIL",
  'RESET_OTP_SENT':                   "api.messages.RESET_OTP_SENT",
  'PASSWORD_RESET_SUCCESS':           "api.messages.PASSWORD_RESET_SUCCESS",
  'INVALID_RESET_OTP':                "api.messages.INVALID_RESET_OTP",

  // ── Change Password ──
  'PASSWORD_CHANGED_SUCCESSFULLY':    "api.messages.PASSWORD_CHANGED_SUCCESSFULLY",
  'OLD_PASSWORD_INCORRECT':           "api.messages.OLD_PASSWORD_INCORRECT",
  'PASSWORDS_DO_NOT_MATCH':           "api.messages.PASSWORDS_DO_NOT_MATCH",

  // ── Registration ──
  'REGISTRATION_SUCCESS':             "api.messages.REGISTRATION_SUCCESS",
  'REGISTRATION_PENDING_OTP':         "api.messages.REGISTRATION_PENDING_OTP",

  // ── Participation/Partner ──
  'SUBMISSION_SUCCESS':               "api.messages.SUBMISSION_SUCCESS",
  'PARTNER_REQUEST_SUBMITTED':        "api.messages.PARTNER_REQUEST_SUBMITTED",

  // ── Permission ──
  'UNAUTHORIZED':                     "api.messages.UNAUTHORIZED",
  'FORBIDDEN':                        "api.messages.FORBIDDEN",
  'TOKEN_EXPIRED':                    "api.messages.TOKEN_EXPIRED",

  // ── System ──
  'INTERNAL_SERVER_ERROR':            "api.messages.INTERNAL_SERVER_ERROR",
  'VALIDATION_ERROR':                 "api.messages.VALIDATION_ERROR",
  'RATE_LIMIT_EXCEEDED':              "api.messages.RATE_LIMIT_EXCEEDED",
  'MISSING_REQUIRED_FIELDS':          "api.messages.MISSING_REQUIRED_FIELDS",

  // ── Reviews (New) ──
  'BOOKING_NOT_COMPLETED':            "api.messages.BOOKING_NOT_COMPLETED",
  'REVIEW_ALREADY_EXISTS':            "api.messages.REVIEW_ALREADY_EXISTS",
  'RESTAURANT_NOT_FOUND':             "api.messages.RESTAURANT_NOT_FOUND",
  'RESTAURANT_SUSPENDED':             "api.messages.RESTAURANT_SUSPENDED",
  'RESTAURANT_SUSPENDED_BY_ADMIN':    "api.messages.RESTAURANT_SUSPENDED_BY_ADMIN",
};

/**
 * @description Trả về thông báo lỗi đã được dịch.
 */
export const parseApiError = (error) => {
  const defaultKey = 'api.messages.DEFAULT_ERROR';

  const errorData = error.response?.data;
  console.group('🚀 API Error Details');
  console.error('Core Message:', errorData?.message || error.message);
  if (errorData?.errors) console.table(errorData.errors);
  console.groupEnd();

  if (!error.response) {
    return {
      message: error.message || i18n.t(defaultKey),
      status: null,
      errors: null,
    };
  }

  const { data, status } = error.response;
  const rawMessage = (data?.message || '').trim();

  // Tìm key i18n tương ứng, nếu không có thì dùng rawMessage (Vietnamese comment)
  const i18nKey = MESSAGE_MAP[rawMessage];
  let friendlyMessage = i18nKey ? i18n.t(i18nKey) : rawMessage;

  // Nếu friendlyMessage rỗng thì dùng mặc định
  if (!friendlyMessage) friendlyMessage = i18n.t(defaultKey);

  // Gộp các chi tiết lỗi validation nếu có (Vietnamese comment)
  if (data?.errors && typeof data.errors === 'object') {
    const errorDetails = Object.values(data.errors).flat().join(', ');
    if (errorDetails) friendlyMessage = `${friendlyMessage}: ${errorDetails}`;
  }

  return {
    message: friendlyMessage,
    status,
    errors: data?.errors || null,
  };
};

/**
 * @description Trả về thông báo thành công đã được dịch.
 */
export const parseApiSuccess = (response) => {
  const raw = (response?.data?.message || response?.message || '').trim();
  const i18nKey = MESSAGE_MAP[raw];
  return i18nKey ? i18n.t(i18nKey) : raw;
};
