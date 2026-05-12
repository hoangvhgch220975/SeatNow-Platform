import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Sparkles, Wand2 } from 'lucide-react';
import PromptSuggestions from './PromptSuggestions.jsx';

/**
 * @file ChatInputBar.jsx
 * @description Ô nhập liệu hội thoại tích hợp gợi ý và công cụ AI thông minh.
 * Redesigned with cinematic luxury aesthetic.
 */
const ChatInputBar = ({ onSend, onRecommend, isLoading, hasPersonalization = false, suggestions = [] }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value);
    setValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full"
    >
      
      {/* Suggestion pills */}
      <PromptSuggestions
        suggestions={suggestions}
        onSelect={onSend}
        isLoading={isLoading}
      />

      {/* Main Input Box */}
      <div className="group relative flex items-center">
        {/* Leading icon */}
        <div className="absolute left-6 text-on-surface-variant/30 group-focus-within:text-primary transition-colors duration-300 pointer-events-none">
          <Sparkles className="w-5 h-5" />
        </div>

        <input 
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('ai_assistant.chat.placeholder')}
          className="w-full bg-white border border-outline/10 p-6 pl-14 pr-56 rounded-[2rem] text-sm text-on-surface placeholder:text-on-surface-variant/30 font-medium focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all duration-300 shadow-sm hover:shadow-md"
          disabled={isLoading}
        />

        {/* Action buttons */}
        <div className="absolute right-3 flex items-center gap-2">
          {/* Recommend button (Customer only) */}
          {hasPersonalization && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRecommend()}
              disabled={isLoading}
              title={t('ai_assistant.chat.recommend_tooltip')}
              className="px-4 py-3 bg-primary/5 text-primary rounded-[1.25rem] font-black flex items-center gap-2 hover:bg-primary hover:text-white disabled:opacity-50 transition-all duration-300 border border-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 group/magic"
            >
              <Wand2 className="w-4 h-4 group-hover/magic:rotate-12 transition-transform duration-300" />
              <span className="hidden lg:inline text-[10px] uppercase tracking-[0.2em]">
                {t('ai_assistant.chat.recommend_button')}
              </span>
            </motion.button>
          )}

          {/* Send button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className="px-6 py-3 bg-primary text-white rounded-[1.25rem] font-black flex items-center gap-2 hover:brightness-110 disabled:opacity-40 disabled:grayscale transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px] uppercase tracking-[0.2em]">{t('ai_assistant.chat.send_button')}</span>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-center text-[9px] font-black text-on-surface-variant/20 uppercase tracking-[0.4em]">
        {t('ai_assistant.footer')}
      </p>
    </motion.div>
  );
};

export default ChatInputBar;
