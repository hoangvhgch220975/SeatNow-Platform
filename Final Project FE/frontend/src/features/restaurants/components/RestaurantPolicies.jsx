import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file RestaurantPolicies.jsx
 * @description Hiển thị các chính sách nhà hàng (đặt chỗ, hủy chỗ, trang phục). Hỗ trợ đa ngôn ngữ.
 */
const RestaurantPolicies = ({ policies }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 border-2 border-primary/10 rounded-xl space-y-6 bg-surface-container-lowest">
      <h3 className="font-bold flex items-center gap-2 text-on-surface">
        <span className="material-symbols-outlined text-primary">info</span>
        {t('restaurants.policies.title')}
      </h3>
      <ul className="text-sm text-on-surface-variant space-y-3">
        {policies.map((policy, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-primary">•</span>
            <span dangerouslySetInnerHTML={{ __html: policy }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantPolicies;
