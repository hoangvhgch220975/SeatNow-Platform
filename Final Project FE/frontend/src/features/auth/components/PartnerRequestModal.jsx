import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '../../../shared/ui/Modal';
import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input';
import { useSubmitPartnerRequestMutation } from '../hooks';
import { authApi } from '../api';
import { getPartnerRequestSchema } from '../schemas';
import { useImageUpload } from '../../media/hooks';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';

/**
 * @file PartnerRequestModal.jsx
 * @description Modal dành cho khách hàng muốn trở thành đối tác nhà hàng.
 * Đã sửa lỗi: Map lại đúng dữ liệu từ apiClient (vốn đã tháo 1 lớp .data).
 */
const PartnerRequestModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const submitMutation = useSubmitPartnerRequestMutation();
  const { upload, isUploading } = useImageUpload();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [availabilityError, setAvailabilityError] = useState({ email: '', phone: '' });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(getPartnerRequestSchema(t)),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      documentUrls: []
    }
  });

  const watchEmail = watch('email');
  const watchPhone = watch('phone');
  const watchDocs = watch('documentUrls');

  const debounceTimer = useRef(null);

  const checkAvailability = useCallback(
    async (field, value) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        if (!value) return;

        try {
          const res = await authApi.checkAvailability({ [field]: value });
          
          /**
           * SỬA LỖI MAPPING (Vietnamese: SỬA LỖI MAPPING)
           * apiClient đã return response.data. Nên res ở đây chính là { success, data }
           * Do đó, exists nằm ở res.data.exists
           */
          const exists = res.data?.exists;
          
          if (exists) {
            const errorMsg = field === 'email' 
              ? t('api.messages.EMAIL_ALREADY_EXISTS') 
              : t('api.messages.PHONE_ALREADY_EXISTS');
            
            setAvailabilityError(prev => ({ ...prev, [field]: errorMsg }));
          } else {
            setAvailabilityError(prev => ({ ...prev, [field]: '' }));
          }
        } catch (err) {
          console.warn(`Check availability failed for ${field}:`, err.message);
        }
      }, 500);
    },
    [t]
  );

  useEffect(() => {
    if (watchEmail && !errors.email) checkAvailability('email', watchEmail);
    else setAvailabilityError(prev => ({ ...prev, email: '' }));

    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [watchEmail, errors.email, checkAvailability]);

  useEffect(() => {
    if (watchPhone && !errors.phone) checkAvailability('phone', watchPhone);
    else setAvailabilityError(prev => ({ ...prev, phone: '' }));

    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [watchPhone, errors.phone, checkAvailability]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadPromises = files.map(file => upload(file));
      const urls = await Promise.all(uploadPromises);
      
      const newDocs = [...watchDocs, ...urls];
      setValue('documentUrls', newDocs, { shouldValidate: true });
    } catch (error) {
      console.error('File upload failed', error);
    }
  };

  const removeImage = (indexToRemove) => {
    const newDocs = watchDocs.filter((_, index) => index !== indexToRemove);
    setValue('documentUrls', newDocs, { shouldValidate: true });
  };

  const onFormSubmit = (data) => {
    if (availabilityError.email || availabilityError.phone) return;

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      documentUrl: data.documentUrls
    };

    submitMutation.mutate(payload, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || '';
        if (err.response?.status === 409 || errorMsg.includes('EXISTS')) {
           if (errorMsg === 'EMAIL_ALREADY_EXISTS') {
             setAvailabilityError(p => ({...p, email: t('api.messages.EMAIL_ALREADY_EXISTS')}));
           } else if (errorMsg === 'PHONE_ALREADY_EXISTS') {
             setAvailabilityError(p => ({...p, phone: t('api.messages.PHONE_ALREADY_EXISTS')}));
           }
        }
      }
    });
  };

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    setAvailabilityError({ email: '', phone: '' });
    onClose();
  };

  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="text-center py-8 space-y-6">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('auth.partner.successTitle')}
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            {t('auth.partner.successDesc')}
          </p>
          <Button className="w-full py-4 rounded-xl font-bold" onClick={handleClose}>
            {t('auth.partner.close')}
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 pt-2">
        <p className="text-sm text-slate-500 font-medium">{t('auth.partner.subtitle')}</p>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <Input 
            label={t('auth.partner.fullName')}
            placeholder="e.g. John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label={t('auth.partner.email')}
              type="email"
              placeholder="name@company.com"
              error={errors.email?.message || availabilityError.email}
              {...register('email')}
            />
            <Input 
              label={t('auth.partner.phone')}
              placeholder="098... or +84..."
              error={errors.phone?.message || availabilityError.phone}
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t('auth.partner.license')}
            </label>
            
            {watchDocs.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {watchDocs.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                    <img src={url} alt={`License ${index + 1}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
              errors.documentUrls ? 'border-red-500 bg-red-50/10' : watchDocs.length > 0 ? 'border-primary/20 bg-primary/5' : 'border-slate-200 hover:border-primary/40'
            }`}>
              <input 
                type="file" 
                id="doc-upload"
                className="hidden" 
                onChange={handleFileUpload}
                accept="image/*.jpg,image/jpeg,image/png"
                multiple
              />
              
              <label htmlFor="doc-upload" className="flex flex-col items-center justify-center cursor-pointer gap-2">
                {isUploading ? (
                  <Loader2 className="animate-spin text-primary" size={32} />
                ) : (
                  <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={32} />
                )}
                <span className="text-xs font-bold text-slate-600">
                  {isUploading ? t('auth.partner.uploading') : t('auth.partner.uploadHint')}
                </span>
              </label>
            </div>
            {errors.documentUrls && (
                <p className="text-[10px] font-bold text-red-500 ml-1">{errors.documentUrls.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-base shadow-xl shadow-primary/20"
              isLoading={submitMutation.isPending}
              disabled={isUploading || !!availabilityError.email || !!availabilityError.phone}
            >
              {t('auth.partner.submit')}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title={!isSuccess ? t('auth.partner.title') : undefined}
    >
      {renderContent()}
    </Modal>
  );
};

export default PartnerRequestModal;
