import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

/**
 * @component BookingInfoSection
 * @description Hiển thị chi tiết nhà hàng, khách hàng và thông tin đặt bàn. Hỗ trợ đa ngôn ngữ.
 * @param {object} booking - Dữ liệu đặt bàn từ BE hoặc MockData
 */
const BookingInfoSection = ({ booking }) => {
  const { t } = useTranslation();
  const { restaurant, guest, reservation } = booking;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-[3.5rem] overflow-hidden border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]"
    >
      {/* Restaurant Header Image Overlay */}
      <div className="h-80 relative group overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
          src={restaurant.image} 
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-10 left-12 space-y-2">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-black text-white headline tracking-tight"
          >
            {restaurant.name}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/60 flex items-center gap-3 text-sm font-bold uppercase tracking-widest italic"
          >
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
            {restaurant.address}
          </motion.p>
        </div>
      </div>

      <div className="p-16 grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Guest Details */}
        <div className="space-y-10">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">person</span>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              {t('booking.detail.sections.guest_info')}
            </h3>
          </div>
          <div className="space-y-8">
            <InfoItem variants={itemVariants} icon="account_circle" label={t('booking.detail.labels.full_name')} value={guest.fullName} />
            <InfoItem variants={itemVariants} icon="alternate_email" label={t('booking.detail.labels.email')} value={guest.email} />
            <InfoItem variants={itemVariants} icon="phone_iphone" label={t('booking.detail.labels.phone')} value={guest.phone} />
          </div>
        </div>

        {/* Reservation Details */}
        <div className="space-y-10">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">event_seat</span>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
              {t('booking.detail.sections.reservation_details')}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            <DetailItem variants={itemVariants} label={t('booking.detail.labels.date')} value={reservation.date} />
            <DetailItem variants={itemVariants} label={t('booking.detail.labels.time')} value={reservation.time} />
            <DetailItem variants={itemVariants} label={t('booking.detail.labels.guests')} value={t('booking.card.guests_count', { count: reservation.partySize })} />
            
            <DetailItem 
              variants={itemVariants}
              label={t('booking.detail.labels.table_number')} 
              value={reservation.tableNumber ? `No. ${reservation.tableNumber}` : t('booking.detail.fallbacks.assignment_pending')} 
            />
            <motion.div variants={itemVariants} className="col-span-2 pt-6 border-t border-outline/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30 mb-3">{t('booking.detail.labels.seating_area')}</p>
              <div className="flex items-center gap-4 text-primary bg-primary/5 px-6 py-4 rounded-2xl w-fit">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>table_restaurant</span>
                <span className="text-sm font-black uppercase tracking-widest">{reservation.tableType}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Cancellation Reason */}
      {booking.status === 'cancelled' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-16 mb-16 p-10 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex gap-8 items-start"
        >
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 shadow-lg shadow-rose-200/50">
            <span className="material-symbols-outlined text-3xl">info</span>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500">{t('booking.detail.sections.cancellation_reason')}</h4>
            <p className="text-xl font-bold text-rose-900 leading-relaxed">
              {booking.cancellationReason || t('booking.detail.fallbacks.no_reason')}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

/* Helper Components nội bộ */
const InfoItem = ({ icon, label, value, variants }) => (
  <motion.div variants={variants} className="flex items-center gap-6 group">
    <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-on-surface-variant/30 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-outline/5">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/30">{label}</p>
      <p className="text-base font-black text-on-surface">{value}</p>
    </div>
  </motion.div>
);

const DetailItem = ({ label, value, variants }) => (
  <motion.div variants={variants} className="space-y-3 group">
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-on-surface-variant/40 group-hover:text-primary transition-colors duration-300">{label}</p>
    <p className="text-xl font-black text-on-surface headline tracking-tight">{value}</p>
  </motion.div>
);

export default BookingInfoSection;
