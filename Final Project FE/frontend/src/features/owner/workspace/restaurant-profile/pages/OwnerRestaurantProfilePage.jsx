import React from 'react';
import { useOutletContext, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ROUTES } from '@/config/routes';
import ProfileHero from '../components/ProfileHero';
import RestaurantProfileForm from '../components/RestaurantProfileForm';
import ContactInfoForm from '../components/ContactInfoForm';
import OpeningHoursForm from '../components/OpeningHoursForm';
import DepositPolicyForm from '../components/DepositPolicyForm';

/**
 * @file OwnerRestaurantProfilePage.jsx
 * @description Trang quản trị hồ sơ chi tiết của nhà hàng.
 * Tổng hợp các module quản lý: Thông tin cơ bản, Liên hệ, Giờ mở cửa, Chính sách cọc.
 */
const OwnerRestaurantProfilePage = () => {
  const { t } = useTranslation();
  const { restaurant, isLoading } = useOutletContext();

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            {t('workspace.profile.title')}
          </h2>
          <p className="text-slate-500 font-bold text-lg">
            {t('workspace.profile.subtitle')}
          </p>
        </div>

        <Link
          to={ROUTES.OWNER_PROFILE}
          onClick={(e) => {
            e.preventDefault();
            toast.dismiss();
            toast(t('common.coming_soon'), {
              icon: '🛠️',
              style: {
                borderRadius: '1rem',
                background: '#1e293b',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
              },
            });
          }}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md hover:border-violet-200 hover:text-violet-600 transition-all active:scale-95 group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">edit_note</span>
          {t('workspace.profile.hero.edit_profile')}
        </Link>
      </div>

      {/* Hero Section */}
      <ProfileHero restaurant={restaurant} isLoading={isLoading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-10">
        {/* Left Column - Main Branding & Concept */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <RestaurantProfileForm restaurant={restaurant} isLoading={isLoading} />
          <ContactInfoForm restaurant={restaurant} isLoading={isLoading} />
        </div>

        {/* Right Column - Operational Settings */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <OpeningHoursForm restaurant={restaurant} isLoading={isLoading} />
          <DepositPolicyForm restaurant={restaurant} isLoading={isLoading} />
        </div>
      </div>

      {/* Final Spacer */}
      <div className="pb-16" />
    </div>
  );
};

export default OwnerRestaurantProfilePage;
