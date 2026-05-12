import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ROUTES } from '@/config/routes.js';
import toast from 'react-hot-toast';
import logo from '@/assets/logos/logo.png';

/**
 * @file OwnerFooter.jsx
 * @description Thành phần chân trang chuyên biệt dành cho Owner Portal. Hỗ trợ đa ngôn ngữ.
 */
const OwnerFooter = () => {
  const { t } = useTranslation();
    


  return (
    <footer className="mt-4 px-8 py-10 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        
        {/* Branding & Entity */}
        <div className="flex flex-col md:items-start items-center space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center p-1 overflow-hidden shadow-lg shadow-violet-100">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
             </div>
             <p className="text-sm font-black text-slate-900 tracking-tight uppercase">SeatNow <span className="text-violet-600 font-bold">{t('footer.owner.portfolio_intelligence')}</span></p>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-11">
             © 2026 {t('footer.owner.strategic_unit')}
          </p>
        </div>
        
        {/* Simplified Navigation Logic */}
        <div className="flex items-center gap-10">
          <Link 
            to={ROUTES.OWNER_POLICIES} 
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-violet-600 transition-all flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-violet-500 transition-colors"></span>
            {t('footer.owner.privacy_policy')}
          </Link>
          
          <Link 
            to={ROUTES.OWNER_ANALYTICS}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-emerald-600 transition-all flex items-center gap-2 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></span>
            {t('footer.owner.system_status')}
          </Link>
        </div>

        {/* Support Token (Fixed) */}
        <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
           <span className="material-symbols-outlined text-slate-400 text-[18px]">verified</span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
             {t('footer.owner.compliance_level')}: 1.0.4-LTS
           </span>
        </div>
      </div>
    </footer>
  );
};

export default OwnerFooter;
