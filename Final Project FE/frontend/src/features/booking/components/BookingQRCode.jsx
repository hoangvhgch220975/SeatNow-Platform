import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * @component BookingQRCode
 * @description Hiển thị mã QR check-in thực tế dựa trên dữ liệu booking.
 * @param {string} value - Dữ liệu để mã hóa vào QR (thường là bookingCode hoặc ID)
 */
const BookingQRCode = ({ value = "SEATNOW-CHECKIN" }) => {
  return (
    <div className="bg-white p-10 rounded-3xl border-2 border-slate-100 shadow-soft flex flex-col items-center text-center transition-all hover:scale-[1.02] hover:border-primary/20 duration-500">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-8 px-4 py-2 bg-primary/5 rounded-full">Digital Check-in</h3>
      
      {/* Container QR Code thực tế - Hình vuông không bo góc */}
      <div className="bg-white p-6 rounded-none border-2 border-slate-100 mb-8 w-full max-w-[240px] shadow-sm flex items-center justify-center">
        <QRCodeCanvas 
          value={value} 
          size={180}
          level="H" 
          includeMargin={false}
          imageSettings={{
            src: "/logo.png",
            x: undefined,
            y: undefined,
            height: 40,
            width: 40,
            excavate: true,
          }}
          className="rounded-none"
        />
      </div>
      
      <div className="space-y-4">
        <p className="text-slate-900 font-black text-xs tracking-widest uppercase">
          CODE: {value}
        </p>
        <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
          Present this code to the maître d' upon arrival for immediate seating and check-in validation.
        </p>
      </div>
    </div>
  );
};

export default BookingQRCode;

