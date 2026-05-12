import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import logo from '../../../assets/logos/logo.png';
import { User } from 'lucide-react';

/**
 * @file MessageBubble.jsx
 * @description Hiển thị bong bóng chat riêng lẻ với hỗ trợ Markdown.
 * Redesigned with cinematic luxury aesthetic.
 */
const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-2`}
    >
      <div className={`flex gap-4 max-w-[88%] ${isUser ? 'flex-row-reverse' : ''}`}>
        
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: isUser ? 2 : -2 }}
          className={`w-10 h-10 rounded-[1.25rem] flex-shrink-0 flex items-center justify-center shadow-lg transition-shadow ${
            isUser 
              ? 'bg-on-surface border border-white/10 shadow-on-surface/20' 
              : 'bg-primary shadow-primary/30'
          }`}
        >
          {isUser ? (
            <User className="text-white w-5 h-5" />
          ) : (
            <img src={logo} alt="SeatNow AI" className="w-6 h-6 object-contain" />
          )}
        </motion.div>

        {/* Content Bubble */}
        <div className="flex flex-col gap-2">
          <div className={`p-5 rounded-[1.75rem] text-sm leading-relaxed shadow-sm border group ${
            isUser 
              ? 'bg-on-surface text-white rounded-tr-[0.5rem] border-white/5 shadow-on-surface/10' 
              : 'bg-white border-outline/5 text-on-surface-variant rounded-tl-[0.5rem] shadow-sm hover:shadow-md transition-shadow duration-500'
          }`}>
            <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'prose-slate'}`}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  strong: ({node, ...props}) => <strong className="text-primary font-black" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1.5 mb-3" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1.5 mb-3" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
                  h1: ({node, ...props}) => <h1 className="text-lg font-black mb-3 text-on-surface" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-md font-black mb-2 text-on-surface" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-sm font-black mb-2 text-primary" {...props} />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-4 rounded-[1.5rem] border border-outline/5">
                      <table className="min-w-full divide-y divide-outline/5" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => <th className="px-4 py-3 bg-surface text-left text-[10px] font-black text-on-surface-variant/50 uppercase tracking-widest" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-3 text-xs border-t border-outline/5" {...props} />,
                  code: ({node, inline, ...props}) => (
                    inline 
                      ? <code className="bg-primary/5 px-2 py-0.5 rounded-lg text-primary font-black text-xs" {...props} />
                      : <code className="block bg-surface p-4 rounded-[1.5rem] font-mono text-xs overflow-x-auto border border-outline/5 mt-2" {...props} />
                  )
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* Timestamp */}
          <p className={`text-[9px] font-black text-on-surface-variant/25 uppercase tracking-[0.25em] px-2 ${isUser ? 'text-right' : 'text-left'}`}>
             {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
