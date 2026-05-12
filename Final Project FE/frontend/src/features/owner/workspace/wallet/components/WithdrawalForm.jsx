import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, QrCode, Send, CloudUpload, Info, AlertCircle } from 'lucide-react';
import { useWithdrawFunds } from '../hooks';
import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * @file WithdrawalForm.jsx
 * @description Biểu mẫu xử lý yêu cầu rút tiền của nhà hàng.
 */

// Schema validation cho cấu trúc dữ liệu rút tiền
const withdrawalSchema = z.object({
  amount: z.number().min(10000, 'Minimum withdrawal is 10,000 VND'),
  description: z.string().optional(),
  withdrawMethod: z.enum(['CARD', 'QR']),
  bankInfo: z.object({
    bankName: z.string().optional(),
    cardNumber: z.string().optional(),
    accountName: z.string().optional(),
    expiryDate: z.string().optional(),
    cvv: z.string().optional(),
  }).optional(),
  qrCodeUrl: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.withdrawMethod === 'CARD') {
    if (!data.bankInfo?.bankName || !data.bankInfo?.cardNumber || !data.bankInfo?.accountName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank information is required for CARD method",
        path: ["bankInfo"]
      });
    }
  } else if (data.withdrawMethod === 'QR') {
    if (!data.qrCodeUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "QR Code is mandatory for QR method",
        path: ["qrCodeUrl"]
      });
    }
  }
});

