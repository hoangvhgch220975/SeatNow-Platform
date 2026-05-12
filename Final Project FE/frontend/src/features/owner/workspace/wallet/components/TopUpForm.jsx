import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wallet, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useTopUpWallet, useTransactionDetail } from '../hooks';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

/**
 * @file TopUpForm.jsx
 * @description Biểu mẫu nhập thông tin nạp tiền vào ví nhà hàng qua MoMo hoặc VNPAY.
 * Tách biệt logic từ TopUpDialog để tái sử dụng và quản lý code tốt hơn.
 */

// Schema validation cho cấu trúc dữ liệu nạp tiền
const topUpSchema = z.object({
  amount: z.number().min(10000, 'Minimum top-up is 10,000 VND'),
  provider: z.enum(['MOMO', 'VNPAY']),
});

const TopUpForm = ({ restaurantId, onSuccess }) => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const topUpMutation = useTopUpWallet();
  const queryClient = useQueryClient();
  const [step, setStep] = useState('INPUT'); // INPUT, PROCESSING, SUCCESS, ERROR
  const [payUrl, setPayUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  // Hook Polling trạng thái giao dịch
  const { data: statusData } = useTransactionDetail(transactionId);
  const currentStatus = statusData?.data?.status || statusData?.status;

  // Effect theo dõi trạng thái giao dịch
  React.useEffect(() => {
    if (step === 'PROCESSING') {
      if (currentStatus === 'completed' || currentStatus === 'PAID' || currentStatus === 'SUCCESS') {
        setStep('SUCCESS');
        toast.success(t('wallet.topup_success_confirmed', 'Nạp tiền thành công!'));
        // Làm mới số dư ngay lập tức
        queryClient.invalidateQueries({ queryKey: ['wallet', 'balance', idOrSlug] });
        queryClient.invalidateQueries({ queryKey: ['wallet', 'history', idOrSlug] });
      } else if (currentStatus === 'failed' || currentStatus === 'FAILED') {
        setStep('ERROR');
        toast.error(t('wallet.topup_failed', 'Giao dịch thất bại.'));
      }
    }
  }, [currentStatus, step, queryClient, idOrSlug, t]);

  const openPaymentPopup = (url) => {
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`;
    return window.open(url, 'SeatNowTopUp', features);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      amount: 50000,
      provider: 'MOMO',
    }
  });

  const selectedProvider = watch('provider');

  // Xử lý khi nhấn nút nạp tiền
  // Vietnamese comment: Gửi yêu cầu tạo giao dịch nạp tiền tới Backend
  const onSubmit = async (data) => {
    try {
      const response = await topUpMutation.mutateAsync({
        restaurantId,
        ...data
      });

      const resolvedPayUrl = response.data?.paymentUrl || response.data?.payUrl;
      if (resolvedPayUrl) {
        const newTransactionId = response.data.transactionId;
        setPayUrl(resolvedPayUrl);
        setTransactionId(newTransactionId);
        setStep('PROCESSING');
        
        toast.success(t('wallet.topup_success'));
        
        // Mở Popup thay vì tab mới
        openPaymentPopup(resolvedPayUrl);
        
        if (onSuccess) onSuccess(resolvedPayUrl);
      } else {
        toast.error(t('wallet.topup_url_not_found'));
      }
    } catch (error) {
      toast.error(t('wallet.topup_error'));
    }
  };

  // Giao diện Processing
  if (step === 'PROCESSING') {
    return (
      <div className="py-8 flex flex-col items-center text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Wallet className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900">{t('wallet.topup_processing', 'Đang xử lý nạp tiền...')}</h4>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[280px]">
            {t('wallet.topup_redirect_notice')}
          </p>
        </div>
        
        <div className="w-full space-y-3">
          <button 
            onClick={() => openPaymentPopup(payUrl)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            {t('wallet.pay_now')}
            <ArrowRight size={18} />
          </button>
          
          <button 
            onClick={() => setStep('INPUT')}
            className="w-full bg-white border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all text-xs"
          >
            {t('wallet.change_amount', 'Thay đổi phương thức/số tiền')}
          </button>
        </div>
      </div>
    );
  }

  // Giao diện Thành công
  if (step === 'SUCCESS') {
    return (
      <div className="py-10 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center scale-110 shadow-lg shadow-green-100">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900">{t('wallet.topup_confirmed', 'Nạp tiền hoàn tất!')}</h4>
          <p className="text-sm text-slate-500 mt-2">
            {t('wallet.topup_success_desc', 'Số dư ví của bạn đã được cập nhật thành công.')}
          </p>
        </div>
        <button 
          onClick={() => {
            if (transactionId) navigate(ROUTES.WORKSPACE_TRANSACTION_DETAIL(idOrSlug, transactionId));
          }}
          className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-800"
        >
          {t('wallet.view_details', 'Xem chi tiết giao dịch')}
        </button>
      </div>
    );
  }

  // Giao diện Lỗi (Optional - có thể gộp vào Processing)
  if (step === 'ERROR') {
    return (
      <div className="py-10 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center scale-110 shadow-lg shadow-red-100">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-slate-900">{t('wallet.topup_failed_title', 'Giao dịch không thành công')}</h4>
          <p className="text-sm text-slate-500 mt-2">
            {t('wallet.topup_failed_desc', 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.')}
          </p>
        </div>
        <button 
          onClick={() => setStep('INPUT')}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl transition-all hover:bg-primary-dark"
        >
          {t('common.retry', 'Thử lại')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
      {/* Trường nhập số tiền nạp */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          {t('wallet.topup_amount')}
        </label>
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
            <AlertCircle size={12} /> {t('wallet.min_topup_error')}
          </p>
        )}
      </div>

      {/* Lựa chọn cổng thanh toán */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          {t('wallet.select_provider')}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['MOMO', 'VNPAY'].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => setValue('provider', provider)}
              className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all gap-2 ${
                selectedProvider === provider 
                  ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                  : 'border-slate-100 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                provider === 'MOMO' ? 'bg-[#A50064]' : 'bg-[#005BAA]'
              }`}>
                <span className="text-white font-black text-xs italic">{provider}</span>
              </div>
              <span className={`text-xs font-bold ${selectedProvider === provider ? 'text-primary' : 'text-slate-500'}`}>
                {provider}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Nút xác nhận nạp tiền */}
      <button 
        disabled={topUpMutation.isPending || !isValid}
        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-full transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed" 
        type="submit"
      >
        {topUpMutation.isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Wallet size={18} className="group-hover:scale-110 transition-transform" />
            {t('wallet.topup')}
          </>
        )}
      </button>
    </form>
  );
};

export default TopUpForm;
