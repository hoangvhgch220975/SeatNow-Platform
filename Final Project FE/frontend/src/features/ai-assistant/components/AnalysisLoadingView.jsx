import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Search, PieChart, TrendingUp, Sparkles } from 'lucide-react';

/**
 * @file AnalysisLoadingView.jsx
 * @description Trạng thái Loading cao cấp với các thông điệp thay đổi liên tục.
 */
const AnalysisLoadingView = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  // Lấy danh sách steps từ i18n (trả về mảng)
  const currentMessages = t('ai_assistant.insights.loading_steps', { returnObjects: true });
  const messageCount = Array.isArray(currentMessages) ? currentMessages.length : 0;

  useEffect(() => {
    if (messageCount === 0) return;
    
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % messageCount);
    }, 2500);
    return () => clearInterval(timer);
  }, [messageCount]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary),0.05),transparent_70%)]">
      {/* Visual Animation */}
      <div className="relative mb-12">
        {/* Outer Glowing Rings */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <div className="absolute inset-0 bg-indigo-500/10 blur-2xl rounded-full scale-125 animate-bounce [animation-duration:3s]"></div>
        
        {/* Central Icon Container */}
        <div className="relative z-10 w-24 h-24 bg-white rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center border border-white/50 backdrop-blur-sm">
          <div className="relative">
            <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-amber-400 animate-spin [animation-duration:4s]" />
            <TrendingUp className="w-10 h-10 text-primary animate-pulse" />
          </div>
        </div>

        {/* Orbiting Icons */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-[spin_8s_linear_infinite]">
                <div className="w-10 h-10 bg-white rounded-xl shadow-md border border-slate-50 flex items-center justify-center -rotate-[inherit]">
                    <BarChart className="w-5 h-5 text-indigo-500" />
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-[spin_10s_linear_infinite_reverse]">
                <div className="w-10 h-10 bg-white rounded-xl shadow-md border border-slate-50 flex items-center justify-center -rotate-[inherit]">
                    <PieChart className="w-5 h-5 text-rose-500" />
                </div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 animate-[spin_12s_linear_infinite]">
                <div className="w-10 h-10 bg-white rounded-xl shadow-md border border-slate-50 flex items-center justify-center -rotate-[inherit]">
                    <Search className="w-5 h-5 text-amber-500" />
                </div>
            </div>
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-bold text-slate-800 mb-3 animate-pulse">
        SeatNow AI Insights
      </h2>
      <div className="flex flex-col items-center gap-2">
        <p className="text-slate-500 font-medium text-lg min-h-[28px] transition-all duration-500">
          {Array.isArray(currentMessages) ? currentMessages[step] : ''}
        </p>
        <div className="flex gap-1.5 mt-2">
          {Array.isArray(currentMessages) && currentMessages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === step ? 'w-8 bg-primary' : 'w-2 bg-slate-200'
              }`} 
            />
          ))}
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-sm max-w-sm">
        {t('ai_assistant.insights.loading_footer')}
      </p>
    </div>
  );
};

export default AnalysisLoadingView;
