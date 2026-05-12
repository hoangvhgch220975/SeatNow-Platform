import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logos/logo.png';
import { ROUTES } from '../../config/routes.js';
import PageTransition from '../components/PageTransition.jsx';
import { getGlobalStats } from '@/features/booking/api.js';

/**
 * @file AuthLayout.jsx
 * @description Layout chuyên biệt cho các trang xác thực (Login, Register, Forgot Password).
 */
const AuthLayout = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [stats, setStats] = useState({ venues: 500, diners: 50000 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getGlobalStats();
        if (data) {
          setStats({
            venues: typeof data.totalRestaurants === 'number' ? data.totalRestaurants : 500,
            diners: typeof data.totalBookings === 'number' ? data.totalBookings : 50000
          });
        }
      } catch (error) {
        // Fallback
      }
    };
    fetchStats();
  }, []);

  /**
   * Định dạng số liệu theo yêu cầu (Làm tròn xuống theo chữ số có nghĩa lớn nhất):
   * < 10: giữ nguyên
   * 10-99: 10+, 20+...
   * 100-999: 100+, 200+...
   * 1000+: 1k+, 2k+, 10k+, 50k+...
   */
  const formatStat = (num) => {
    if (num < 10) return num.toString();
    
    // Tìm lũy thừa của 10 cao nhất (ví dụ: 520 -> 100, 52400 -> 10000)
    const power = Math.floor(Math.log10(num));
    const factor = Math.pow(10, power);
    
    // Làm tròn xuống theo factor
    const rounded = Math.floor(num / factor) * factor;
    
    if (rounded >= 1000) {
      return `${rounded / 1000}k+`;
    }
    return `${rounded}+`;
  };

  const footerLinks = [
    { label: 'Privacy Policy', path: ROUTES.POLICIES },
    { label: 'Terms of Service', path: ROUTES.POLICIES },
    { label: 'Contact Support', path: ROUTES.CONTACT },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body text-on-surface overflow-hidden relative selection:bg-primary/10 bg-[#fbfbfc]">

      {/* Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 120, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-secondary/5 rounded-full blur-[140px]" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(251,251,252,0.8)_100%)]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-12 py-10 flex justify-between items-center z-50">
        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-3 group"
        >
          <div className="bg-primary p-2.5 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-primary/20">
            <img src={logo} alt="SeatNow" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-2xl font-bold text-primary headline tracking-tighter">SeatNow</span>
        </Link>

        <Link 
          to={ROUTES.HOME}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/40 hover:text-primary transition-all group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          {/* Back to Home text is handled by icon + spacing on mobile if needed */}
          <span className="hidden md:inline">Back to Home</span>
        </Link>
      </nav>
      
      <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-20 relative z-10">
        <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Branding/Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="hidden lg:flex flex-col space-y-8"
          >
            <div className="space-y-4">
              <h1 
                className="text-[5rem] font-bold tracking-tighter text-on-surface headline leading-[0.9]"
                dangerouslySetInnerHTML={{ __html: t('auth.layout.title') }}
              />
              <p className="text-xl text-on-surface-variant/60 font-medium max-w-md leading-relaxed">
                {t('auth.layout.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center gap-10 pt-8 border-t border-outline/5 w-fit">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-on-surface headline tracking-tight">
                  {formatStat(stats.venues)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/30">
                  {t('auth.layout.curated_venues')}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-on-surface headline tracking-tight">
                  {formatStat(stats.diners)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/30">
                  {t('auth.layout.happy_diners')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Auth Form */}
          <div className="flex justify-center lg:justify-end overflow-hidden">
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-12 px-12 border-t border-outline/5 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30 order-2 md:order-1">
            © {currentYear} SeatNow. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-10 order-1 md:order-2">
            {footerLinks.map((item) => (
               <Link 
                key={item.label}
                to={item.path} 
                className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/30 hover:text-primary transition-colors"
               >
                 {item.label}
               </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
