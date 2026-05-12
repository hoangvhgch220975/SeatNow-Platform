import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Store, MapPin, Clock, LayoutGrid, Image as ImageIcon, 
  ShieldCheck, ArrowRight, ArrowLeft, Send, CheckCircle2,
  Loader2, AlertCircle, Trash2, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useCreateRestaurant } from '../hooks';
import { useAuthStore } from '@/features/auth/store';
import { useImageUpload } from '@/features/media/hooks';
import MapLocationPicker from '@/shared/components/MapLocationPicker';
import OpeningHoursForm from '../components/create-wizard/OpeningHoursForm';
import CuisineSelector from '../components/create-wizard/CuisineSelector';
import DepositPolicyForm from '../components/create-wizard/DepositPolicyForm';

/**
 * @file CreateRestaurantPage.jsx
 * @description Trang đăng ký nhà hàng mới với quy trình Wizard 4 bước.
 */
const CreateRestaurantPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const createMutation = useCreateRestaurant();
  const { upload, isUploading: isImageUploading } = useImageUpload();

  // State quản lý bước hiện tại (Vietnamese comment)
  const [currentStep, setCurrentStep] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // State quản lý dữ liệu form (Vietnamese comment)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    latitude: 21.0285,
    longitude: 105.8542,
    description: '',
    cuisineTypeJson: [],
    priceRange: 1,
    imagesJson: [],
    openingHoursJson: { 'Monday-Sunday': '10:00 - 22:00' },
    depositEnabled: false,
    depositPolicyJson: {
      required: false,
      minGuests: 1,
      type: 'fixed',
      minAmount: 50000
    }
  });

  // Tự động tạo slug khi tên thay đổi (Vietnamese comment)
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMapConfirm = (pos, addr) => {
    setFormData(prev => ({
      ...prev,
      latitude: pos.lat,
      longitude: pos.lng,
      address: addr || prev.address
    }));
    setIsMapOpen(false);
    toast.success(t('owner_portal.create_restaurant.form.location_selected'));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (formData.imagesJson.length + files.length > 5) {
      toast.error(t('owner_portal.create_restaurant.form.max_images_error'));
      return;
    }

    const uploadPromises = files.map(file => upload(file));
    try {
      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        imagesJson: [...prev.imagesJson, ...urls]
      }));
      toast.success(t('owner_portal.create_restaurant.form.images_upload_success'));
    } catch (err) {
      toast.error(t('owner_portal.create_restaurant.form.images_upload_error'));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imagesJson: prev.imagesJson.filter((_, i) => i !== index)
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name) return t('owner_portal.create_restaurant.form.name_required');
      if (!formData.email) return t('owner_portal.create_restaurant.form.email_required');
      if (!formData.phone) return t('owner_portal.create_restaurant.form.phone_required');
      if (!formData.address) return t('owner_portal.create_restaurant.form.address_required');
    }
    if (currentStep === 2) {
      if (formData.cuisineTypeJson.length === 0) return t('owner_portal.create_restaurant.form.cuisine_required');
    }
    if (currentStep === 3) {
      if (formData.imagesJson.length === 0) return t('owner_portal.create_restaurant.form.image_required');
    }
    return null;
  };

  const nextStep = () => {
    const error = validateStep();
    if (error) {
      toast.error(error);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    // Chuẩn bị payload khớp CHÍNH XÁC 100% với yêu cầu của Backend (Vietnamese comment)
    const payload = {
      ownerId: user?.id,
      name: formData.name,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      phone: formData.phone,
      email: formData.email,
      priceRange: Number(formData.priceRange),
      description: formData.description,
      
      // Tên trường sạch (không có Json) và gửi trực tiếp Array (Vietnamese comment)
      cuisineTypes: formData.cuisineTypeJson,
      images: formData.imagesJson,
      
      // Gửi trực tiếp Object (Vietnamese comment)
      openingHours: formData.openingHoursJson,
      
      depositEnabled: formData.depositPolicyJson.required,
      depositPolicy: {
        required: formData.depositPolicyJson.required,
        minGuests: Number(formData.depositPolicyJson.minGuests),
        amountPerGuest: Number(formData.depositPolicyJson.minAmount) // Map minAmount -> amountPerGuest (Vietnamese comment)
      }
    };
    
    console.log('STANDARD PAYLOAD SENT:', payload);

    createMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(t('owner_portal.create_restaurant.form.success_title'));
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || t('owner_portal.create_restaurant.form.create_failed'));
      }
    });
  };

  // UI Bước 1 (Vietnamese comment)
  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.name_label')}</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t('owner_portal.create_restaurant.form.name_placeholder')}
            className="w-full h-12 px-4 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.email_label')}</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('owner_portal.create_restaurant.form.email_placeholder')}
            className="w-full h-12 px-4 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.phone_label')}</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t('owner_portal.create_restaurant.form.phone_placeholder')}
            className="w-full h-12 px-4 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.address_label')}</label>
          <div className="relative">
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder={t('owner_portal.create_restaurant.form.address_placeholder')}
              className="w-full h-12 pl-4 pr-12 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
            />
            <button 
              onClick={() => setIsMapOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            >
              <MapPin size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.description_label')}</label>
        <textarea
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleInputChange}
          placeholder={t('owner_portal.create_restaurant.form.description_placeholder')}
          className="w-full px-4 py-3 bg-white border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm resize-none"
        />
      </div>
    </div>
  );

  // UI Bước 2 (Vietnamese comment)
  const renderStep2 = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.cuisine_label')}</label>
        <CuisineSelector 
          selectedCuisines={formData.cuisineTypeJson}
          onChange={(val) => handleUpdate('cuisineTypeJson', val)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.price_range_label')}</label>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((num) => (
              <button
                key={num}
                onClick={() => handleUpdate('priceRange', num)}
                className={`w-12 h-12 rounded-xl border-2 font-black transition-all ${
                  formData.priceRange === num 
                    ? 'border-primary bg-primary/5 text-primary scale-110 shadow-lg shadow-primary/10' 
                    : 'border-outline-variant/30 text-on-surface-variant/40 hover:border-outline-variant'
                }`}
              >
                {'$'.repeat(num)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-extrabold text-primary uppercase tracking-widest pl-1">{t('owner_portal.create_restaurant.form.hours_label')}</label>
          <OpeningHoursForm 
            value={formData.openingHoursJson}
            onChange={(val) => handleUpdate('openingHoursJson', val)}
          />
        </div>
      </div>
    </div>
  );

  // UI Bước 3 (Vietnamese comment)
  const renderStep3 = () => (
    <div className="h-full flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex-1 border-2 border-dashed border-outline-variant/50 rounded-3xl p-10 flex flex-col items-center justify-center bg-surface-container-low/50 gap-4 hover:border-primary/50 transition-colors group">
        <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          {isImageUploading ? <Loader2 size={32} className="animate-spin" /> : <ImageIcon size={32} />}
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-on-surface mb-1">{t('owner_portal.create_restaurant.form.images_label')}</p>
          <p className="text-[11px] text-on-surface-variant/60 font-medium">{t('owner_portal.create_restaurant.form.images_hint')}</p>
        </div>
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isImageUploading}
          className="hidden" 
          id="image-upload" 
        />
        <label 
          htmlFor="image-upload"
          className="px-6 py-2.5 bg-white border border-outline-variant rounded-xl text-xs font-black shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
        >
          {isImageUploading ? t('owner_portal.create_restaurant.form.uploading') : t('owner_portal.create_restaurant.form.select_photos')}
        </label>
      </div>

      {formData.imagesJson.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {formData.imagesJson.map((url, idx) => (
            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg">
              <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {formData.imagesJson.length < 5 && (
            <label htmlFor="image-upload" className="aspect-square rounded-2xl border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant/20 hover:text-primary/50 hover:border-primary/50 transition-all cursor-pointer">
              <Plus size={32} />
            </label>
          )}
        </div>
      )}
    </div>
  );

  // UI Bước 4 (Vietnamese comment)
  const renderStep4 = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <DepositPolicyForm 
        data={formData.depositPolicyJson}
        onChange={(val) => handleUpdate('depositPolicyJson', val)}
      />

      <div className="p-6 bg-orange-50/50 border border-orange-200/50 rounded-3xl flex items-start gap-4">
        <AlertCircle className="text-orange-600 shrink-0" size={24} />
        <div className="space-y-1">
          <p className="text-sm font-black text-orange-950 uppercase tracking-tight">{t('owner_portal.create_restaurant.form.final_step_title')}</p>
          <p className="text-xs text-orange-900/70 font-medium leading-relaxed">
            {t('owner_portal.create_restaurant.form.final_step_desc')}
          </p>
        </div>
      </div>
    </div>
  );

  const steps = [
    { id: 1, icon: Store, title: t('owner_portal.create_restaurant.steps.identity') },
    { id: 2, icon: Clock, title: t('owner_portal.create_restaurant.steps.concept') },
    { id: 3, icon: ImageIcon, title: t('owner_portal.create_restaurant.steps.media') },
    { id: 4, icon: ShieldCheck, title: t('owner_portal.create_restaurant.steps.policies') },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-body">
      {/* Header (Vietnamese comment) */}
      <header className="mb-12 text-center space-y-2">
        <h1 className="text-4xl font-black tracking-tighter text-on-surface drop-shadow-sm">
          {t('owner_portal.create_restaurant.title')}
        </h1>
        <p className="text-on-surface-variant text-base font-medium opacity-70">
          {t('owner_portal.create_restaurant.subtitle')}
        </p>
      </header>

      {/* Progress Stepper (Vietnamese comment) */}
      <div className="mb-24 px-4">
        <div className="flex justify-between items-center relative h-16">
          {/* Background Line (Vietnamese comment) */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-high -translate-y-1/2 z-0 rounded-full" />
          
          {/* Animated Progress Line (Vietnamese comment) */}
          <motion.div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep - 1) * 33.33}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
          
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isActive = isCompleted || isCurrent;

            return (
              <div key={step.id} className="relative z-10">
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: isActive ? '#630ed4' : '#ffffff',
                    borderColor: isActive ? '#630ed4' : '#e2e8f0',
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                    isActive ? 'text-white shadow-lg shadow-primary/25' : 'text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                  ) : (
                    <Icon size={24} strokeWidth={isCurrent ? 2.5 : 2} />
                  )}
                </motion.div>
                
                {/* Title Container (Vietnamese comment) */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-28 text-center pointer-events-none">
                  <span className={`text-[10px] font-black uppercase tracking-widest block transition-all duration-300 leading-tight ${
                    isActive ? 'text-primary' : 'text-slate-400 opacity-60'
                  }`}>
                    {step.title}
                  </span>
                  {isCurrent && (
                    <motion.div 
                      layoutId="active-pill"
                      className="h-1 w-6 bg-primary mx-auto mt-2 rounded-full"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content (Vietnamese comment) */}
      <div className="bg-white border border-outline-variant/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 relative overflow-hidden mb-8 min-h-[600px] flex flex-col">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/50 via-violet-500 to-primary/50" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation (Vietnamese comment) */}
        <div className="mt-12 pt-12 border-t border-outline-variant/30 flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1 || createMutation.isPending}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              currentStep === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high active:scale-95'
            }`}
          >
            <ArrowLeft size={16} />
            {t('owner_portal.create_restaurant.form.back')}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="group flex items-center gap-2 px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-container active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              {t('owner_portal.create_restaurant.form.continue')}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="group flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-container active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t('owner_portal.create_restaurant.form.processing')}
                </>
              ) : (
                <>
                  <Send size={18} />
                  {t('owner_portal.create_restaurant.form.submit_button')}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Map Popup Modal (Vietnamese comment) */}
      <MapLocationPicker 
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        onConfirm={handleMapConfirm}
        initialLocation={{ lat: formData.latitude, lng: formData.longitude }}
      />
    </div>
  );
};

export default CreateRestaurantPage;
