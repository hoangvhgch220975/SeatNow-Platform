import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { partnerAdminApi } from '../../partners/api.js';
import { Search, User, Mail, Phone, Check, ChevronDown, Loader2 } from 'lucide-react';

/**
 * @file OwnerPicker.jsx
 * @description Component chọn nhanh Chủ sở hữu (Owner) cho Admin khi tạo nhà hàng.
 * Hỗ trợ tìm kiếm real-time theo Tên, Email hoặc SĐT.
 */
const OwnerPicker = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const dropdownRef = useRef(null);

  // Khởi tạo owner đã chọn nếu có value (id)
  useEffect(() => {
    if (value && !selectedOwner) {
      // Nếu có ID nhưng chưa có object owner, ta lẩy dữ liệu từ danh sách hiện có hoặc để đơn giản ta fetch lại
      // Trong ngữ cảnh tạo mới, thường value sẽ bắt đầu là null
    }
  }, [value]);

  // Tìm kiếm owner khi thay đổi keyword
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isOpen) {
        fetchOwners(search);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, isOpen]);

  const fetchOwners = async (keyword) => {
    setIsLoading(true);
    try {
      const response = await partnerAdminApi.getOwners({ keyword, limit: 10 });
      setOwners(response.data || []);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (owner) => {
    setSelectedOwner(owner);
    onChange(owner.id);
    setIsOpen(false);
    setSearch('');
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-black text-slate-700 mb-2 ml-1 uppercase tracking-wider">
        {t('admin.restaurants.edit_form.owner_selection')} <span className="text-rose-500">*</span>
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-50 border rounded-2xl transition-all duration-300 ${
          error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200 hover:border-violet-300 hover:bg-white'
        } ${isOpen ? 'ring-4 ring-violet-500/10 border-violet-400 bg-white' : ''}`}
      >
        <div className="flex items-center gap-3 overflow-hidden text-left">
          {selectedOwner ? (
            <>
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-white">
                {selectedOwner.avatar ? (
                  <img src={selectedOwner.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-violet-600" />
                )}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {selectedOwner.fullName}
                </span>
                <span className="text-[10px] text-slate-500 truncate lowercase font-medium">
                  {selectedOwner.email} • {selectedOwner.phone}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-slate-400">
              <User className="w-5 h-5 opacity-50" />
              <span className="text-sm font-medium">{t('admin.restaurants.edit_form.choose_owner_placeholder')}</span>
            </div>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-500' : ''}`} />
      </button>

      {/* Error Message */}
      {error && <p className="mt-2 text-xs font-bold text-rose-500 ml-1">{error}</p>}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Search Input */}
          <div className="p-3 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder={t('admin.restaurants.edit_form.search_owner_placeholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 font-medium placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Results List */}
          <div className="max-h-64 overflow-y-auto custom-scrollbar p-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2 text-violet-500" />
                <span className="text-xs font-bold uppercase tracking-widest">{t('common.loading')}</span>
              </div>
            ) : owners.length > 0 ? (
              <div className="space-y-1">
                {owners.map((owner) => (
                  <button
                    key={owner.id}
                    type="button"
                    onClick={() => handleSelect(owner)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all group ${
                      selectedOwner?.id === owner.id ? 'bg-violet-50 text-violet-700' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {owner.avatar ? (
                        <img src={owner.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                      <span className="text-sm font-bold truncate w-full flex items-center gap-2">
                        {owner.fullName}
                        {selectedOwner?.id === owner.id && <Check className="w-3 h-3 text-violet-600 font-black" />}
                      </span>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Mail className="w-2.5 h-2.5" /> {owner.email}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                          <Phone className="w-2.5 h-2.5" /> {owner.phone}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-20">person_off</span>
                <p className="text-xs font-bold uppercase tracking-widest">{t('admin.restaurants.edit_form.no_owner_found')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPicker;
