import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUpdateRestaurant } from '@/features/owner/workspace/settings/hooks';
import { parseApiError } from '@/shared/utils/parseApiError';
import toast from 'react-hot-toast';

/**
 * @file ProfileHero.jsx
 * @description Hiển thị ảnh bìa, avatar thương hiệu và trạng thái nhà hàng.
 * Thiết kế theo phong cách Glassmorphism cao cấp.
 */
const ProfileHero = ({ restaurant, isLoading }) => {
  const { t } = useTranslation();
  const updateRestaurantMutation = useUpdateRestaurant();

  const isSaving = updateRestaurantMutation.isPending;
  const status = restaurant?.status?.toLowerCase();
  const isPending = status === 'pending';
  const isActive = status === 'active';

  const handleToggleStatus = async () => {
    if (isPending) return;

    const newStatus = isActive ? 'suspended' : 'active';
    try {
      await updateRestaurantMutation.mutateAsync({
        restaurantId: restaurant.id,
        updateData: { status: newStatus }
      });
      toast.success(newStatus === 'active' 
        ? t('workspace.profile.hero.toast_open_success') 
        : t('workspace.profile.hero.toast_close_success')
      );
    } catch (error) {
      const { message } = parseApiError(error);
      toast.error(message || t('workspace.profile.hero.toast_update_error'));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-3xl animate-pulse mb-8" />
    );
  }

  // Logic lấy ảnh (Vietnamese comment)
  // Avatar: Ảnh đầu tiên
  const avatarImage = restaurant?.images?.[0];
  // Banner: Ảnh thứ hai, nếu không có thì lấy ảnh đầu, nếu không có nữa thì lấy mặc định
  const bannerImage = restaurant?.images?.[1] || restaurant?.images?.[0] || 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200';
  
  return (
    <div className="relative w-full mb-8">
      {/* Cover Image Container (Banner) */}
      <div className="relative h-64 md:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-violet-100/50 group">
        <img 
          src={bannerImage} 
          alt="Restaurant Banner" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-black/60" />
        
        {/* Status Badge & Toggle Overlay */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : isPending ? 'bg-amber-500' : 'bg-rose-500'}`} />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
              {isActive ? t('workspace.profile.hero.active') : isPending ? t('workspace.profile.hero.pending') : t('workspace.profile.hero.suspended')}
            </span>
          </div>

          {!isPending && (
            <button
              onClick={handleToggleStatus}
              disabled={isSaving}
              className={`px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2 ${
                isActive 
                  ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">{isActive ? 'do_not_disturb_on' : 'play_circle'}</span>
              )}
              {isActive ? t('workspace.profile.hero.btn_close') : t('workspace.profile.hero.btn_open')}
            </button>
          )}
        </div>
      </div>

      {/* Floating Info Card */}
      <div className="absolute -bottom-10 left-6 right-6 md:left-8 md:right-auto md:max-w-[90%] lg:max-w-[70%] bg-white/70 backdrop-blur-2xl p-6 rounded-[2rem] shadow-xl shadow-violet-100/30 border border-white flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Brand Logo/Avatar */}
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white p-1.5 shadow-lg border border-slate-100 overflow-hidden shrink-0 -mt-12 md:-mt-16">
          {avatarImage ? (
            <img 
              src={avatarImage} 
              alt={restaurant?.name} 
              className="w-full h-full object-cover rounded-2xl" 
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-violet-600 flex items-center justify-center text-white text-3xl font-black">
              {restaurant?.name?.charAt(0) || 'R'}
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-1">
            {restaurant?.name || 'Loading...'}
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-x-4 md:gap-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
              <span className="material-symbols-outlined text-[18px] text-violet-500">verified</span>
              {t('workspace.profile.hero.verified')}
            </div>
            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
              <span className="material-symbols-outlined text-[18px] text-violet-500">location_on</span>
              {restaurant?.address || 'Loading...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;
