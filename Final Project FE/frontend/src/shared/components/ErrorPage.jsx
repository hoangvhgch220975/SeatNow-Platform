import React from 'react';
import { useRouteError, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @file ErrorPage.jsx
 * @description Trang hiển thị lỗi cao cấp khi ứng dụng gặp sự cố không mong muốn.
 * Tích hợp đa ngôn ngữ và giao diện Glassmorphism.
 */
const ErrorPage = () => {
  const error = useRouteError(); // Lấy thông tin lỗi từ React Router (Vietnamese comment)
  const navigate = useNavigate(); // Hook điều hướng (Vietnamese comment)
  const { t } = useTranslation(); // Hook dịch thuật (Vietnamese comment)

  // Log lỗi ra console để phục vụ debugging (chỉ trong dev) (Vietnamese comment)
  console.error('System Error Captured:', error);

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex items-center justify-center p-6 font-body relative overflow-hidden">
      {/* Hiệu ứng nền mờ ảo (Background Glow) (Vietnamese comment) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl relative z-10"
      >
        {/* Biểu tượng cảnh báo với hiệu ứng chuyển động (Vietnamese comment) */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, -2, 2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-24 h-24 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-violet-500/20"
        >
          <span className="material-symbols-outlined text-[48px] text-white select-none">report</span>
        </motion.div>

        {/* Tiêu đề và Thông báo (Vietnamese comment) */}
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight uppercase">
          {t('errors.title')}
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
          {t('errors.message')}
        </p>

        {/* Phân đoạn kỹ thuật (Chỉ hiển thị stack trace nếu là lỗi thật và trong môi trường phát triển) (Vietnamese comment) */}
        <div className="mb-10 text-left">
           <div className="bg-black/40 rounded-2xl p-6 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                  {t('errors.status_code')}
                </span>
                <span className="text-slate-500 text-xs font-mono">
                  {error?.statusText || error?.message || 'CRITICAL_RUNTIME_EXCEPTION'}
                </span>
              </div>
              
              {/* Stack trace ẩn dưới dạng Expandable (Tùy chọn cho Dev) (Vietnamese comment) */}
              <details className="group">
                <summary className="text-[10px] font-black text-slate-500 cursor-pointer list-none hover:text-slate-300 transition-colors uppercase tracking-widest">
                  {t('errors.stack_trace')}
                </summary>
                <div className="mt-4 max-h-40 overflow-y-auto text-[10px] font-mono text-slate-600 bg-white/[0.02] p-4 rounded-xl custom-scrollbar leading-loose">
                  {error?.stack || 'No telemetry stack available for this exception.'}
                </div>
              </details>
           </div>
        </div>

        {/* Nút hành động (Vietnamese comment) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-2xl font-black text-sm tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            {t('errors.action_home')}
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 rounded-2xl font-black text-sm tracking-widest hover:bg-white/5 transition-all active:scale-95"
          >
            {t('errors.action_retry')}
          </button>
        </div>
      </motion.div>

      {/* Footer mờ (Vietnamese comment) */}
      <p className="absolute bottom-8 left-0 right-0 text-center text-slate-600 text-[10px] font-bold tracking-widest uppercase opacity-40">
        SeatNow Executive Protocol &copy; 2026
      </p>
    </div>
  );
};

export default ErrorPage;
