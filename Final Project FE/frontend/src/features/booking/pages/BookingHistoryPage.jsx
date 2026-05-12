import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyBookingsQuery } from '../hooks.js';
import { useProfileQuery } from '../../profile/hooks.js';
import BookingFilter from '../components/BookingFilter.jsx';
import BookingCard from '../components/BookingCard.jsx';
import BookingEmptyState from '../components/BookingEmptyState.jsx';
import Pagination from '../../../shared/ui/Pagination.jsx';

/**
 * @file BookingHistoryPage.jsx
 * @description Trang lịch sử đặt bàn cao cấp.
 */
const BookingHistoryPage = () => {
  const { t } = useTranslation();
  const { data: profile } = useProfileQuery();
  const { data: bookings = [], isLoading } = useMyBookingsQuery();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = b.status?.toLowerCase() || '';
      
      if (activeTab === 'all') return true;
      if (activeTab === 'upcoming') {
        return ['pending', 'confirmed', 'arrived'].includes(status);
      }
      if (activeTab === 'completed') {
        return status === 'completed';
      }
      if (activeTab === 'canceled') {
        return ['cancelled', 'no_show', 'canceled'].includes(status);
      }
      return false;
    });
  }, [bookings, activeTab]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter(b => ['pending', 'confirmed', 'arrived'].includes(b.status?.toLowerCase())).length,
      completed: bookings.filter(b => b.status?.toLowerCase() === 'completed').length,
      canceled: bookings.filter(b => ['cancelled', 'no_show', 'canceled'].includes(b.status?.toLowerCase())).length,
    };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-surface pt-12 pb-40 px-12 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-20 space-y-6">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-7xl font-bold text-on-surface leading-tight tracking-tighter headline"
          >
            My <span className="text-primary italic">Reservations</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-on-surface-variant/60 font-medium max-w-2xl leading-relaxed"
          >
            {t('booking.history.subtitle')}
          </motion.p>
        </header>

        <div className="bg-white p-12 rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] space-y-12">
          <BookingFilter 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            counts={counts}
          />

          <div className="space-y-8 min-h-[600px]">
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-44 bg-surface rounded-[2.5rem]" />
                ))}
              </div>
            ) : paginatedBookings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-8">
                  {paginatedBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>

                <div className="pt-12 border-t border-outline/5">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <BookingEmptyState activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryPage;
