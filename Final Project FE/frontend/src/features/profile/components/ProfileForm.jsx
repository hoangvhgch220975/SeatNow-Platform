import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file ProfileForm.jsx
 * @description Thành phần biểu mẫu hiển thị các trường thông tin cơ bản: Tên, Email, SĐT, ID... Hỗ trợ đa ngôn ngữ.
 * @param {Object} props
 * @param {Function} props.register - Hàm đăng ký từ useForm (react-hook-form)
 * @param {Object} props.errors - Đối tượng chứa thông tin lỗi từ useForm
 * @param {Object} props.user - Thông tin người dùng hiện tại
 * @param {boolean} props.isPending - Trạng thái đang xử lý lưu thông tin
 * @param {Function} props.onSubmit - Hàm xử lý submit biểu mẫu
 */
const ProfileForm = ({ 
  register, 
  errors, 
  user, 
  isPending, 
  onSubmit 
}) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="space-y-10">
      {/* Lưới các trường nhập liệu - Cấu trúc 2x2 Grid (Vietnamese comment) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Họ và Tên (Full Name) (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
            {t('profile.form.name_label')}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">badge</span>
            <input 
              {...register('name')}
              placeholder="Julianne Smith"
              className={`w-full bg-slate-50/50 border-2 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold outline-none transition-all shadow-inner ${
                errors.name ? 'border-red-400 focus:border-red-500 bg-red-50/10' : 'border-slate-100 focus:border-primary/20 focus:bg-white'
              }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-[10px] font-bold px-4">{errors.name.message}</p>}
        </div>

        {/* Mã ID Hệ thống (System ID) - ReadOnly (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
            {t('profile.form.system_id_label')}
          </label>
          <div className="relative group opacity-60 cursor-not-allowed">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">fingerprint</span>
            <input 
              value={user?.id || user?._id || 'N/A'}
              readOnly
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-slate-400 outline-none shadow-inner cursor-not-allowed"
            />
          </div>
          <p className="text-[9px] text-slate-300 font-bold px-4 uppercase tracking-tighter">
            {t('profile.form.id_hint')}
          </p>
        </div>

        {/* Địa chỉ Email (Email Address) (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
            {t('profile.form.email_label')}
          </label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">mail</span>
            <input 
              {...register('email')}
              placeholder="example@mail.com"
              className={`w-full bg-slate-50/50 border-2 rounded-3xl py-4 pl-14 pr-6 text-sm font-bold outline-none transition-all shadow-inner ${
                errors.email ? 'border-red-400 focus:border-red-500 bg-red-50/10' : 'border-slate-100 focus:border-primary/20 focus:bg-white'
              }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] font-bold px-4">{errors.email.message}</p>}
        </div>

        {/* Số điện thoại (Phone Number) - ReadOnly (Vietnamese comment) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
            {t('profile.form.phone_label')}
          </label>
          <div className="relative group opacity-60 cursor-not-allowed">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">phone_iphone</span>
            <input 
              {...register('phone')}
              readOnly
              className="w-full bg-slate-100/50 border-2 border-transparent rounded-3xl py-4 pl-14 pr-6 text-sm font-bold text-slate-400 outline-none shadow-inner cursor-not-allowed"
            />
          </div>
          <p className="text-[9px] text-slate-300 font-bold px-4 uppercase tracking-tighter">
            {t('profile.form.phone_hint')}
          </p>
        </div>
      </div>

      {/* Khu vực nút hành động (Save Button) (Vietnamese comment) */}
      <div className="pt-6 border-t border-slate-100">
         <button 
           type="submit"
           disabled={isPending}
           className={`w-full md:w-fit px-14 py-5 bg-primary text-white font-black rounded-2xl shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 ${isPending ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/30 hover:-translate-y-0.5'}`}
         >
           {isPending ? (
             <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
           ) : (
             <span className="material-symbols-outlined text-[20px]">save</span>
           )}
           {isPending ? t('profile.form.saving') : t('profile.form.submit_button')}
         </button>
      </div>
    </form>
  );
};

export default ProfileForm;
