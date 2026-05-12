import { BOOKING_STATUS } from '../../constants/bookingStatus.js';

/**
 * Trả về các Tailwind class css để tạo badge màu cho thẻ status
 * (màu chữ, màu viền hoặc màu bg)
 */
export const getStatusColor = (status) => {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
    case BOOKING_STATUS.CONFIRMED:
      return 'text-blue-700 bg-blue-100 border border-blue-200';
    case BOOKING_STATUS.ARRIVED:
      return 'text-purple-700 bg-purple-100 border border-purple-200';
    case BOOKING_STATUS.COMPLETED:
      return 'text-green-700 bg-green-100 border border-green-200';
    case BOOKING_STATUS.CANCELLED:
    case BOOKING_STATUS.NO_SHOW:
      return 'text-red-700 bg-red-100 border border-red-200';
      
    // Có thể bổ sung Table Status, Restaurant Status
    case 'active':
      return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
    case 'suspended':
    case 'maintenance':
      return 'text-red-700 bg-red-100 border border-red-200';
    case 'available':
      return 'text-teal-700 bg-teal-100 border border-teal-200';
      
    default:
      return 'text-zinc-600 bg-zinc-100 border border-zinc-200';
  }
};
