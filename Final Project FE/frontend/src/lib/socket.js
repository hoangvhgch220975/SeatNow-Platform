import { io } from 'socket.io-client';

/**
 * @file socket.js
 * @description Quản lý kết nối Socket.IO tập trung qua Gateway (Port 7000).
 */

const SOCKET_URL = 'http://localhost:7000';

// 1. Booking Socket (Mặc định path /socket.io/)
export const bookingSocket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket'], // Force WebSocket transport
});

// 2. Notification Socket (Path riêng /notification.io/)
// Khởi tạo rỗng, sẽ được kết nối thủ công qua connectNotificationSocket
export let notificationSocket = null;

/**
 * Helper hỗ trợ kết nối Sockets với Token xác thực cho Booking
 * @param {string} token - JWT Access Token
 */
export const connectBookingSocket = (token) => {
  bookingSocket.auth = token ? { token } : {};
  if (!bookingSocket.connected) bookingSocket.connect();
};

/**
 * Kết nối Notification Socket với Query Params (yêu cầu từ BE)
 * @param {string} userId - UUID của người dùng
 * @param {string} role - Role của người dùng (RESTAURANT_OWNER)
 * @param {string} token - JWT Access Token
 */
export const connectNotificationSocket = (userId, role, token) => {
  // 1. Kiểm tra session stale: Nếu socket cũ khác userId thì phải ngắt kết nối
  if (notificationSocket) {
    const oldUserId = notificationSocket.io.opts.query?.userId;
    if (oldUserId && oldUserId !== userId) {
      notificationSocket.disconnect();
      notificationSocket = null;
    }
  }

  if (notificationSocket?.connected) return notificationSocket;

  notificationSocket = io(SOCKET_URL, {
    path: '/notification.io',
    query: { userId, role },
    auth: token ? { token } : {},
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket'], // Force WebSocket transport
  });

  // [DISCOVERY] Nghe mọi event để bắt đúng tên event từ BE
  notificationSocket.onAny((eventName, ...args) => {
    // Hidden debug: console.log(`📡 [ANY EVENT RECEIVED]: ${eventName}`, args);
  });

  notificationSocket.on('connect', () => {
    // Hidden debug: console.log('✅ [Notification Socket] Connected for user:', userId);
  });

  notificationSocket.on('connect_error', (err) => {
    // Hidden debug: console.error('❌ [Notification Socket] Connection error:', err.message);
  });

  notificationSocket.on('disconnect', (reason) => {
    if (reason === 'io server disconnect') {
      notificationSocket.connect();
    }
  });

  return notificationSocket;
};

/**
 * Helper ngắt kết nối toàn bộ Sockets
 */
export const disconnectSockets = () => {
  if (bookingSocket.connected) {
    bookingSocket.disconnect();
  }
  
  if (notificationSocket) {
    notificationSocket.disconnect();
    notificationSocket.removeAllListeners(); // Xóa sạch listener cũ
    notificationSocket = null; // Xóa reference để connect mới hoàn toàn
  }
};
