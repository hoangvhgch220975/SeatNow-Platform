import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useMyBookingsQuery } from '../../booking/hooks.js';
import { useRestaurant } from '../../restaurants/hooks.js';
import { formatDate, formatTime } from '../../../shared/utils/formatDateTime.js';
import BookingStatusBadge from '../../booking/components/BookingStatusBadge.jsx';

/**
 * @file RecentOrders.jsx
 * @description Hiển thị danh sách các đơn đặt bàn gần nhất cao cấp.
 */
const RecentOrders = () => {
  const { t } = useTranslation();
  const { data: bookings, isLoading } = useMyBookingsQuery();
  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-12 lg:p-14 rounded-[3.5rem] border border-outline/5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] flex flex-col h-full hover:shadow-[0_40px_80px_-15px_rgba(var(--primary-rgb),0.1)] transition-all duration-700"
    >
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-black text-on-surface headline tracking-tight">
          {t('profile.recent_orders.title')}
        </h2>
        <Link 
          to="/my-bookings" 
          className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-primary/70 transition-colors bg-primary/5 px-4 py-2 rounded-full border border-primary/10 hover:bg-primary/10"
        >
          {t('profile.recent_orders.view_history')}
        </Link>
      </div>
      
      <div className="space-y-6 flex-grow">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-28 bg-surface rounded-[2.5rem] animate-pulse" />
          ))
        ) : recentBookings.length > 0 ? (
          recentBookings.map((b, idx) => (
            <ActivityItem 
              key={b.id}
              booking={b}
              status={b.status} 
              index={idx}
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-24 space-y-8">
            <div className="w-24 h-24 bg-surface rounded-[2.5rem] flex items-center justify-center shadow-inner ring-4 ring-white">
               <span className="material-symbols-outlined text-5xl text-on-surface-variant/20">history_toggle_off</span>
            </div>
            <p className="text-[11px] font-black text-on-surface-variant/30 uppercase tracking-[0.3em]">
              {t('profile.recent_orders.empty_message')}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ActivityItem = ({ booking, status, index }) => {
  const { t } = useTranslation();
  const b = booking;
  const initialName = b.restaurant?.name || b.restaurantName || b.RestaurantName;
  const restaurantId = b.restaurantId || b.idRestaurant;
  const { data: restaurant, isLoading: isResLoading } = useRestaurant(!initialName ? restaurantId : null);

  const displayName = initialName || restaurant?.name || (isResLoading ? '...' : `Booking #${b.bookingCode || b.id.slice(0, 8)}`);
  const restaurantImages = b.restaurant?.images || restaurant?.images || [];
  const displayImg = restaurantImages[0] || b.restaurant?.image || restaurant?.image || `https://api.dicebear.com/9.x/shapes/svg?seed=${b.id || b.restaurantId}`;

  const formattedDate = formatDate(b.bookingDate || b.date);
  const formattedTime = formatTime(b.bookingTime || b.time);
  const subtitle = `${b.numGuests || 0} ${t('profile.recent_orders.guests_label')} • ${formattedDate} • ${formattedTime}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="bg-surface/30 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-surface transition-all duration-500 border border-transparent hover:border-outline/5 hover:shadow-sm group cursor-pointer"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white overflow-hidden shadow-sm group-hover:scale-105 group-hover:rotate-3 transition-transform duration-700 border border-outline/5">
          <img alt={displayName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={displayImg} />
        </div>
        <div className="space-y-1">
          <h4 className="font-black text-on-surface tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">{displayName}</h4>
          <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col items-end scale-90 group-hover:scale-100 transition-transform duration-500">
        <BookingStatusBadge status={status} />
      </div>
    </motion.div>
  );
};

export default RecentOrders;
