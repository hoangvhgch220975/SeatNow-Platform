import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @file Badge.jsx
 * @description Component hiển thị nhãn trạng thái/vai trò với phong cách hiện đại.
 */

const variants = {
  default: 'bg-slate-100 text-slate-600 border-slate-200',
  primary: 'bg-violet-50 text-violet-600 border-violet-100',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  warning: 'bg-amber-50 text-amber-600 border-amber-100',
  danger: 'bg-rose-50 text-rose-600 border-rose-100',
  info: 'bg-blue-50 text-blue-600 border-blue-100',
};

const Badge = ({ 
  children, 
  variant = 'default', 
  className,
  dot = false 
}) => {
  return (
    <span className={twMerge(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all',
      variants[variant] || variants.default,
      className
    )}>
      {dot && (
        <span className={clsx(
          'w-1 h-1 rounded-full',
          variant === 'default' && 'bg-slate-400',
          variant === 'primary' && 'bg-violet-400',
          variant === 'success' && 'bg-emerald-400',
          variant === 'warning' && 'bg-amber-400',
          variant === 'danger' && 'bg-rose-400',
          variant === 'info' && 'bg-blue-400',
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;
