import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MoreVertical, ShieldCheck, Zap, CloudOff } from 'lucide-react';

// [Imports]: Modular Components
import ChatSidebar from '../components/ChatSidebar.jsx';
import ChatBox from '../components/ChatBox.jsx';
import ChatInputBar from '../components/ChatInputBar.jsx';
import { useAI } from '../hooks.js';
import { ROUTES } from '../../../config/routes.js';

/**
 * @file AIAssistantPage.jsx
 * @description Trang hội thoại AI tổng hợp, hỗ trợ Guest, Customer và Owner.
 * Hỗ trợ context từng nhà hàng khi được truyền restaurantId prop (Workspace mode).
 */
const AIAssistantPage = ({ restaurantId: restaurantIdProp = null }) => {
  const { t } = useTranslation();
  const location = useLocation();
  
  // [Logic]: Ưu tiên prop được truyền trực tiếp (Workspace), sau đó mới lấy từ location.state (Portal)
  const restaurantId = restaurantIdProp || location.state?.restaurantId || null;
  const isWorkspaceContext = !!restaurantId;

  // [Hook]: Sử dụng Logic AI tập trung
  const { 
    chatHistory, 
    sendMessage, 
    sendRecommend, 
    isLoading, 
    isAuthReady,
    sessions,
    activeSessionId,
    startNewChat,
    loadSession,
    deleteSession,
    hasPersonalization,
    isOwner,
    isCustomer,
    isAdmin,
    isGuest,
    role,
    isAiOnline
  } = useAI(restaurantId);

  // [Logic]: Phân tách bộ gợi ý dựa trên vai trò
  const suggestions = useMemo(() => {
    const list = isOwner 
      ? t('ai_assistant.suggestions_owner', { returnObjects: true }) 
      : isAdmin
      ? t('admin.ai_intelligence.chat.suggestions', { returnObjects: true })
      : isCustomer 
      ? t('ai_assistant.suggestions_customer', { returnObjects: true }) 
      : t('ai_assistant.suggestions_guest', { returnObjects: true });
    
    return Array.isArray(list) ? list : [];
  }, [isOwner, isCustomer, t]);

  // [Style]: Phân tách chủ đề màu sắc theo vai trò
  const theme = useMemo(() => {
    if (isAdmin) return {
        accent: 'amber',
        badge: 'ADMIN PROTOCOL',
        badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        glow: 'rgba(217,119,6,0.15)',
    };
    if (isOwner) return { 
        accent: 'violet',
        badge: 'EXECUTIVE ADVISOR',
        badgeBg: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
        glow: 'rgba(124,58,237,0.15)',
    };
    if (isCustomer) return { 
        accent: 'primary',
        badge: 'PRIVATE CONCIERGE',
        badgeBg: 'bg-primary/10 text-primary border-primary/20',
        glow: 'rgba(99,14,212,0.15)',
    };
    return { 
        accent: 'slate',
        badge: 'GUEST EXPLORER',
        badgeBg: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
        glow: 'rgba(100,116,139,0.1)',
    };
  }, [isAdmin, isOwner, isCustomer]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef(null);

  // [Effect]: Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatHistory, isLoading]);

  // [Logic]: Hiển thị Skeleton khi đang tải Auth
  if (!isAuthReady) {
    return (
      <div className="h-[calc(100vh-80px)] bg-surface flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-[11px] font-black text-on-surface-variant/40 uppercase tracking-[0.4em] animate-pulse">
            {t('ai_assistant.chat.initializing')}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-surface flex overflow-hidden relative font-sans">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[200px] pointer-events-none opacity-60"
        style={{ background: theme.glow }}
      />
      
      {/* 1. [Component]: Sidebar Quản lý lịch sử */}
      {hasPersonalization && (
        <ChatSidebar 
          isOpen={isSidebarOpen}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onStartNewChat={() => startNewChat()}
          onLoadSession={loadSession}
          onDeleteSession={deleteSession}
          roleBadge={isAdmin ? 'PROTOCOL' : (isOwner ? 'EXECUTIVE' : 'MEMBER')}
          theme={theme}
        />
      )}

      {/* 2. [Layout]: Vùng Chat chính */}
      <main className="flex-grow flex flex-col relative z-20 overflow-hidden">
        
        {/* [Header]: Thanh tiêu đề */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-20 border-b border-outline/5 glass px-8 flex items-center justify-between sticky top-0 z-40 shadow-premium"
        >
           <div className="flex items-center gap-5">
              {/* Toggle Sidebar Button */}
              {hasPersonalization && (
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-[1rem] border border-outline/10 text-on-surface-variant/40 hover:border-primary/30 hover:text-primary hover:bg-white transition-all"
                >
                  <MoreVertical className={`w-5 h-5 transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''}`} />
                </motion.button>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-black text-on-surface leading-tight tracking-tight">
                    {isAdmin 
                      ? t('ai_assistant.chat.roles.admin') 
                      : (isOwner 
                          ? t('ai_assistant.chat.roles.owner') 
                          : (isCustomer 
                              ? t('ai_assistant.chat.roles.customer') 
                              : t('ai_assistant.chat.roles.guest')
                            )
                        )
                    }
                  </h1>
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border ${theme.badgeBg}`}>
                    {theme.badge}
                  </span>
                </div>
                <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    {isAdmin 
                      ? t('ai_assistant.chat.protocols.admin') 
                      : (isOwner 
                          ? t('ai_assistant.chat.protocols.owner') 
                          : (isCustomer 
                              ? t('ai_assistant.chat.protocols.customer') 
                              : t('ai_assistant.chat.protocols.guest')
                            )
                        )
                    }
                </p>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                  <span className="text-[9px] font-black text-on-surface-variant/30 uppercase tracking-widest">{t('ai_assistant.chat.status_label')}</span>
                  <div className={`flex items-center gap-1.5 ${isAiOnline ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isAiOnline ? (
                        <Zap className="w-3 h-3 fill-current" />
                      ) : (
                        <CloudOff className="w-3 h-3" />
                      )}
                      <span className="text-[11px] font-black">
                        {isAiOnline ? t('ai_assistant.chat.ultra_responsive') : t('ai_assistant.chat.maintenance_mode')}
                      </span>
                  </div>
              </div>
              {!isOwner && !isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to={ROUTES.HOME} className="w-10 h-10 bg-white border border-outline/10 rounded-[1rem] flex items-center justify-center text-on-surface-variant/40 hover:text-primary hover:border-primary/30 hover:shadow-md transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </Link>
                </motion.div>
              )}
           </div>
        </motion.header>

        {/* [Viewport]: Khu vực hiển thị tin nhắn */}
        <div className="flex-grow flex flex-col items-center overflow-hidden">
            <div className="max-w-4xl w-full flex-grow flex flex-col p-4 lg:p-8 min-h-0">
                
                {/* [Component]: Danh sách tin nhắn + ThinkingIndicator */}
                <ChatBox
                  chatHistory={chatHistory}
                  isLoading={isLoading}
                  scrollRef={scrollRef}
                />

                {/* [Input Area]: Thanh nhập liệu */}
                <div className="w-full shrink-0">
                    <ChatInputBar 
                      onSend={sendMessage}
                      onRecommend={sendRecommend}
                      isLoading={isLoading}
                      hasPersonalization={isCustomer}
                      suggestions={suggestions}
                    />
                </div>
            </div>
        </div>
      </main>

      {/* [Style]: Custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.1); }
      `}</style>
    </div>
  );
};

export default AIAssistantPage;
