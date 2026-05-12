import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, MessageSquare, Trash2, ShieldCheck, Crown } from 'lucide-react';

/**
 * @file ChatSidebar.jsx
 * @description Sidebar quản lý lịch sử và các phiên hội thoại (Chỉ dành cho Customer/Owner).
 * Redesigned with cinematic luxury aesthetic.
 */
const ChatSidebar = ({ 
  sessions, 
  activeSessionId, 
  onLoadSession, 
  onDeleteSession, 
  onStartNewChat, 
  isOpen,
  roleBadge = 'VIP',
  theme = {}
}) => {
  const { t } = useTranslation();

  return (
    <aside className={`${isOpen ? 'w-80' : 'w-0'} bg-white border-r border-outline/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden relative z-30 shadow-xl shadow-black/5`}>
      <div className="p-8 flex flex-col h-full w-80">
        
        {/* New Chat button */}
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartNewChat}
          className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all mb-8 shadow-lg shadow-primary/20 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>{t('ai_assistant.sidebar.new_chat')}</span>
        </motion.button>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-[10px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">
                {t('ai_assistant.sidebar.recent_conversations')}
            </p>
        </div>
        
        {/* Sessions list */}
        <div className="flex-grow overflow-y-auto space-y-2 custom-scrollbar pr-2">
          <AnimatePresence>
            {sessions.map((session, idx) => (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => onLoadSession(session.id)}
                className={`group relative p-4 rounded-[1.25rem] cursor-pointer transition-all duration-300 border ${
                  activeSessionId === session.id 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-surface hover:border-outline/5'
                }`}
              >
                <div className="flex items-center gap-3 pr-8">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors ${activeSessionId === session.id ? 'text-primary' : 'text-on-surface-variant/30'}`} />
                  <div className="overflow-hidden">
                    <p className={`text-sm font-black truncate transition-colors ${activeSessionId === session.id ? 'text-primary' : 'text-on-surface'}`}>
                      {session.title || 'New Conversation'}
                    </p>
                    <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-widest mt-0.5">
                      {new Date(session.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Delete button */}
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-50 text-on-surface-variant/30 hover:text-rose-500 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {sessions.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-surface rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border border-outline/5">
                <MessageSquare className="w-7 h-7 text-on-surface-variant/20" />
              </div>
              <p className="text-[11px] font-black text-on-surface-variant/30 uppercase tracking-[0.2em]">
                {t('ai_assistant.sidebar.no_past_conversations')}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Role info */}
        <div className="mt-auto pt-6 border-t border-outline/5">
           <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-[1.25rem] border border-outline/5">
              <div className="w-10 h-10 rounded-[1rem] bg-primary/5 flex items-center justify-center text-primary shadow-sm border border-primary/10 flex-shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black text-on-surface flex items-center gap-1.5">
                    {roleBadge} <ShieldCheck className="w-3 h-3 text-primary" />
                </p>
                <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em] truncate mt-0.5">
                    {t('ai_assistant.sidebar.encrypted_session')}
                </p>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
