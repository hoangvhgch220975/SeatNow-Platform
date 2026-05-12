import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Check, X, Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Fix cho biểu tượng marker của Leaflet trong React (Vietnamese comment)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * @component MapLocationPicker
 * @description Trình chọn vị trí trên bản đồ sử dụng Leaflet và OpenStreetMap (Nominatim).
 * Chấp nhận setAddress và setCoordinates (lat, lng).
 */
const MapLocationPicker = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialLocation = { lat: 21.0285, lng: 105.8542 } 
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  // Tọa độ mặc định: Hà Nội (Vietnamese comment)
  const DEFAULT_CENTER = [initialLocation.lat, initialLocation.lng];

  // Đồng bộ vị trí bản đồ khi người dùng click (Vietnamese comment)
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        reverseGeocode(lat, lng);
      },
    });

    return position ? <Marker position={[position.lat, position.lng]} /> : null;
  };

  // Cập nhật view của bản đồ (Vietnamese comment)
  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  // Hàm tìm kiếm địa chỉ qua Nominatim (Vietnamese comment)
  const searchAddress = async (q) => {
    if (!q || q.length < 3) return;
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Hàm lấy địa chỉ từ tọa độ (Vietnamese comment)
  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      if (data.display_name) {
        setSelectedAddress(data.display_name);
      }
    } catch (error) {
      console.error('Reverse Geocode error:', error);
    }
  };

  const handleSelectResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition({ lat, lng });
    setSelectedAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header (Vietnamese comment) */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-surface-container-low">
          <div>
            <h3 className="text-xl font-bold text-on-surface">
              {t('owner_portal.create_restaurant.map.title')}
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              {t('owner_portal.create_restaurant.map.instructions')}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search & Map Body (Vietnamese comment) */}
        <div className="relative flex-1 flex flex-col">
          {/* Search Bar (Vietnamese comment) */}
          <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder={t('owner_portal.create_restaurant.map.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAddress(searchQuery)}
                  className="w-full h-12 pl-10 pr-4 bg-white border border-outline-variant rounded-2xl shadow-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-sm"
                />
              </div>
              <button 
                onClick={() => searchAddress(searchQuery)}
                className="px-6 h-12 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2 font-bold"
              >
                {isSearching ? '...' : <Navigation size={18} />}
              </button>
            </div>

            {/* Search Results Dropdown (Vietnamese comment) */}
            {searchResults.length > 0 && (
              <div className="bg-white border border-outline-variant rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-4 py-3 text-left hover:bg-surface-container-low flex items-start gap-3 transition-colors border-b last:border-0 border-outline-variant/30"
                  >
                    <MapPin className="text-primary mt-0.5 shrink-0" size={16} />
                    <span className="text-sm text-on-surface-variant line-clamp-2">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Instance (Vietnamese comment) */}
          <div className="flex-1 z-0 relative">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker />
              <ChangeView center={[position.lat, position.lng]} />
            </MapContainer>
            
            {/* Custom Location Card (Vietnamese comment) */}
            {selectedAddress && (
              <div className="absolute bottom-6 left-4 right-4 z-[1000] p-4 bg-white/90 backdrop-blur-md border border-primary/20 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest mb-1">Current Sync Target</p>
                    <p className="text-xs font-bold text-on-surface-variant line-clamp-2 mb-1">{selectedAddress}</p>
                    <p className="text-[10px] text-on-surface-variant/60 font-medium">Coordinates: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer (Vietnamese comment) */}
        <div className="px-6 py-4 border-t bg-surface-container-low flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-on-surface-variant font-bold text-sm hover:bg-black/5 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(position, selectedAddress)}
            disabled={!position}
            className="px-8 py-2.5 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
          >
            <Check size={18} />
            {t('owner_portal.create_restaurant.map.confirm_selection')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
