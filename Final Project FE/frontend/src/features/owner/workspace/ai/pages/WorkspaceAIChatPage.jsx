import React from 'react';
import { useParams } from 'react-router-dom';
import AIAssistantPage from '../../../../ai-assistant/pages/AIAssistantPage.jsx';

/**
 * @file WorkspaceAIChatPage.jsx
 * @description Trang AI Chat trong không gian làm việc của từng nhà hàng.
 * Sử dụng lại AIAssistantPage nhưng truyền restaurantId từ URL params.
 */
const WorkspaceAIChatPage = () => {
  const { idOrSlug } = useParams();
  // [Logic]: Truyền idOrSlug (ID hoặc Slug nhà hàng) để AI
  // sử dụng context riêng của nhà hàng đó
  return <AIAssistantPage restaurantId={idOrSlug} />;
};

export default WorkspaceAIChatPage;
