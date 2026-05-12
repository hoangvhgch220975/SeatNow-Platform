import { Outlet, useSearchParams, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import CustomerNavbar from './CustomerNavbar.jsx';
import Footer from './Footer.jsx';
import ScrollToTop from '../components/ScrollToTop.jsx';

/**
 * @file CustomerLayout.jsx
 * @description Layout dành riêng cho người dùng đã đăng nhập (Customer Side).
 */
const CustomerLayout = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSuccessPopup, setIsSuccessPopup] = useState(false);

  // 🛡️ Logic Thông báo Thanh toán Toàn cục (Xử lý Popup Tự hủy xuyên suốt toàn App cho Customer)
  useEffect(() => {
    const status = searchParams.get('payment_status') || searchParams.get('payment');
    const bId = searchParams.get('bookingId');

    if (status === 'success') {
      // 🚀 1. PHÁT TÍN HIỆU CHO TAB CHÍNH
      const paymentChannel = new BroadcastChannel('seatnow_payment');
      paymentChannel.postMessage({ status: 'SUCCESS', bookingId: bId });

      // 🚀 2. CHẾ ĐỘ POPUP TỰ HUỶ (Xử lý Popup Tự đóng)
      const isPopup = window.opener || window.name === 'SeatNowPayment' || window.innerHeight < 800;
      
      if (isPopup) {
        setIsSuccessPopup(true);
        const timer = setTimeout(() => {
          paymentChannel.close();
          window.close();
          // Lệnh đóng quyết liệt fallback
          setTimeout(() => { if (!window.closed) window.open('', '_self', '').close(); }, 200);
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        // Nếu lỡ tay mở ở Tab chính -> Chỉ hiện thông báo và dọn URL
        toast.success('Your table is officially reserved!', { icon: '✅' });
        paymentChannel.close();
      }

      // Làm sạch URL (Xóa các param rác sau khi đã báo tin xong)
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      newParams.delete('payment_status');
      newParams.delete('bookingId');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Giao diện Success Overlay cho Thành viên
  if (isSuccessPopup) {
    return (
      <div className="fixed inset-0 bg-surface z-[9999] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 ease-out-expo">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-primary/20">
          <span className="material-symbols-outlined text-white text-5xl font-black">check_circle</span>
        </div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2">Payment Secured!</h2>
        <p className="text-on-surface-variant/60 font-medium mb-8 max-w-xs">Success! Your primary session has been updated and redirected.</p>
        <button 
          onClick={() => window.close()} 
          className="px-10 py-4 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:brightness-110 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
        >
          Close This Window
        </button>
      </div>
    );
  }

  return (
    <div className="antialiased min-h-screen bg-[#FDFCFE] flex flex-col font-sans">
      {/* Navbar chuyên biệt cho Customer - Thiết kế cao cấp từ code.md */}
      <CustomerNavbar />
      
      {/* Nội dung chính của trang (Profile, Bookings, Dashboard) */}
      <main className="flex-grow flex flex-col pt-24">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      {/* Footer chung cuối trang */}
      <Footer />

    </div>
  );
};

export default CustomerLayout;
