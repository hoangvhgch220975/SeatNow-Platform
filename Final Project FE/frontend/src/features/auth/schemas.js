import { z } from 'zod';

/**
 * @file schemas.js
 * @description Định nghĩa các Schema validation bằng Zod cho module Auth. 
 * Hỗ trợ đa ngôn ngữ bằng cách sử dụng hàm t() được truyền vào.
 */

export const getLoginSchema = (t) => z.object({
  identifier: z.string().min(1, t('auth.validation.identifier_required')),
  password: z.string().min(8, t('auth.validation.password_min')),
});

export const getRegisterSchema = (t) => z.object({
  name: z.string().min(2, t('auth.validation.name_min')),
  email: z.string().email(t('auth.validation.email_invalid')),
  phone: z.string().regex(/^(0|\+84)[0-9]{9,11}$/, t('auth.validation.phone_invalid')),
  password: z.string().min(8, t('auth.validation.password_min')),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.validation.password_mismatch'),
  path: ["confirmPassword"],
});

export const getChangePasswordSchema = (t) => z.object({
  oldPassword: z.string().min(1, t('auth.validation.current_password_required')),
  newPassword: z.string().min(8, t('auth.validation.new_password_min')),
  confirmPassword: z.string().min(1, t('auth.validation.confirm_password_required')),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: t('auth.validation.password_mismatch'),
  path: ["confirmPassword"],
});
export const getPartnerRequestSchema = (t) => z.object({
  name: z.string().min(2, t('auth.validation.name_min')),
  email: z.string().email(t('auth.validation.email_invalid')),
  phone: z.string().regex(/^(0|\+84)[0-9]{9,11}$/, t('auth.validation.phone_invalid')),
  documentUrls: z.array(z.string()).min(1, t('api.messages.MISSING_REQUIRED_FIELDS')),
});
