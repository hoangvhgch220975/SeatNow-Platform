import { useMutation } from '@tanstack/react-query';
import { lookupGuestBooking } from './api';

export const useGuestBookingLookup = () => {
  return useMutation({
    mutationFn: lookupGuestBooking,
  });
};
