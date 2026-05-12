import { z } from 'zod';

/**
 * @file schemas.js
 * @description Định nghĩa quy tắc kiểm tra dữ liệu (Validation) cho Profile.
 */
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  phone: z.string().optional(), // SĐT không đổi nên để optional
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});


