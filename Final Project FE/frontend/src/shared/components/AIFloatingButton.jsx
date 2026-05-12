import { Link } from 'react-router';
import { ROUTES } from '../../config/routes.js';

/**
 * @file AIFloatingButton.jsx
 * @description Nút bấm nổi (FAB) cho Trợ lý AI.
 * Thiết kế Premium với hiệu ứng Glassmorphism và Pulse.
 */
const AIFloatingButton = () => {
  return (
    <Link 
      to={ROUTES.AI_CHAT}
      className="fixed bottom-8 right-8 z-[100] cursor-pointer"
    >
      {/* Glow Effect Layer */}
      <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>

      {/* Main Button */}
      <button
        className="relative group flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full shadow-[0_20px_50px_rgba(var(--color-primary),0.3)] hover:shadow-[0_25_60px_rgba(var(--color-primary),0.4)] transition-all duration-300 hover:-translate-y-1 active:scale-95"
        aria-label="AI Assistant"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Animated Rings */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        {/* Icon */}
        <span className="material-symbols-outlined text-3xl font-light transform group-hover:rotate-12 transition-transform duration-300">
          auto_awesome
        </span>

        {/* Tooltip (Optional/Hidden for now) */}
        <div className="absolute right-full mr-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 whitespace-nowrap pointer-events-none">
          Ask SeatNow AI
          <div className="absolute top-1/2 -right-1 border-4 border-transparent border-l-slate-900 -translate-y-1/2"></div>
        </div>
      </button>

      {/* Decorative dot */}
      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-sm"></div>
    </Link>
  );
};

export default AIFloatingButton;
