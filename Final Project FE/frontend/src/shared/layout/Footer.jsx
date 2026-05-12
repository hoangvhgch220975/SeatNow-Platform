import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes.js';
import logo from '@/assets/logos/logo.png';

/**
 * @file Footer.jsx
 * @description Footer chung cho toàn bộ trang public/customer. Hỗ trợ đa ngôn ngữ.
 */
const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { labelKey: 'footer.customer.home', path: ROUTES.HOME },
    { labelKey: 'footer.customer.restaurants', path: ROUTES.RESTAURANT_LIST },
    { labelKey: 'footer.customer.track_booking', path: ROUTES.TRACK_BOOKING },
    { labelKey: 'footer.customer.ai_assistant', path: ROUTES.AI_CHAT },
  ];

  const legalLinks = [
    { labelKey: 'footer.customer.privacy_policy', path: ROUTES.POLICIES },
    { labelKey: 'footer.customer.terms_of_service', path: ROUTES.POLICIES },
    { labelKey: 'footer.customer.refund_policy', path: ROUTES.POLICIES },
    { labelKey: 'footer.customer.contact_us', path: ROUTES.CONTACT },
  ];

  return (
    <footer className="bg-surface border-t border-outline/5 relative overflow-hidden">
      {/* Defined top accent line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Background decorative elements - very subtle on surface */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/2 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px] pointer-events-none" />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link to={ROUTES.HOME} className="flex items-center gap-4 group w-fit">
              <div className="bg-primary p-3 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 ease-out-expo shadow-xl shadow-primary/20">
                <img src={logo} alt="SeatNow" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-on-surface headline group-hover:text-primary transition-colors duration-500 ease-out-expo">
                SeatNow
              </span>
            </Link>
            <p className="text-on-surface-variant/60 leading-relaxed max-w-sm text-[13px] font-bold uppercase tracking-widest">
              {t('footer.customer.description')}
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-4">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="p-3 bg-white hover:bg-primary/5 rounded-2xl text-on-surface-variant/30 hover:text-primary transition-all duration-500 ease-out-expo group border border-outline/5 hover:shadow-xl hover:shadow-primary/5"
                  aria-label={social}
                >
                  <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform block">
                    {social === 'facebook' ? 'hub' : social === 'instagram' ? 'photo_camera' : social === 'twitter' ? 'tag' : 'play_circle'}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-on-surface-variant/30">
              {t('footer.customer.quick_links')}
            </h4>
            <ul className="space-y-5">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.path}
                    className="text-on-surface-variant/80 hover:text-primary text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-500 ease-out-expo flex items-center gap-3 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary group-hover:w-3 transition-all duration-500 ease-out-expo" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-on-surface-variant/30">
              {t('footer.customer.legal')}
            </h4>
            <ul className="space-y-5">
              {legalLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link
                    to={link.path}
                    className="text-on-surface-variant/80 hover:text-primary text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-500 ease-out-expo flex items-center gap-3 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/20 group-hover:bg-primary group-hover:w-3 transition-all duration-500 ease-out-expo" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-on-surface-variant/30 text-[10px] font-bold uppercase tracking-widest">
            &copy; {currentYear} SeatNow. {t('footer.customer.all_rights_reserved')}
          </p>
          <div className="flex items-center gap-8 text-[10px] text-on-surface-variant/40">
            <span className="flex items-center gap-2 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
              {t('footer.customer.ssl_secured')}
            </span>
            <span className="flex items-center gap-2 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>shield</span>
              {t('footer.customer.pci_compliant')}
            </span>
            <span className="flex items-center gap-2 font-bold uppercase tracking-widest">
              <span className="material-symbols-outlined text-[16px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>language</span>
              {t('footer.customer.vietnam')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
