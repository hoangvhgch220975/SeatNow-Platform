import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

/**
 * @file Button.jsx
 * @description Nút bấm tiêu chuẩn của hệ thống SeatNow.
 * Hỗ trợ các trạng thái loading, disabled và đa dạng phong cách.
 */
const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  ...props
}) => {
  // Định nghĩa các phong cách nút (Vietnamese comment)
  const variants = {
    primary: 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-primary-container active:scale-95 disabled:bg-slate-200',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95 disabled:bg-slate-200',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 active:scale-95',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200 active:scale-95',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-current" size={size === 'sm' ? 16 : 20} />
      ) : (
        <>
          {icon && <span className="flex items-center justify-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
