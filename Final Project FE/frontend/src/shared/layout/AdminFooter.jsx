import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * @file AdminFooter.jsx
 * @description Footer chuyên nghiệp dành cho Admin Console.
 */
const AdminFooter = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto px-8 py-6 border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side: Copyright & Status */}
        <div className="flex flex-col md:items-start items-center space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            {t('admin.footer.copyright')}
          </p>
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {t('admin.footer.system_status')}: <span className="text-emerald-600">{t('admin.footer.healthy')}</span>
            </span>
          </div>
        </div>

        {/* Center/Right Side: Technical Info */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200/50 group hover:bg-white hover:shadow-sm transition-all cursor-default">
            <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-violet-600">verified_user</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {t('admin.footer.compliance')}: 2.4.0-CORE
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200/50 group hover:bg-white hover:shadow-sm transition-all cursor-default">
            <span className="material-symbols-outlined text-slate-400 text-sm group-hover:text-amber-600">lock</span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {t('admin.footer.security_locked')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
