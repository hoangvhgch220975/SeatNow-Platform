import { useState, useEffect } from 'react';

/**
 * Tự động hỏi và đọc tọa độ GPS bằng trình duyệt API.
 * Ứng dụng để Search: Nhà hàng Gần tôi (Near Me)
 */
export const useUserLocation = () => {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Your browser does not support Geolocation.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || 'Geolocation permission denied or network error.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return { location, error, isLoading };
};
