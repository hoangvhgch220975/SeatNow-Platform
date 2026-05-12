import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TABLE_STATUS } from '@/constants/tableStatus';
import { TABLE_TYPES } from '@/constants/tableTypes';

/**
 * TableForm Component
 * Xử lý nhập liệu cho việc Thêm/Sửa bàn với phong cách Premium Light. (Vietnamese comment)
 * 
 * @param {object} initialData - Dữ liệu ban đầu khi sửa bàn
 * @param {function} onSubmit - Hàm xử lý khi gửi form
 * @param {function} onCancel - Hàm xử lý khi hủy bỏ
 * @param {boolean} isLoading - Trạng thái đang gửi dữ liệu
 */
const TableForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation();
  
  // Danh sách các tầng/khu vực chuẩn (Vietnamese comment)
  const locations = [
    '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', 
    'Rooftop', 'Terrace', 'Outdoor'
  ];

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData || {
      tableNumber: '',
      capacity: 4,
      location: '1st Floor',
      type: TABLE_TYPES.STANDARD,
      status: TABLE_STATUS.AVAILABLE
    }
  });

  // Theo dõi giá trị type để hiển thị UI tương ứng (Vietnamese comment)
  const selectedType = watch('type');

  // Reset form khi dữ liệu ban đầu thay đổi (Vietnamese comment)
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Số hiệu bàn (Table Number) (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('tables.form.table_number', { defaultValue: 'Table ID / Number' })}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors">
              pin
            </span>
            <input
              {...register('tableNumber', { required: true })}
              placeholder="e.g. Table 01"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 focus:bg-white transition-all font-bold"
            />
          </div>
          {errors.tableNumber && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tighter">{t('tables.form.required', { defaultValue: 'Required field' })}</p>}
        </div>

        {/* Sức chứa (Capacity) (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('tables.form.capacity', { defaultValue: 'Max Guests' })}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-violet-500 transition-colors">
              groups
            </span>
            <input
              type="number"
              {...register('capacity', { required: true, min: 1, valueAsNumber: true })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-700 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 focus:bg-white transition-all font-bold"
            />
          </div>
          {errors.capacity && <p className="text-rose-500 text-[10px] font-bold px-1 uppercase tracking-tighter">{t('tables.form.min_guest', { defaultValue: 'Min 1 guest' })}</p>}
        </div>

        {/* Vị trí / Tầng (Location Selector) (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('tables.form.location', { defaultValue: 'Assigned Floor' })}
          </label>
          <div className="relative">
             <select
              {...register('location', { required: true })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-700 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 focus:bg-white transition-all appearance-none cursor-pointer font-bold shadow-sm"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Lựa chọn Loại bàn dạng Thẻ (Location Category Cards) (Vietnamese comment) */}
        <div className="space-y-3 md:col-span-2">
          <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('tables.form.type', { defaultValue: 'Table Category' })}
          </label>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(TABLE_TYPES).map(([key, value]) => (
              <label key={key} className="relative cursor-pointer group">
                <input
                  type="radio"
                  value={value}
                  {...register('type')}
                  className="sr-only peer"
                />
                <div className="bg-slate-50 p-6 rounded-3xl text-center border-2 border-transparent peer-checked:border-violet-600 peer-checked:bg-white peer-checked:shadow-xl peer-checked:shadow-violet-600/10 transition-all duration-300 hover:bg-slate-100">
                  <span className="material-symbols-outlined block mb-3 text-violet-400 text-3xl group-hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {value === 'outdoor' ? 'wb_sunny' : value === 'vip' ? 'stars' : 'meeting_room'}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400 peer-checked:text-violet-600">
                    {t(`tables.types.${value}`, { defaultValue: value.toUpperCase() })}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Trạng thái (Status Switchers) - Chỉ hiện khi sửa bàn (Vietnamese comment) */}
        {initialData && (
          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              {t('tables.form.status', { defaultValue: 'Current Status' })}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {Object.entries(TABLE_STATUS).map(([key, value]) => (
                <label key={key} className="relative flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    value={value}
                    {...register('status')}
                    className="sr-only peer"
                  />
                  <div className="px-6 py-3 rounded-2xl border border-slate-100 text-slate-400 peer-checked:bg-slate-900 peer-checked:text-white peer-checked:border-slate-900 peer-checked:shadow-lg hover:border-slate-300 transition-all text-xs font-black uppercase tracking-widest">
                    {t(`tables.stats.${value}`, { defaultValue: value.toUpperCase() })}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hành động (Actions) (Vietnamese comment) */}
      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors active:scale-95"
          disabled={isLoading}
        >
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-2 px-12 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-violet-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">save</span>
              {initialData ? t('tables.form.update_record', { defaultValue: 'Update Record' }) : t('tables.form.establish_table', { defaultValue: 'Establish Table' })}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TableForm;
