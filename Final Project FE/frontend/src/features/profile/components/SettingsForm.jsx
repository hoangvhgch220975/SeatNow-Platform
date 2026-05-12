import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useUpdateProfileMutation } from '../hooks.js';
import { profileSchema } from '../schemas.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';

import AvatarUploader from './AvatarUploader.jsx';
import ProfileForm from './ProfileForm.jsx';

/**
 * @file SettingsForm.jsx
 * @description Thành phần Container quản lý logic cập nhật hồ sơ người dùng cao cấp.
 */
const SettingsForm = ({ user }) => {
  const { t } = useTranslation();
  
  const [previewUrl, setPreviewUrl] = useState(user?.avatar || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const updateProfileMutation = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || user?.fullName || '',
      phone: user?.phone || user?.phoneNumber || '',
      email: user?.email || '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name || user.fullName || '');
      setValue('phone', user.phone || user.phoneNumber || '');
      setValue('email', user.email || '');
      setPreviewUrl(user.avatar || '');
    }
  }, [user, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      let avatarUrl = user?.avatar;

      if (selectedFile) {
        try {
          const uploadRes = await uploadToCloudinary(selectedFile);
          avatarUrl = uploadRes.secure_url;
        } catch (uploadError) {
          toast.error(t('profile.settings.upload_error'));
          return;
        }
      }

      await updateProfileMutation.mutateAsync({
        name: data.name,
        email: data.email,
        avatar: avatarUrl,
      });

      toast.success(t('profile.settings.success_toast'));
      setSelectedFile(null);
    } catch (error) {
      console.error('Update Profile Error:', error);
      const message = error.response?.data?.message;
      const status = error.response?.status;
      
      if (status === 409) {
        toast.error(t('profile.settings.email_conflict'));
      } else {
        toast.error(message || t('profile.settings.error_default'));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = updateProfileMutation.isPending || isUploading;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-12 rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] h-full"
    >
      <header className="flex items-center gap-6 mb-12">
        <div className="w-16 h-16 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary">
           <span className="material-symbols-outlined text-3xl">person_edit</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">
            {t('profile.settings.title')}
          </h2>
          <p className="text-[10px] text-on-surface-variant/40 font-bold uppercase tracking-[0.3em] mt-2">
            {t('profile.settings.subtitle')}
          </p>
        </div>
      </header>

      <div className="space-y-12">
        <AvatarUploader 
          previewUrl={previewUrl}
          isUploading={isUploading}
          isPending={isPending}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />

        <ProfileForm 
          register={register}
          errors={errors}
          user={user}
          isPending={isPending}
          onSubmit={handleSubmit(onSubmit)}
        />
      </div>
    </motion.div>
  );
};

export default SettingsForm;
