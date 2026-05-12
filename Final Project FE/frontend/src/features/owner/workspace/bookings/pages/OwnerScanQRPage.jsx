import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Camera, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  History, 
  ChevronLeft,
  Loader2,
  Scan,
  AlertCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/lib/axios';
import { ENV } from '@/config/env';
import { storage } from '@/lib/storage';
import { ROUTES } from '@/config/routes';
import { bookingOwnerApi } from '../api';

/**
 * @file OwnerScanQRPage.jsx
 * @description QR Check-in scanner page for restaurant owners.
 * Inspired by code.html logic and aesthetics.
 */

const OwnerScanQRPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { idOrSlug } = useParams();

  // Refs cho Camera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const requestRef = useRef(null);

  // State
  // State
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [qrPreview, setQrPreview] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [processStatus, setProcessStatus] = useState('idle'); // idle, processing, success, error

  // Thêm log vào danh sách
  const addLog = useCallback((message, type = 'info') => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ time, message, type }, ...prev].slice(0, 20));
  }, []);

  // Xử lý Check-in sau khi quét được ID
  const processCheckIn = useCallback(async (bookingId) => {
    if (processing) return;
    
    setProcessing(true);
    setProcessStatus('processing');
    addLog(`${t('scan_qr.processing')}: ${bookingId.substring(0, 8)}...`, 'action');

    try {
      // 1. Lấy thông tin chi tiết để hiển thị
      const detailRes = await bookingOwnerApi.getBookingDetail(bookingId);
      const bookingData = detailRes?.booking || detailRes;
      setCurrentBooking(bookingData);
      addLog(`${t('scan_qr.success')}: ${bookingData.customerName}`, 'info');

      // 2. Gọi API Arrive
      await bookingOwnerApi.arriveBooking(bookingId);
      
      setProcessStatus('success');
      addLog(t('scan_qr.success_msg', { name: bookingData.customerName }), 'success');
      toast.success(t('owner_bookings.toast.arrive_success'));
      
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      
      // Cập nhật cache để trang chi tiết hiển thị trạng thái mới
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });

      // Sau 2 giây thành công, tự động quay lại trang chi tiết đặt bàn
      setTimeout(() => {
        navigate(ROUTES.WORKSPACE_BOOKING_DETAIL(idOrSlug, bookingId));
      }, 2000);

    } catch (err) {
      console.error('Scan process error:', err);
      setProcessStatus('error');
      
      let errorMsg = err.response?.data?.message || err.message;
      if (err.response?.status === 401) {
        errorMsg = t('scan_qr.unauthorized_msg');
      } else if (err.response?.status === 403) {
        errorMsg = t('scan_qr.forbidden_msg');
      }

      addLog(t('scan_qr.fail_msg', { message: errorMsg }), 'error');
      toast.error(errorMsg);
      if (navigator.vibrate) navigator.vibrate(200);
    } finally {
      setProcessing(false);
    }
  }, [addLog, processing, t]);

  // Vòng lặp quét camera
  const tick = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code) {
        const now = Date.now();
        if (now - lastScanTime > 3000) { // Cooldown 3s
          setLastScanTime(now);
          setQrPreview(canvas.toDataURL('image/png'));
          
          // Trích xuất ID từ data (xử lý cả URL chứa bookingId)
          let id = code.data.trim();
          try {
            if (id.includes('bookingId=')) {
              id = id.split('bookingId=')[1].split('&')[0];
            } else if (id.includes('/bookings/')) {
               id = id.split('/bookings/')[1].split('?')[0];
            }
          } catch (e) {}

          stopCamera();
          processCheckIn(id);
        }
      }
    }
    if (isScanning) {
      requestRef.current = requestAnimationFrame(tick);
    }
  }, [isScanning, lastScanTime, processCheckIn]);

  useEffect(() => {
    if (isScanning) {
      requestRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isScanning, tick]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        videoRef.current.play();
        setIsScanning(true);
        addLog(t('scan_qr.scanner_activated'), 'info');
      }
    } catch (err) {
      addLog(`Camera Error: ${err.message}`, 'error');
      toast.error(t('scan_qr.cannot_access_camera'));
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
    addLog(t('scan_qr.scanner_standby'), 'info');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          setQrPreview(event.target.result);
          processCheckIn(code.data);
        } else {
          addLog(t('scan_qr.no_qr_found'), 'error');
          toast.error(t('scan_qr.no_qr_found_in_image'));
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Status Badge UI
  const StatusBadge = ({ status }) => {
    const configs = {
      idle: { color: 'text-slate-400', label: t('scan_qr.waiting') },
      processing: { color: 'text-indigo-500', label: t('scan_qr.processing'), icon: Loader2 },
      success: { color: 'text-green-500', label: t('scan_qr.success') },
      error: { color: 'text-rose-500', label: t('scan_qr.error') },
    };
    const cfg = configs[status] || configs.idle;
    return (
      <div className={`flex items-center gap-2 ${cfg.color} text-[10px] font-bold uppercase tracking-widest`}>
        {cfg.icon && <cfg.icon size={12} className="animate-spin" />}
        <span>{cfg.label}</span>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20 p-4 md:p-0">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-bold group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('scan_qr.back_to_detail')}
          </button>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
            {t('scan_qr.title')}
            <span className="text-sm font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
              {t('scan_qr.zero_click_active')}
            </span>
          </h1>
          <p className="text-slate-500 font-medium">{t('scan_qr.subtitle')}</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('scan_qr.security_status')}</p>
            <p className="text-xs font-bold text-green-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {t('scan_qr.session_active')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Scan size={20} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Scanner & Controls */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden border border-slate-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Camera size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">{t('scan_qr.scanner')}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-tighter">{t('scan_qr.live_recognition')}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={isScanning ? stopCamera : startCamera}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                    isScanning 
                    ? 'bg-rose-500 text-white shadow-rose-200' 
                    : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
                  }`}
                >
                  {isScanning ? <Trash2 size={14} /> : <Scan size={14} />}
                  {isScanning ? t('scan_qr.turn_off_camera') : t('scan_qr.turn_on_camera')}
                </button>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black hover:bg-slate-200 transition-all"
                >
                  <Upload size={14} className="inline mr-2" />
                  {t('scan_qr.upload_qr')}
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className={`relative aspect-video bg-slate-900 rounded-[2rem] overflow-hidden border-4 transition-all duration-500 ${
              isScanning ? 'border-indigo-400/30 ring-8 ring-indigo-50' : 'border-transparent'
            }`}>
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay */}
              {isScanning && (
                <div className="absolute inset-0 border-[60px] border-slate-900/40 pointer-events-none">
                  <div className="w-full h-full border-2 border-indigo-400/50 rounded-3xl relative">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500/80 shadow-[0_0_15px_rgba(79,70,229,0.5)] animate-scan" />
                  </div>
                </div>
              )}

              {/* Standby State */}
              {!isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-950/95 z-10">
                  <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-6">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                  </div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{t('scan_qr.scanner_standby')}</p>
                </div>
              )}
            </div>

            {/* QR Preview Footer */}
            <div className="mt-8 flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <div className="w-24 h-24 bg-white rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                  {qrPreview ? (
                    <img src={qrPreview} alt="QR" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-4xl opacity-20">🖼️</div>
                  )}
               </div>
               <div className="space-y-1">
                  <h5 className="text-sm font-black text-slate-800">{t('scan_qr.qr_preview')}</h5>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t('scan_qr.qr_preview_desc')}
                  </p>
               </div>
            </div>
          </section>
        </div>

        {/* Right: Results & Logs */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('scan_qr.processing_status')}</h3>
              <StatusBadge status={processStatus} />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center min-h-[300px]">
              {processStatus === 'idle' && (
                <div className="animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-inner">
                    <span className="text-4xl animate-bounce">✨</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">{t('scan_qr.ready_title')}</h4>
                  <p className="text-sm text-slate-500 mt-3 max-w-[280px] font-medium leading-relaxed">
                    {t('scan_qr.ready_desc')}
                  </p>
                </div>
              )}

              {processStatus === 'processing' && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-indigo-50 animate-pulse mx-auto" />
                    <Loader2 size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 animate-spin" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900">{t('scan_qr.loading_info')}</h4>
                </div>
              )}

              {(processStatus === 'success' || processStatus === 'error') && currentBooking && (
                <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                   <div className={`${processStatus === 'success' ? 'bg-indigo-600' : 'bg-rose-600'} text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-left`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                      
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${processStatus === 'success' ? 'bg-green-400' : 'bg-rose-300'} animate-pulse`} />
                        {t('scan_qr.current_info')}
                      </div>

                      <div className="text-3xl font-black tracking-tight mb-2 truncate">{currentBooking.customerName}</div>
                      <div className="text-xs font-mono font-bold opacity-70 mb-8">{currentBooking.customerEmail || 'Guest'}</div>
                      
                      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                        <div>
                          <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Status</div>
                          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-block ${
                            processStatus === 'success' ? 'bg-green-400/20 text-green-300 border border-green-400/30' : 'bg-rose-400/20 text-rose-200 border border-rose-400/30'
                          }`}>
                            {currentBooking.status || (processStatus === 'success' ? 'ARRIVED' : 'ERROR')}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">Table</div>
                          <div className="text-lg font-black italic"># {currentBooking.tableNumber || 'Auto'}</div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-3xl">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('scan_qr.identification')}</span>
                      <span className="text-xs font-mono font-black text-slate-700">{currentBooking.bookingCode}</span>
                   </div>
                </div>
              )}
            </div>
          </section>

          {/* Logs Card */}
          <section className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <History size={18} className="text-slate-400" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('scan_qr.transaction_log')}</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase transition-colors tracking-widest"
              >
                {t('scan_qr.clear')}
              </button>
            </div>
            
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
              {logs.length === 0 ? (
                <div className="text-[11px] text-slate-300 font-bold italic tracking-wide">— {t('scan_qr.no_activity')} —</div>
              ) : (
                logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-[10px] font-bold flex border-l-2 pl-4 py-1 transition-all animate-in slide-in-from-left-2 ${
                      log.type === 'success' ? 'text-green-600 border-green-500' :
                      log.type === 'error' ? 'text-rose-500 border-rose-500' :
                      log.type === 'action' ? 'text-indigo-600 border-indigo-600' :
                      'text-slate-400 border-slate-200'
                    }`}
                  >
                    <span className="opacity-40 mr-3 font-mono">[{log.time}]</span>
                    <span className="flex-1 uppercase tracking-tight">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default OwnerScanQRPage;
