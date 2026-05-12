import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

/**
 * @file PartnerPolicyPage.jsx
 * @description Trang Chính sách & Điều khoản dành riêng cho Đối tác (Owner).
 * Nội dung được xây dựng dựa trên Business Flow thực tế của SeatNow.
 */
const PartnerPolicyPage = () => {
  const { t } = useTranslation();

  return (
    <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[300px] flex items-center justify-center overflow-hidden bg-slate-900 rounded-[3rem] mb-16 shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/40 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6">
          <span className="inline-block py-2.5 px-6 rounded-2xl bg-white/10 backdrop-blur-md text-violet-300 font-black text-[10px] tracking-[0.3em] uppercase mb-8 border border-white/10">
             {t('partner_policy.hero.tag', { defaultValue: 'Strategic Partnership Compliance' })}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
            <Trans i18nKey="partner_policy.hero.title">
              Partner <span className="text-violet-400">Governance</span> & Security<span className="text-emerald-400">.</span>
            </Trans>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold text-sm uppercase tracking-widest leading-loose">
            {t('partner_policy.hero.desc', { defaultValue: 'Ensuring business integrity, financial transparency and data governance across the SeatNow Network.' })}
          </p>
        </div>
      </section>

      {/* Content Layout */}
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* 1. Onboarding & Business Identity */}
        <section className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
           <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 border border-violet-100 mb-2">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
           </div>
           <div className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {t('partner_policy.sections.onboarding.title', { defaultValue: '1. Onboarding & Business Identity' })}
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                 {t('partner_policy.sections.onboarding.desc', { defaultValue: 'SeatNow enforces a strict verification process for all restaurant entities. As a Principal Partner, your identity is vetted by our Internal Audit team to ensure operational legitimacy.' })}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 {t('partner_policy.sections.onboarding.cards', { returnObjects: true, defaultValue: [
                    { title: 'Verified Credentials', desc: 'Accounts are provisioned exclusively by SeatNow Administration. Access is granted via encrypted business credentials.' },
                    { title: 'Principal Status', desc: 'Approved entities receive active Wallet systems and are integrated into the Global Discovery network.' }
                  ] }).map((item, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <h4 className="font-black text-slate-900 mb-2 uppercase text-[11px] tracking-widest">{item.title}</h4>
                       <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 2. Operational Intelligence (Slot & Capacity) */}
        <section className="space-y-10 group">
           <div className="flex items-center gap-6">
              <div className="h-0.5 flex-1 bg-slate-100"></div>
              <h2 className="text-sm font-black text-slate-400 tracking-[0.3em] uppercase">
                {t('partner_policy.sections.operations.tag', { defaultValue: 'Service Optimization' })}
              </h2>
              <div className="h-0.5 flex-1 bg-slate-100"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              <div className="md:col-span-4 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/20 blur-3xl rounded-full"></div>
                 <h3 className="text-2xl font-black mb-6">
                   {t('partner_policy.sections.operations.slot_title', { defaultValue: 'Slot Synchronization' })}
                 </h3>
                 <p className="text-xs text-slate-400 font-bold leading-loose mb-8">
                   {t('partner_policy.sections.operations.slot_desc', { defaultValue: 'To prevent overbooking, SeatNow utilizes a 2-hour default slot allocation. Our Redis Lock technology ensures real-time capacity protection.' })}
                 </p>
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <span className="text-[10px] font-black uppercase text-emerald-400">
                      {t('partner_policy.sections.operations.slot_badge', { defaultValue: '120-Min Availability Segments' })}
                    </span>
                 </div>
              </div>

              <div className="md:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
                 <h3 className="text-xl font-bold text-slate-900">
                   {t('partner_policy.sections.operations.protocol_title', { defaultValue: 'Operational Integrity Protocol' })}
                 </h3>
                 <p className="text-slate-500 font-medium leading-relaxed">
                   {t('partner_policy.sections.operations.protocol_desc', { defaultValue: 'Partners are required to maintain accurate digital menus (MongoDB) and table configurations (SQL) to provide seamless reservation services.' })}
                 </p>
                 <ul className="space-y-4">
                    {t('partner_policy.sections.operations.bullets', { returnObjects: true, defaultValue: [
                       'Real-time status updates: Confirmed, Arrived, and Completed.',
                       'QR-Code based check-in for instant verification.',
                       'Automatic release of table slots upon completion.'
                    ] }).map((text, idx) => (
                       <li key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-600">
                          <span className="material-symbols-outlined text-violet-500 text-[18px]">sync_saved_locally</span>
                          {text}
                       </li>
                    ))}
                 </ul>
              </div>
           </div>
        </section>

        {/* 3. Financial Settlement (Deposit & Wallet) */}
        <section className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 space-y-10">
           <div className="flex items-center justify-between gap-6 border-b border-slate-200 pb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('partner_policy.sections.finance.title', { defaultValue: '3. Financial Transparency Framework' })}
              </h3>
              <div className="hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                 <span className="material-symbols-outlined text-emerald-500">payments</span>
                 <span className="text-[10px] font-black uppercase text-slate-500">
                   {t('partner_policy.sections.finance.badge', { defaultValue: 'Encrypted Settlement Active' })}
                 </span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600 leading-relaxed">
              {t('partner_policy.sections.finance.cards', { returnObjects: true, defaultValue: [
                {
                  title: "Deposit Governance",
                  desc: "Customer deposits are held in a secure escrow by SeatNow and settled to the Partner Wallet immediately upon attendee Arrival."
                },
                {
                  title: "Commission Logic",
                  desc: "Administrative commissions are deducted quarterly from the Partner Wallet. Net revenue is available for withdrawal upon Admin approval."
                },
                {
                  title: "Cancellation Protection",
                  desc: "Cancellations within 3 hours or \"No-shows\" grant full deposit retention (minus commission) to the restaurant entity."
                }
              ] }).map((card, idx) => (
                <div key={idx} className="space-y-3">
                   <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest">{card.title}</h4>
                   <p className="text-xs font-medium">{card.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* 4. Portfolio Telemetry & AI Insights */}
        <section className="bg-gradient-to-br from-violet-600 to-indigo-700 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                 <h3 className="text-3xl font-black tracking-tight">
                    {t('partner_policy.sections.telemetry.title', { defaultValue: '4. Portfolio Telemetry & AI' })}
                 </h3>
                 <p className="text-violet-100 text-sm font-bold leading-loose">
                    {t('partner_policy.sections.telemetry.desc', { defaultValue: 'Principal Partners gain access to advanced SeatNow Analytics, providing deep visibility into guest segments (Couple, Small Group, Party) and flexible period benchmarking (Weekly, Monthly, Quarterly).' })}
                 </p>
                 <div className="flex gap-3">
                    {t('partner_policy.sections.telemetry.badges', { returnObjects: true, defaultValue: [
                      "Gemini AI Enhanced",
                      "Real-time Dashboard"
                    ] }).map((badge, idx) => (
                      <div key={idx} className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-[10px] font-black tracking-widest uppercase">{badge}</div>
                    ))}
                 </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-4">
                 <p className="text-xs font-bold text-violet-200 uppercase tracking-widest">
                   {t('partner_policy.sections.telemetry.strategic_tag', { defaultValue: 'Strategic Benefit' })}
                 </p>
                 <p className="italic text-sm font-medium leading-relaxed">
                   {t('partner_policy.sections.telemetry.strategic_quote', { defaultValue: '"Utilize SeatNow AI to predict peak hours, optimize menu performance, and manage withdrawal lifecycles through a unified intelligence interface."' })}
                 </p>
              </div>
           </div>
        </section>

        {/* 5. Support & Compliance Contact */}
        <section className="scroll-mt-32" id="contact">
          <div className="bg-emerald-600 p-12 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
             {/* Decorative background circle */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>

            <h3 className="text-3xl font-black mb-4 relative z-10 tracking-tight">
              {t('partner_policy.sections.support.title', { defaultValue: 'Business Integrity Support' })}
            </h3>
            <p className="mb-10 text-emerald-50/80 font-bold text-sm relative z-10 max-w-xl leading-relaxed">
              {t('partner_policy.sections.support.desc', { defaultValue: 'Our Strategic Business Unit is available 24/7 to resolve disputes, manage withdrawal approvals, and assist with technical integration.' })}
            </p>
            <div className="flex flex-wrap gap-8 relative z-10">
              <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">call</span>
                <span className="font-black text-lg tracking-tight">(0812823285)</span>
              </div>
              <div className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/20 transition-all">
                <span className="material-symbols-outlined text-white">mail</span>
                <span className="font-black text-lg tracking-tight">hoangvhgch220975@fpt.edu.vn</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center mt-20 space-y-2">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
           {t('partner_policy.footer.last_update', { defaultValue: 'Last Update: April 2026' })}
         </p>
         <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
           {t('partner_policy.footer.copyright', { defaultValue: '© SeatNow Strategic Business Unit' })}
         </p>
      </div>
    </main>
  );
};

export default PartnerPolicyPage;
