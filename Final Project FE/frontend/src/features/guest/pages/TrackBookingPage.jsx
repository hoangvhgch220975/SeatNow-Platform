import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import BookingLookupForm from '../components/BookingLookupForm';
import BookingResultCard from '../components/BookingResultCard';

/**
 * @file TrackBookingPage.jsx
 * @description Trang tra cứu đặt bàn cao cấp cho khách vãng lai.
 */
const TrackBookingPage = () => {
  const { t } = useTranslation();
  const [bookingData, setBookingData] = useState(null);

  return (
    <main className="min-h-screen bg-surface pt-32 pb-40 px-12 relative overflow-hidden -mt-16">
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-24 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-primary mx-auto mb-10 border border-outline/5"
          >
            <span className="material-symbols-outlined text-4xl">travel_explore</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-bold tracking-tight text-on-surface headline tracking-tighter"
          >
            {t('booking.lookup.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant/60 text-xl max-w-2xl mx-auto leading-relaxed font-medium italic"
          >
            {t('booking.lookup.subtitle')}
          </motion.p>
        </header>

        <div className="min-h-[500px]">
          {!bookingData ? (
            <BookingLookupForm onSearch={setBookingData} />
          ) : (
            <BookingResultCard bookingData={bookingData} onReset={() => setBookingData(null)} />
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 text-center space-y-6"
        >
          <p className="text-on-surface-variant/40 font-bold uppercase tracking-[0.3em] text-[10px]">
            {t('booking.lookup.manage_all')}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="text-primary font-bold text-sm inline-flex items-center gap-3 group bg-white px-8 py-4 rounded-full shadow-lg border border-outline/5 transition-all">
              {t('booking.lookup.sign_in')}
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default TrackBookingPage;
