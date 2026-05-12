import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useGuestBookingLookup } from '../hooks';
import { getRestaurantById } from '../../restaurants/api';

/**
 * @file BookingLookupForm.jsx
 * @description Biểu mẫu tra cứu đặt bàn cao cấp với hiệu ứng mượt mà.
 */
const BookingLookupForm = ({ onSearch }) => {
  const { t } = useTranslation();
  const [bookingCode, setBookingCode] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  
  const { mutate, isPending, isError, error } = useGuestBookingLookup();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ bookingCode, guestPhone }, {
      onSuccess: async (data) => {
        const bookingData = data?.data || data; 
        
        if (bookingData && bookingData.restaurantId && !bookingData.restaurantName && !bookingData.restaurant?.name) {
          try {
            const restaurant = await getRestaurantById(bookingData.restaurantId);
            if (restaurant) {
              bookingData.restaurantName = restaurant.name || restaurant.restaurantName;
            }
          } catch (err) {
            console.error("Failed to fetch restaurant details:", err);
          }
        }

        onSearch(bookingData);
      }
    });
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-outline/5">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 ml-6">
                {t('booking.lookup.form.id_label')}
              </label>
              <input 
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value)}
                className="w-full h-20 px-10 rounded-[2rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-on-surface font-bold placeholder:text-outline/20 outline-none transition-all duration-300" 
                placeholder={t('booking.lookup.form.id_placeholder')} 
                type="text"
                required
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40 ml-6">
                {t('booking.lookup.form.phone_label')}
              </label>
              <input 
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="w-full h-20 px-10 rounded-[2rem] bg-surface border border-outline/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/20 text-on-surface font-bold placeholder:text-outline/20 outline-none transition-all duration-300" 
                placeholder={t('booking.lookup.form.phone_placeholder')}
                type="text"
                required
              />
            </div>
          </div>
          
          {isError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/5 py-4 px-8 rounded-2xl border border-rose-500/10 flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined text-rose-500 text-lg">error</span>
              <p className="text-rose-500 text-xs font-bold uppercase tracking-wider">
                {(() => {
                  const status = error?.response?.status;
                  const msg = error?.response?.data?.message?.toLowerCase() || '';
                  if (status === 404) return t('booking.lookup.error.not_found');
                  if (status === 403 || msg.includes('phone')) return t('booking.lookup.error.phone_mismatch');
                  return error?.response?.data?.message || t('booking.lookup.error.generic');
                })()}
              </p>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            disabled={isPending}
            className="w-full h-20 bg-primary text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all disabled:opacity-70 flex items-center justify-center gap-4" 
            type="submit"
          >
            {isPending ? (
              <>
                <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                {t('booking.lookup.form.searching')}
              </>
            ) : t('booking.lookup.form.find_button')}
          </motion.button>
        </form>
      </div>
    </section>
  );
};

export default BookingLookupForm;
