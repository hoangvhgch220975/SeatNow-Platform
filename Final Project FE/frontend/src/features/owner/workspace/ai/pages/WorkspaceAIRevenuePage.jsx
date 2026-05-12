import React from 'react';
import { useParams } from 'react-router-dom';
import AIRevenueInsightsPage from '../../../../owner/portal/pages/AIRevenueInsightsPage.jsx';

/**
 * @file WorkspaceAIRevenuePage.jsx
 * @description Trang AI Phân tích doanh thu cho từng nhà hàng cụ thể.
 * Sử dụng lại AIRevenueInsightsPage nhưng truyền restaurantId từ URL params.
 */
const WorkspaceAIRevenuePage = () => {
  const { idOrSlug } = useParams();
  // [Logic]: Truyền idOrSlug để AI chỉ phân tích dữ liệu nhà hàng này
  return <AIRevenueInsightsPage restaurantId={idOrSlug} />;
};

export default WorkspaceAIRevenuePage;
