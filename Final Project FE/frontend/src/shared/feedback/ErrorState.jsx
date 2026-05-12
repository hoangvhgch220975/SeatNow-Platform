import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../config/routes.js';

/**
 * @file ErrorState.jsx
 * @description Card thông báo lỗi phong cách Glassmorphism, căn giữa hoàn hảo.
 */
const ErrorState = ({ 
  title = "Oops! Destination Not Found", 
  message = "We couldn't retrieve the details for this restaurant. It might be offline or the link has expired.",
  backPath = ROUTES.RESTAURANT_LIST,
  backLabel = "Back to Destinations"
}) => {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center pb-48 bg-transparent px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Main Error Content */}
      <div className="max-w-md w-full bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 text-center relative z-10 transition-all hover:shadow-[0_45px_110px_-20px_rgba(0,0,0,0.1)]">
        
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          <div className="absolute inset-0 bg-red-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-full h-full bg-red-50 rounded-full flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-5xl text-red-500 font-light">
              error_outline
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4 mb-10">
          <h2 className="text-4xl font-[900] text-slate-900 tracking-tight leading-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-[280px] mx-auto">
            {message}
          </p>
        </div>

        {/* Premium Button */}
        <Link 
          to={backPath}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-bold overflow-hidden shadow-2xl shadow-primary/25 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1">arrow_back</span>
          <span className="relative z-10">{backLabel}</span>
        </Link>
      </div>

      {/* Bottom Identity */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3 opacity-30">
          <div className="w-8 h-[1px] bg-slate-400"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">SeatNow Concierge</span>
          <div className="w-8 h-[1px] bg-slate-400"></div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
