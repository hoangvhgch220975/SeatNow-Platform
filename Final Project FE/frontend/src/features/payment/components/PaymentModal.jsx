import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Infrastructure
import { useStartPayment, usePaymentStatus } from '../hooks';

// UI Components
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';
import PaymentHeader from './shared/PaymentHeader';
import PaymentFooter from './shared/PaymentFooter';
import PaymentMethodSelector from './steps/PaymentMethodSelector';
import PaymentProcessing from './steps/PaymentProcessing';
import PaymentResult from './steps/PaymentResult';

/**
 * @component PaymentModal
 * @description Modal điều hướng thanh toán (Orchestrator) sau khi Refactor.
 * @author Antigravity AI
 */
const PaymentModal = ({ bookingId, amount, onSuccess, onClose }) => {
  const { t } = useTranslation();
  // 1. Quản lý trạng thái bước (Step Management)
  const [step, setStep] = useState('SELECT'); // SELECT, PROCESSING, SUCCESS, ERROR
  const [paymentData, setPaymentData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút đếm ngược
  
  const paymentWindowRef = useRef(null);
  const hasTriggeredSuccess = useRef(false);

  // 2. Tích hợp Hooks
  const startPaymentMutation = useStartPayment();
  const { data: statusData, isFetching: isCheckingStatus } = usePaymentStatus(
    paymentData?.transactionId, 
    step === 'PROCESSING'
  );

  /**
   * 3. Xử lý khởi tạo thanh toán
   */
  const handleStartPayment = async (provider) => {
    try {
      const result = await startPaymentMutation.mutateAsync({ bookingId, provider });
      const actualData = result?.data || result;
      
      if (!actualData?.paymentUrl) throw new Error(t('payment.toast.url_error', 'Could not generate payment URL.'));

      setPaymentData(actualData);
      setStep('PROCESSING');
      setTimeLeft(300);

      // Mở Popup 600x700
      toast.success(t('payment.toast.redirecting', 'Redirecting to {{provider}}...', { provider }));
      const features = 'width=600,height=700,status=no,resizable=yes,left=400,top=100';
      paymentWindowRef.current = window.open(actualData.paymentUrl, 'SeatNowPayment', features);
      
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(`${t('payment.toast.init_error', 'Initialization Error')}: ${msg}`);
    }
  };

  /**
   * 4. Hiệu ứng đếm ngược (Countdown)
   */
  useEffect(() => {
    let timer;
    if (step === 'PROCESSING' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && step === 'PROCESSING') {
      setStep('ERROR');
      toast.error(t('payment.toast.session_expired', 'Payment session expired.'));
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  /**
   * 4.5 Lắng nghe tín hiệu thành công từ Popup (Kênh Broadcast)
   * Giúp Modal phản ứng tức thì khi Popup báo xong, không cần đợi Polling.
   */
  useEffect(() => {
    const paymentChannel = new BroadcastChannel('seatnow_payment');
    
    paymentChannel.onmessage = (event) => {
      const status = event.data?.status || event.data?.type;
      if (status === 'SUCCESS' || status === 'PAYMENT_SUCCESS') {
        if (!hasTriggeredSuccess.current) {
          setStep('SUCCESS');
          // Note: useEffect polling phía dưới sẽ lo phần toast và callback Success
        }
      }
    };

    return () => paymentChannel.close();
  }, []);

  /**
   * 5. Hiệu ứng lắng nghe trạng thái (Polling Listener)
   */
  useEffect(() => {
    const status = statusData?.data?.status || statusData?.status;
    
    if ((status === 'PAID' || status === 'SUCCESS') && !hasTriggeredSuccess.current) {
      hasTriggeredSuccess.current = true;
      
      // Đóng popup nếu còn mở
      if (paymentWindowRef.current) {
        try { paymentWindowRef.current.close(); } catch(e) {}
      }

      setStep('SUCCESS');
      toast.success(t('payment.toast.deposit_confirmed', 'Deposit Confirmed!'));
      
      // Đợi 2.5s hiệu ứng rồi gọi callback thành công
      setTimeout(onSuccess, 2500);
    } else if (status === 'FAILED') {
      setStep('ERROR');
      toast.error(t('payment.toast.transaction_declined', 'Transaction declined.'));
    }
  }, [statusData, onSuccess]);

  /**
   * 6. Render Logic
   */
  const renderContent = () => {
    if (startPaymentMutation.isPending) {
        return <div className="py-20"><LoadingSpinner message={t('payment.handshaking', 'Handshaking with gateway...')} /></div>;
    }

    switch (step) {
      case 'SELECT':
        return (
          <PaymentMethodSelector 
            amount={amount} 
            onSelect={handleStartPayment}
            isStarting={startPaymentMutation.isPending}
          />
        );
      case 'PROCESSING':
        return (
          <PaymentProcessing 
            paymentData={paymentData}
            timeLeft={timeLeft}
            isChecking={isCheckingStatus}
            onCheckStatus={() => {}} // Hook tự fetch, nút này chỉ làm UI trigger
            onChangeMethod={() => {
                setPaymentData(null);
                setStep('SELECT');
            }}
          />
        );
      case 'SUCCESS':
      case 'ERROR':
        return (
          <PaymentResult 
            status={step} 
            onRetry={() => setStep('SELECT')} 
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={step === 'SELECT' || step === 'ERROR' ? onClose : undefined}
      ></div>

      {/* Main Modal Card */}
      <div className="bg-white rounded-[2rem] w-full max-w-md relative z-10 overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-500">
        <PaymentHeader bookingId={bookingId} onClose={onClose} />
        
        <div className="px-6 py-6 flex flex-col justify-center">
            {renderContent()}
        </div>

        <PaymentFooter />
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;
