import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldCheck,
  Ban
} from 'lucide-react';
import Modal from '../../../../shared/ui/Modal';
import { formatCurrency } from '../../../../shared/utils/formatCurrency';

/**
 * @file WithdrawalDecisionDialog.jsx
 * @description Dialog xác nhận phê duyệt hoặc từ chối yêu cầu rút tiền.
 */
const WithdrawalDecisionDialog = ({ 
  isOpen, 
  onClose, 
  request, 
  mode = 'approve', // 'approve' | 'reject'
  onConfirm,
  loading = false 
}) => {
  const { t } = useTranslation();

  if (!request) return null;

  const isApprove = mode === 'approve';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isApprove ? t('admin.withdrawals.actions.confirm_title') : t('admin.withdrawals.actions.reject_title')}
    >
      <div className="space-y-6">
        {/* Hero Illustration */}
        <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${isApprove ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isApprove ? <ShieldCheck size={32} /> : <Ban size={32} />}
          </div>
          <h4 className={`text-lg font-black uppercase tracking-tight ${isApprove ? 'text-green-700' : 'text-red-700'}`}>
             {isApprove ? t('admin.withdrawals.actions.approve') : t('admin.withdrawals.actions.reject')}
          </h4>
        </div>

        {/* Action Content */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-sm font-medium text-slate-600 mb-4">
              {isApprove 
                ? t('admin.withdrawals.actions.confirm_desc', { 
                    amount: formatCurrency(request.amount), 
                    restaurant: request.restaurantName 
                  })
                : t('admin.withdrawals.actions.reject_desc')
              }
            </p>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.withdrawals.table.requested')}</p>
                   <p className="text-lg font-black text-slate-900">{formatCurrency(request.amount)}</p>
                </div>
                <ArrowRight className="text-slate-200" />
                <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin.withdrawals.table.status')}</p>
                   <p className={`text-sm font-black uppercase ${isApprove ? 'text-green-600' : 'text-red-600'}`}>
                     {isApprove ? 'COMPLETED' : 'FAILED'}
                   </p>
                </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <AlertTriangle className="text-amber-500 shrink-0" size={18} />
            <p className="text-xs text-amber-800 font-medium leading-relaxed">
              {isApprove 
                ? t('admin.withdrawals.actions.approve_warning')
                : t('admin.withdrawals.actions.reject_warning')
              }
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => onConfirm(request.id)}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2
              ${isApprove 
                ? 'bg-green-600 text-white shadow-green-200 hover:bg-green-700' 
                : 'bg-red-600 text-white shadow-red-200 hover:bg-red-700'}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                  {isApprove ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  {isApprove ? t('admin.withdrawals.actions.approve') : t('admin.withdrawals.actions.reject')}
                </>
            )}
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
          >
            {t('common.cancel') || 'Go Back'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawalDecisionDialog;
