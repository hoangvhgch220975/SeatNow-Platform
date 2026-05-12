import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các tệp dịch thuật (Vietnamese comment)
import enTranslations from '../constants/locales/en.json';
import viTranslations from '../constants/locales/vi.json';

/**
 * @file i18n.js
 * @description Cấu hình đa ngôn ngữ toàn cục cho SeatNow.
 * @author SeatNow Executive UI Team
 */

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ trình duyệt (Vietnamese comment)
  .use(initReactI18next) // Kết nối với react-i18next (Vietnamese comment)
  .init({
    resources: {
      en: { translation: enTranslations },
      vi: { translation: viTranslations }
    },
    lng: 'en', // Thiết lập Tiếng Anh là ngôn ngữ mặc định (Vietnamese comment)
    fallbackLng: 'en', // Dự phòng Tiếng Anh nếu không tìm thấy chuỗi dịch (Vietnamese comment)
    debug: false, // Tắt debug ở môi trường sản phẩm (Vietnamese comment)

    interpolation: {
      escapeValue: false // React đã tự động bảo vệ chống XSS (Vietnamese comment)
    },

    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage'] // Lưu lựa chọn vào localStorage (Vietnamese comment)
    }
  });

export default i18n;
