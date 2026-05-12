import React from 'react';
import { motion } from 'framer-motion';

/**
 * @file PromptSuggestions.jsx
 * @description Các pill gợi ý câu hỏi nhanh theo vai trò (Owner/Customer/Guest).
 * Redesigned with cinematic luxury aesthetic.
 */
const PromptSuggestions = ({ suggestions = [], onSelect, isLoading = false }) => {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  if (safeSuggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 px-1">
      {safeSuggestions.map((suggestion, idx) => (
        <motion.button
          key={idx}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: idx * 0.05, duration: 0.3 }}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion)}
          disabled={isLoading}
          className="px-5 py-2.5 bg-white border border-outline/10 rounded-full text-[11px] font-black text-on-surface-variant/60 hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
};

export default PromptSuggestions;
