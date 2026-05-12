import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminBookings, useAdminBookingStats } from '../hooks';
import BookingStats from '../components/BookingStats';
import BookingFilters from '../components/BookingFilters';
import BookingTable from '../components/BookingTable';

/**
 * @file AdminBookingsPage.jsx
 * @description Central booking management page for system administrators.
 */
const AdminBookingsPage = () => {
  const { t } = useTranslation();

  // State management for filters and pagination
  const [params, setParams] = useState({
    restaurantId: '',
    status: '',
    page: 1,
    limit: 5
  });

  // Data fetching
  const { data: bookingsData, isLoading: isBookingsLoading } = useAdminBookings(params);
  // Synchronize stats with active filters (restaurantId)
  const { data: statsData, isLoading: isStatsLoading } = useAdminBookingStats({ 
    restaurantId: params.restaurantId 
  });

  const handleFilterChange = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setParams(prev => ({ ...prev, page: newPage }));
  };

  const totalPages = bookingsData?.pagination ? Math.ceil(bookingsData.pagination.total / params.limit) : 0;

  return (
    <div className="space-y-8 p-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
          {t('admin.bookings.title')}
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          {t('admin.bookings.subtitle')}
        </p>
      </div>

      {/* Global Statistics Section */}
      <BookingStats 
        stats={statsData?.data} 
        loading={isStatsLoading} 
      />

      {/* Filters Section */}
      <BookingFilters 
        filters={params} 
        onFilterChange={handleFilterChange} 
      />

      {/* Main Content: Booking Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[600px]">
        <BookingTable 
          bookings={bookingsData?.data || []}
          loading={isBookingsLoading}
        />

        {/* Pagination Toolbar (Admin Prime Style) */}
        {!isBookingsLoading && bookingsData?.pagination?.total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              <span>{t('common.showing')}</span>
              <span className="text-slate-900 mx-1">{bookingsData?.data?.length || 0}</span>
              <span>{t('common.of')}</span>
              <span className="text-slate-900 mx-1">{bookingsData?.pagination?.total || 0}</span>
              <span>{t('admin.bookings.table.booking_plural')}</span>
            </div>

            {bookingsData.pagination.total > params.limit && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePageChange(params.page - 1)}
                  disabled={params.page <= 1}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        params.page === i + 1 
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                          : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handlePageChange(params.page + 1)}
                  disabled={params.page >= totalPages}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-all disabled:opacity-30 active:scale-95 shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsPage;
