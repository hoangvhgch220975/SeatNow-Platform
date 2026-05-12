import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * @file Input.jsx
 * @description Thành phần nhập liệu tiêu chuẩn với thiết kế cao cấp.
 * Hỗ trợ label, error message và hiệu ứng focus phong cách hiện đại.
 */
const Input = ({
  label,
  error,
  className,
  containerClassName,
  icon,
  ...props
}) => {
  return (
    <div className={twMerge(clsx('space-y-2', containerClassName))}>
      {label && (
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
            {icon}
          </div>
        )}
        
        <input
          className={twMerge(
            clsx(
              'w-full h-14 rounded-2xl bg-slate-50 border-2 border-transparent transition-all duration-300 outline-none',
              'px-6 text-sm font-bold text-slate-900 placeholder:text-slate-300',
              'hover:bg-slate-100 hover:border-slate-100',
              'focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5',
              error && 'border-red-100 bg-red-50/50 focus:border-red-200 focus:ring-red-100/20',
              icon && 'pl-12',
              className
            )
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="material-symbols-outlined text-xs">error</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
