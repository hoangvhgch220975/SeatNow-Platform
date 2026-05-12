import React from 'react';
import MessageBubble from './MessageBubble.jsx';
import ThinkingIndicator from './ThinkingIndicator.jsx';

/**
 * @file ChatBox.jsx
 * @description Khung hiển thị danh sách tin nhắn + indicator khi AI đang phản hồi.
 * Được tách ra từ AIAssistantPage để tái sử dụng và dễ bảo trì.
 * Props:
 *   - chatHistory: Array<{ role: 'user'|'model', message: string }>
 *   - isLoading: boolean - hiển thị ThinkingIndicator khi true
 *   - scrollRef: React.RefObject - dùng để auto-scroll xuống cuối
 */
const ChatBox = ({ chatHistory = [], isLoading = false, scrollRef }) => {
  return (
    <div
      ref={scrollRef}
      className="flex-grow h-0 overflow-y-auto space-y-4 pr-2 mb-4 custom-scrollbar scroll-smooth"
    >
      {chatHistory.map((chat, idx) => (
        <MessageBubble
          key={idx}
          role={chat.role}
          content={chat.message}
        />
      ))}

      {/* [Indicator]: Hiển thị khi AI đang xử lý phản hồi */}
      {isLoading && <ThinkingIndicator />}
    </div>
  );
};

export default ChatBox;
