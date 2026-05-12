import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * @file firebase.js
 * @description Cấu hình Firebase SDK để phục vụ tính năng Social Login (Google).
 */

const firebaseConfig = { 
  apiKey: "AIzaSyDDWXtPxcBM0Y7yAGPkloV-Q-LiVVPyp5Y", 
  authDomain: "seatnow-43be0.firebaseapp.com", 
  projectId: "seatnow-43be0", 
  storageBucket: "seatnow-43be0.firebasestorage.app", 
  messagingSenderId: "582187890102", 
  appId: "1:582187890102:web:c6a27a9de6871ea4d8bd17", 
  measurementId: "G-8TQKN8XGGN" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Export Auth & Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Cấu hình ngôn ngữ Tiếng Việt cho popup/redirect
auth.languageCode = 'vi';

export default app;
