import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../../../config/routes.js';
import { useRestaurant, useRestaurantTables } from '../../restaurants/hooks.js';
import { useRestaurantAvailability, useCreateBooking, useCancelBooking, useCancelBookingByGuest, useModifyBooking } from '../hooks.js';
import { useAuthStore } from '../../auth/store.js';
import LoadingSpinner from '../../../shared/ui/LoadingSpinner';
import ErrorState from '../../../shared/feedback/ErrorState';
import toast from 'react-hot-toast';

import { useQueryClient } from '@tanstack/react-query';
import { bookingSocket, connectBookingSocket, disconnectSockets } from '../../../lib/socket.js';

import FloorFilter from '../components/FloorFilter';
import TimeSlotPicker from '../components/TimeSlotPicker';
import TableSelector from '../components/TableSelector';
import BookingSummary from '../components/BookingSummary';
import BookingHeader from '../components/BookingHeader';

import PaymentModal from '../../payment/components/PaymentModal';
import ConfirmDialog from '../../../shared/ui/ConfirmDialog';
import { calculateDepositAmount } from '../components/DepositSummary';

/**
 * @file CreateBookingPage.jsx
 * @description Trang đặt bàn với giao diện cao cấp và hiệu ứng chuyển động mượt mà.
 */
const CreateBookingPage = () => {
  const { t } = useTranslation();
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, token } = useAuthStore();

  const { data: restaurantData, isLoading: isLoadingRest, isError: isErrorRest } = useRestaurant(idOrSlug);
  const restaurant = restaurantData?.data || restaurantData;
  const restaurantId = restaurant?.id;

  const { data: tablesData, isLoading: isLoadingTables, isError: isErrorTables } = useRestaurantTables(restaurantId);

  const location = useLocation();
  const modifyState = location.state?.modifyBookingItem;
  const isModifying = !!modifyState;
  const oldBookingId = modifyState?.id;
  const modifyBookingMutation = useModifyBooking();
  const [isReplacingLoading, setIsReplacingLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    let raw = modifyState?.reservation?.rawDate;
    if (!raw) {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
    return raw.includes('T') ? raw.split('T')[0] : raw;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(() => {
    let raw = modifyState?.reservation?.rawTime;
    if (!raw) return null;
    if (raw.includes('T')) {
      const timePart = raw.split('T')[1];
      return timePart ? timePart.substring(0, 5) : null;
    }
    return raw.substring(0, 5);
  });
  const [activeFloor, setActiveFloor] = useState(null); 
  const [selectedTable, setSelectedTable] = useState(() => {
    if (modifyState?.reservation?.tableId) {
       return { 
         id: modifyState.reservation.tableId, 
         ...(modifyState.reservation.tableInfo || {}) 
       };
    }
    return null;
  });
  const [partySize, setPartySize] = useState(modifyState?.reservation?.partySize || 2);
  const [specialRequests, setSpecialRequests] = useState(
    modifyState?.notes && modifyState.notes !== "No special requests provided." ? modifyState.notes : ''
  );
  
  const [guestInfo, setGuestInfo] = useState({
    guestName: modifyState?.guest?.fullName !== "Verified Member" ? (modifyState?.guest?.fullName || '') : '',
    guestEmail: modifyState?.guest?.email !== "Email in profile" ? (modifyState?.guest?.email || '') : '',
    guestPhone: modifyState?.guest?.phone !== "Phone in profile" ? (modifyState?.guest?.phone || '') : ''
  });

  const [realtimeStatuses, setRealtimeStatuses] = useState({});

  const deterministicTables = useMemo(() => {
    const raw = tablesData?.data || tablesData;
    if (!raw) return [];
    
    let baseTables = [];
    if (Array.isArray(raw)) {
      baseTables = raw;
    } else if (Array.isArray(raw.items)) {
      baseTables = raw.items;
    }
    
    return baseTables;
  }, [tablesData]);

  const AVAILABLE_AREAS = useMemo(() => [
    { id: '1st Floor', label: t('workspace.floor_plan.floors.1st') },
    { id: '2nd Floor', label: t('workspace.floor_plan.floors.2nd') },
    { id: '3rd Floor', label: t('workspace.floor_plan.floors.3rd') },
    { id: '4th Floor', label: t('workspace.floor_plan.floors.4th') },
    { id: '5th Floor', label: t('workspace.floor_plan.floors.5th') },
    { id: 'Rooftop', label: t('workspace.floor_plan.floors.rooftop') },
    { id: 'Terrace', label: t('workspace.floor_plan.floors.terrace') },
    { id: 'Outdoor', label: t('workspace.floor_plan.floors.outdoor') }
  ], [t]);

  const getAreaCategory = (areaId) => {
    if (!areaId) return 'FLOOR';
    const id = areaId.toLowerCase();
    if (id.includes('floor')) return 'FLOOR';
    if (id.includes('rooftop')) return 'ROOFTOP';
    if (id.includes('terrace')) return 'TERRACE';
    if (id.includes('outdoor')) return 'OUTDOOR';
    return 'FLOOR';
  };

  const availabilityParams = useMemo(() => ({
    date: selectedDate,
    time: selectedTimeSlot,
    guests: partySize
  }), [selectedDate, selectedTimeSlot, partySize]);

  const { data: availabilityData, isFetching: isFetchingAvailability } = useRestaurantAvailability(restaurantId, availabilityParams);

  const availableTables = useMemo(() => {
    const raw = availabilityData?.data || availabilityData;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    return [];
  }, [availabilityData]);

  const floors = AVAILABLE_AREAS;

  React.useEffect(() => {
    if (!activeFloor && floors.length > 0) {
      setActiveFloor(floors[0].id);
    }
  }, [floors, activeFloor]);

  const displayTables = useMemo(() => {
    const floorTables = deterministicTables.filter(t => (t.location || '1st Floor') === activeFloor);
    
    const normalizeDate = (d) => d?.toString().substring(0, 10);
    const normalizeTime = (t) => t?.toString().substring(0, 5);

    return floorTables.map(t => {
      const tableId = String(t.id).toLowerCase();
      const isFake = tableId.includes('fake');
      
      const compositeKey = `${normalizeDate(selectedDate)}_${normalizeTime(selectedTimeSlot)}_${tableId}`;
      const realtimeStatus = realtimeStatuses[compositeKey];
      
      const hasLoadedAvailability = !!availabilityData;
      const isAvailableByBE = (isFake || !selectedDate || !selectedTimeSlot || !hasLoadedAvailability) 
        ? true 
        : availableTables.some(at => String(at.id).toLowerCase() === tableId || String(at.tableNumber).toLowerCase() === String(t.tableNumber).toLowerCase());
      
      const isCurrentlySelected = selectedTable?.id === t.id;
      let finalStatus = t.status; 

      if (!isCurrentlySelected) {
        if (isAvailableByBE) {
          if (realtimeStatus === 'held') {
            finalStatus = 'held';
          } else {
            finalStatus = 'available';
          }
        } 
        else {
          finalStatus = realtimeStatus === 'held' ? 'held' : 'occupied';
        }
      } else {
        finalStatus = 'available';
      }
      
      return {
        ...t,
        category: getAreaCategory(activeFloor),
        status: finalStatus
      };
    });
  }, [deterministicTables, activeFloor, availableTables, availabilityData, realtimeStatuses, selectedTable, selectedDate, selectedTimeSlot]);

  const createBookingMutation = useCreateBooking();
  const cancelBookingMutation = useCancelBooking();
  const cancelBookingGuestMutation = useCancelBookingByGuest();

  React.useEffect(() => {
    if (!restaurantId) return;

    connectBookingSocket(token);
    
    const onConnect = () => {
        bookingSocket.emit('joinRestaurant', restaurantId);
    };

    if (bookingSocket.connected) onConnect();
    bookingSocket.on('connect', onConnect);

    const handleTableStatusChanged = (payload) => {
      const normalizeDate = (d) => d?.toString().substring(0, 10);
      const normalizeTime = (t) => t?.toString().substring(0, 5);
      
      const tableId = String(payload.tableId).toLowerCase();
      const storageKey = `${normalizeDate(payload.bookingDate)}_${normalizeTime(payload.bookingTime)}_${tableId}`;
      
      setRealtimeStatuses(prev => ({
        ...prev,
        [storageKey]: payload.status
      }));
    };

    const handleAvailabilityChange = (payload) => {
        queryClient.invalidateQueries(['booking-restaurants', 'availability', restaurantId]);
    };

    const handlePaymentSuccessSocket = (payload) => {
      if (payload.status === 'paid' || payload.status === 'success') {
        const incomingId = payload.bookingId || payload.id;
        
        if (incomingId === pendingBookingId || !pendingBookingId) {
          setShowPaymentModal(false);
          handleBookingSuccess(incomingId);
        }
      }
    };

    bookingSocket.on('tableStatusChanged', handleTableStatusChanged);
    bookingSocket.on('availabilityChanged', handleAvailabilityChange);
    bookingSocket.on('payment_success', handlePaymentSuccessSocket);

    return () => {
      bookingSocket.off('connect', onConnect);
      bookingSocket.off('tableStatusChanged', handleTableStatusChanged);
      bookingSocket.off('availabilityChanged', handleAvailabilityChange);
      bookingSocket.off('payment_success', handlePaymentSuccessSocket);
      bookingSocket.emit('leaveRestaurant', restaurantId);
      disconnectSockets(); 
    };
  }, [token, restaurantId, queryClient]);

  React.useEffect(() => {
    setRealtimeStatuses({});
  }, [selectedDate, selectedTimeSlot]);

  React.useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedTable && lastHoldInfo.current.tableId) {
        bookingSocket.emit('releaseHold', {
          restaurantId,
          tableId: lastHoldInfo.current.tableId,
          bookingDate: lastHoldInfo.current.date,
          bookingTime: lastHoldInfo.current.time
        });
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [selectedTable, restaurantId]);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelPaymentDialog, setShowCancelPaymentDialog] = useState(false);
  const [pendingBookingId, setPendingBookingId] = useState(null);
  const [pendingDepositAmount, setPendingDepositAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const lastHoldInfo = React.useRef({ date: null, time: null, tableId: null });

  const handleSelectTable = async (table) => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error(t('booking.create.toast.select_date_time'));
      return;
    }

    if (isProcessing) return;

    const currentTableId = String(table.id).toLowerCase();
    const selectedId = selectedTable?.id ? String(selectedTable.id).toLowerCase() : null;

    if (selectedId !== currentTableId) {
        setIsProcessing(true);
        try {
            if (selectedTable && lastHoldInfo.current.tableId) {
                const oldId = String(lastHoldInfo.current.tableId).toLowerCase();
                await new Promise((resolve) => {
                    bookingSocket.emit('releaseHold', {
                      restaurantId,
                      tableId: lastHoldInfo.current.tableId,
                      bookingDate: lastHoldInfo.current.date,
                      bookingTime: lastHoldInfo.current.time
                    }, (res) => {
                        resolve(res);
                    });
                });
                setRealtimeStatuses(prev => ({ ...prev, [oldId]: 'available' }));
            }

            const payload = {
              restaurantId,
              tableId: table.id,
              bookingDate: selectedDate,
              bookingTime: selectedTimeSlot
            };

            const response = await new Promise((resolve) => {
              bookingSocket.emit('holdTable', payload, (res) => {
                resolve(res);
              });
            });

            if (response?.success) {
                setSelectedTable(table);
                lastHoldInfo.current = { date: selectedDate, time: selectedTimeSlot, tableId: table.id };
                setRealtimeStatuses(prev => ({ ...prev, [currentTableId]: 'held' }));
                toast.success(t('booking.create.toast.table_held', { number: table.tableNumber }));
            } else {
                toast.error(response?.error || t('booking.create.toast.table_busy'));
            }
        } catch (error) {
            console.error('❌ [Socket Error]:', error);
        } finally {
            setIsProcessing(false);
        }
    } else {
        setIsProcessing(true);
        bookingSocket.emit('releaseHold', {
          restaurantId,
          tableId: table.id,
          bookingDate: lastHoldInfo.current.date,
          bookingTime: lastHoldInfo.current.time
        }, (res) => {
          setSelectedTable(null);
          setRealtimeStatuses(prev => ({ ...prev, [currentTableId]: 'available' }));
          lastHoldInfo.current = { date: null, time: null, tableId: null };
          setIsProcessing(false);
        });
    }
  };

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo(prev => ({ ...prev, [field]: value }));
  };

  const hasRedirectedRef = React.useRef(false);

  const handleBookingSuccess = (bookingId) => {
    if (hasRedirectedRef.current) return; 
    hasRedirectedRef.current = true;

    setIsProcessing(true);
    toast.success(t('booking.create.toast.redirecting'));
    
    lastHoldInfo.current = { date: null, time: null, tableId: null };
    
    setTimeout(() => {
      setIsProcessing(false);
      
      if (isAuthenticated) {
        navigate(ROUTES.BOOKING_DETAIL(bookingId));
      } else {
        navigate(ROUTES.HOME);
      }
    }, 2000);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTable || !selectedTimeSlot) {
      toast.error(t('booking.create.toast.select_date_time'));
      return;
    }

    const realRestaurantId = restaurant?._id || restaurant?.id || restaurant?.Id;

    try {
      setIsProcessing(true);
      
      if (isModifying && oldBookingId) {
        setIsReplacingLoading(true);
        
        const phoneToVerify = guestInfo.guestPhone || modifyState?.guest?.phone;
        if (!isAuthenticated && !phoneToVerify) {
           toast.error(t('booking.create.toast.identity_required'));
           setIsProcessing(false);
           setIsReplacingLoading(false);
           return;
        }

        const modifyPayload = {
          id: oldBookingId,
          bookingDate: selectedDate,
          bookingTime: selectedTimeSlot,
          numGuests: partySize,
          tableId: selectedTable?.id,
          specialRequests: specialRequests,
          guestName: !isAuthenticated ? (guestInfo.guestName || modifyState?.guest?.fullName) : undefined,
          guestPhone: guestInfo.guestPhone || modifyState?.guest?.phone || modifyState?.reservation?.guestPhone,
          guestEmail: !isAuthenticated ? (guestInfo.guestEmail || modifyState?.guest?.email) : undefined
        };

        const modifyResult = await modifyBookingMutation.mutateAsync(modifyPayload);
        setIsReplacingLoading(false);
        
        const newBookingId = modifyResult?.booking?.id || modifyResult?.id || oldBookingId;
        handleBookingSuccess(newBookingId);
        return;
      }

      if (!isAuthenticated && (!guestInfo.guestName || !guestInfo.guestPhone)) {
        toast.error(t('booking.create.toast.guest_info_required'));
        setIsProcessing(false);
        return;
      }

      const payload = {
        restaurantId: realRestaurantId,
        tableId: selectedTable.id,
        bookingDate: selectedDate,
        bookingTime: selectedTimeSlot,
        numGuests: partySize,
        specialRequests: specialRequests,
        guestName: !isAuthenticated ? guestInfo.guestName : undefined,
        guestPhone: !isAuthenticated ? guestInfo.guestPhone : undefined,
        guestEmail: !isAuthenticated ? guestInfo.guestEmail : undefined
      };

      const result = await createBookingMutation.mutateAsync(payload);
      
      const rawData = result?.data || result;
      const bookingId = rawData?.booking?.id || rawData?.booking?._id || rawData?.id || result?.booking?.id || (typeof result === 'string' ? result : null);

      if (!bookingId) {
        console.error('⚠️ [API Response Debug]:', result);
        throw new Error(t('booking.create.toast.id_retrieve_error'));
      }
      
      setPendingBookingId(bookingId);

      const isDepositNeeded = rawData?.depositRequired || result?.depositRequired || false;
      const amountToPay = rawData?.depositAmount || result?.depositAmount || 0;
      
      if (isDepositNeeded && amountToPay > 0) {
        setPendingDepositAmount(amountToPay);
        setIsProcessing(false);
        setShowPaymentModal(true);
      } else {
        setIsProcessing(false);
        handleBookingSuccess(bookingId);
      }
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message;
      setIsProcessing(false);
      setIsReplacingLoading(false);
      toast.error(serverMessage || 'Failed to complete reservation flow.');
    }
  };

  const handleCancelPayment = async () => {
    try {
      setIsProcessing(true);
      if (isAuthenticated) {
        await cancelBookingMutation.mutateAsync({ id: pendingBookingId, cancellationReason: 'User abandoned payment' });
      } else {
        await cancelBookingGuestMutation.mutateAsync({ 
          id: pendingBookingId, 
          guestPhone: guestInfo.guestPhone, 
          cancellationReason: 'Guest abandoned payment' 
        });
      }
      setShowPaymentModal(false);
      setShowCancelPaymentDialog(false);
      setPendingBookingId(null);
      setSelectedTable(null);
      toast.success(t('booking.create.payment_cancelled', 'Payment cancelled. Table released.'));
    } catch (e) {
      toast.error(t('booking.create.payment_cancel_error', 'Failed to cancel the booking. Please try again or contact support.'));
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    const paymentChannel = new BroadcastChannel('seatnow_payment');
    const handlePaymentMessage = (event) => {
      if (event.data?.type === 'PAYMENT_SUCCESS' || event.data?.status === 'SUCCESS') {
        processSuccess(event.data?.bookingId || event.data?.id);
      }
    };

    const processSuccess = (bookingId) => {
      if (hasRedirectedRef.current) return;
      
      setIsProcessing(false);
      const finalId = bookingId || pendingBookingId;
      if (finalId) {
        handleBookingSuccess(finalId);
      } else {
        navigate(ROUTES.HOME);
      }
    };

    paymentChannel.onmessage = (event) => {
      if (event.data?.status === 'SUCCESS') {
        processSuccess(event.data?.bookingId);
      }
    };
    
    window.addEventListener('message', handlePaymentMessage);
    
    return () => {
      window.removeEventListener('message', handlePaymentMessage);
      paymentChannel.close();
    };
  }, [pendingBookingId, navigate]); 

  if (isReplacingLoading) return (
    <LoadingSpinner message={t('booking.create.loading_modifying')} />
  );

  if (isLoadingRest || isLoadingTables) return (
    <LoadingSpinner message={t('booking.create.loading_rest')} />
  );
  if (isErrorRest || isErrorTables || !restaurant) return <ErrorState message={t('booking.create.error_not_found')} />;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-surface -mt-5 pb-10">
      <BookingHeader restaurant={restaurant} isModifying={isModifying} />

      <main className="max-w-7xl mx-auto px-12 mt-16">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="flex-1 space-y-12">
            
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              className="space-y-8 bg-white p-12 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] border border-outline/5"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl font-bold">event_available</span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight headline">{t('booking.create.select_date_time')}</h2>
               </div>
               <TimeSlotPicker 
                 selectedDate={selectedDate} 
                 onSelectDate={setSelectedDate}
                 selectedTimeSlot={selectedTimeSlot}
                 onSelectSlot={setSelectedTimeSlot}
                 openingHours={restaurant.openingHours}
               />
            </motion.section>

            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              transition={{ delay: 0.1 }}
              className="space-y-8 bg-white p-12 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] border border-outline/5"
            >
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-2xl font-bold">table_view</span>
                      </div>
                      <h2 className="text-2xl font-bold text-on-surface tracking-tight headline">{t('booking.create.experience_way')}</h2>
                   </div>
                   
                   <FloorFilter 
                    floors={floors} 
                    activeFloor={activeFloor} 
                    onSelectFloor={(f) => {
                        setActiveFloor(f);
                        setSelectedTable(null);
                    }} 
                   />
                </div>

                <TableSelector 
                  tables={displayTables}
                  selectedTableId={selectedTable?.id}
                  onSelectTable={handleSelectTable}
                />
                
                <AnimatePresence>
                  {isFetchingAvailability && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-center pt-6"
                    >
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/60 bg-primary/5 px-6 py-2 rounded-full border border-primary/10">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                        {t('booking.create.syncing_availability')}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
            </motion.section>

            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={sectionVariants}
              transition={{ delay: 0.2 }}
              className="space-y-8 bg-white p-12 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] border border-outline/5"
            >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl font-bold">edit_note</span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight headline">{t('booking.create.special_requests')}</h2>
                </div>
                <div className="relative group w-full">
                  <span className="material-symbols-outlined absolute left-6 top-8 text-on-surface-variant/30 group-focus-within:text-primary transition-colors text-xl">draw</span>
                  <textarea 
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full bg-white border border-outline/10 hover:border-primary/30 focus:border-primary rounded-[1.5rem] pl-16 pr-8 py-8 focus:ring-4 focus:ring-primary/5 shadow-sm hover:shadow-md transition-all duration-300 text-on-surface font-bold placeholder:text-on-surface-variant/40 placeholder:font-medium min-h-[160px] resize-none text-[13px] outline-none" 
                    placeholder={t('booking.create.special_requests_placeholder')} 
                  />
                </div>
            </motion.section>
          </div>

          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:w-[460px] sticky top-12"
          >
            <BookingSummary 
              restaurant={restaurant}
              selectedDate={selectedDate}
              selectedTimeSlot={selectedTimeSlot}
              partySize={partySize}
              onUpdatePartySize={setPartySize}
              selectedTable={selectedTable}
              onConfirm={handleConfirmBooking}
              isProcessing={isProcessing}
              onCancel={() => navigate(ROUTES.RESTAURANT_DETAIL(idOrSlug))}
              isAuthenticated={isAuthenticated}
              guestInfo={guestInfo}
              onGuestInfoChange={handleGuestInfoChange}
              isModifying={isModifying}
            />
          </motion.aside>
        </div>
      </main>

      {showPaymentModal && pendingBookingId && (
        <PaymentModal 
          bookingId={pendingBookingId}
          amount={pendingDepositAmount}
          onSuccess={() => {
            setShowPaymentModal(false);
            handleBookingSuccess(pendingBookingId);
          }}
          onClose={() => setShowCancelPaymentDialog(true)}
        />
      )}

      <ConfirmDialog
        isOpen={showCancelPaymentDialog}
        onClose={() => setShowCancelPaymentDialog(false)}
        onConfirm={handleCancelPayment}
        title={t('booking.create.confirm_cancel_payment_title', 'Cancel Payment?')}
        message={t('booking.create.confirm_cancel_payment', 'Are you sure you want to cancel the payment? Your booking will be cancelled and the table will be released.')}
        confirmText={t('common.confirm_cancel', 'Yes, Cancel')}
        cancelText={t('common.keep_payment', 'No, Keep Payment')}
        type="danger"
        isLoading={isProcessing}
      />
    </div>
  );
};

export default CreateBookingPage;
