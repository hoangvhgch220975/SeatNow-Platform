import React from 'react';
import { ShieldCheck, ToggleLeft, ToggleRight, Info, DollarSign, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * @component DepositPolicyForm
 * @description Thành phần cấu hình chính sách đặt cọc.
 * Chứa nút Switch để bật/tắt và nhập số tiền cọc tối thiểu.
 */
const DepositPolicyForm = ({ data = {}, onChange }) => {
  const { t } = useTranslation();

  const handleToggle = () => {
    onChange({
      ...data,
      required: !data.required
    });
  };

  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Switch (Vietnamese comment) */}
      <div 
        onClick={handleToggle}
        className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
          data.required 
            ? 'bg-primary/5 border-primary shadow-sm ring-1 ring-primary/10' 
            : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            data.required ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant/40'
          }`}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-on-surface">
              {t('owner_portal.create_restaurant.form.deposit_enabled')}
            </h4>
            <p className="text-xs text-on-surface-variant/60 font-medium tracking-tight">
              {t('owner_portal.create_restaurant.form.deposit_protection_desc')}
            </p>
          </div>
        </div>
        {data.required ? (
          <ToggleRight className="text-primary w-10 h-10" />
        ) : (
          <ToggleLeft className="text-on-surface-variant/30 w-10 h-10" />
        )}
      </div>

      {/* Cấu hình chi tiết (Vietnamese comment) */}
      {data.required && (
        <div className="animate-in slide-in-from-top-4 fade-in duration-300 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Min Amount (Vietnamese comment) */}
          <div className="p-5 bg-white border border-outline-variant rounded-2xl space-y-3 shadow-sm">
            <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <DollarSign size={12} />
              {t('owner_portal.create_restaurant.form.min_amount_label')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1000"
                value={data.minAmount || ''}
                onChange={(e) => handleChange('minAmount', parseInt(e.target.value) || 0)}
                className="w-full h-12 pl-4 pr-12 bg-surface-container-low border border-outline-variant outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-lg"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/40">VND</span>
            </div>
          </div>

          {/* Apply for party size (Vietnamese comment) */}
          <div className="p-5 bg-white border border-outline-variant rounded-2xl space-y-3 shadow-sm">
            <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Users size={12} />
              {t('owner_portal.create_restaurant.form.min_guests_label')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={data.minGuests || 1}
                onChange={(e) => handleChange('minGuests', parseInt(e.target.value) || 1)}
                className="w-20 h-12 px-4 bg-surface-container-low border border-outline-variant outline-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-lg text-center"
              />
              <span className="text-sm font-bold text-on-surface-variant/60 uppercase tracking-tighter">{t('owner_portal.create_restaurant.form.guests_plus')}</span>
            </div>
          </div>

          {/* Policy Type (Vietnamese comment) */}
          <div className="md:col-span-2 p-5 bg-white border border-outline-variant rounded-2xl space-y-4 shadow-sm">
            <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Info size={12} />
              {t('owner_portal.create_restaurant.form.policy_type_label')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('type', 'fixed')}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-xs ${
                  data.type === 'fixed' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-outline-variant/30 text-on-surface-variant/40 hover:border-outline-variant'
                }`}
              >
                {t('owner_portal.create_restaurant.form.policy_type_fixed')}
              </button>
              <button
                type="button"
                onClick={() => handleChange('type', 'person')}
                className={`py-3 px-4 rounded-xl border-2 transition-all font-bold text-xs ${
                  data.type === 'person' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-outline-variant/30 text-on-surface-variant/40 hover:border-outline-variant'
                }`}
              >
                {t('owner_portal.create_restaurant.form.policy_type_person')}
              </button>
            </div>
            <p className="text-[10px] text-on-surface-variant/50 font-medium italic">
              {data.type === 'fixed' 
                ? t('owner_portal.create_restaurant.form.policy_fixed_desc') 
                : t('owner_portal.create_restaurant.form.policy_person_desc')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPolicyForm;
