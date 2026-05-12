import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { aiApi } from './api.js';
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../auth/store.js';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

/**
 * @file hooks.js
 * @description Hook tổng hợp quản lý hội thoại AI cho mọi Role (Guest, Customer, Owner).
 * Tích hợp đa ngôn ngữ và đồng bộ lịch sử Redis.
 */

const STORAGE_KEY_PREFIX = 'seatnow_ai_sessions_';

export const useAI = (restaurantId = null) => {
  const { i18n } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  
  // KIỂM TRA ĐỘ SẴN SÀNG CỦA AUTH
  const isAuthReady = !isAuthenticated || (isAuthenticated && user !== null);
  
  // [Xác định vai trò và định danh]
  const isOwner = isAuthenticated && user?.role?.toUpperCase() === 'RESTAURANT_OWNER';
  const isCustomer = isAuthenticated && user?.role?.toUpperCase() === 'CUSTOMER';
  const isAdmin = isAuthenticated && user?.role?.toUpperCase() === 'ADMIN';
  const isGuest = !isAuthenticated;
  
  const userId = user?.id || user?._id || 'guest';
  const role = user?.role || 'GUEST';
  const currentLang = i18n.language || 'en';

  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // 1. [Logic: Đồng bộ lịch sử từ Server]
  // Đồng bộ hóa với Redis theo từng SessionId cụ thể
  const syncWithServerHistory = async (targetSessionId) => {
    if (isGuest || !targetSessionId) return;

    try {
      let response;
      const roleLower = role.toLowerCase();
      
      // [Phân tách theo Role]: Truyền kèm sessionId để lấy đúng lịch sử của phiên đó
      if (isCustomer) {
        response = await aiApi.getCustomerHistory(targetSessionId);
      } else if (isOwner) {
        response = await aiApi.getOwnerHistory(restaurantId, targetSessionId);
      } else if (roleLower === 'admin') {
        response = await aiApi.getAdminHistory(targetSessionId);
      }

      const serverHistory = response?.data?.history || response?.data || [];
      
      // Chuyển đổi format từ backend sang format UI ({role, message})
      const formattedHistory = serverHistory.map(h => ({
        role: h.role,
        message: h.parts?.[0] || h.message || ''
      }));

      if (formattedHistory.length > 0) {
          setChatHistory(formattedHistory);
          setSessions(prev => prev.map(s => 
              s.id === targetSessionId ? { ...s, messages: formattedHistory } : s
          ));
      }
    } catch (e) {
      console.warn(`[AI-Sync] No server history found for session ${targetSessionId}`);
    }
  };

  // 2. [Logic: Khởi tạo dữ liệu]
  useEffect(() => {
    if (!isAuthReady) return;

    // // [Role: PUBLIC/GUEST]: Luôn bắt đầu chat mới mỗi lần load trang
    if (isGuest) {
      startNewChat(true);
      return;
    }

    // // [Role: CUSTOMER/OWNER/ADMIN]: Load lịch sử từ LocalStorage theo VAI TRÒ
    // Cô lập hoàn toàn: Lịch sử theo tổ hợp Role + UserId
    const storageKey = `${STORAGE_KEY_PREFIX}${role.toLowerCase()}_${userId}`;
    const saved = localStorage.getItem(storageKey);
    let loadedSessions = [];

    if (saved) {
      try {
        loadedSessions = JSON.parse(saved);
        setSessions(loadedSessions);
      } catch (e) { console.error("History load error", e); }
    }

    if (loadedSessions.length > 0) {
      const latest = loadedSessions[0];
      setActiveSessionId(latest.id);
      setChatHistory(latest.messages);
      syncWithServerHistory(latest.id);
    } else {
      startNewChat(true);
    }
  }, [userId, role, isAuthReady, isGuest]);

  // 3. [Logic: Lưu trữ cục bộ theo Role]
  useEffect(() => {
    if (!isGuest && sessions.length > 0) {
      const storageKey = `${STORAGE_KEY_PREFIX}${role.toLowerCase()}_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    }
  }, [sessions, userId, role, isGuest]);

  // 4. [Logic: Quản lý phiên chat]
  const updateSessionHistory = (newHistory) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const firstUserMsg = newHistory.find(m => m.role === 'user')?.message;
        const newTitle = firstUserMsg ? (firstUserMsg.slice(0, 30) + '...') : 'New Conversation';
        return { ...s, messages: newHistory, title: newTitle, timestamp: new Date().toISOString() };
      }
      return s;
    }));
  };

  const startNewChat = useCallback(async (isInitial = false) => {
    // [Xử lý]: Khi bắt đầu chat mới hoàn toàn (Client-side), backend sẽ tự có key mới theo sessionId mới
    // Không cần gọi clearHistory toàn bộ nữa vì mỗi session đã được cô lập
    
    const newId = crypto.randomUUID();
    const welcomeMsg = { 
      role: 'model', 
      message: `Hello! I am your SeatNow AI Advisor. How can I help you today?` 
    };

    const newSession = {
      id: newId,
      title: 'New Conversation',
      messages: [welcomeMsg],
      timestamp: new Date().toISOString()
    };

    setChatHistory([welcomeMsg]);
    setActiveSessionId(newId);
    setSessions(prev => [newSession, ...prev]);
  }, [isGuest, isCustomer, isOwner, restaurantId, currentLang]);

  // 4.5 [Logic: Kiểm tra trạng thái AI Service]
  const aiHealthQuery = useQuery({
    queryKey: ['ai', 'health'],
    queryFn: () => aiApi.getHealth(),
    refetchInterval: 1000 * 30, // 30s check một lần
    retry: 1,
    staleTime: 1000 * 20
  });

  // 5. [Logic: Xử lý Mutation gửi tin nhắn]
  const mutation = useMutation({
    mutationFn: async (message) => {
      let res;
      const roleLower = role.toLowerCase();
      // // [Phân luồng gọi API]: Luôn truyền kèm activeSessionId
      if (isOwner) {
        res = await aiApi.ownerChat(message, restaurantId, currentLang, activeSessionId);
      } else if (isCustomer) {
        res = await aiApi.customerChat(message, currentLang, activeSessionId);
      } else if (roleLower === 'admin') {
        res = await aiApi.adminChat(message, currentLang, activeSessionId);
      } else {
        res = await aiApi.publicRecommend(message, currentLang);
      }

      return res?.data?.reply || res?.reply || res?.recommendations || res?.message || res;
    },
    onSuccess: (reply) => {
      const aiMsg = { role: 'model', message: reply };
      setChatHistory(prev => {
        const newHistory = [...prev, aiMsg];
        updateSessionHistory(newHistory);
        return newHistory;
      });
    },
    onError: (err) => {
        toast.error("AI service is currently busy. Please try again later.");
    }
  });

  const addUserMessage = (message) => {
    const userMsg = { role: 'user', message };
    setChatHistory(prev => {
      const newHistory = [...prev, userMsg];
      updateSessionHistory(newHistory);
      return newHistory;
    });
  };

  // 6. [Logic: Gợi ý Magic Recommend]
  const recommendMutation = useMutation({
    mutationFn: () => {
        if (isCustomer) return aiApi.customerRecommend(currentLang);
        if (isOwner) return aiApi.ownerRevenueSummary(restaurantId, currentLang);
        return aiApi.publicRecommend("Recommend some restaurants", currentLang);
    },
    onSuccess: (res) => {
      const result = res?.recommendations || res?.data?.summary || res?.summary || res?.reply || "I don't have enough data to recommend yet.";
      const aiMsg = { role: 'model', message: typeof result === 'string' ? result : JSON.stringify(result) };
      setChatHistory(prev => {
        const newHistory = [...prev, aiMsg];
        updateSessionHistory(newHistory);
        return newHistory;
      });
    }
  });

  return {
    chatHistory,
    sendMessage: (msg) => { addUserMessage(msg); mutation.mutate(msg); },
    sendRecommend: () => recommendMutation.mutate(),
    isLoading: mutation.isPending || recommendMutation.isPending,
    isAuthReady,
    sessions,
    activeSessionId,
    startNewChat,
    loadSession: (sid) => {
        const s = sessions.find(x => x.id === sid);
        if (s) { 
          setActiveSessionId(sid); 
          setChatHistory(s.messages); 
          syncWithServerHistory(sid); 
        }
    },
    deleteSession: async (sid) => {
        // [Xóa phiên]: Xóa cả trên LocalStorage và Redis (nếu cần)
        setSessions(prev => prev.filter(x => x.id !== sid));
        if (activeSessionId === sid) startNewChat(true);
        
        try {
          if (isCustomer) await aiApi.clearCustomerHistory(sid);
          if (isOwner) await aiApi.clearOwnerHistory(restaurantId, sid);
          if (isAdmin) await aiApi.clearAdminHistory(sid);
        } catch(e) {}
    },
    hasPersonalization: !isGuest,
    isOwner,
    isCustomer,
    isAdmin,
    isGuest,
    role,
    aiHealth: aiHealthQuery.data,
    isAiOnline: aiHealthQuery.status === 'success' && (aiHealthQuery.data?.status === 'UP' || aiHealthQuery.data?.data?.status === 'UP')
  };
};

export const useAIAssistant = (rid) => useAI(rid);
export const usePublicAI = () => useAI();
export const useOwnerAI = (rid) => useAI(rid);
