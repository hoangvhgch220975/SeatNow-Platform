import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Phone, Loader2, Save } from 'lucide-react';

/**
 * @file PartnerDialog.jsx
 * @description Dialog thêm mới hoặc chỉnh sửa thông tin Đối tác (Owner).
 */
const PartnerDialog = ({ isOpen, onClose, onSave, partner = null, loading = false }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (partner) {
      setFormData({
        name: partner.name || partner.fullName || '',
        email: partner.email || '',
        phone: partner.phone || '',
      });
    } else {
      setFormData({ name: '', email: '', phone: '' });
    }
    setErrors({});
  }, [partner, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('admin.partners.dialog.errors.name_required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = t('admin.partners.dialog.errors.email_required');
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = t('admin.partners.dialog.errors.email_invalid');
    }

    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = t('admin.partners.dialog.errors.phone_required');
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = t('admin.partners.dialog.errors.phone_invalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {partner ? t('admin.partners.dialog.title_edit') : t('admin.partners.dialog.title_add')}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {partner ? t('admin.partners.dialog.subtitle_edit') : t('admin.partners.dialog.subtitle_add')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white hover:shadow-md rounded-2xl text-slate-400 hover:text-rose-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('admin.partners.dialog.name')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.name ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 group-focus-within:border-violet-500 group-focus-within:ring-4 group-focus-within:ring-violet-500/10'} rounded-2xl text-sm font-medium transition-all focus:outline-none`}
                placeholder="Nguyễn Văn A"
              />
            </div>
            {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase ml-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('admin.partners.dialog.email')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 group-focus-within:border-violet-500 group-focus-within:ring-4 group-focus-within:ring-violet-500/10'} rounded-2xl text-sm font-medium transition-all focus:outline-none`}
                placeholder="partner@example.com"
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase ml-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('admin.partners.dialog.phone')}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                <Phone size={18} />
              </div>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border ${errors.phone ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-100 group-focus-within:border-violet-500 group-focus-within:ring-4 group-focus-within:ring-violet-500/10'} rounded-2xl text-sm font-medium transition-all focus:outline-none`}
                placeholder="+84 9xx xxx xxx"
              />
            </div>
            {errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase ml-1">{errors.phone}</p>}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
            >
              {t('admin.partners.dialog.btn_cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-violet-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {partner ? t('admin.partners.dialog.btn_save') : t('admin.partners.dialog.btn_create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerDialog;