const WithdrawalForm = ({ availableBalance, onSuccess, hideHeader = false }) => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
      withdrawMethod: 'CARD',
      description: '',
    }
  });
  const activeMethod = watch('withdrawMethod');
  const withdrawMutation = useWithdrawFunds();
  const [isUploading, setIsUploading] = useState(false);
  const qrCodeUrl = watch('qrCodeUrl');

  // Hàm tự động định dạng ngày hết hạn (MM/YY)
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Chỉ lấy số
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length === 3) {
      // Logic đặc biệt: Nếu người dùng nhập 715 -> 07/15
      const firstDigit = parseInt(value[0]);
      if (firstDigit > 1) {
        value = '0' + value[0] + '/' + value.slice(1);
      } else {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    } else if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }

    setValue('bankInfo.expiryDate', value, { shouldValidate: true });
  };

  // Hàm tự động định dạng số thẻ (nhóm 4 số)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Chỉ lấy số
    if (value.length > 19) value = value.slice(0, 19); // Giới hạn độ dài thẻ thông thường

    // Thêm khoảng trắng sau mỗi 4 chữ số
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setValue('bankInfo.cardNumber', formattedValue, { shouldValidate: true });
  };

  // Hàm xử lý upload QR Code thực tế
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file
    if (!file.type.startsWith('image/')) {
      toast.error(t('wallet.qr_error'));
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result.secure_url) {
        setValue('qrCodeUrl', result.secure_url, { shouldValidate: true });
        toast.success(t('wallet.qr_success'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(t('wallet.qr_error'));
    } finally {
      setIsUploading(false);
    }
  };



  // Xử lý khi nhấn nút gửi yêu cầu rút tiền
  const onSubmit = async (data) => {
    if (data.amount > availableBalance) {
      toast.error(t('wallet.insufficient_balance'));
      return;
    }

    try {
      const response = await withdrawMutation.mutateAsync({
        idOrSlug,
        ...data
      });
      toast.success(t('wallet.withdraw_success'));
      reset();
      
      // Chuyển hướng sang trang chi tiết giao dịch (Vietnamese comment)
      if (response.data?.id) {
        navigate(ROUTES.WORKSPACE_TRANSACTION_DETAIL(idOrSlug, response.data.id));
      }

      // Thông báo thành công cho component cha (nếu có)
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(t('wallet.withdraw_error'));
    }
  };

  // Thay đổi phương thức rút tiền
  const handleTabChange = (method) => {
    setValue('withdrawMethod', method);
  };

  return (
    <div className={`bg-white ${!hideHeader ? 'p-6 rounded-2xl shadow-sm border border-slate-100' : ''} space-y-6`}>
      {!hideHeader && (
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('wallet.withdraw_funds')}</h2>
          <p className="text-sm text-slate-500 mt-2">{t('wallet.subtitle')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Trường nhập số tiền */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('wallet.amount')}</label>
            <button 
              type="button"
              onClick={() => setValue('amount', availableBalance)}
              className="text-[10px] font-bold text-primary bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-all border border-primary/10 active:scale-95"
            >
              {t('wallet.withdraw_all')}
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">VND</span>
            <input 
              {...register('amount', { valueAsNumber: true })}
              className={`w-full bg-slate-50 border-none rounded-xl py-4 pl-16 pr-4 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all ${errors.amount ? 'ring-2 ring-red-100' : ''}`} 
              type="number"
              placeholder="0"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> {t('wallet.min_withdraw_error')}
            </p>
          )}
        </div>

        {/* Trường nhập nội dung */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('wallet.description')}</label>
          <textarea 
            {...register('description')}
            className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px]" 
            placeholder={t('wallet.description')}
          ></textarea>
        </div>

        {/* Tab chọn phương thức thanh toán */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t('wallet.method')}</label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100/50 p-1.5 rounded-xl">
            <button 
              type="button"
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${activeMethod === 'CARD' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} 
              onClick={() => handleTabChange('CARD')}
            >
              <CreditCard size={14} />
              {t('wallet.bank_card')}
            </button>
            <button 
              type="button"
              className={`flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${activeMethod === 'QR' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`} 
              onClick={() => handleTabChange('QR')}
            >
              <QrCode size={14} />
              {t('wallet.qr_code')}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeMethod === 'CARD' ? (
              <motion.div 
                key="card-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 pt-2"
              >
                {/* Các trường thông tin ngân hàng cụ thể */}
                <input 
                  {...register('bankInfo.bankName')}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder={t('wallet.bank_name')}
                />
                <input 
                  {...register('bankInfo.cardNumber')}
                  onChange={handleCardNumberChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono" 
                  placeholder={t('wallet.card_number')}
                  maxLength={23} // 19 số + 4 khoảng trắng
                />
                <input 
                  {...register('bankInfo.accountName')}
                  className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                  placeholder={t('wallet.account_name')}
                />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      {...register('bankInfo.expiryDate')}
                      onChange={handleExpiryDateChange}
                      className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-mono" 
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  <input 
                    {...register('bankInfo.cvv')}
                    className="bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all" 
                    placeholder="CVV"
                    maxLength={3}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="qr-upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="pt-2"
              >
                {/* Khu vực upload ảnh mã QR */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group relative overflow-hidden min-h-[180px]">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
                      <p className="text-xs font-bold text-primary animate-pulse italic">Uploading QR...</p>
                    </div>
                  ) : qrCodeUrl ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img src={qrCodeUrl} alt="QR Preview" className="w-24 h-24 object-contain rounded-lg shadow-sm mb-2" />
                      <p className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-tighter">QR Secured</p>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setValue('qrCodeUrl', ''); }}
                        className="mt-2 text-[10px] text-red-400 hover:text-red-600 font-bold underline"
                      >
                        Remove & Replace
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CloudUpload className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">{t('wallet.qr_hint')}</p>
                      <p className="text-[11px] text-slate-400 mt-1 uppercase font-medium tracking-wider">{t('wallet.qr_upload_desc')}</p>
                    </>
                  )}
                  
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nút gửi yêu cầu */}
        <button 
          disabled={withdrawMutation.isPending || !isValid}
          className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed`} 
          type="submit"
        >
          {withdrawMutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              {t('wallet.withdraw_funds')}
            </>
          )}
        </button>

        {/* Chú thích thông tin */}
        <div className="bg-slate-50 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            {t('wallet.footer_note')}
          </p>
        </div>
      </form>
    </div>
  );
};

export default WithdrawalForm;
