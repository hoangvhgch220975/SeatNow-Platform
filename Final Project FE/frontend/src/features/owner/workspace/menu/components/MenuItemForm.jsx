import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ImageUploader from '@/features/media/components/ImageUploader';

/**
 * Menu Item Form Component
 * Handles the input fields and validation for adding or editing a dish
 * 
 * @param {object} initialData - Data for editing mode
 * @param {Function} onSubmit - Callback when form is submitted
 * @param {Function} onCancel - Callback to close the form
 * @param {boolean} isSubmitting - Loading state flag
 */
const MenuItemForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { t } = useTranslation();
  
  // Khởi tạo React Hook Form
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      category: 'Main Course',
      isAvailable: true,
      images: [],
      preparationTime: 15, // Thời gian chuẩn bị mặc định (phút)
      tags: [],
      allergens: []
    }
  });

  // Reset form khi dữ liệu ban đầu thay đổi để đảm bảo trạng thái chỉnh sửa chính xác
  // Điều này cũng giúp nạp mảng images vào uploader một cách đồng bộ
  useEffect(() => {
    if (initialData) {
      // Chuyển đổi mảng thành chuỗi phân cách bởi dấu phẩy để dễ chỉnh sửa trong input text
      const formattedData = {
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
        allergens: Array.isArray(initialData.allergens) ? initialData.allergens.join(', ') : ''
      };
      reset(formattedData);
    } else {
      reset({
        name: '',
        description: '',
        price: 0,
        discountPrice: 0,
        category: 'Main Course',
        isAvailable: true,
        images: [],
        preparationTime: 15,
        tags: '',
        allergens: ''
      });
    }
  }, [initialData, reset]);

  // Theo dõi mảng images để truyền vào component ImageUploader
  const images = watch('images');

  const onImageChange = (urls) => {
    setValue('images', urls);
  };

  /**
   * Xử lý dữ liệu trước khi gửi lên Backend để khớp với Schema
   * Loại bỏ các trường ID và Metadata nội bộ để tránh lỗi "Invalid Payload"
   */
  const handleFormSubmit = (data) => {
    // 1. Tạo bản sao dữ liệu và làm sạch các trường không cần thiết cho Payload
    const cleanedData = { ...data };
    
    // Danh sách các trường cần loại bỏ (tránh gây lỗi Schema nghiêm ngặt ở Backend)
    const fieldsToRemove = ['_id', 'id', 'restaurantId', 'createdAt', 'updatedAt', '__v'];
    fieldsToRemove.forEach(field => delete cleanedData[field]);

    // 2. Định dạng lại các kiểu dữ liệu phức tạp
    const formattedData = {
      ...cleanedData,
      // Chuyển chuỗi phân cách dấu phẩy ngược lại thành mảng
      tags: typeof cleanedData.tags === 'string' 
        ? cleanedData.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
        : cleanedData.tags,
      allergens: typeof cleanedData.allergens === 'string' 
        ? cleanedData.allergens.split(',').map(a => a.trim()).filter(Boolean) 
        : cleanedData.allergens,
      // Đảm bảo kiểu số chính xác
      price: Number(cleanedData.price),
      preparationTime: cleanedData.preparationTime ? Number(cleanedData.preparationTime) : null
    };
    
    // 3. Đảm bảo discountPrice là null nếu không có giá trị hoặc bằng 0
    if (!formattedData.discountPrice || Number(formattedData.discountPrice) === 0) {
      formattedData.discountPrice = null;
    } else {
      formattedData.discountPrice = Number(formattedData.discountPrice);
    }

    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Section: Media Upload & Metadata */}
        <div className="space-y-10">
          <div className="space-y-8">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
              {t('menu_mgmt.upload_res')}
            </label>
            <div className="rounded-[2.5rem] overflow-hidden bg-zinc-50 border border-zinc-100 p-2">
              <ImageUploader 
                value={images}
                onChange={onImageChange}
                maxImages={5}
              />
            </div>
            <p className="text-[10px] text-zinc-400 px-4 mt-2 italic">{t('menu_mgmt.upload_hint')}</p>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {/* Thời gian chuẩn bị */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
                {t('menu_mgmt.prep_time')}
              </label>
              <div className="relative group">
                <input 
                  {...register('preparationTime', { valueAsNumber: true })}
                  className="w-full bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="15" 
                  type="number"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-xs tracking-widest text-slate-300 group-focus-within:text-violet-700 transition-colors uppercase">
                  {t('menu_mgmt.prep_time_unit')}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 px-4 italic">{t('menu_mgmt.prep_time_desc')}</p>
            </div>

            {/* Tags & Allergens Group */}
            <div className="space-y-8 p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block">
                  {t('menu_mgmt.tags')}
                </label>
                <input 
                  {...register('tags')}
                  className="w-full bg-white border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-violet-700/10 font-bold text-sm text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder={t('menu_mgmt.tags_hint')} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block">
                  {t('menu_mgmt.allergens')}
                </label>
                <input 
                  {...register('allergens')}
                  className="w-full bg-white border-none rounded-xl py-4 px-6 focus:ring-4 focus:ring-violet-700/10 font-bold text-sm text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder={t('menu_mgmt.allergens_hint')} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Core Form Fields */}
        <div className="space-y-10">
          {/* Dish Name */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
              {t('menu_mgmt.dish_name')}
            </label>
            <input 
              {...register('name', { required: true })}
              className={`w-full bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 ${errors.name ? 'ring-2 ring-rose-500/20' : ''}`}
              placeholder="e.g. Wagyu Ribeye with Truffle Jus" 
              type="text"
            />
            {errors.name && <span className="text-xs text-rose-500 font-bold ml-1">This field is required</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
                {t('menu_mgmt.category')}
              </label>
              <div className="relative group">
                <select 
                  {...register('category')}
                  className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 cursor-pointer transition-all hover:bg-slate-100"
                >
                  <option value="Appetizers">{t('menu_mgmt.categories.appetizers')}</option>
                  <option value="Main Course">{t('menu_mgmt.categories.main_course')}</option>
                  <option value="Desserts">{t('menu_mgmt.categories.desserts')}</option>
                  <option value="Drinks">{t('menu_mgmt.categories.drinks')}</option>
                </select>
                <span className="material-symbols-outlined absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-violet-700 transition-colors">expand_more</span>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
               <span className="text-sm font-black text-zinc-900 uppercase tracking-tighter">{t('menu_mgmt.active')}</span>
               <button 
                type="button"
                onClick={() => setValue('isAvailable', !watch('isAvailable'))}
                className={`w-14 h-7 rounded-full relative flex items-center px-1 transition-all duration-500 transform ${watch('isAvailable') ? 'bg-violet-700' : 'bg-zinc-200'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-sm transition-all duration-500 transform ${watch('isAvailable') ? 'translate-x-7' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Price */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
                {t('menu_mgmt.price')}
              </label>
              <div className="relative group">
                <input 
                  {...register('price', { required: true, min: 0, valueAsNumber: true })}
                  className={`w-full bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 ${errors.price ? 'ring-2 ring-rose-500/20' : ''}`}
                  placeholder="0" 
                  type="number"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-xs tracking-widest text-slate-300 group-focus-within:text-violet-700 transition-colors uppercase">VND</span>
              </div>
              {errors.price && <span className="text-xs text-rose-500 font-bold ml-1">Valid price required</span>}
            </div>

            {/* Discount Price */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
                {t('menu_mgmt.discount_price')}
              </label>
              <div className="relative group">
                <input 
                  {...register('discountPrice', { min: 0, valueAsNumber: true })}
                  className="w-full bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300"
                  placeholder="0" 
                  type="number"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-xs tracking-widest text-slate-300 group-focus-within:text-violet-700 transition-colors uppercase text-emerald-500">OFF</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 block px-4">
              {t('menu_mgmt.description')}
            </label>
            <textarea 
              {...register('description')}
              className="w-full bg-slate-50 border-none rounded-2xl py-6 px-8 focus:ring-4 focus:ring-violet-700/10 font-bold text-lg text-slate-900 transition-all placeholder:text-slate-300 resize-none min-h-[160px]" 
              placeholder="Describe the flavors, ingredients, and preparation..." 
            ></textarea>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="pt-12 border-t border-zinc-100 flex justify-end items-center gap-8">
        <button 
          type="button"
          onClick={onCancel}
          className="px-10 py-5 text-zinc-400 font-black tracking-widest uppercase text-xs hover:text-zinc-900 transition-colors"
        >
          {t('menu_mgmt.cancel')}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-16 py-6 bg-violet-700 text-white rounded-2xl font-black tracking-widest uppercase text-xs shadow-xl shadow-violet-200 hover:bg-violet-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>{t('common.loading')}</span>
            </div>
          ) : (initialData ? t('menu_mgmt.save') : t('menu_mgmt.save_creation'))}
        </button>
      </div>
    </form>
  );
};

export default MenuItemForm;
