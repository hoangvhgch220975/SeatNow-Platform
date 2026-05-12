import React from 'react';
import AIAssistantPage from '../../../ai-assistant/pages/AIAssistantPage.jsx';

/**
 * @file AdminAIChatPage.jsx
 * @description Trang trợ lý ảo (Copilot) cho Admin.
 * Sử dụng lại AIAssistantPage, vai trò Admin sẽ được tự động nhận diện từ AuthStore.
 */
const AdminAIChatPage = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full overflow-hidden rounded-[32px] border border-slate-200">
      <AIAssistantPage />
    </div>
  );
};

export default AdminAIChatPage;
