import React from 'react';

/**
 * @file LoadingSpinner.jsx
 * @description Màn hình Loading toàn trang phong cách Premium.
 * Sử dụng CSS keyframes cho hiệu ứng Orbital và Pulse.
 */
const LoadingSpinner = ({ message = "Loading exquisite details..." }) => {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center pb-32 bg-transparent">
      {/* Container hiệu ứng */}
      <div className="relative flex items-center justify-center w-32 h-32 mb-8">
        
        {/* Glow nền mờ */}
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>

        {/* Vòng quay quỹ đạo 1 */}
        <div className="absolute w-full h-full border-[3px] border-transparent border-t-primary/40 rounded-full animate-[spin_1.5s_linear_infinite]"></div>
        
        {/* Vòng quay quỹ đạo 2 */}
        <div className="absolute w-4/5 h-4/5 border-[3px] border-transparent border-b-primary/60 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        
        {/* Nhân ở giữa nhấp nháy */}
        <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--color-primary),0.5)] animate-pulse"></div>
      </div>

      {/* Thông báo */}
      <div className="text-center space-y-2 px-6">
        <h3 className="text-xl font-extrabold tracking-tight text-slate-900 animate-pulse">
          {message}
        </h3>
        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase">
          Please wait a moment
        </p>
      </div>

      {/* Thêm CSS inline cho animation nếu Tailwind chưa config spin-reverse */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}} />
    </div>
  );
};

export default LoadingSpinner;
