import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ROUTES } from '@/config/routes';
import { toast } from 'react-hot-toast';

// components
import ImageSettings from '../components/ImageSettings';
import BasicInfoSettings from '../components/BasicInfoSettings';
import ContactSettings from '../components/ContactSettings';
import OpeningHoursSettings from '../components/OpeningHoursSettings';
import DepositPolicySettings from '../components/DepositPolicySettings';

// hooks
import { useUpdateRestaurant, useUpdateDepositPolicy } from '../hooks';

/**
 * @file OwnerSettingsPage.jsx
 * @description Trang cài đặt chính của nhà hàng. Quản lý form data chung.
 */

// Hàm parse giờ mở cửa giữ nguyên cấu trúc gốc phục vụ OpeningHoursForm mới
const parseOpeningHoursRaw = (dbHours) => {
  if (!dbHours) return { 'Monday-Sunday': '09:00-22:00' };

  if (typeof dbHours === 'string') {
    try {
      return JSON.parse(dbHours);
    } catch {
      return { 'Monday-Sunday': '09:00-22:00' };
    }
  }

  return typeof dbHours === 'object' ? dbHours : { 'Monday-Sunday': '09:00-22:00' };
};

// Helper parse mảng JSON string bị lỗi thành Array chuẩn
const parseArray = (dbVal) => {
  if (Array.isArray(dbVal)) return dbVal;
  if (typeof dbVal === 'string') {
    try {
      const parsed = JSON.parse(dbVal);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper parse Deposit Policy vì backend có thể trả chuỗi và key bị sai khác
const parsePolicy = (dbVal) => {
  let policy = dbVal;
  if (typeof dbVal === 'string') {
    try { policy = JSON.parse(dbVal); } catch {}
  }
  return {
    // Backend cũ có thể lưu minGuests thay vì minGuest
    minGuest: policy?.minGuest || policy?.minGuests || 1,
    // Backend cũ có thể lưu amountPerGuest thay cho minAmount 
    minAmount: policy?.minAmount || policy?.amountPerGuest || 0,
    note: policy?.note || ''
  };
};

const OwnerSettingsPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { restaurant, isLoading } = useOutletContext();

  const updateRestaurantMutation = useUpdateRestaurant();
  const updatePolicyMutation = useUpdateDepositPolicy();

  // Khởi tạo form với useForm
  const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      description: '',
      cuisineTypes: [],
      priceRange: 1,
      phone: '',
      email: '',
      address: '',
      latitude: '',
      longitude: '',
      images: [],
      openingHours: { 'Monday-Sunday': '09:00-22:00' },
      depositEnabled: false,
      depositPolicy: { minGuest: 1, minAmount: 0, note: '' }
    }
  });

  // Tự động gán lại dữ liệu cũ (reset form) khi fetch được thông tin restaurant từ DB cục bộ (Workspace Context)
  useEffect(() => {
    if (restaurant && Object.keys(restaurant).length > 0) {
      reset({
        name: restaurant.name || '',
        description: restaurant.description || '',
        cuisineTypes: parseArray(restaurant.cuisineTypes),
        priceRange: restaurant.priceRange || 1,
        phone: restaurant.phone || '',
        email: restaurant.email || '',
        address: restaurant.address || '',
        latitude: restaurant.latitude || '',
        longitude: restaurant.longitude || '',
        images: parseArray(restaurant.images),
        openingHours: parseOpeningHoursRaw(restaurant.openingHours),
        depositEnabled: restaurant.depositEnabled || false,
        depositPolicy: parsePolicy(restaurant.depositPolicy)
      });
    }
  }, [restaurant, reset]);

  if (isLoading) {
    return <div className="text-center p-20">{t('common.loading')}</div>;
  }

  const isSaving = updateRestaurantMutation.isPending || updatePolicyMutation.isPending;

  const onSubmit = async (data) => {
    try {
      // 1. Dữ liệu chung
      const generalData = {
        name: data.name,
        description: data.description,
        cuisineTypes: data.cuisineTypes,
        priceRange: data.priceRange,
        phone: data.phone,
        email: data.email,
        address: data.address,
        latitude: parseFloat(data.latitude) || null,
        longitude: parseFloat(data.longitude) || null,
        images: data.images,
        openingHours: data.openingHours,
      };

      // 2. Dữ liệu Policy
      const policyData = {
        depositEnabled: data.depositEnabled,
        depositPolicy: {
          required: data.depositEnabled,
          minGuest: data.depositPolicy?.minGuest || 1,
          minAmount: data.depositPolicy?.minAmount || 0,
          note: data.depositPolicy?.note || '',
        }
      };

      // Gọi đồng thời 2 API cập nhật
      // Lưu ý: Dùng id thực từ restaurant object để chắc chắn (nếu idOrSlug là slug)
      const targetId = restaurant?.id || idOrSlug;

      const [resUpdate] = await Promise.all([
        updateRestaurantMutation.mutateAsync({ restaurantId: targetId, updateData: generalData }),
        updatePolicyMutation.mutateAsync({ restaurantId: targetId, policyData })
      ]);

      toast.success(t('workspace.settings.success_toast'));
      
      // Chuyển hướng về trang profile (workspace)
      // Nếu đổi tên -> slug thay đổi -> cần dùng slug mới từ response để tránh lỗi 404/không load được data
      const newSlug = resUpdate?.data?.slug || resUpdate?.slug || idOrSlug;
      navigate(ROUTES.WORKSPACE_PROFILE(newSlug));

      // Load lại trang hoặc chỉ cập nhật dirty form theo reset
      reset(data, { keepDirty: false });

    } catch (error) {
      console.error('Update failed:', error);
      toast.error(t('workspace.settings.error_toast'));
    }
  };

  return (
    <div className="max-w-(--breakpoint-2xl) mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            {t('workspace.settings.title')}
          </h2>
          <p className="text-slate-500 font-bold text-lg">
            {t('workspace.settings.subtitle')}
          </p>
        </div>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
            ${isSaving
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95'
            }`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <span className="material-symbols-outlined text-[20px] font-bold">save</span>
          )}
          {isSaving ? t('workspace.settings.saving') : t('workspace.settings.save_all')}
        </button>
      </div>

      {/* Form Content */}
      <form className="grid grid-cols-1 lg:grid-cols-12 gap-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Left Column */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-8">
          <BasicInfoSettings register={register} control={control} errors={errors} />
          <ContactSettings register={register} errors={errors} setValue={setValue} watch={watch} />
                    <ImageSettings control={control} />

        </div>

        {/* Right Column */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-8">
          <OpeningHoursSettings control={control} />
          <DepositPolicySettings register={register} control={control} errors={errors} />
        </div>
      </form>
    </div>
  );
};

export default OwnerSettingsPage;
