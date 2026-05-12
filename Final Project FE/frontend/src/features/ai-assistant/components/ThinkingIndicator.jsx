import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import logo from '../../../assets/logos/logo.png';

/**
 * @file ThinkingIndicator.jsx
 * @description Small loading state component when AI is generating a response.
 * Redesigned with cinematic luxury aesthetic.
 */
const ThinkingIndicator = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.3 }}
      className="flex justify-start mb-6 px-2"
    >
      <div className="flex gap-4">
        {/* AI Avatar - pulsing */}
        <div className="w-10 h-10 rounded-[1.25rem] bg-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
          <img src={logo} alt="Thinking..." className="w-6 h-6 object-contain" />
        </div>
        
        {/* Thinking bubble */}
        <div className="bg-white border border-outline/5 rounded-[1.75rem] rounded-tl-[0.5rem] shadow-sm px-6 py-4 flex items-center gap-4">
          {/* Animated dots */}
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </span>
          <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.3em]">
            {t('ai_assistant.chat.searching')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;
