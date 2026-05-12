import React from 'react';

/**
 * @file AdminEmptyState.jsx
 * @description Shared empty state component for the Admin console.
 * Designed with a premium, focused aesthetic.
 */
const AdminEmptyState = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 sm:px-10">
      <div className="relative group mb-10">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-violet-200 rounded-[40px] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
        
        {/* Border container */}
        <div className="relative w-32 h-32 rounded-[40px] border-2 border-dashed border-slate-200 bg-white shadow-sm flex items-center justify-center transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
          <div className="w-20 h-20 bg-violet-50 rounded-[28px] flex items-center justify-center shadow-inner">
            {Icon && <Icon className="text-violet-500 transition-transform duration-500 group-hover:scale-110" size={40} />}
          </div>
          
          {/* Decorative floating dots */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-100 rounded-full animate-bounce delay-75" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-100 rounded-full animate-bounce delay-150" />
        </div>
      </div>

      <div className="text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h3 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
            {subtitle}
          </p>
        )}
        
        {action && (
          <div className="animate-in fade-in delay-300">
            {action}
          </div>
        )}
      </div>

      {/* Security/Trust indicator */}
      <div className="mt-12 flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Secure Administration Protocol
        </span>
        <div className="w-1 h-1 rounded-full bg-slate-300" />
      </div>
    </div>
  );
};

export default AdminEmptyState;
