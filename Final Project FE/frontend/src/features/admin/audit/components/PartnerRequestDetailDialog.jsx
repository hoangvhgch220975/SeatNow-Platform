import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { 
  X, User, Mail, Phone, Clock, 
  ShieldCheck, Image as ImageIcon, AlertTriangle,
  FileText, CheckCircle, XCircle
} from 'lucide-react';

/**
 * @file PartnerRequestDetailDialog.jsx
 * @description Dialog hiển thị thông tin chi tiết yêu cầu đối tác (Leads).
 * Sử dụng createPortal để tránh lỗi CSS từ component cha.
 */
const PartnerRequestDetailDialog = ({ 
  isOpen, 
  onClose, 
  lead,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false
}) => {
  const { t } = useTranslation();

  // Chặn scroll body khi modal mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !lead) return null;

  const documentUrls = Array.isArray(lead.documentUrl) 
    ? lead.documentUrl 
    : (typeof lead.documentUrl === 'string' ? [lead.documentUrl] : []);

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-violet-600 flex items-center justify-center text-white shadow-xl shadow-violet-200">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                {t('admin.audit.detail.title')}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">
                LEAD ID: <span className="text-slate-600">#{lead._id || lead.id}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-8 no-scrollbar space-y-10">
          
          {/* Basic Info Section */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <User size={12} className="text-violet-500" /> {t('admin.audit.detail.basic_info')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('admin.audit.detail.full_name')}</p>
                  <p className="text-[15px] font-black text-slate-900">{lead.name}</p>
                </div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('admin.audit.detail.phone')}</p>
                  <p className="text-[15px] font-black text-slate-900 font-mono tracking-tight">{lead.phone}</p>
                </div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 md:col-span-2 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('admin.audit.detail.email')}</p>
                  <p className="text-[15px] font-black text-slate-900">{lead.email}</p>
                </div>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 flex items-center gap-4 md:col-span-2 transition-all hover:bg-white hover:shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('admin.audit.detail.submitted_at')}</p>
                  <p className="text-[15px] font-bold text-slate-700 italic">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                    }) : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 ml-1">
              <FileText size={12} className="text-emerald-500" /> {t('admin.audit.detail.license_docs')}
            </h4>
            {documentUrls.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {documentUrls.map((url, idx) => (
                  <div key={idx} className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                    <img 
                      src={url} 
                      alt={`License ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 bg-white text-slate-900 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
                      >
                        <ImageIcon size={24} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-slate-400">
                <AlertTriangle size={48} className="opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">{t('common.no_data')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2.5 text-amber-600 bg-amber-50 px-5 py-2.5 rounded-2xl border border-amber-100">
            <AlertTriangle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('admin.audit.info.rules_title')}</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onReject(lead)}
              disabled={isRejecting || isApproving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 border border-rose-200 bg-rose-50 text-rose-500 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-95 disabled:opacity-50"
            >
              <XCircle size={16} />
              {t('common.reject')}
            </button>
            <button
              onClick={() => onApprove(lead)}
              disabled={isApproving || isRejecting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {isApproving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              {t('common.approve')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PartnerRequestDetailDialog;
